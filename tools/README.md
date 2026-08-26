# 航天图片资产采集工具

`asset_collector.py` 根据 `sources.yaml` 中的任务关键词搜索 Wikimedia Commons，并将通过许可、格式、尺寸和去重检查的图片写入 `src/assets/images`。候选图片会先经过博物馆展示评分，优先尝试可信来源、实物照片、任务现场与横向高清图片；采集结束后会自动运行评分器并刷新展厅角色图片。

## 首次测试运行

```powershell
python tools/asset_collector.py --limit-per-category 3
```

只运行一个类别：

```powershell
python tools/asset_collector.py --category chang-e --limit-per-category 3
```

## 输出

- 图片文件：`src/assets/images/<category>/`
- 来源索引：`src/data/sources.json`
- 展示资产注册表：`src/data/assets.json`
- 终端报告：真实下载数量、失败列表和本轮来源列表

## 图片评分与展厅角色

安装 Pillow 后运行：

```powershell
python tools/image_ranker.py
```

评分器读取现有 `sources.json` 和本地图片，在每个类别目录中生成合格的角色副本：

- `main.jpg`：必须匹配该类别的优先任务，并满足横向高清、非工程图等封面条件。
- `secondary.jpg`：补充展陈照片。
- `technical.jpg`：轨道示意或工程资料图。
- `src/data/asset_quality_report.json`：逐图记录 `filename`、`score`、`reason`、`recommendation`，并列出角色分配和缺口。

角色副本不会覆盖或删除原始下载文件。素材不满足封面标准时，评分器会保留 `main` 缺口，避免把技术图误标为展厅封面。只更新报告、不生成角色图片可使用 `--report-only`。

## 自动过滤规则

- 只接受 JPG、PNG、WebP，且同时检查响应 MIME 和文件头。
- 文件必须大于 10KB、小于 20MB，默认最小尺寸为 480 × 320。
- 使用来源 URL 和 SHA-256 内容摘要去除重复项。
- 必须来自配置中的已知提供者，并具备明确的开放许可元数据和来源页。
- 标题、描述、来源或分类包含 AI 生成、概念图、图库水印等风险词时拒绝下载。
- 不接受视频、SVG、GIF 或未知文件格式。

严重水印与 AI 内容无法仅靠机器规则做到百分之百识别。工具采用保守的来源白名单、许可元数据与风险词过滤；正式发布前仍应人工检查已下载图片，并在来源页面核对署名和许可要求。

## 配置说明

`sources.yaml` 使用 JSON 语法（JSON 是有效 YAML），因此工具无需安装 PyYAML。每条查询可独立设置 `relatedMission`，采集成功后会自动关联到现有图片画廊。

新增任务时，在 `categories` 中添加类别、目录与查询词即可。不要移除 `source_url`，它是后续署名和许可复核的依据。
