# 中国航天发展史数字博物馆 · China Space Museum

中国航天发展可视化 × 交互式数字博物馆 × AI/Codex 协作开发全过程

本项目从一条简单的中国航天时间轴出发，经过 V1 → V5 持续迭代，逐步发展为包含五大发展主线、五座主题展厅、真实任务影像、来源登记、自动 QA、本地一键启动和 GitHub Pages 在线发布体系的数字博物馆。项目以中文展陈为主，技术目录、变量和 API 保持原有英文命名。

## 当前版本

V5.0，已完成五厅策展去模板化与正式版桌面视觉收口；当前仍只维护并验收 `1600×900` 桌面端，不修改移动端和平板端。

## 重要入口

- 🌐 [在线参观](https://happydayily.github.io/China-Space-Museum/)
- 📖 [V1 → V5 完整开发复盘](docs/V1-V5_AI开发复盘.md)
- 🖼 [V5.0 正式版截图](docs/screenshots/v5.0/)
- 🤖 [AI / Codex 开发记录](AI_DEVELOPMENT_LOG.md)
- 📝 [CHANGELOG](CHANGELOG.md)
- 💬 [Prompt 档案](docs/prompts/README.md)

在线版与本地版使用同一套页面内容。需要在开发电脑启动本地展馆时，可双击根目录的 `中国航天博物馆启动器.cmd`；它会检查本地环境、调用 `npm.cmd run dev` 启动 Vite 服务并自动打开 Microsoft Edge。

## 在线参观

[打开中国航天数字博物馆](https://happydayily.github.io/China-Space-Museum/)

正式版主要验收 1600×900 PC 桌面端；移动端和平板端不属于 V5.0 的正式支持范围。

## 从 V1 到 V5

```text
时间轴
  → 航天视觉网页
  → 数据和数字资产系统
  → 五大主题数字展厅
  → 策展去模板化
  → 来源与事实核验
  → 自动截图 / QA
  → Git / Tag / Pages
  → V5.0
```

完整背景、失败记录、版本演化和 Human × ChatGPT × Codex 分工，见 [V1 → V5 完整开发复盘](docs/V1-V5_AI开发复盘.md)。

## 当前能力

- 星空背景与三维地球视觉场景
- 中国航天历史时间线
- 中国航天五大发展主线：进入太空、天基中国、人在太空、奔向月球、走向行星
- 五大主题展厅与 `#/grand-hall/:grandHallId` 路由
- 五个独立 GrandHall Story，分别呈现运力、卫星应用、载人航天、探月和行星探测
- 航天任务影像与展品卡片
- 长征系列运载火箭谱系
- 航天技术发展树
- 五种差异化航天任务过程：历史流程、载人绕飞、探月、火星探测和空间站建造
- 中国航天官方任务回顾、视频和图集入口
- 官方媒体与开放许可素材来源记录；任务级 `whyItMatters` 与展厅级 `hallWhyItMatters` 分层
- 深浅交替的数字博物馆视觉基底
- 五厅轻量本厅导览与“数字博物馆第二层”重点展项深入层
- 统一 1600×900 视口的六页 PC 自动验收截图
- 五厅差异化 Deep Dive 展陈布局、章节状态和键盘可用的展项参数展开
- 五厅专属 Deep Dive 标题与叙事入口；来源卡默认只显示机构、年份和来源详情入口，完整授权登记按需展开
- 首页关键时刻历史展墙、卫星“问题—结果—证据”链、月背工程支路和低噪声行星工程链
- RC4 最终来源登记收口：link-only 资料保留完整授权说明，避免在普通阅读层重复显示许可文本
- 图片素材登记、来源记录和质量评估数据

## 技术栈

- React
- Vite
- Three.js
- React Three Fiber

## 本地运行

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

生成六张 PC 最新长页面验收截图：

```bash
npm run screenshots
```

PC 截图只输出到 `docs/screenshots/v5.0/`，固定为 `01-home.png` 至 `06-planetary.png`，不建立移动端、平板端或其他视口子目录。历史版本截图通过 Git commit / Tag 查询。截图脚本复用本机 Edge/Chrome，不保存浏览器 Profile、缓存或 Cookie，并自动检查图片、链接、同源 404、运行时错误、错误覆盖层和 1600px 桌面横向溢出。

## 项目结构

```text
src/                    应用源码、页面、组件、数据和运行时素材
src/components/         三维场景、展厅、时间线和任务等组件
src/data/               航天任务、展厅、火箭、时间线和素材来源数据
src/assets/images/      应用使用的图片素材
tools/                  图片采集、排序和素材来源维护工具
docs/iterations/        中文迭代记录和人工验收记录
docs/prompts/           提交给 Codex/AI 的完整中文提示词
docs/screenshots/       精选版本验收截图
scripts/                构建辅助与自动验收截图脚本
中国航天博物馆启动器.cmd  本地一键启动入口
dist/                   本地构建产物，不纳入 Git
node_modules/           npm 依赖安装目录，不纳入 Git
```

## 图片和资料来源

项目中的图片、航天资料和数据来源记录在 `src/data/sources.json` 与 `tools/sources.yaml` 中。新增素材时应尽可能补充来源、用途和授权/引用说明。`src/assets/images.zip` 是已确认不再需要的历史传输归档，不纳入 Git，也不应重新上传。

## AI 辅助开发说明

项目记录“人工提出需求 → AI/Codex 修改 → 人工验收 → 再次迭代”的过程。AI 生成或修改的内容必须经过人工验收；文档记录应使用中文，代码中的技术目录名、变量名和 API 名称可继续使用英文。

## 迭代记录与提示词档案

- [Git 之前的历史回顾](docs/iterations/000-pre-git-history.md)
- [迭代记录目录](docs/iterations/)
- [Codex/AI 提示词档案说明](docs/prompts/README.md)
- [V4.2 正式基线提示词](docs/prompts/v4.2.md)
- [V4.4 完整中文开发提示词](docs/prompts/v4.4.md)
- [V5.0-E3 迭代记录](docs/iterations/v5.0-e3.md)
- [V5.0-E3 中文提示词](docs/prompts/v5.0-e3.md)
- [V5.0-E4 迭代记录](docs/iterations/v5.0-e4.md)
- [V5.0-E4 中文提示词](docs/prompts/v5.0-e4.md)
- V5.0-E4 六页归档截图：通过 Git commit / Tag 查询
- [V5.0-F 迭代记录](docs/iterations/v5.0-f.md)
- [V5.0-F 中文提示词](docs/prompts/v5.0-f.md)
- V5.0-F 桌面与移动端归档截图：通过 Git commit / Tag 查询
- [V5.0-RC1-PC 迭代记录](docs/iterations/v5.0-rc1-pc.md)
- [V5.0-RC1-PC 中文提示词](docs/prompts/v5.0-rc1-pc.md)
- [V5.0 六张 PC 正式截图](docs/screenshots/v5.0/)
- [V5.0-RC2-PC 迭代记录](docs/iterations/v5.0-rc2-pc.md)
- [V5.0-RC2-PC 中文开发记录](docs/prompts/v5.0-rc2-pc.md)
- [V5.0-RC3.1-PC 迭代记录](docs/iterations/v5.0-rc3.1-pc.md)
- [V5.0-RC3.1-PC 中文开发记录](docs/prompts/v5.0-rc3.1-pc.md)
- [V5.0-RC3.2-PC 迭代记录](docs/iterations/v5.0-rc3.2-pc.md)
- [V5.0-RC3.2-PC 中文开发记录](docs/prompts/v5.0-rc3.2-pc.md)
- [V5.0-RC3-PC 总结与最终验收记录](docs/iterations/v5.0-rc3-pc.md)
- [V5.0-RC3-PC 中文开发记录](docs/prompts/v5.0-rc3-pc.md)
- [AI 辅助开发总日志](AI_DEVELOPMENT_LOG.md)
- [更新日志](CHANGELOG.md)

## 后续计划

- V5.0 正式版已完成内容、策展、视觉与 PC 桌面终审；移动端与平板端不在本版本支持范围内。
- 移动端与平板端在本轮明确冻结；发现的响应式问题统一记录到 V5.1 TODO，不为 PC 终审扩展截图或修改响应式结构。
- 后续继续补强来源和授权明确的任务历史影像，不批量下载授权不清晰的媒体。
- 为每轮迭代保存完整中文提示词、人工验收结果和遗留问题。
- 持续整理图片与资料来源，减少重复素材和不必要的构建归档。
- 建立更稳定的构建检查和发布流程。

