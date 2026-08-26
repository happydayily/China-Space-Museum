#!/usr/bin/env python3
"""Collect licensed space images from Wikimedia Commons.

The configuration file uses JSON syntax, which is valid YAML. The collector is
stdlib-only so it can run without changing the frontend dependency graph.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from image_ranker import rank_assets, score_candidate_metadata


PROJECT_ROOT = Path(__file__).resolve().parents[1]
TOOLS_ROOT = Path(__file__).resolve().parent
IMAGE_ROOT = PROJECT_ROOT / "src" / "assets" / "images"
ASSETS_PATH = PROJECT_ROOT / "src" / "data" / "assets.json"
SOURCES_PATH = PROJECT_ROOT / "src" / "data" / "sources.json"
USER_AGENT = "China-Space-Museum-AssetCollector/1.0 (educational digital museum)"
SUPPORTED_MIME = {"image/jpeg", "image/png", "image/webp"}
REJECT_TERMS = {
    "ai generated", "ai-generated", "artificial intelligence", "midjourney",
    "stable diffusion", "dall-e", "generated image", "concept art",
    "illustration", "fan art", "watermark", "watermarked", "stock photo",
    "shutterstock", "alamy", "getty images", "depositphotos", "水印",
    "人工智能生成", "ai生成", "概念图", "插画",
}


def load_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def atomic_write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    handle, temp_name = tempfile.mkstemp(prefix=path.name, suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(handle, "w", encoding="utf-8", newline="\n") as stream:
            json.dump(value, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
        os.replace(temp_name, path)
    except Exception:
        Path(temp_name).unlink(missing_ok=True)
        raise


def request_bytes(url: str, timeout: int = 30) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        content_type = response.headers.get_content_type().lower()
        return response.read(), content_type


def request_json(url: str, params: dict[str, Any]) -> dict[str, Any]:
    encoded = urllib.parse.urlencode(params)
    payload, _ = request_bytes(f"{url}?{encoded}")
    return json.loads(payload.decode("utf-8"))


def metadata_value(metadata: dict[str, Any], key: str) -> str:
    value = metadata.get(key, {})
    return str(value.get("value", "")) if isinstance(value, dict) else ""


def strip_markup(value: str) -> str:
    return re.sub(r"<[^>]+>", " ", value or "").replace("&nbsp;", " ").strip()


def candidate_text(candidate: dict[str, Any]) -> str:
    metadata = candidate.get("extmetadata", {})
    fields = [
        candidate.get("title", ""),
        metadata_value(metadata, "ImageDescription"),
        metadata_value(metadata, "Categories"),
        metadata_value(metadata, "Credit"),
    ]
    return strip_markup(" ".join(fields)).lower()


def allowed_license(candidate: dict[str, Any], allowed: list[str]) -> tuple[bool, str]:
    license_name = metadata_value(candidate.get("extmetadata", {}), "LicenseShortName").strip()
    if not license_name:
        return False, "missing license metadata"
    normalized = license_name.lower()
    return any(normalized.startswith(prefix.lower()) for prefix in allowed), license_name


def detect_image_format(payload: bytes) -> tuple[str, str] | None:
    if payload.startswith(b"\xff\xd8\xff"):
        return ".jpg", "image/jpeg"
    if payload.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png", "image/png"
    if len(payload) >= 12 and payload[:4] == b"RIFF" and payload[8:12] == b"WEBP":
        return ".webp", "image/webp"
    return None


def slug(value: str) -> str:
    clean = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return clean or "asset"


def search_commons(config: dict[str, Any], term: str) -> list[dict[str, Any]]:
    provider = config["provider"]
    response = request_json(provider["api_url"], {
        "action": "query",
        "format": "json",
        "formatversion": 2,
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {term}",
        "gsrnamespace": 6,
        "gsrlimit": provider.get("search_limit", 24),
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": 2400,
    })
    results = []
    for page in response.get("query", {}).get("pages", []):
        image_info = page.get("imageinfo", [])
        if not image_info:
            continue
        candidate = dict(image_info[0])
        candidate["title"] = page.get("title", "").removeprefix("File:")
        results.append(candidate)
    return results


def existing_hashes() -> set[str]:
    hashes: set[str] = set()
    if not IMAGE_ROOT.exists():
        return hashes
    for path in IMAGE_ROOT.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            hashes.add(hashlib.sha256(path.read_bytes()).hexdigest())
    return hashes


def upsert_asset(assets: list[dict[str, Any]], record: dict[str, Any]) -> None:
    empty_match = next((item for item in assets if item.get("relatedMission") == record["relatedMission"] and not item.get("localPath")), None)
    if empty_match:
        empty_match.update(record)
        return
    if not any(item.get("id") == record["id"] for item in assets):
        assets.append(record)


def collect(config: dict[str, Any], selected_category: str | None, limit_override: int | None) -> dict[str, Any]:
    defaults = config["defaults"]
    provider = config["provider"]
    assets = load_json(ASSETS_PATH, [])
    sources = load_json(SOURCES_PATH, [])
    known_source_urls = {item.get("source_url") for item in sources}
    hashes = existing_hashes()
    downloaded: list[dict[str, Any]] = []
    failures: list[dict[str, str]] = []

    categories = config["categories"]
    if selected_category:
        categories = [item for item in categories if item["id"] == selected_category]
        if not categories:
            raise ValueError(f"unknown category: {selected_category}")

    for category in categories:
        target_dir = IMAGE_ROOT / category["directory"]
        target_dir.mkdir(parents=True, exist_ok=True)
        category_limit = limit_override or defaults["max_downloads_per_category"]
        category_count = sum(1 for item in sources if item.get("category") == category["id"])

        for query in category["queries"]:
            if category_count >= category_limit:
                break
            try:
                candidates = search_commons(config, query.get("searchTerm", query["term"]))
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
                failures.append({"category": category["id"], "query": query["term"], "reason": f"search failed: {error}"})
                continue

            # Search APIs optimize for textual relevance, not exhibition quality.
            # Score all metadata first so cover-worthy photographs are attempted
            # before diagrams and technical illustrations.
            candidates.sort(
                key=lambda candidate: score_candidate_metadata(
                    title=candidate.get("title", ""),
                    source_url=candidate.get("descriptionurl", ""),
                    source_name=f"{provider['name']} {metadata_value(candidate.get('extmetadata', {}), 'Credit')}",
                    width=int(candidate.get("width", 0)),
                    height=int(candidate.get("height", 0)),
                    extra_text=candidate_text(candidate),
                )["score"],
                reverse=True,
            )

            accepted_for_query = 0
            download_attempts = 0
            consecutive_rate_limits = 0
            for candidate in candidates:
                if category_count >= category_limit:
                    break
                source_url = candidate.get("descriptionurl", "")
                download_url = candidate.get("thumburl") or candidate.get("url", "")
                if not source_url or not download_url or source_url in known_source_urls:
                    continue
                text = candidate_text(candidate)
                match_terms = [term.lower() for term in query.get("matchTerms", [query["term"]])]
                if not any(term in text for term in match_terms):
                    continue
                if candidate.get("mime", "").lower() not in SUPPORTED_MIME:
                    continue
                if candidate.get("width", 0) < defaults["minimum_width"] or candidate.get("height", 0) < defaults["minimum_height"]:
                    continue
                licensed, license_name = allowed_license(candidate, provider["allowed_licenses"])
                if not licensed:
                    continue
                if any(term in text for term in REJECT_TERMS):
                    continue

                download_attempts += 1
                if download_attempts > provider.get("max_download_attempts_per_query", 8):
                    failures.append({"category": category["id"], "query": query["term"], "reason": "download attempt limit reached"})
                    break

                try:
                    time.sleep(0.35)
                    payload, response_type = request_bytes(download_url)
                except urllib.error.HTTPError as error:
                    if error.code == 429:
                        consecutive_rate_limits += 1
                        if consecutive_rate_limits >= 2:
                            failures.append({"category": category["id"], "query": query["term"], "reason": "Wikimedia rate limited downloads (HTTP 429); stopped this query"})
                            break
                        continue
                    failures.append({"category": category["id"], "query": query["term"], "reason": f"download failed: {candidate['title']}: {error}"})
                    continue
                except (urllib.error.URLError, TimeoutError) as error:
                    failures.append({"category": category["id"], "query": query["term"], "reason": f"download failed: {candidate['title']}: {error}"})
                    continue

                consecutive_rate_limits = 0

                if not defaults["minimum_bytes"] < len(payload) <= defaults["maximum_bytes"]:
                    continue
                detected = detect_image_format(payload)
                if not detected:
                    continue
                extension, detected_mime = detected
                if response_type not in SUPPORTED_MIME or detected_mime not in SUPPORTED_MIME:
                    continue
                digest = hashlib.sha256(payload).hexdigest()
                if digest in hashes:
                    continue

                asset_id = f"collected-{slug(category['id'])}-{digest[:12]}"
                filename = f"{slug(category['id'])}-{category_count + 1:02d}-{digest[:10]}{extension}"
                destination = target_dir / filename
                temp_destination = destination.with_suffix(destination.suffix + ".part")
                temp_destination.write_bytes(payload)
                os.replace(temp_destination, destination)

                title = candidate["title"]
                local_path = destination.relative_to(PROJECT_ROOT / "src" / "assets").as_posix()
                source_name = f"{provider['name']} ({license_name})"
                source_record = {
                    "id": asset_id,
                    "filename": filename,
                    "title": title,
                    "source_url": source_url,
                    "source_name": source_name,
                    "download_time": datetime.now(timezone.utc).isoformat(),
                    "category": category["id"],
                }
                asset_record = {
                    "id": asset_id,
                    "name": title,
                    "category": category["id"],
                    "localPath": local_path,
                    "description": f"公开航天图片：{title}",
                    "relatedMission": query["relatedMission"],
                }
                sources.append(source_record)
                upsert_asset(assets, asset_record)
                downloaded.append(source_record)
                known_source_urls.add(source_url)
                hashes.add(digest)
                category_count += 1
                accepted_for_query += 1

            if not candidates:
                failures.append({"category": category["id"], "query": query["term"], "reason": "no search results"})
            elif accepted_for_query == 0 and category_count < category_limit:
                failures.append({"category": category["id"], "query": query["term"], "reason": "no candidate passed source/license/format/quality filters"})

        if category_count < category_limit:
            failures.append({"category": category["id"], "query": "*", "reason": f"downloaded {category_count}/{category_limit}"})

    atomic_write_json(SOURCES_PATH, sources)
    atomic_write_json(ASSETS_PATH, assets)
    quality_report: dict[str, Any] | None = None
    try:
        quality_report = rank_assets(write_roles=True)
    except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as error:
        failures.append({"category": "*", "query": "*", "reason": f"image ranking failed: {error}"})
    return {
        "download_count": len(downloaded),
        "downloaded": downloaded,
        "failures": failures,
        "sources": sorted({item["source_name"] for item in downloaded}),
        "quality_report": {
            "scored": len(quality_report["items"]),
            "assignments": quality_report["assignments"],
            "missing_roles": quality_report["missing_roles"],
        } if quality_report else None,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Collect licensed space images into the local asset library.")
    parser.add_argument("--config", type=Path, default=TOOLS_ROOT / "sources.yaml")
    parser.add_argument("--category", help="Collect only one configured category id.")
    parser.add_argument("--limit-per-category", type=int, choices=range(1, 11), metavar="1-10")
    return parser.parse_args()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    args = parse_args()
    try:
        config = load_json(args.config, None)
        if not config:
            raise ValueError(f"invalid or empty config: {args.config}")
        report = collect(config, args.category, args.limit_per_category)
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(json.dumps({"download_count": 0, "fatal_error": str(error)}, ensure_ascii=False, indent=2))
        return 1
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
