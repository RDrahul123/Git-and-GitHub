const MODULES = [
  { slug: '00-introduction', number: '00', title: 'Introduction to version control', short: 'Introduction', group: 'Start here', level: 'Beginner', time: '6 min', description: 'Understand why version control exists, how Git works, and how GitHub fits into the picture.', path: '00-introduction/README.md' },
  { slug: '01-installation-setup', number: '01', title: 'Install and set up Git', short: 'Installation & setup', group: 'Start here', level: 'Beginner', time: '10 min', description: 'Install Git, configure your identity, connect with SSH, and learn the basics of signed commits.', path: '01-installation-setup/README.md' },
  { slug: '02-git-basics', number: '02', title: 'The everyday Git workflow', short: 'Git basics', group: 'Core Git', level: 'Beginner', time: '12 min', description: 'Initialize, stage, commit, inspect changes, read history, and ignore generated files.', path: '02-git-basics/README.md' },
  { slug: '03-git-internals', number: '03', title: 'How Git stores your work', short: 'Git internals', group: 'Core Git', level: 'Intermediate', time: '9 min', description: 'Explore objects, commit hashes, the index, HEAD, refs, tags, and the .git directory.', path: '03-git-internals/README.md' },
  { slug: '04-branching-merging', number: '04', title: 'Branches and merges', short: 'Branching & merging', group: 'History & recovery', level: 'Beginner', time: '12 min', description: 'Create parallel work, understand merge strategies, and resolve conflicts with confidence.', path: '04-branching-merging/README.md' },
  { slug: '05-rebase-and-history', number: '05', title: 'Rebase and shape history', short: 'Rebase & history', group: 'History & recovery', level: 'Intermediate', time: '11 min', description: 'Use rebase, interactive rebase, cherry-pick, amend, squash, and reflog safely.', path: '05-rebase-and-history/README.md' },
  { slug: '06-undoing-changes', number: '06', title: 'Undo changes safely', short: 'Undoing changes', group: 'History & recovery', level: 'Intermediate', time: '10 min', description: 'Choose between restore, reset, revert, clean, and stash based on what should remain.', path: '06-undoing-changes/README.md' },
  { slug: '07-remote-repositories', number: '07', title: 'Work with remotes', short: 'Remote repositories', group: 'Sharing & teamwork', level: 'Intermediate', time: '9 min', description: 'Fetch, pull, push, track upstream branches, publish tags, and prepare releases.', path: '07-remote-repositories/README.md' },
  { slug: '08-github-essentials', number: '08', title: 'Collaborate on GitHub', short: 'GitHub essentials', group: 'Sharing & teamwork', level: 'Beginner', time: '11 min', description: 'Use repositories, forks, pull requests, issues, reviews, Projects, READMEs, and licenses.', path: '08-github-essentials/README.md' },
  { slug: '09-collaboration-workflows', number: '09', title: 'Choose a team workflow', short: 'Collaboration workflows', group: 'Sharing & teamwork', level: 'Intermediate', time: '10 min', description: 'Compare feature branches, Gitflow, GitHub Flow, trunk-based development, and forks.', path: '09-collaboration-workflows/README.md' },
  { slug: '10-github-advanced', number: '10', title: 'Automate with GitHub', short: 'GitHub advanced', group: 'Shipping & craft', level: 'Advanced', time: '12 min', description: 'Explore Actions, Pages, branch rules, CODEOWNERS, Dependabot, secrets, and Packages.', path: '10-github-advanced/README.md' },
  { slug: '11-best-practices', number: '11', title: 'Build maintainable Git habits', short: 'Best practices', group: 'Shipping & craft', level: 'All levels', time: '8 min', description: 'Write clear commits, use sensible branches, protect secrets, and work in monorepos.', path: '11-best-practices/README.md' },
  { slug: '12-troubleshooting', number: '12', title: 'Troubleshoot and recover', short: 'Troubleshooting', group: 'Shipping & craft', level: 'Intermediate', time: '9 min', description: 'Recover lost commits and diagnose detached HEAD, conflicts, rejected pushes, and common errors.', path: '12-troubleshooting/README.md' },
  { slug: '13-cheatsheets', number: '13', title: 'Keep the command reference close', short: 'Cheatsheets', group: 'Reference & practice', level: 'Quick reference', time: '5 min', description: 'Find a command by task or situation with printable, grouped references.', path: '13-cheatsheets/README.md' },
  { slug: '14-practice', number: '14', title: 'Practice and test your skills', short: 'Practice & interviews', group: 'Reference & practice', level: 'Hands-on', time: '30+ min', description: 'Work through guided labs, quizzes, mini projects, and 45 interview questions.', path: '14-practice/README.md' }
];

const GROUPS = [
  { title: 'Start here', icon: 'icon-book', description: 'Build the mental model and prepare your tools.' },
  { title: 'Core Git', icon: 'icon-git', description: 'Learn the daily workflow and what happens under the hood.' },
  { title: 'History & recovery', icon: 'icon-arrow', description: 'Branch, integrate, edit, and recover work.' },
  { title: 'Sharing & teamwork', icon: 'icon-external', description: 'Connect remotes and collaborate on GitHub.' },
  { title: 'Shipping & craft', icon: 'icon-check', description: 'Automate delivery and build reliable team habits.' },
  { title: 'Reference & practice', icon: 'icon-book', description: 'Review, practice, and prepare to explain what you know.' }
];

const STORAGE_KEYS = { completed: 'git-fieldguide-completed-v1', theme: 'git-fieldguide-theme-v1' };
const moduleBySlug = new Map(MODULES.map((item) => [item.slug, item]));
const page = document.querySelector('#page-content');
const sidebar = document.querySelector('#sidebar');
const courseNav = document.querySelector('#course-nav');
const lessonPicker = document.querySelector('#lesson-picker-grid');
const lessonsDialog = document.querySelector('#lessons-dialog');
const searchDialog = document.querySelector('#search-dialog');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const completed = new Set(readStorage(STORAGE_KEYS.completed, []));
const markdownCache = new Map();
let currentSlug = 'home';
let mermaidInstance = null;
let searchIndexPromise = null;
let searchDebounce = 0;
let pendingAnchor = '';
let renderGeneration = 0;
let searchGeneration = 0;

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Browsing still works when storage is unavailable. */ }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function icon(id, className = '') {
  return `<svg class="icon ${className}" aria-hidden="true"><use href="#${id}"></use></svg>`;
}

function routeHref(slug = 'home', hash = '') {
  const url = new URL(window.location.href);
  if (slug === 'home') url.searchParams.delete('lesson');
  else url.searchParams.set('lesson', slug);
  url.hash = hash ? `#${hash}` : '';
  return `${url.pathname}${url.search}${url.hash}`;
}

function renderNav() {
  courseNav.innerHTML = GROUPS.map((group) => {
    const groupModules = MODULES.filter((item) => item.group === group.title);
    const links = groupModules.map((item) => `
      <a class="nav-link" href="${routeHref(item.slug)}" data-route="${item.slug}" aria-label="${item.number}: ${escapeHtml(item.title)}">
        <span class="nav-number">${item.number}</span>
        <span class="nav-link-title">${escapeHtml(item.short)}</span>
        <span class="nav-done">${icon('icon-check')}</span>
      </a>`).join('');
    return `<section class="nav-group"><h2 class="nav-group-title">${escapeHtml(group.title)}</h2>${links}</section>`;
  }).join('');
  lessonPicker.innerHTML = GROUPS.map((group) => {
    const groupModules = MODULES.filter((item) => item.group === group.title);
    return `<section class="lesson-picker-group">
      <h3><span>${escapeHtml(group.title)}</span><small>${String(groupModules.length).padStart(2, '0')}</small></h3>
      ${groupModules.map((item) => `<a class="lesson-picker-link" href="${routeHref(item.slug)}" data-route="${item.slug}">
        <span class="picker-number ${completed.has(item.slug) ? 'is-complete' : ''}">${completed.has(item.slug) ? icon('icon-check') : item.number}</span>
        <span class="picker-copy"><strong>${escapeHtml(item.short)}</strong><small>${escapeHtml(item.time)} · ${escapeHtml(item.level)}</small></span>
        ${icon('icon-arrow', 'picker-arrow')}
      </a>`).join('')}
    </section>`;
  }).join('');
  updateProgress();
}

function updateProgress() {
  const count = completed.size;
  const percent = Math.round((count / MODULES.length) * 100);
  document.querySelector('#progress-label').textContent = `${percent}%`;
  document.querySelector('#progress-detail').textContent = `${count} of ${MODULES.length} lessons complete`;
  document.querySelector('#progress-fill').style.width = `${percent}%`;
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('is-complete', completed.has(link.dataset.route)));
  document.querySelectorAll('.lesson-picker-link').forEach((link) => {
    const done = completed.has(link.dataset.route);
    const badge = link.querySelector('.picker-number');
    badge.classList.toggle('is-complete', done);
    badge.innerHTML = done ? icon('icon-check') : moduleBySlug.get(link.dataset.route).number;
  });
}

function updateRouteChrome(slug) {
  currentSlug = slug;
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.dataset.route === slug) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('.lesson-picker-link').forEach((link) => {
    if (link.dataset.route === slug) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const item = moduleBySlug.get(slug);
  document.querySelector('#breadcrumb-current').textContent = item ? item.short : 'Overview';
  document.title = item ? `${item.number} · ${item.short} | Git & GitHub Course` : 'Git & GitHub Course';
  document.querySelector('#reading-progress').style.width = '0%';
  document.body.classList.remove('nav-open');
  document.querySelector('#mobile-menu').setAttribute('aria-expanded', 'false');
}

function goTo(slug = 'home', options = {}) {
  const validSlug = moduleBySlug.has(slug) ? slug : 'home';
  const targetUrl = routeHref(validSlug, options.hash || '');
  if (options.push !== false) history.pushState({ lesson: validSlug }, '', targetUrl);
  pendingAnchor = options.hash || '';
  updateRouteChrome(validSlug);
  if (validSlug === 'home') renderHome();
  else renderLesson(moduleBySlug.get(validSlug));
  if (!options.keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  if (validSlug === 'home' && options.hash) setTimeout(() => document.getElementById(options.hash)?.scrollIntoView(), 80);
}

function renderHome() {
  const count = completed.size;
  const nextLesson = MODULES.find((item) => !completed.has(item.slug)) || MODULES[0];
  const ctaText = count ? 'Continue learning' : 'Start the course';
  const pathCards = GROUPS.slice(0, 3).map((group, index) => {
    const groupModules = MODULES.filter((item) => item.group === group.title);
    return `<a class="path-card" href="${routeHref(groupModules[0].slug)}" data-route="${groupModules[0].slug}">
      <span class="path-card-top"><span class="path-icon">${icon(group.icon)}</span><span class="path-count">${String(groupModules.length).padStart(2, '0')} LESSONS</span></span>
      <h3>${escapeHtml(group.title)}</h3><p>${escapeHtml(group.description)}</p>
    </a>`;
  }).join('');
  const moduleCards = MODULES.map((item) => `<a class="module-card ${completed.has(item.slug) ? 'is-complete' : ''}" href="${routeHref(item.slug)}" data-route="${item.slug}">
    <span class="module-card-number">${completed.has(item.slug) ? icon('icon-check') : item.number}</span>
    <span class="module-card-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.description)}</small></span>
    ${icon(completed.has(item.slug) ? 'icon-check' : 'icon-arrow')}
  </a>`).join('');

  page.innerHTML = `
    <div class="home-page">
      <section class="home-hero">
        <div class="hero-copy">
          <span class="hero-label">A practical learning path · 15 modules</span>
          <h1>Make Git feel<br><em>like second nature.</em></h1>
          <p>Build a clear mental model, practice the commands that matter, and learn to collaborate without fear of losing work.</p>
          <div class="hero-actions">
            <a class="button-primary" href="${routeHref(nextLesson.slug)}" data-route="${nextLesson.slug}">${ctaText} ${icon('icon-arrow')}</a>
            <a class="button-secondary" href="#course-map" data-scroll="course-map">Explore the roadmap</a>
          </div>
        </div>
        <div class="hero-stat" aria-label="Course progress">
          <div><div class="stat-number">${String(count).padStart(2, '0')}<span style="font-size:.55em;color:var(--ink-faint)">/15</span></div><div class="stat-label">lessons completed</div></div>
          <div class="stat-divider"></div>
          <div class="stat-foot">${icon('icon-check')} <span>${count ? `${Math.round(count / MODULES.length * 100)}% of your path complete` : 'Your progress saves on this device'}</span></div>
        </div>
      </section>

      <section class="home-section" aria-labelledby="roadmap-title">
        <div class="section-heading"><div><span class="section-kicker">A steady climb</span><h2 id="roadmap-title">The learning path</h2></div><p>Start with the why. Finish ready to ship.</p></div>
        <div class="path-grid">${pathCards}</div>
        <div class="roadmap-strip" style="margin-top:12px">
          <div class="roadmap-step"><span>1</span>Learn the model</div><div class="roadmap-arrow">${icon('icon-arrow')}</div>
          <div class="roadmap-step"><span>2</span>Practice locally</div><div class="roadmap-arrow">${icon('icon-arrow')}</div>
          <div class="roadmap-step"><span>3</span>Collaborate confidently</div>
        </div>
      </section>

      <section class="home-section" id="course-map" aria-labelledby="modules-title">
        <div class="section-heading"><div><span class="section-kicker">Your table of contents</span><h2 id="modules-title">Explore all lessons</h2></div><p>Choose a lesson to jump right in.</p></div>
        <div class="module-grid">${moduleCards}</div>
      </section>

      <section class="home-section" aria-label="Practice reminder">
        <div class="roadmap-strip"><div><span class="section-kicker">Best way to learn</span><div style="margin-top:4px;color:var(--ink-soft);font-size:12px">Keep a disposable repository open and try each command as you go.</div></div><a class="button-secondary" href="${routeHref('14-practice')}" data-route="14-practice">Open hands-on labs ${icon('icon-arrow')}</a></div>
      </section>
    </div>`;
}

async function getMarkdown(item) {
  if (markdownCache.has(item.slug)) return markdownCache.get(item.slug);
  const response = await fetch(item.path);
  if (!response.ok) throw new Error(`Could not load ${item.path} (${response.status})`);
  const text = await response.text();
  markdownCache.set(item.slug, text);
  return text;
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[`*_~]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function rewriteMarkdownLinks(container, item) {
  const sourceUrl = new URL(item.path, document.baseURI);
  container.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith('#')) {
      const anchor = slugify(decodeURIComponent(href.slice(1)));
      link.href = `#${anchor}`;
      return;
    }
    let resolved;
    try { resolved = new URL(href, sourceUrl); } catch { return; }
    if (resolved.origin !== window.location.origin) {
      link.target = '_blank';
      link.rel = 'noreferrer';
      return;
    }
    const pathname = decodeURIComponent(resolved.pathname).replace(/\/$/, '');
    if (pathname.endsWith('/README.md')) {
      const slug = pathname.split('/').at(-2);
      const target = moduleBySlug.has(slug) ? slug : 'home';
      link.href = routeHref(target, resolved.hash ? slugify(decodeURIComponent(resolved.hash.slice(1))) : '');
      link.dataset.route = target;
      if (resolved.hash) link.dataset.routeHash = slugify(decodeURIComponent(resolved.hash.slice(1)));
    } else if (pathname.endsWith('/index.md')) {
      link.href = routeHref('home');
      link.dataset.route = 'home';
    } else {
      link.href = resolved.href;
      link.target = '_blank';
      link.rel = 'noreferrer';
    }
  });
}

function decorateCallouts(container) {
  container.querySelectorAll('blockquote').forEach((quote) => {
    const first = quote.querySelector('p');
    const marker = first?.textContent.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*/i);
    if (!marker) return;
    const type = marker[1].toLowerCase();
    quote.classList.add(`callout-${type}`);
    first.innerHTML = first.innerHTML.replace(/^\[!(?:NOTE|TIP|WARNING|IMPORTANT)\]\s*/i, '');
    const label = document.createElement('span');
    label.className = 'callout-label';
    label.textContent = marker[1];
    quote.prepend(label);
  });
}

function decorateHeadings(container) {
  const seen = new Map();
  container.querySelectorAll('h2, h3, h4').forEach((heading) => {
    let base = slugify(heading.textContent) || 'section';
    const repeats = seen.get(base) || 0;
    seen.set(base, repeats + 1);
    if (repeats) base = `${base}-${repeats}`;
    heading.id = base;
  });
}

function makeCodeCopyButtons(container) {
  container.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code || pre.querySelector('.code-toolbar') || code.classList.contains('language-mermaid')) return;
    const language = [...code.classList].find((name) => name.startsWith('language-'))?.slice(9) || 'text';
    const toolbar = document.createElement('span');
    toolbar.className = 'code-toolbar';
    const languageLabel = document.createElement('span');
    languageLabel.className = 'code-language';
    languageLabel.textContent = language;
    const copy = document.createElement('button');
    copy.className = 'copy-code';
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Copy code');
    copy.title = 'Copy code';
    copy.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
    toolbar.append(languageLabel, copy);
    pre.append(toolbar);
  });
}

function wrapTables(container) {
  container.querySelectorAll('table').forEach((table) => {
    if (table.parentElement.classList.contains('table-scroll')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    table.before(wrapper);
    wrapper.append(table);
  });
}

function buildToc(container) {
  const toc = document.querySelector('#lesson-toc');
  const headings = [...container.querySelectorAll('h2, h3')];
  if (!headings.length) {
    toc.hidden = true;
    toc.innerHTML = '';
    return;
  }
  toc.hidden = false;
  toc.innerHTML = `<strong>On this page</strong>${headings.map((heading) => `<a class="${heading.tagName === 'H3' ? 'toc-sub' : ''}" href="#${heading.id}">${escapeHtml(heading.textContent)}</a>`).join('')}`;
}

async function loadMermaid() {
  if (mermaidInstance) return mermaidInstance;
  try {
    const library = await import('https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs');
    mermaidInstance = library.default;
    return mermaidInstance;
  } catch {
    return null;
  }
}

async function renderDiagrams(container) {
  const codeBlocks = [...container.querySelectorAll('pre code.language-mermaid')];
  if (!codeBlocks.length) return;
  const library = await loadMermaid();
  for (const [index, code] of codeBlocks.entries()) {
    const diagram = document.createElement('div');
    diagram.className = 'mermaid';
    diagram.id = `course-diagram-${index}`;
    diagram.dataset.source = code.textContent;
    diagram.textContent = diagram.dataset.source;
    code.closest('pre').replaceWith(diagram);
  }
  if (!library) {
    container.querySelectorAll('.mermaid').forEach((diagram) => diagram.classList.add('diagram-fallback'));
    return;
  }
  library.initialize({ startOnLoad: false, securityLevel: 'strict', theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'neutral', fontFamily: 'DM Sans, sans-serif' });
  try { await library.run({ nodes: [...container.querySelectorAll('.mermaid')] }); }
  catch (error) { console.warn('A course diagram could not be rendered.', error); }
}

function hideInlineNavigation(container) {
  container.querySelectorAll('p').forEach((paragraph) => {
    const text = paragraph.textContent.trim();
    if (/^(Previous:|Home(?:\s*·\s*Next:|:)|Next:)/i.test(text)) paragraph.remove();
  });
  container.querySelector('h1')?.remove();
}

function lessonPagination(item) {
  const index = MODULES.findIndex((entry) => entry.slug === item.slug);
  const previous = MODULES[index - 1];
  const next = MODULES[index + 1];
  const previousCard = previous
    ? `<a class="lesson-pager" href="${routeHref(previous.slug)}" data-route="${previous.slug}"><small>← Previous lesson</small><strong>${previous.number} · ${escapeHtml(previous.short)}</strong></a>`
    : `<a class="lesson-pager" href="${routeHref('home')}" data-route="home"><small>← Course overview</small><strong>All lessons</strong></a>`;
  const nextCard = next
    ? `<a class="lesson-pager next" href="${routeHref(next.slug)}" data-route="${next.slug}"><small>Next lesson →</small><strong>${next.number} · ${escapeHtml(next.short)}</strong></a>`
    : `<a class="lesson-pager next" href="${routeHref('home')}" data-route="home"><small>Course complete</small><strong>Back to overview →</strong></a>`;
  return `<nav class="lesson-pagination" aria-label="Lesson pagination">${previousCard}${nextCard}</nav>`;
}

async function renderLesson(item) {
  const generation = ++renderGeneration;
  page.innerHTML = `<div class="lesson-layout"><div class="lesson-main"><div class="loading-state"><span class="loader"></span><p>Loading lesson ${item.number}…</p></div></div><aside class="lesson-toc" id="lesson-toc" hidden></aside></div>`;
  try {
    const markdown = await getMarkdown(item);
    if (generation !== renderGeneration || currentSlug !== item.slug) return;
    if (!window.marked || !window.DOMPurify) throw new Error('The Markdown renderer could not be loaded. Check your connection and reload this page.');
    const html = window.DOMPurify.sanitize(window.marked.parse(markdown, { gfm: true, breaks: false }));
    page.innerHTML = `<div class="lesson-layout">
      <div class="lesson-main">
        <header class="lesson-intro">
          <div class="lesson-meta"><span>Lesson ${item.number}</span><span class="meta-dot">·</span><span>${item.time}</span><span class="meta-dot">·</span><span class="lesson-level">${escapeHtml(item.level)}</span></div>
          <h1>${escapeHtml(item.title)}</h1>
          <p class="lesson-summary">${escapeHtml(item.description)}</p>
          <div class="lesson-actions"><button class="mark-complete ${completed.has(item.slug) ? 'is-complete' : ''}" data-complete="${item.slug}" type="button">${completed.has(item.slug) ? '✓ Lesson completed' : 'Mark lesson complete'}</button><span class="section-kicker">${escapeHtml(item.group)}</span></div>
        </header>
        <article class="lesson-content">${html}</article>
        ${lessonPagination(item)}
      </div>
      <aside class="lesson-toc" id="lesson-toc" aria-label="On this page"></aside>
    </div>`;
    const article = page.querySelector('.lesson-content');
    hideInlineNavigation(article);
    decorateCallouts(article);
    decorateHeadings(article);
    rewriteMarkdownLinks(article, item);
    wrapTables(article);
    makeCodeCopyButtons(article);
    buildToc(article);
    updateProgress();
    await renderDiagrams(article);
    if (generation !== renderGeneration || currentSlug !== item.slug) return;
    if ('IntersectionObserver' in window) observeToc(article);
    if (pendingAnchor) {
      const anchor = pendingAnchor;
      pendingAnchor = '';
      setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 40);
    }
  } catch (error) {
    pendingAnchor = '';
    page.innerHTML = `<section class="lesson-error"><span class="section-kicker">Lesson unavailable</span><h2>We couldn't open this page.</h2><p>${escapeHtml(error.message)}</p><p>Try reloading, or open the source lesson on GitHub.</p><a class="button-secondary" href="https://github.com/RDrahul123/Git-and-GitHub/blob/main/${item.path}" target="_blank" rel="noreferrer">Open lesson source ${icon('icon-external')}</a></section>`;
  }
}

function observeToc(article) {
  const headings = [...article.querySelectorAll('h2, h3')];
  if (!headings.length) return;
  const tocLinks = new Map([...document.querySelectorAll('#lesson-toc a')].map((link) => [link.hash.slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    tocLinks.forEach((link) => link.classList.remove('is-active'));
    tocLinks.get(visible.target.id)?.classList.add('is-active');
  }, { rootMargin: '-85px 0px -70% 0px' });
  headings.forEach((heading) => observer.observe(heading));
}

async function buildSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = Promise.all(MODULES.map(async (item) => {
      try { return { item, text: await getMarkdown(item) }; }
      catch { return { item, text: item.title + ' ' + item.description }; }
    }));
  }
  return searchIndexPromise;
}

function textPreview(markdown, index, query) {
  const before = markdown.slice(0, index);
  const heading = before.match(/^#{1,4}\s+(.+)$/gm)?.at(-1)?.replace(/^#+\s+/, '') || 'Lesson overview';
  const plain = markdown.replace(/```[\s\S]*?```/g, ' ').replace(/`([^`]+)`/g, '$1').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]+\]\(([^)]+)\)/g, '$1').replace(/[#>*|_~-]/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = plain.toLowerCase();
  const position = lower.indexOf(query.toLowerCase());
  if (position < 0) return markdown.slice(0, 180).replace(/[#*`]/g, '').trim();
  return `…${plain.slice(Math.max(0, position - 60), Math.min(plain.length, position + query.length + 110))}…`;
}

async function performSearch(query) {
  const generation = ++searchGeneration;
  const term = query.trim().toLowerCase();
  if (!term) {
    searchResults.innerHTML = '<p class="search-empty">Type to search the course content.</p>';
    return;
  }
  searchResults.innerHTML = '<p class="search-empty">Searching all lessons…</p>';
  const entries = await buildSearchIndex();
  if (generation !== searchGeneration || !searchDialog.open) return;
  const matches = [];
  for (const { item, text } of entries) {
    const metadata = `${item.title} ${item.short} ${item.group} ${item.description}`;
    const index = text.toLowerCase().indexOf(term);
    if (metadata.toLowerCase().includes(term) || index >= 0) {
      const heading = index >= 0 ? text.slice(0, index).match(/^#{1,4}\s+(.+)$/gm)?.at(-1)?.replace(/^#+\s+/, '') : '';
      matches.push({ item, preview: index >= 0 ? textPreview(text, index, query.trim()) : item.description, heading });
    }
  }
  if (!matches.length) {
    searchResults.innerHTML = '<p class="search-empty">No lessons found. Try another command or concept.</p>';
    return;
  }
  searchResults.innerHTML = matches.slice(0, 12).map(({ item, preview, heading }) => `
    <button class="search-result" type="button" role="option" data-route="${item.slug}">
      <span class="result-number">${item.number}</span>
      <span class="result-copy"><strong>${escapeHtml(item.title)}${heading ? ` · ${escapeHtml(heading)}` : ''}</strong><small>${escapeHtml(preview)}</small></span>
    </button>`).join('');
}

function openSearch() {
  if (lessonsDialog.open) lessonsDialog.close();
  if (!searchDialog.open) searchDialog.showModal();
  searchInput.focus();
  searchInput.select();
}

function openLessons() {
  if (searchDialog.open) searchDialog.close();
  if (!lessonsDialog.open) lessonsDialog.showModal();
  document.querySelector('#open-lessons').setAttribute('aria-expanded', 'true');
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  writeStorage(STORAGE_KEYS.theme, theme);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#151b17' : '#f8f8f5';
  if (mermaidInstance && page.querySelector('.mermaid svg')) {
    page.querySelectorAll('.mermaid').forEach((diagram) => { diagram.removeAttribute('data-processed'); diagram.textContent = diagram.dataset.source || diagram.textContent; });
    mermaidInstance.initialize({ startOnLoad: false, securityLevel: 'strict', theme, fontFamily: 'DM Sans, sans-serif' });
    mermaidInstance.run({ nodes: [...page.querySelectorAll('.mermaid')] }).catch(() => {});
  }
}

function initialize() {
  renderNav();
  document.querySelector('#search-shortcut').textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  applyTheme(readStorage(STORAGE_KEYS.theme, window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const initialSlug = new URLSearchParams(window.location.search).get('lesson') || 'home';
  goTo(initialSlug, { push: false, hash: window.location.hash.slice(1) });

  document.addEventListener('click', (event) => {
    const routeLink = event.target.closest('[data-route]');
    if (routeLink) {
      event.preventDefault();
      const hash = routeLink.dataset.routeHash || '';
      goTo(routeLink.dataset.route, { hash });
      if (searchDialog.open) searchDialog.close();
      if (lessonsDialog.open) lessonsDialog.close();
      return;
    }
    const completeButton = event.target.closest('[data-complete]');
    if (completeButton) {
      const slug = completeButton.dataset.complete;
      if (completed.has(slug)) completed.delete(slug);
      else completed.add(slug);
      writeStorage(STORAGE_KEYS.completed, [...completed]);
      updateProgress();
      renderLesson(moduleBySlug.get(slug));
      return;
    }
    const copyButton = event.target.closest('.copy-code');
    if (copyButton) {
      const code = copyButton.closest('pre').querySelector('code').textContent;
      navigator.clipboard?.writeText(code).then(() => {
        copyButton.title = 'Copied!';
        copyButton.setAttribute('aria-label', 'Copied');
        setTimeout(() => { copyButton.title = 'Copy code'; copyButton.setAttribute('aria-label', 'Copy code'); }, 1400);
      });
      return;
    }
    const scrollLink = event.target.closest('[data-scroll]');
    if (scrollLink) {
      event.preventDefault();
      document.getElementById(scrollLink.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.querySelector('#open-search').addEventListener('click', openSearch);
  document.querySelector('#top-search').addEventListener('click', openSearch);
  document.querySelector('#close-search').addEventListener('click', () => searchDialog.close());
  document.querySelector('#open-lessons').addEventListener('click', openLessons);
  document.querySelector('#close-lessons').addEventListener('click', () => lessonsDialog.close());
  lessonsDialog.addEventListener('close', () => document.querySelector('#open-lessons').setAttribute('aria-expanded', 'false'));
  lessonsDialog.addEventListener('click', (event) => { if (event.target === lessonsDialog) lessonsDialog.close(); });
  searchDialog.addEventListener('click', (event) => { if (event.target === searchDialog) searchDialog.close(); });
  document.querySelector('#theme-toggle').addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  document.querySelector('#mobile-menu').addEventListener('click', (event) => {
    const isOpen = document.body.classList.toggle('nav-open');
    event.currentTarget.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelector('#mobile-scrim').addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    document.querySelector('#mobile-menu').setAttribute('aria-expanded', 'false');
  });
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => performSearch(searchInput.value), 140);
  });
  document.addEventListener('keydown', (event) => {
    if ((event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') {
      document.body.classList.remove('nav-open');
      document.querySelector('#mobile-menu').setAttribute('aria-expanded', 'false');
    }
    if (event.altKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      openLessons();
    }
  });
  window.addEventListener('popstate', () => goTo(new URLSearchParams(location.search).get('lesson') || 'home', { push: false, hash: location.hash.slice(1) }));
  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
    document.querySelector('#reading-progress').style.width = `${progress}%`;
  }, { passive: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
