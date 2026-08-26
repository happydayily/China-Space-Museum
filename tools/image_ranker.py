#!/usr/bin/env python3
"""Rank museum images and generate curated display-role JPEGs.

The ranker is intentionally usable by ``asset_collector.py`` without Pillow.
Pillow is only required when local files are inspected or role JPEGs are made.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = PROJECT_ROOT / "src" / "assets" / "images"
SOURCES_PATH = PROJECT_ROOT / "src" / "data" / "sources.json"
REPORT_PATH = PROJECT_ROOT / "src" / "data" / "asset_quality_report.json"

SOURCE_RULES = (
    (("cnsa.gov.cn", "国家航天局", "cnsa"), 5, "国家航天局/CNSA 来源 +5"),
    (("cmse.gov.cn", "中国载人航天", "china manned space"), 5, "中国载人航天来源 +5"),
    (("news.cn", "xinhuanet", "新华网", "新华社"), 4, "新华网来源 +4"),
    (("commons.wikimedia.org", "wikimedia commons", "wikimedia"), 2, "Wikimedia 来源 +2"),
)

ORBIT_TERMS = (
    "orbit", "orbital", "trajectory", "transfer", "轨道", "trajectory",
)
ENGINEERING_TERMS = (
    "schema", "schéma", "schematic", "diagram", "descriptif", "cutaway",
    "blueprint", "structure", "technical drawing", "工程图", "结构图", "示意图",
)
MISSION_SCENE_TERMS = (
    "launch", "landing", "astronaut", "crew", "interior", "mission site",
    "rover", "panorama", "module", "space station", "发射", "着陆", "航天员",
    "任务现场", "核心舱", "实验舱", "空间站", "月面", "火星表面",
)
PHYSICAL_TERMS = (
    "satellite", "spacecraft", "rocket", "lander", "rover", "mockup", "replica",
    "model", "module", "capsule", "卫星", "飞船", "火箭", "着陆器", "巡视器",
    "模型", "实物", "核心舱", "实验舱",
)
PEOPLE_TERMS = (
    "astronaut", "crew", "yang liwei", "people", "interior", "航天员", "杨利伟", "乘组",
)
PAPER_TERMS = (
    "paper", "journal", "figure", "fig.", "researchgate", "论文", "期刊插图",
)

PRIORITY_ALIASES = {
    "origin-one": ("东方红一号", "dong fang hong 1", "dongfanghong", "dfh-1"),
    "shenzhou5": ("神舟五号", "shenzhou 5", "shenzhou-5"),
    "chang-e": ("嫦娥六号", "chang'e 6", "chang’e 6", "chang'e-6"),
    "tianwen": ("天问一号", "tianwen-1", "tianwen 1", "zhurong", "祝融"),
    "tiangong": ("天宫", "中国空间站", "tianhe", "wentian", "mengtian", "space station"),
}

COVER_TARGET_ALIASES = {
    "origin-one": ("东方红一号", "dong fang hong 1", "dongfanghong", "dfh-1"),
    "shenzhou5": ("神舟五号", "shenzhou 5", "shenzhou-5"),
    "chang-e": ("嫦娥六号", "chang'e 6", "chang’e 6", "chang'e-6"),
    "tianwen": ("天问一号", "tianwen-1", "tianwen 1"),
    "tiangong": ("完整", "全貌", "组合体", "complete", "completed", "full configuration"),
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


def _contains(text: str, terms: tuple[str, ...]) -> bool:
    return any(term in text for term in terms)


def score_candidate_metadata(
    *,
    title: str,
    source_url: str = "",
    source_name: str = "",
    width: int = 0,
    height: int = 0,
    extra_text: str = "",
    is_grayscale: bool = False,
) -> dict[str, Any]:
    """Score API metadata or a local asset using the museum's quality rubric."""
    text = " ".join((title, source_url, source_name, extra_text)).lower()
    score = 0
    source_score = 0
    reasons: list[str] = []

    for terms, points, reason in SOURCE_RULES:
        if _contains(text, terms):
            score += points
            source_score = points
            reasons.append(reason)
            break

    is_engineering = _contains(text, ENGINEERING_TERMS)
    is_mission_scene = _contains(text, MISSION_SCENE_TERMS)
    is_paper = _contains(text, PAPER_TERMS)
    has_people = _contains(text, PEOPLE_TERMS)
    likely_photo = title.lower().split("?")[0].endswith((".jpg", ".jpeg"))
    # The word "orbit" can describe a real spacecraft photograph. Treat it as
    # a diagram only when the asset is non-photographic or has diagram traits.
    is_orbit = _contains(text, ORBIT_TERMS) and (is_engineering or not likely_photo)
    is_physical = (
        _contains(text, PHYSICAL_TERMS) or likely_photo
    ) and not (is_orbit or is_engineering or is_paper)

    if is_physical:
        score += 5
        reasons.append("实物照片 +5")
        image_type = "physical"
    elif is_mission_scene and not is_engineering:
        score += 4
        reasons.append("任务现场 +4")
        image_type = "mission-scene"
    elif is_orbit:
        score += 3
        reasons.append("轨道示意 +3")
        image_type = "orbital"
    elif is_engineering:
        score += 1
        reasons.append("工程图 +1")
        image_type = "engineering"
    else:
        image_type = "unknown"

    aspect_ratio = width / height if height else 0
    if width >= 1280 and aspect_ratio >= 1.3:
        score += 3
        reasons.append("横向高清图片 +3")
    if width > 1920:
        score += 3
        reasons.append("分辨率宽度 >1920 +3")
    if has_people or (is_mission_scene and not is_engineering):
        score += 2
        reasons.append("人物/任务场景 +2")

    if is_engineering:
        score -= 3
        reasons.append("工程示意图 -3")
    if is_grayscale and (is_engineering or is_orbit):
        score -= 2
        reasons.append("黑白结构图 -2")
    if is_paper:
        score -= 3
        reasons.append("论文插图 -3")

    cover_eligible = (
        image_type in {"physical", "mission-scene"}
        and (width >= 1280 or (source_score >= 4 and width >= 1024))
        and aspect_ratio >= 1.3
        and not is_grayscale
        and not is_paper
    )
    return {
        "score": score,
        "reasons": reasons or ["未命中评分规则 +0"],
        "image_type": image_type,
        "cover_eligible": cover_eligible,
        "width": width,
        "height": height,
    }


def _inspect_image(path: Path) -> tuple[int, int, bool]:
    try:
        from PIL import Image, ImageStat
    except ImportError as error:
        raise RuntimeError("运行本地评分需要 Pillow：python -m pip install Pillow") from error

    with Image.open(path) as image:
        width, height = image.size
        sample = image.convert("RGB")
        sample.thumbnail((160, 160))
        stat = ImageStat.Stat(sample)
        channel_delta = max(stat.mean) - min(stat.mean)
        pixels = sample.get_flattened_data() if hasattr(sample, "get_flattened_data") else sample.getdata()
        colorful_pixels = sum(
            1 for red, green, blue in pixels
            if max(red, green, blue) - min(red, green, blue) >= 14
        )
        pixel_count = max(1, sample.width * sample.height)
        is_grayscale = channel_delta < 7 and colorful_pixels / pixel_count < 0.05
        return width, height, is_grayscale


def _priority_match(category: str, text: str) -> bool:
    normalized = text.lower()
    return _contains(normalized, PRIORITY_ALIASES.get(category, ()))


def _cover_target_match(category: str, text: str) -> bool:
    normalized = text.lower()
    return _contains(normalized, COVER_TARGET_ALIASES.get(category, ()))


def _save_jpeg(source: Path, destination: Path) -> None:
    from PIL import Image, ImageOps

    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".jpg.part")
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.save(temporary, format="JPEG", quality=91, optimize=True, progressive=True)
    os.replace(temporary, destination)


def _clear_generated_roles(category_dir: Path) -> None:
    for role in ("main.jpg", "secondary.jpg", "technical.jpg"):
        (category_dir / role).unlink(missing_ok=True)


def rank_assets(*, write_roles: bool = True) -> dict[str, Any]:
    sources = load_json(SOURCES_PATH, [])
    ranked: list[dict[str, Any]] = []
    by_category: dict[str, list[dict[str, Any]]] = {}

    for source in sources:
        category = str(source.get("category", ""))
        filename = str(source.get("filename", ""))
        path = IMAGE_ROOT / category / filename
        if not category or not filename or not path.is_file():
            continue
        width, height, is_grayscale = _inspect_image(path)
        quality = score_candidate_metadata(
            title=str(source.get("title", "")),
            source_url=str(source.get("source_url", "")),
            source_name=str(source.get("source_name", "")),
            width=width,
            height=height,
            is_grayscale=is_grayscale,
        )
        item = {
            "filename": filename,
            "category": category,
            "title": source.get("title", filename),
            "path": path,
            "priority_match": _priority_match(category, f"{source.get('title', '')} {filename}"),
            "cover_target_match": _cover_target_match(category, f"{source.get('title', '')} {filename}"),
            **quality,
        }
        ranked.append(item)
        by_category.setdefault(category, []).append(item)

    assignments: dict[str, dict[str, str | None]] = {}
    for category, items in by_category.items():
        items.sort(key=lambda item: (item["score"], item["width"]), reverse=True)
        category_dir = IMAGE_ROOT / category
        if write_roles:
            _clear_generated_roles(category_dir)

        cover_candidates = [
            item for item in items if item["cover_eligible"] and item["priority_match"]
        ]
        main = next(
            (item for item in cover_candidates if item["cover_target_match"]),
            cover_candidates[0] if cover_candidates else None,
        )
        used = {main["filename"]} if main else set()
        secondary = next(
            (item for item in items if item["filename"] not in used and item["image_type"] in {"physical", "mission-scene", "unknown"}),
            None,
        )
        if secondary:
            used.add(secondary["filename"])
        technical = next(
            (item for item in items if item["filename"] not in used and item["image_type"] in {"engineering", "orbital"}),
            None,
        )

        selected = {"main": main, "secondary": secondary, "technical": technical}
        assignments[category] = {}
        for role, item in selected.items():
            assignments[category][role] = item["filename"] if item else None
            if item and write_roles:
                _save_jpeg(item["path"], category_dir / f"{role}.jpg")

    role_by_filename: dict[tuple[str, str], str] = {}
    for category, roles in assignments.items():
        for role, filename in roles.items():
            if filename:
                role_by_filename[(category, filename)] = role

    report_items: list[dict[str, Any]] = []
    for item in sorted(ranked, key=lambda value: (value["category"], -value["score"], value["filename"])):
        role = role_by_filename.get((item["category"], item["filename"]))
        if role == "main":
            recommendation = "推荐为 main.jpg：符合优先任务和非技术图封面标准"
        elif role == "secondary":
            recommendation = "推荐为 secondary.jpg：适合补充展陈"
        elif role == "technical":
            recommendation = "推荐为 technical.jpg：适合技术说明，不应用作展厅封面"
        elif item["cover_eligible"] and not item["priority_match"]:
            recommendation = "画面可展示，但不匹配本类别优先任务，不作为封面"
        else:
            recommendation = "保留为资料图，不推荐作为展厅封面"
        report_items.append({
            "filename": item["filename"],
            "score": item["score"],
            "reason": "；".join(item["reasons"]),
            "recommendation": recommendation,
        })

    missing = {
        category: [role for role, filename in roles.items() if filename is None]
        for category, roles in assignments.items()
        if any(filename is None for filename in roles.values())
    }
    runtime_report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "items": report_items,
        "assignments": assignments,
        "missing_roles": missing,
    }
    # Keep the persisted report as a simple collection of the four fields
    # required by the data contract. Assignment diagnostics remain in CLI output.
    atomic_write_json(REPORT_PATH, report_items)
    return runtime_report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Score local museum images and make curated JPEG roles.")
    parser.add_argument("--report-only", action="store_true", help="Do not create main/secondary/technical JPEGs.")
    return parser.parse_args()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    args = parse_args()
    try:
        report = rank_assets(write_roles=not args.report_only)
    except (OSError, ValueError, json.JSONDecodeError, RuntimeError) as error:
        print(json.dumps({"fatal_error": str(error)}, ensure_ascii=False, indent=2))
        return 1
    print(json.dumps({
        "scored": len(report["items"]),
        "assignments": report["assignments"],
        "missing_roles": report["missing_roles"],
        "report": str(REPORT_PATH),
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
