# 航天资料数据维护指南

本目录是中国航天数字博物馆的内容数据源。组件直接读取 JSON；新增资料时无需修改组件结构。

## 添加时间线事件

在 `timeline.json` 数组中按时间顺序新增对象：

```json
{
  "id": "unique-event-id",
  "year": "2026",
  "title": "事件名称",
  "category": "深空探索",
  "description": "面向观众的简明说明。",
  "importance": 4,
  "image": "",
  "relatedMission": "mission-id"
}
```

- `id` 必须唯一，建议使用英文短横线格式。
- `category` 使用：`中国航天起步`、`卫星时代`、`载人航天`、`深空探索` 或 `未来航天`。
- `importance` 使用 1—5 的整数，5 代表里程碑事件。
- 当前阶段 `image` 保持空字符串；加入图片后填写站点内的资源路径。
- `relatedMission` 对应 `missions.json` 中的任务 `id`；没有任务详情时填 `null`。

## 添加航天任务

在 `missions.json` 中新增任务。`id` 必须唯一，`route` 按飞行顺序填写轨迹节点：

```json
{
  "id": "mission-id",
  "name": "任务名称",
  "type": "任务类型",
  "year": 2026,
  "rocket": "运载火箭",
  "route": ["发射场", "转移轨道", "目标天体"],
  "description": "任务目标和成果。"
}
```

如时间线事件需要关联该任务，请将事件的 `relatedMission` 设置为相同的任务 `id`。

## 添加运载火箭

在 `rockets.json` 中新增对象：

```json
{
  "name": "火箭名称",
  "firstFlight": 2026,
  "height": "高度及单位",
  "payload": "典型轨道运力及单位",
  "missions": ["代表任务一", "代表任务二"]
}
```

提交前请确认 JSON 没有注释和末尾多余逗号，并运行 `npm run build` 验证数据可被前端正常导入。

## 添加数字资产

图片、视频和模型统一放在 `src/assets`，并在 `assets.json` 注册。不要在组件中直接写资源路径。

```json
{
  "id": "asset-change-6",
  "name": "嫦娥六号",
  "category": "chang-e",
  "localPath": "images/chang-e/change-6.webp",
  "description": "嫦娥六号月背采样返回任务资料。",
  "relatedMission": "change-6"
}
```

- `localPath` 从 `src/assets` 开始填写，不要包含 `src/assets/` 前缀。
- 支持的图片格式：PNG、JPG、JPEG、WebP、AVIF、GIF、SVG。
- 支持的视频格式：MP4、WebM、OGG；模型格式：GLB、GLTF、OBJ、FBX。
- `relatedMission` 可填写任务 ID、时间线事件 ID 或火箭名称，由展示组件进行关联。
- 路径为空、文件缺失或图片加载失败时，组件会自动显示占位内容。
