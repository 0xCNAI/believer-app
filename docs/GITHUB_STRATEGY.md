# GitHub Upload Strategy & Exclusion List

## 1. 適合公開的文件 (Public Safe List)

以下文件不包含敏感邏輯，適合上傳至公開 Repo：

- `app/**/*` (UI 層程式碼，確認已移除所有 Hardcoded API Keys)
- `components/**/*` (通用 UI組件)
- `constants/Colors.ts`, `constants/Layout.ts` (純樣式常數)
- `docs/GITHUB_PUBLIC_README.md` (作為 Repo 的 README.md)
- `docs/TESTFLIGHT.md` (作為專案說明文件)

## 2. 必須排除或替換的文件 (Exclusion / Redaction List)

以下文件可能包含內部權重算法、具體參數門檻或開發筆記，**嚴禁**直接公開，或需經過脫敏處理：

- **敏感邏輯 (Sensitive Logic)**:
    - `constants/techConditions.ts` (若包含具體參數 `defaultParams` 的精細數值，建議替換為範例值或 0)
    - `stores/beliefStore.ts` (檢查 `Reversal Contribution` 的具體計算公式係數，如 `(price / 100) * 40` 中的 `40` 是否為商業機密)
    - `services/marketData.ts` (若以 Hardcode 方式包含真實 API Key 或特定的 Mock Data 來源邏輯)

- **開發足跡 (Development Artifacts)**:
    - `.gemini/**/*` (AI Agent 的工作記憶與腦圖)
    - `task.md`, `implementation_plan.md`, `walkthrough.md` (包含詳細開發思路與指令，不應公開)
    - `*.env`, `.env.local` (環境變數)

## 3. 建議的 .gitignore 補充

請確認 `.gitignore` 包含以下項目：

```gitignore
# AI & Agent artifacts
.gemini/
task.md
implementation_plan.md
walkthrough.md

# Environment variables
.env
.env.*

# System files
.DS_Store
node_modules/
.expo/
dist/
```

## 4. 上傳前檢查清單 (Pre-Push Checklist)

- [ ] 確認 `app.json` 或 `app.config.js` 中無敏感 Key。
- [ ] 全域搜尋 "Key", "Secret", "Token" 確認無漏網之魚。
- [ ] 確認所有 UI 文案已符合 TestFlight 的中性化要求 (無 "Buy/Sell" 字眼)。
