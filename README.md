# nextforge

`nextforge` 是一個基於插件化架構的 CLI 工具，專門用來快速建立及配置 Next.js 專案。它透過互動式的問答流程，幫助你自動配置常用的技術棧（如 Redux、NextAuth、shadcn/ui 等），大幅減少每次開新專案的初始設定時間。

## 目前開發狀態 (v1.0.0 / v0.7 引導)

專案目前已經完成了**核心引擎的重構**，採用了高度可擴展的**插件系統**（Plugin-based architecture）。主要功能如下：

- **互動式引導 (`lib/interactive.js`)**：提供使用者友善的命令列問答，支援選擇專案模板、核心功能（Auth, Redux）、UI 解決方案以及套件管理工具。
- **生命週期執行器 (`core/executor.js`)**：定義了建立專案的生命週期（`init` -> `resolve` -> `validate` -> `beforeCreate` -> `create` -> `afterCreate` -> `destroy`），各個插件可以掛載到對應的階段。
- **內建插件 (`plugins/`)**：
  - `plugin-nextjs.js`: 封裝了 `npx create-next-app` 的自動化執行。
  - `plugin-redux.js`: 支援 Redux Toolkit 的狀態管理配置。
  - `plugin-ui-shadcn.js`: 支援 shadcn/ui 的自動引入。
  - `plugin-auth.js`: 支援 NextAuth / JWT 的基礎設定。

## 安裝與使用方式

由於目前還在開發階段，你可以直接在本地執行：

### 1. 安裝依賴
首先進入專案目錄並安裝必要的依賴（如 `prompts`, `execa`, `chalk`）：
```bash
pnpm install
```

### 2. 測試/執行 CLI
你可以直接透過 Node.js 執行進入點文件，並帶上你要建立的專案名稱：
```bash
node bin/index.js my-new-app
```
或者使用 `package.json` 中設定好的腳本：
```bash
pnpm start my-new-app
```

### 3. 全域測試 (可選)
如果你想在本地將它作為全域指令 `nextforge` 來測試，可以使用 `npm link`：
```bash
# 在 nextforge 目錄下執行
pnpm link

# 之後就可以在任何地方使用
nextforge my-awesome-project
```

## 專案結構

- `bin/` - CLI 的入口點 (`index.js`)。
- `core/` - 核心引擎，包含上下文建立 (`context.js`) 與生命週期執行器 (`executor.js`)。
- `lib/` - 共用工具模組，例如互動式問答 (`interactive.js`)、Log 系統 (`logger.js`) 等。
- `plugins/` - 獨立的功能插件，引擎會自動載入此目錄下的 `plugin-*.js` 檔案。

## 擴充與開發

若要新增功能，只需在 `plugins/` 目錄下新增一個遵循插件介面的檔案，並定義好它在不同生命週期（如 `create`, `afterCreate`）要執行的動作，核心引擎啟動時便會自動將其整合進流程中。
