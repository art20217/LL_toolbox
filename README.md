# 機械工程工具箱 ME Engineering Toolbox

機械工程 Web 工具的入口網站，部署於 <https://art20217.github.io/LL_toolbox/>。。

純靜態網站（HTML／CSS／JS），無建置流程；唯一外部資源為 Google Fonts 的 Noto Sans TC 字型。

## 收錄工具

| 工具 | 說明 | 網址 |
|---|---|---|
| 車床主軸馬達選型工具 | AC 主軸馬達＋四檔齒輪變速箱選型計算 | <https://art20217.github.io/lathe_motor_selector/> |
| 容積式潤滑系統計算器 | 潤滑點油量估算與分配器編組 | <https://ll-rd-a392c.web.app> |
| 幾何公差查詢器 | 幾何公差推薦與 CNS／ISO 公差表查詢 | <https://art20217.github.io/Geom_Tol_App/> |
| DiffSheet 資料比對工具 | 試算表差異比對 | <https://art20217.github.io/diffsheet/> |

## 新增工具

編輯 [`tools.js`](tools.js)：在 `TOOLS` 陣列加一筆資料（名稱、簡介、分類、網址、關鍵字、SVG 圖示），
必要時在 `CATEGORIES` 增加分類。不需要其他改動。

## 部署

推送到 `main` 後由 GitHub Actions（`.github/workflows/deploy.yml`）自動發佈到 GitHub Pages。
