# 中国航天发展史数字博物馆

这是一个使用 React、Vite 和 Three.js 构建的中国航天发展史可视化数字博物馆实验项目。项目在人工提出需求、AI/Codex 辅助实现、人工验收和持续迭代的协作方式下逐步建设。

## 当前版本

V4.4.1，GitHub Pages 自动部署版本。

## 在线体验

[打开中国航天数字博物馆](https://happydailyly.github.io/China-Space-Museum/)

## 当前能力

- 星空背景与三维地球视觉场景
- 中国航天历史时间线
- 五大主题展厅：起源、探月、载人航天、空间站和深空探测
- 航天任务影像与展品卡片
- 长征系列运载火箭谱系
- 航天技术发展树
- 五种差异化航天任务过程：历史流程、载人绕飞、探月、火星探测和空间站建造
- 中国航天官方任务回顾、视频和图集入口
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
- [AI 辅助开发总日志](AI_DEVELOPMENT_LOG.md)
- [更新日志](CHANGELOG.md)

## 后续计划

- 在后续版本继续补强来源和授权明确的任务历史影像。
- 为每轮迭代保存完整中文提示词、人工验收结果和遗留问题。
- 持续整理图片与资料来源，减少重复素材和不必要的构建归档。
- 建立更稳定的构建检查和发布流程。

