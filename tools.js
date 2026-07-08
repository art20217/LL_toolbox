// 工具資料檔：新增工具時只需要在 TOOLS 加一筆（必要時在 CATEGORIES 加分類）。
// status: 'live' = 已上線；'soon' = 即將推出（卡片不可點、顯示徽章）。

const CATEGORIES = [
  { id: 'sizing', name: '選型與計算' },
  { id: 'lookup', name: '查表工具' },
  { id: 'data',   name: '資料工具' },
];

const TOOLS = [
  {
    id: 'lathe-motor-selector',
    name: '車床主軸馬達選型工具',
    description:
      '臥式車床「AC 感應式主軸馬達＋四檔齒輪變速箱」選型：工況定義、馬達候選篩選、' +
      '齒比設計與 T-n 覆蓋驗證、慣量與驅動器系統驗證，並可輸出選型報告。',
    category: 'sizing',
    url: 'https://art20217.github.io/lathe_motor_selector/',
    keywords: ['馬達', '選型', '車床', '主軸', '齒輪箱', 'motor', 'lathe', 'spindle', 'T-n'],
    status: 'live',
    icon: `
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="6" y="16" width="22" height="16" rx="3"/>
        <path d="M28 21h6l4 3v0M28 27h6"/>
        <path d="M34 24h8"/>
        <path d="M10 12v4M16 12v4M22 12v4"/>
        <path d="M8 38c6-8 20-8 32-24" stroke-dasharray="1 5"/>
      </svg>`,
  },
  {
    id: 'disp-lub-calc',
    name: '容積式潤滑系統計算器',
    description:
      '潤滑點油量估算、分配器編組與規格代碼計算，並驗證升壓時間、循環時間等系統參數，' +
      '支援軸承、滑軌、齒輪、鍊條等多種元件類型。',
    category: 'sizing',
    url: 'https://ll-rd-app.web.app',
    keywords: ['潤滑', '油量', '分配器', 'lubrication', 'oil', '軸承', '滑軌'],
    status: 'live',
    icon: `
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M24 6c6 8.5 11 13.5 11 20a11 11 0 1 1-22 0c0-6.5 5-11.5 11-20Z"/>
        <path d="M19 28a5.5 5.5 0 0 0 5 5.5"/>
      </svg>`,
  },
  {
    id: 'geom-tol-app',
    name: '幾何公差查詢器',
    description:
      '依零件的功能用途、配合關係、加工產量與精度需求推薦幾何公差類型與數值，' +
      '亦可直接查詢 CNS／ISO 標準公差表，結果可追溯、非 AI 生成。',
    category: 'lookup',
    url: 'https://art20217.github.io/Geom_Tol_App/',
    keywords: ['公差', '幾何公差', 'GD&T', 'ISO 1101', 'CNS', '查表', '真圓度', '平行度'],
    status: 'live',
    icon: `
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="24" cy="24" r="12"/>
        <path d="M24 6v8M24 34v8M6 24h8M34 24h8"/>
        <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none"/>
      </svg>`,
  },
  {
    id: 'diffsheet',
    name: 'DiffSheet 資料比對工具',
    description:
      '試算表資料比對：貼上兩份表格內容即自動找出差異列，提供高對比標記、' +
      '列排除與同步捲動對照，適合 BOM 表與清單核對。',
    category: 'data',
    url: 'https://art20217.github.io/diffsheet/',
    keywords: ['比對', '差異', 'diff', '試算表', 'excel', 'BOM', '核對'],
    status: 'live',
    icon: `
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="6" y="8" width="15" height="32" rx="2"/>
        <rect x="27" y="8" width="15" height="32" rx="2"/>
        <path d="M6 17h15M27 17h15M6 26h15M27 26h15"/>
        <path d="M10 31.5h7M31 21.5h7" stroke-width="3.2"/>
      </svg>`,
  },
];
