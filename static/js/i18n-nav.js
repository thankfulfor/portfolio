function localizePagination() {
  const map = {
    Previous: 'Предыдущая',
    Next: 'Следующая',
  };

  const selectors = [
    '.rst-footer-buttons a',
    '.rst-content .pager a',
    '.rst-versions a',
  ];

  document.querySelectorAll(selectors.join(',')).forEach((el) => {
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    const hasLeftChevron = text.includes('«');
    const hasRightChevron = text.includes('»');
    const normalized = text.replace(/[«»]/g, '').trim();

    if (!map[normalized]) return;

    const translated = map[normalized];

    // Keep icon spans in footer buttons, replace only text nodes.
    let replaced = false;
    el.childNodes.forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const nodeText = node.nodeValue || '';
      if (/Previous|Next/.test(nodeText)) {
        node.nodeValue = nodeText.replace(/Previous|Next/g, translated);
        replaced = true;
      }
    });

    // For compact bottom bar links there are no icons, set full label.
    if (!replaced) {
      let label = translated;
      if (hasLeftChevron) label = `« ${label}`;
      if (hasRightChevron) label = `${label} »`;
      el.textContent = label;
    }
  });
}

function setPrimaryMenuActive() {
  const path = window.location.pathname;
  const menuLinks = document.querySelectorAll('#menu a');
  if (!menuLinks.length) return;

  const isUx =
    path.includes('/ux/') ||
    path.includes('-ux-') ||
    path.includes('ux-writing') ||
    path.includes('release-banner');
  const isHome = path === '/portfolio/' || path === '/portfolio';
  const target = isHome ? 'Главная' : isUx ? 'UX Writing' : 'Tech Writing';

  menuLinks.forEach((a) => {
    const span = a.querySelector('span');
    if (!span) return;
    span.classList.remove('active');
    if ((a.textContent || '').trim() === target) {
      span.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', localizePagination);
document.addEventListener('DOMContentLoaded', setPrimaryMenuActive);
window.addEventListener('load', localizePagination);
window.addEventListener('load', setPrimaryMenuActive);

// Theme scripts can re-render nav/footer after load, so relocalize on changes.
const observer = new MutationObserver(() => {
  localizePagination();
  setPrimaryMenuActive();
});
observer.observe(document.documentElement, { childList: true, subtree: true });
