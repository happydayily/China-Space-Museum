# V4 沉浸式数字博物馆实施计划

## 目标与约束

- 把首页从数据集合升级为五个任务展厅的数字博物馆入口。
- 保留 React、Vite、Three.js 与现有组件，不引入路由库。
- 不修改 `tools/asset_collector.py`、`tools/image_ranker.py` 和采集流程。
- 展厅、时间线、轨迹和展品说明由 JSON 驱动。

## 数据契约

1. 新增 `src/data/halls.json`：展厅 ID、年份、短介绍、主任务、轨迹节点及视觉色。
2. 扩展 `timeline.json`：精选叙事标识、历史意义、技术突破。
3. 扩展 `assets.json`：`historicalImportance`、`technicalAchievement`、`displayRole`。
4. 在 `assetRegistry.js` 中统一完成角色筛选、来源记录关联和本地 URL 解析。

## 组件与页面

1. `ExhibitionCard`：首页五展厅入口卡片。
2. `ImageViewer`：主图/卡片模式、灯箱、Fullscreen API、来源版权与说明。
3. `MissionTrajectory`：R3F 轨迹曲线、发光进度、飞行点与摄像机平滑跟随。
4. `MissionHall`：展厅标题、主图、次图、技术资料侧栏和轨迹区。
5. `HallPage`：独立展厅页面及返回入口。
6. 重构 `Timeline` 为 IntersectionObserver 驱动的滚动叙事。

## 验证

- 数据契约检查：五个展厅、精选时间线、三个新增展品字段、来源关联完整。
- `npm run build`。
- 启动 Vite，分别截图首页和展厅页，检查桌面布局、图片加载、轨迹画布和灯箱入口。
- 自检移动端断点与键盘可访问性。
