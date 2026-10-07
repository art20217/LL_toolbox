/* GitBook Docs Embed：右下角浮動「查手冊」小工具
 *
 * 採用官方 standalone script 方案（@gitbook/embed），無建置流程。
 * 載入腳本寫在 index.html，其網址須與下方 SITE_URL 指向同一個站台。
 * 腳本網址可在 GitBook 站台設定 → AI & MCP 取得。
 *
 * 面板內可用的分頁（assistant／search／docs）取決於 GitBook 站台本身的設定，
 * 其中 Assistant 需較高方案；此處刻意不覆寫 tabs，直接沿用站台設定。
 */
(function initGitBookEmbed() {
  const SITE_URL = 'https://xie-fu-jisorganization.gitbook.io/xie-fu-jisorganization-docs';

  // 腳本未載入成功（網址有誤或方案未開放）時靜默略過，不影響入口網站其餘功能
  if (typeof window.GitBook !== 'function') return;

  const CONFIG = {
    button: { label: '查手冊', icon: 'book' }, // icon 僅接受 assistant｜sparkle｜help｜book
    greeting: { title: '研發部工作手冊', subtitle: '想查什麼規範或流程？' },
    assistantName: '手冊助理',
    suggestions: [
      '螺紋孔的標註格式',
      '圖面審查要檢查哪些項目',
      '幾何公差字高比例異常怎麼處理',
      'OV 件的發行流程',
    ],
    actions: [
      {
        icon: 'arrow-up-right-from-square', // 可用任何 FontAwesome 圖示名稱
        label: '開啟完整手冊',
        onClick: () => window.open(SITE_URL, '_blank', 'noopener'),
      },
    ],
    closeButton: true,
    // tabs: ['search', 'docs'],  // 要限制分頁時取消註解
    // trademark: false,          // 要隱藏 GitBook 品牌標示時取消註解
  };

  /* 目前生效的主題：未手動指定時跟隨系統，與 app.js 的切換邏輯一致 */
  function currentScheme() {
    const attr = document.documentElement.dataset.theme;
    if (attr === 'dark' || attr === 'light') return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  let mountedScheme = null;

  function mount() {
    mountedScheme = currentScheme();
    window.GitBook('init', { siteURL: SITE_URL }, { colorScheme: mountedScheme });
    window.GitBook('configure', CONFIG);
    window.GitBook('show');
  }

  mount();

  /* 主題同步：colorScheme 只能在 init 時傳入，故主題改變時重新掛載。
     代價是展開中的面板會收起，但切換主題本身不常發生。 */
  function syncScheme() {
    if (currentScheme() === mountedScheme) return;
    window.GitBook('unload');
    mount();
  }

  new MutationObserver(syncScheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncScheme);

  /* 意見回饋 Modal 開啟時收起小工具，避免兩個浮層互疊 */
  const feedbackModal = document.getElementById('feedback-modal');
  if (feedbackModal) {
    new MutationObserver(() => {
      window.GitBook(feedbackModal.hidden ? 'show' : 'hide');
    }).observe(feedbackModal, { attributes: true, attributeFilter: ['hidden'] });
  }
})();
