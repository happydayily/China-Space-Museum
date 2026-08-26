# V4.4 航天任务过程与官方影像实施计划

## 设计决策

- 删除五座展厅共用的 `MissionTrajectory` 弧线模板，改为 `MissionProcess` 数据入口和五种独立布局。
- 东方红一号使用历史阶段时间线；神舟五号使用近地绕飞动画和七阶段点亮；嫦娥系列使用任务选择器与地月双天体过程；天问一号使用“奔火、落火、巡火”三章；中国空间站使用舱段逐步组装。
- 所有阶段内容放入 `src/data/missionProcesses.json`，组件只负责表现，不把任务文本硬编码在 JSX 中。
- `OfficialMedia` 读取 `src/data/mediaLinks.json`，只展示官方机构、新华社或央视页面的外链，不下载视频文件。

## 实施步骤

1. 先建立数据契约检查，证明 V4.3 尚无任务过程与官方影像数据。
2. 创建 `missionProcesses.json`，完整记录五个展厅及嫦娥一号、三号、五号、六号的真实阶段与统计信息。
3. 创建 `MissionProcess/` 组件目录，实现历史、载人绕飞、探月、火星探测和空间站组装五种布局与逐阶段高亮。
4. 检索并抽样打开中国国家航天局、中国载人航天工程官网、新华社/新华网、央视官方页面；创建 `mediaLinks.json` 和 `OfficialMedia` 卡片模块。
5. 将 `MissionHall` 接入新任务过程和官方影像模块，删除旧 `MissionTrajectory` 引用与旧 CSS。
6. 更新 V4.4 完整提示词、迭代记录、CHANGELOG、AI 开发日志和 README 版本。
7. 运行数据契约、生产构建、浏览器 DOM 检查与人工截图，确认五座展厅不再共用相同轨迹。
8. 检查 Git diff 和远程 main；验证通过后创建中文提交、`v4.4` 标签并推送。

## 验证命令

- Node 数据契约检查：过程类型、阶段数量、嫦娥任务选择、官方链接字段与来源域名。
- `npm run build`
- Chrome 本地页面 DOM/截图检查。
- `git diff --check`、`git status --short`、`git rev-list --left-right --count main...origin/main`

## 风险与边界

- 不把搜索结果标题当作已验证链接，官方链接至少抽样读取正文。
- 不嵌入来源不稳定的视频播放器；默认外链打开官方页面。
- 不改动展厅路由、图片采集/评分工具或现有 Three.js 首页场景。
