# 中国航天发展史数字博物馆：Git 仓库只读审计

审计日期：2026-08-26  
审计路径：`I:\GitHub-practice\China-Space-Museum`  
审计性质：只读审计。未删除、移动或修改源码，未初始化 Git，未创建 `.gitignore`。

> 统计基准为生成本报告前的项目状态；本报告文件本身不计入下述基准统计。

## 1. 总体统计

| 项目 | 数量 |
|---|---:|
| 文件 | 3,883 |
| 目录（不含项目根目录） | 392 |
| 总占用空间 | 137,783,510 bytes ≈ 131.40 MiB ≈ 137.78 MB |
| `.git` 目录 | 未发现 |

## 2. 一级目录统计

| 一级路径 | 文件数 | 占用空间 | 初步判断 |
|---|---:|---:|---|
| `node_modules/` | 3,769 | 73.73 MiB | 不应提交：依赖安装结果 |
| `src/` | 63 | 31.94 MiB | 主要源码、数据和运行时素材；应提交，但需审查压缩包 |
| `dist/` | 31 | 17.02 MiB | 不应提交：Vite 构建产物 |
| `docs/` | 12 | 8.61 MiB | 说明、计划和截图；选择性提交 |
| `tools/` | 4 | 0.04 MiB | 建议提交：项目工具和来源配置 |
| `assets/` | 0 | 0 bytes | 仅有空的分类目录，无实际文件 |
| `index.html` | 1 | 376 bytes | 应提交 |
| `package.json` | 1 | 381 bytes | 应提交 |
| `package-lock.json` | 1 | 65,683 bytes | 应提交 |
| `vite.config.js` | 1 | 110 bytes | 应提交 |

## 3. 重点目录检查

| 路径 | 文件数 | 目录数（下级） | 大小 | 结论 |
|---|---:|---:|---:|---|
| `node_modules/` | 3,769 | 352 | 73.73 MiB | 依赖安装目录；可安全排除 |
| `node_modules/.vite/` | 存在于上述统计中 | 1 个下级目录 | 已包含在 `node_modules` | Vite 依赖预构建缓存；可安全排除 |
| `dist/` | 31 | 1 | 17.02 MiB | 构建输出；可安全排除 |
| `.vite/`（项目根目录） | 不存在 | — | — | 未发现 |
| `docs/` | 12 | 3 | 8.61 MiB | 包含截图和迭代计划 |
| `docs/screenshots/` | 9 | 0 | 8.61 MiB | 精选截图可选择提交；不是浏览器 Profile |
| `cache/` | 不存在 | — | — | 未发现 |
| `temp/` | 不存在 | — | — | 未发现 |
| `screenshots/`（项目根目录） | 不存在 | — | — | 未发现 |

## 4. `docs/chrome-v41-entrance` 与浏览器 Profile 检查

`docs/chrome-v41-entrance` 不存在，未发现该目录的文件或大小。

对项目内目录名和文件名进行 Chrome、Edge、Profile、Browser、Cookies、User Data、Playwright、Puppeteer 等关键词检查后：

- 未发现类似 `chrome-v41-entrance` 的 Chrome/Edge 浏览器用户数据目录。
- 未发现 `Cookies`、`History`、`Login Data`、`Local Storage`、`Session Storage` 等典型浏览器 Profile 数据文件。
- 未发现 Playwright、Puppeteer、Cypress 测试运行目录。
- `node_modules` 中出现的 `baseline-browser-mapping`、`browserslist` 等只是 npm 依赖包，不是浏览器 Profile。
- `node_modules/.vite/` 是 Vite 依赖预构建缓存，不是浏览器缓存。

因此，当前项目中的 3,883 个文件主要来自 npm 依赖，而不是浏览器 Profile。审计结果不能排除复制源目录曾经存在但本次复制时未带过来的外部浏览器数据。

## 5. 文件分类建议

### A. 必须进入 GitHub

- `src/` 中的 React/Three.js 源码、页面、组件、工具函数和 JSON 数据。
- `src/assets/images/` 中实际被应用引用的图片素材。
- `tools/`、`tools/README.md`、`tools/sources.yaml` 和两个 Python 工具。
- `index.html`、`package.json`、`package-lock.json`、`vite.config.js`。
- 根目录 `README.md`（当前未发现，后续应补充）。

### B. 建议进入 GitHub

- `docs/superpowers/plans/` 中的三份迭代计划，作为 AI 辅助开发和设计决策记录。
- `docs/screenshots/` 中经过筛选、命名清晰且不含隐私信息的验收截图。
- 后续新增的架构说明、素材来源说明、运行和部署文档。
- 如果 `src/assets/images.zip` 只是素材备份而不是运行时输入，建议不要提交它；如确需保留，应单独确认其用途，避免与解压后的图片重复。

### C. 不应进入 GitHub

- `node_modules/`，包括其中的 `node_modules/.vite/`。
- `dist/` 及其 `dist/assets/` 构建输出。
- 根目录或任意层级的 `.vite/`、`cache/`、`temp/`、`tmp/`、`coverage/`、测试报告和临时截图目录。
- Chrome/Edge Profile、Cookies、History、Local Storage、Session Storage、Cache、Code Cache、浏览器测试用户数据。
- 临时压缩包、测试导出物、调试转储和未经筛选的截图。

### D. 无法仅凭目录结构判断，需要确认

- `src/assets/images.zip`：当前为 15.81 MiB，内容看起来是 `src/assets/images/` 的打包副本，可能与运行时图片重复；建议确认是否为交付所需的原始素材归档。
- `docs/screenshots/` 下 9 张截图：从命名看是 v4/v4-1/v4-2 版本验收图，但是否全部作为项目历史记录保留，应由项目维护者确认。
- `assets/images`、`assets/models`、`assets/videos`：目前为空目录，可能是预留结构；不需要提交空目录，除非通过 `.gitkeep` 明确保留结构。

## 6. 推荐的最终 Git 仓库目录结构

```text
china-space-museum/
├─ README.md
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ components/
│  ├─ pages/
│  ├─ data/
│  ├─ utils/
│  └─ assets/
│     ├─ images/
│     ├─ models/
│     └─ videos/
├─ tools/
├─ docs/
│  ├─ superpowers/plans/
│  ├─ screenshots/             # 仅保留精选验收图
│  └─ architecture/            # 后续可新增
├─ .gitignore
└─ （不提交）node_modules/、dist/、缓存、浏览器 Profile
```

## 7. 推荐 `.gitignore` 内容（仅提供，不创建）

```gitignore
# Dependencies
node_modules/

# Vite / build output
dist/
.vite/
*.tsbuildinfo

# Logs and local environment
*.log
logs/
.env
.env.*
!.env.example

# Test and coverage output
coverage/
test-results/
playwright-report/
blob-report/
cypress/videos/
cypress/screenshots/

# Temporary files and screenshots
tmp/
temp/
cache/
screenshots/
*.tmp
*.temp

# Browser profiles and sensitive local data
**/chrome-*/
**/edge-*/
**/*profile*/
**/*Profile*/
**/User Data/
**/Cookies
**/History
**/Login Data
**/Local Storage/
**/Session Storage/
**/Cache/
**/Code Cache/

# OS / editor files
.DS_Store
Thumbs.db
.idea/
.vscode/

# Optional local archive; confirm before enabling this rule
# src/assets/images.zip
```

## 8. 大文件与来源结论

本次未发现大于 25 MiB、50 MiB 或 100 MiB 的单个文件。

最大文件为：

| 文件 | 大小 | 说明 |
|---|---:|---|
| `src/assets/images.zip` | 15.81 MiB | 疑似图片素材归档，需确认是否与解压图片重复 |

25 个 MiB 以上的大文件：0 个；50 MiB 以上：0 个；100 MiB 以上：0 个。

文件数量的主要来源如下：

1. `node_modules/`：3,769 个文件，占总文件数约 97.1%，是旧开发目录复制后文件数量超过 3,000 的绝对主要原因。
2. `src/`：63 个文件，包含源码、JSON 数据和实际图片素材。
3. `dist/`：31 个文件，是一次 Vite 构建结果。
4. `docs/`：12 个文件，主要是截图和迭代计划。

按当前内容估算，首次提交 GitHub 的合理范围约为 82 个文件（根配置、源码/运行时素材、工具、文档和精选截图），其中约 70 个属于核心代码、配置和运行时素材；若排除 `src/assets/images.zip`，可减少约 15.81 MiB。实际提交数量会取决于是否保留全部截图、迭代计划和该压缩包。

## 9. 当前安全排除项

在不影响源码复现的前提下，可安全排除：`node_modules/`、`node_modules/.vite/`、`dist/`，以及尚未发现但应预防性忽略的根级/嵌套 `.vite/`、`cache/`、`temp/`、测试输出和浏览器 Profile 目录。

本报告没有执行任何删除或移动操作。
