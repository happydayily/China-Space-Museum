# V5.0 信息架构与半成品审计

审计日期：2026-08-26
审计范围：当前未跟踪的 V5.0 半成品与 V4.4.1 现有应用结构。
本轮不修改项目代码、数据、Git 历史或远程仓库；本文为唯一新增的审计文档。

## 1. 当前 Git 状态

当前分支为 `main`，且与 `origin/main` 一致。没有已暂存或已修改的已跟踪文件；存在以下 7 项未跟踪内容，均属于未完成的 V5.0 尝试：

| 状态 | 路径 | 结论 |
| --- | --- | --- |
| 未跟踪 | `src/data/grandHalls.json` | V5 大展厅、节点数据 |
| 未跟踪 | `src/data/developmentLines.json` | V5 五线地图数据 |
| 未跟踪 | `src/components/DevelopmentLines/DevelopmentLines.jsx` | V5 首页发展地图组件 |
| 未跟踪 | `src/components/GrandHallCard/GrandHallCard.jsx` | V5 大展厅入口卡片 |
| 未跟踪 | `src/pages/GrandHallPage/GrandHallPage.jsx` | V5 大展厅页面 |
| 未跟踪 | `src/v5.css` | 上述 V5 组件的样式 |
| 未跟踪 | `docs/superpowers/plans/2026-08-26-v5-five-development-lines.md` | V5 实施计划 |

当前已跟踪的 `src/App.jsx` 仍只识别 `#hall/:id`，首页仍将东方红一号、神舟五号、嫦娥系列、天问一号、中国空间站作为五个一级入口。因此当前构建是 V4.4 页面，结论与现状一致。

## 2. 当前 V5 半成品结构

```text
未接入的 V5 半成品
├── developmentLines.json（5 条线）
│   └── DevelopmentLines（展示并调用 onEnter(grandHall)）
├── grandHalls.json（5 座厅、40 个节点）
│   ├── GrandHallCard（单座厅入口）
│   └── GrandHallPage（节点、技术、关系、未来、旧展项入口）
└── v5.css（未被 main.jsx 导入）

已运行的 V4.4 应用
└── App
    ├── 首页 ExhibitionCard × 5（旧任务一级入口）
    └── #hall/:id → HallPage → MissionHall
```

### 数据与组件逐项结论

- `grandHalls.json`：内容方向正确，五座厅与目标名称一致，拥有共 40 个阶段性节点。它目前把展厅级“为什么重要”写为 `whyItMatters`，语义上应改为 `hallWhyItMatters`。节点中的 `legacyHall` 为进入既有详情页提供了可行的引用方式。
- `developmentLines.json`：包含五条发展线，也通过 `grandHall` 指向五座厅，适合作为总览地图的轻量数据源。但它再次保存了名称、年份范围和里程碑，和 `grandHalls.json` 的节点存在重复。其 `id` 是发展线 id，而 `grandHall` 才是展厅 id，这是合理的跨层引用。
- `DevelopmentLines`：职责合理，即展示总发展脉络并交由上层导航处理。但它把“发展主线”直接写成可进入“同名展厅”的入口，视觉文案应明确“主线总览 → 对应展厅”，避免被理解为多了一层同名页面。
- `GrandHallCard`：本身可保留，但若首页同时使用它和 `DevelopmentLines`，会把同样的五个名称重复呈现两次。首页应选择一个作为主入口；推荐保留 `DevelopmentLines` 为主入口，卡片仅作为补充索引或不使用。
- `GrandHallPage`：页面职责基本正确，提供展厅级叙事与节点列表，并复用 `RocketGallery`。不过其 `featuredHalls = halls.filter((mission) => mission.grandHall === hall.id)` 当前必定为空，因为现有 `halls.json` 尚无 `grandHall` 字段。该组件不能在未迁移旧任务数据前接入。
- `v5.css`：未由 `src/main.jsx` 导入，因此当前构建不会包含它；这正是半成品尚未影响 V4.4 的原因。
- V5 实施计划：保留 V4.4 能力、先做结构、不批量下载素材的范围控制合理；但字段命名和数据归属需要按本审计的建议调整后再执行。

## 3. 发现的问题与风险

| 优先级 | 问题 | 证据与影响 | 建议 |
| --- | --- | --- | --- |
| 高 | 旧展项尚未迁入新数据关系 | `halls.json` 没有 `grandHall`、`relatedLines`、`relatedMissions`、任务级 `whyItMatters` | 先迁移五个旧展项的数据归属，再接入页面 |
| 高 | 展厅级与任务级“为什么重要”混用同名字段 | `grandHalls.json` 的 `whyItMatters` 实际回答路线的重要性 | 大展厅使用 `hallWhyItMatters`；具体任务使用 `whyItMatters` |
| 高 | 当前不存在 V5 路由 | `App.jsx` 只解析 `#hall/:id` | 新增单独的 `#grand-hall/:id`；保留 `#hall/:id` 兼容旧任务链接 |
| 中 | 重点旧展项区域将为空 | `GrandHallPage` 按 `mission.grandHall` 筛选，而当前旧数据无此字段 | 数据迁移完成后再显示该区域；或以节点的 `legacyHall` 作为唯一来源 |
| 中 | 发展线与展厅的内容重复 | 两个 JSON 都保存五个名称、范围与里程碑/节点 | `developmentLines.json` 只保存地图展示和对 `grandHallId` 的引用；详细节点只保留在 `grandHalls.json` |
| 中 | 一个无效关联 id | “长征一号”节点使用 `space-infrastructure`，但发展线数据没有该 id | 改为有效的 `access-to-space`，或新增明确的基础设施线（后者不在本期范围） |
| 中 | 首页可能出现同名双入口 | `DevelopmentLines` 和 `GrandHallCard` 都意图展示五座厅 | 确定唯一首页一级导航；推荐发展地图 |
| 中 | V4 任务页的名称仍是“展厅” | `HallPage` 显示“第 xx 展厅”，与 V5 中“具体展项”定位冲突 | 接入时改为“具体展项”并增加返回所属大展厅 |
| 低 | 关系字段为纯文本 | `relations` 与节点 `relatedLines` 不能生成可点击关系图 | 保留文字作首期内容，同时定义可引用 id 数组供后续可视化 |

没有发现当前 V5 文件会与 `MissionHall` 发生运行时冲突：它们尚未被导入。真正的冲突风险只会在接入时出现，主要是旧任务被继续称为“展厅”和字段语义混淆。

## 4. 正确的 V5 三层架构

发展主线是首页的“总览和导航方式”，大展厅是同名主题的“内容容器”。二者不能各自再包含一套独立的完整历史数据。

```text
中国航天发展史（HomePage / 序厅）
│
├── 中国航天五大发展主线（DevelopmentMap）
│   ├── 01 进入太空 ────────→ GrandHallPage: 运载火箭与发射体系
│   ├── 02 天基中国 ────────→ GrandHallPage: 卫星应用体系
│   ├── 03 人在太空 ────────→ GrandHallPage: 载人航天三步走
│   ├── 04 奔向月球 ────────→ GrandHallPage: 绕、落、回与月球科研
│   └── 05 走向行星 ────────→ GrandHallPage: 行星际探测
│
└── 五个大展厅（第二级）
    ├── 进入太空
    │   └── 运载火箭与发射体系（RocketGallery、发射场、测控节点）
    ├── 天基中国
    │   ├── 东方红一号 → MissionHall: origin-one
    │   ├── 返回式卫星、通信、气象、遥感、北斗（首期为节点）
    ├── 人在太空
    │   ├── 921工程、神舟系列、交会对接（首期为节点）
    │   ├── 神舟五号 → MissionHall: shenzhou5
    │   └── 中国空间站 → MissionHall: tiangong
    ├── 奔向月球
    │   └── 嫦娥系列 → MissionHall: chang-e
    └── 走向行星
        └── 天问一号 → MissionHall: tianwen
```

这里的五个既有页面全部降为第三级“具体任务/展项详情页”，不是首页一级展厅。

## 5. 推荐 React 页面与组件关系

| 模块 | 职责 | 读取数据 | 不负责的内容 |
| --- | --- | --- | --- |
| `HomePage`（可由当前 `App` 首页部分提取） | 序厅、Three.js 星空地球、五线总览、进入大展厅 | `developmentLines.json`、少量首页文案 | 不承载五个旧任务详情 |
| `DevelopmentMap`（可由 `DevelopmentLines` 更名） | 绘制五发展线、显示跨线技术支撑，跳转对应大展厅 | 精简的 `developmentLines.json` | 不重复保存展厅完整节点 |
| `GrandHallPage` | 通用大展厅框架：核心问题、`hallWhyItMatters`、发展脉络、关键节点、技术演进、关系、未来、重点任务入口 | `grandHalls.json` + `halls.json` 的归属字段 | 不替代具体任务的图集、过程和官方影像 |
| `MissionHall`（现有） | 原五个具体任务详情：图片、展品解读、任务过程、官方影像 | `halls.json`、资产、任务过程、官方影像数据 | 不承担大展厅的总历史叙事 |
| `HallPage`（建议以后改名 `MissionPage`） | 旧任务页壳与返回所属大展厅的面包屑 | 当前 mission/hall 记录 | 不再称自己为一级展厅 |
| `RocketGallery`（现有） | 运载火箭谱系，作为“进入太空”大展厅的核心模块 | `rockets.json` | 不单独充当首页一级展厅 |

建议路由保持兼容且职责分明：

```text
#/                         HomePage
#/grand-hall/:grandHallId  GrandHallPage
#/hall/:missionId          MissionHall（保留已有外部链接）
```

用户点击路径为：`HomePage → DevelopmentMap → #/grand-hall/:id → 节点/重点任务 → #/hall/:id`。任务页的返回按钮应回到来源大展厅；若用户直接打开旧链接，则回到首页或由任务数据的 `grandHall` 推导其所属大展厅。

## 6. 数据关系与“为什么重要”字段

推荐的数据边界如下：

```text
developmentLines.json
  line.id
  └── grandHallId ───────────────→ grandHalls.json[].id

grandHalls.json
  id, name, question, hallWhyItMatters, nodes[], relatedLineIds[]
  └── nodes[].missionId ─────────→ halls.json[].id（可选，仅重点任务）

halls.json（现有五个具体任务）
  id, grandHallId, relatedLineIds, whyItMatters, assets/process/media
```

字段不能混用：

- `hallWhyItMatters` 属于第二级大展厅，回答“为什么整条发展路线重要”。当前 `grandHalls.json` 的同名 `whyItMatters` 应在正式实施时更名。
- `whyItMatters` 属于第三级具体任务/展项，回答“为什么该任务在中国航天发展史上重要”。现有五个 `halls.json` 记录目前都尚未拥有这个正式字段。

## 7. 五个用户导航流程

1. **进入太空**：首页 → 五大发展主线 → 点击“进入太空” → 查看火箭、发射场、测控与运力节点 → 浏览复用的长征火箭谱系 → 返回首页或切换至其他主线。
2. **天基中国**：首页 → 点击“天基中国” → 查看东方红一号、返回式卫星、通信、气象、遥感、北斗脉络 → 点击“东方红一号” → 进入现有详细任务页 → 返回“天基中国” → 继续浏览卫星应用节点。
3. **人在太空**：首页 → 点击“人在太空” → 查看 921 工程、神舟系列、出舱、交会对接、空间站三步走 → 点击“神舟五号” → 进入现有神舟五号详情 → 返回“人在太空” → 点击“中国空间站”继续浏览。
4. **奔向月球**：首页 → 点击“奔向月球” → 依次浏览绕、落、回、月背采样与科研站节点 → 点击“嫦娥系列” → 进入现有嫦娥详细任务页 → 返回“奔向月球”。
5. **走向行星**：首页 → 点击“走向行星” → 查看天问一号、火星环绕、着陆、祝融巡视以及后续行星任务 → 点击“天问一号” → 进入现有详细任务页 → 返回“走向行星”。

## 8. 现有 V4 组件的复用结论

直接复用：`SpaceScene`、`ImageViewer`、`MissionHall`、`MissionProcess` 全套过程组件、`OfficialMedia`、`RocketGallery`、资产登记与来源数据、`TechTree`、现有任务详情的图片和官方链接。

需要重新定位而非删除：`ExhibitionCard` 从首页一级任务入口改为大展厅内部的重点展项卡；`HallPage` 从“展厅页”外壳改为“任务详情页”外壳；`Timeline` 可继续作为首页的总历史切片或成为大展厅节点的补充，不应与 `grandHalls.json.nodes` 争夺同一完整叙事职责。

## 9. V5 半成品处理建议

### 建议保留并重构接入

- `grandHalls.json`：保留五座厅、40 个节点和大部分展厅叙事；重命名展厅级字段，统一关联 id。
- `developmentLines.json`：保留五线视觉识别和时间总览；删除与展厅节点重复的细节，只保留地图摘要与关系引用。
- `DevelopmentLines.jsx`：保留实现方向，建议更名为 `DevelopmentMap` 并展示真实的关系引用。
- `GrandHallPage.jsx`：保留通用页面框架和对 `RocketGallery` 的复用；待任务数据迁移后接入。
- `v5.css`：保留视觉基础，但在接入后做一次样式审查与响应式验收。
- V5 实施计划：保留为历史工作计划，同时以本审计的字段边界为准更新后续执行计划。

### 建议删除或重做

- `GrandHallCard.jsx`：若首页以 `DevelopmentMap` 为唯一一级入口，建议删除；若保留，只能作为地图下的辅助索引，不能再构成第二套五展厅入口。
- `grandHalls.json` 中的展厅级 `whyItMatters`：不建议原样保留，应重命名为 `hallWhyItMatters`。
- `developmentLines.json` 的重复里程碑：建议改为引用 `grandHallId` 和 `nodeIds`，避免两处维护同一历史事实。

## 10. 推荐实施顺序

1. 冻结并确认本审计的三层边界、字段命名和路由约定。
2. 整理数据：迁移现有五个任务的 `grandHallId`、`relatedLineIds`、`whyItMatters`；修正无效 `space-infrastructure` 引用；将展厅级字段改为 `hallWhyItMatters`。
3. 精简发展线数据，使其只服务地图和跨线关系；详细节点只由大展厅数据维护。
4. 接入路由和 `HomePage`：首页先展示 `DevelopmentMap`，旧五任务从一级入口移除。
5. 接入 `GrandHallPage` 和任务返回路径；把旧 `HallPage` 的“展厅”文案改为具体任务详情语义。
6. 在“进入太空”嵌入现有 `RocketGallery`；其余四厅先用节点和现有重点任务，遵守首期不批量下载图片的范围。
7. 为五个具体任务显示 `whyItMatters`，为五个大展厅显示 `hallWhyItMatters`。
8. 执行构建、路由回归、五条导航路径的人工验收和截图，再决定提交、标签、推送与 Pages 验证。
