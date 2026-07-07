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
    card.href = tool.url;
    card.target = '_blank';
    card.rel = 'noopener';
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

document.getElementById('search-input').addEventListener('input', (event) => {
  renderSections(event.target.value);
});

document.getElementById('year').textContent = new Date().getFullYear();
renderSections('');
