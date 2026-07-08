/* 主題切換：localStorage 記憶，未設定時跟隨系統 */
(function initTheme() {
  const saved = localStorage.getItem('toolbox-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }
})();

document.getElementById('theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.dataset.theme || (systemDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('toolbox-theme', next);
});

/* Header 高度追蹤 */
(function trackHeaderHeight() {
  const header = document.querySelector('.site-header');
  function update() {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  new ResizeObserver(update).observe(header);
  update();
})();

/* 狀態 */
const state = { currentToolId: null, sidebarOpen: true };

/* 卡片渲染 */
const EXT_MARK_SVG =
  '<svg class="ext-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M14 5h5v5M19 5l-8 8M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"/></svg>';

function renderSections(filterTerm) {
  const term = (filterTerm || '').trim().toLowerCase();
  const sectionsEl = document.getElementById('tool-sections');
  sectionsEl.textContent = '';
  let shown = 0;

  for (const category of CATEGORIES) {
    const tools = TOOLS.filter((tool) => {
      if (tool.category !== category.id) return false;
      if (!term) return true;
      const haystack = [tool.name, tool.description, ...(tool.keywords || [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
    if (tools.length === 0) continue;
    shown += tools.length;

    const section = document.createElement('section');
    section.className = 'category-section';

    const title = document.createElement('h2');
    title.className = 'category-title';
    title.append(category.name);
    const count = document.createElement('span');
    count.className = 'category-count';
    count.textContent = `${tools.length} 個工具`;
    title.append(count);
    section.append(title);

    const grid = document.createElement('div');
    grid.className = 'card-grid';
    for (const tool of tools) grid.append(buildCard(tool));
    section.append(grid);
    sectionsEl.append(section);
  }

  const noResults = document.getElementById('no-results');
  noResults.hidden = shown !== 0;
  if (shown === 0) {
    document.getElementById('no-results-term').textContent = filterTerm;
  }
}

function buildCard(tool) {
  const isSoon = tool.status === 'soon';
  const card = document.createElement('a');
  card.className = 'tool-card' + (isSoon ? ' is-soon' : '');
  if (!isSoon) {
    card.href = '#tool=' + tool.id;
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openTool(tool.id);
    });
  }

  const icon = document.createElement('div');
  icon.className = 'tool-icon';
  icon.innerHTML = tool.icon;

  const body = document.createElement('div');
  body.className = 'tool-body';

  const name = document.createElement('h3');
  name.className = 'tool-name';
  name.append(tool.name);
  if (isSoon) {
    const badge = document.createElement('span');
    badge.className = 'badge-soon';
    badge.textContent = '即將推出';
    name.append(badge);
  } else {
    name.insertAdjacentHTML('beforeend', EXT_MARK_SVG);
  }

  const desc = document.createElement('p');
  desc.className = 'tool-desc';
  desc.textContent = tool.description;

  const host = document.createElement('div');
  host.className = 'tool-host';
  host.textContent = isSoon ? '準備中' : new URL(tool.url).host;

  body.append(name, desc, host);
  card.append(icon, body);
  return card;
}

/* ===== 側邊欄 ===== */
function buildSidebarNav() {
  const nav = document.getElementById('sidebar-nav');
  nav.textContent = '';

  for (const category of CATEGORIES) {
    const tools = TOOLS.filter((t) => t.category === category.id);
    if (tools.length === 0) continue;

    const label = document.createElement('div');
    label.className = 'sidebar-category-label';
    label.textContent = category.name;
    nav.append(label);

    for (const tool of tools) {
      const link = document.createElement('a');
      link.className = 'sidebar-tool-link' + (tool.status === 'soon' ? ' is-soon' : '');
      link.dataset.toolId = tool.id;
      link.href = '#tool=' + tool.id;

      const iconWrap = document.createElement('span');
      iconWrap.className = 'sidebar-tool-icon';
      iconWrap.innerHTML = tool.icon;
      link.append(iconWrap);

      const nameSpan = document.createElement('span');
      nameSpan.textContent = tool.name;
      link.append(nameSpan);

      if (tool.status !== 'soon') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openTool(tool.id);
        });
      }
      nav.append(link);
    }
  }
}

function updateSidebarActiveState(toolId) {
  for (const link of document.querySelectorAll('.sidebar-tool-link')) {
    link.classList.toggle('is-active', link.dataset.toolId === toolId);
  }
}

/* ===== 工具檢視切換 ===== */
function openTool(toolId, updateHash) {
  if (updateHash === undefined) updateHash = true;
  const tool = TOOLS.find((t) => t.id === toolId);
  if (!tool || tool.status === 'soon') return;

  state.currentToolId = toolId;

  document.querySelector('main.container').hidden = true;
  document.querySelector('.site-footer').hidden = true;

  const toolView = document.getElementById('tool-view');
  toolView.hidden = false;

  document.getElementById('sidebar-toggle').hidden = false;

  const iframe = document.getElementById('tool-iframe');
  if (iframe.src !== tool.url) {
    iframe.src = tool.url;
  }

  updateSidebarActiveState(toolId);
  document.title = tool.name + ' | 機械工程工具箱';

  if (window.innerWidth <= 768) {
    collapseSidebar();
  } else {
    expandSidebar();
  }

  if (updateHash) {
    history.pushState(null, '', '#tool=' + encodeURIComponent(toolId));
  }
}

function closeToolView(updateHash) {
  if (updateHash === undefined) updateHash = true;
  state.currentToolId = null;

  document.querySelector('main.container').hidden = false;
  document.querySelector('.site-footer').hidden = false;
  document.getElementById('tool-view').hidden = true;
  document.getElementById('sidebar-toggle').hidden = true;
  document.getElementById('tool-iframe').src = 'about:blank';
  document.title = '機械工程工具箱 | ME Engineering Toolbox';

  if (updateHash) {
    history.pushState(null, '', window.location.pathname);
  }
}

/* ===== 側邊欄收合 ===== */
function collapseSidebar() {
  state.sidebarOpen = false;
  document.getElementById('sidebar').classList.add('is-collapsed');
}

function expandSidebar() {
  state.sidebarOpen = true;
  document.getElementById('sidebar').classList.remove('is-collapsed');
}

document.getElementById('sidebar-collapse').addEventListener('click', collapseSidebar);
document.getElementById('sidebar-toggle').addEventListener('click', expandSidebar);
document.getElementById('sidebar-back').addEventListener('click', () => closeToolView());

document.querySelector('.brand').addEventListener('click', (e) => {
  if (state.currentToolId) {
    e.preventDefault();
    closeToolView();
  }
});

/* ===== Hash routing ===== */
function getToolIdFromHash() {
  const match = location.hash.match(/^#tool=(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

window.addEventListener('popstate', () => {
  const toolId = getToolIdFromHash();
  if (toolId) {
    openTool(toolId, false);
  } else {
    closeToolView(false);
  }
});

/* ===== 意見回饋 Modal ===== */
const FEEDBACK_URL = 'https://waiting-ear-f0f.notion.site/ebd//39702a00ca618061abe6d4980ad40ce3';

function openFeedbackModal() {
  const modal = document.getElementById('feedback-modal');
  const iframe = modal.querySelector('.feedback-iframe');
  if (!iframe.src || iframe.src === 'about:blank' || iframe.src === window.location.href) {
    iframe.src = FEEDBACK_URL;
  }
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeFeedbackModal() {
  document.getElementById('feedback-modal').hidden = true;
  document.body.style.overflow = '';
}

document.getElementById('feedback-btn').addEventListener('click', openFeedbackModal);
document.getElementById('feedback-close').addEventListener('click', closeFeedbackModal);

document.getElementById('feedback-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeFeedbackModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('feedback-modal').hidden) {
    closeFeedbackModal();
  }
});

/* ===== 搜尋 ===== */
document.getElementById('search-input').addEventListener('input', (event) => {
  renderSections(event.target.value);
});

/* ===== 初始化 ===== */
document.getElementById('year').textContent = new Date().getFullYear();
renderSections('');
buildSidebarNav();

const initialToolId = getToolIdFromHash();
if (initialToolId) {
  openTool(initialToolId, false);
}
