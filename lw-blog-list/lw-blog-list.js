import { LitElement, html, css, repeat }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import '../lw-blog-list-item/lw-blog-list-item.js';

const PAGE_LIMIT = 20;

function mapHit(hit) {
  // Fix protocol-relative image URLs (//cdn/...) → (https://cdn/...)
  const image = (hit.imageUrl ?? '').replace(/^\/\//, 'https://');

  // Try to pull category from topics, then fall back to the blog path segment
  const category = hit.topics?.[0]
    ?? hit.topic
    ?? (hit.url ? decodeURIComponent((hit.url.split('/blogs/')[1] || '').split('/')[0]).replace(/-/g, ' ') : '');

  return {
    id:       hit.id,
    title:    hit.title   ?? '',
    excerpt:  hit.summary ?? hit.body ?? '',
    image,
    author:   hit.author?.name ?? hit.authorName ?? '',
    avatar:   hit.author?.img  ?? hit.authorImg  ?? '',
    category,
    url:      hit.url ?? '#',
    date:     hit.publishedAt ?? hit.date ?? '4 days ago',
    readTime: hit.readTime ?? '3 min read',
    // kept for detail view
    _body:    hit.body    ?? '',
    _summary: hit.summary ?? '',
    _topics:  hit.topics  ?? [],
  };
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-blog-list>
// Supports list/grid toggle, sort dropdown, and category sidebar.
//
// ATTRIBUTES:
//   base-url     (String)  — search API endpoint
//   api-key      (String)  — X-API-KEY header value
//   detail-url   (String)  — page navigated to on post click
//   default-view (String)  — 'list' | 'grid'
//   default-sort (String)  — initial sort key (see SORT_OPTIONS)
//   + all --pl-* CSS custom properties
// ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'default',   label: 'Default'       },
  { value: 'newest',    label: 'Newest First'   },
  { value: 'oldest',    label: 'Oldest First'   },
  { value: 'title-az',  label: 'Title (A–Z)'    },
  { value: 'title-za',  label: 'Title (Z–A)'    },
  { value: 'author-az', label: 'Author (A–Z)'   },
  { value: 'author-za', label: 'Author (Z–A)'   },
  { value: 'longest',   label: 'Longest First'  },
  { value: 'shortest',  label: 'Shortest First' },
];

export class LwBlogList extends LitElement {

  static properties = {
    // internal — set only by _fetchResults
    posts:      { state: true },
    loading:    { state: true },
    totalCount: { state: true },

    defaultView: { attribute: 'default-view' },
    defaultSort: { attribute: 'default-sort' },

    // API configuration
    baseUrl:   { attribute: 'base-url'   },
    apiKey:    { attribute: 'api-key'    },
    detailUrl: { attribute: 'detail-url' },

    // set from parent to trigger search
    searchQuery:   { type: String },
    semanticRatio: { type: Number },

    // internal state
    _view:           { state: true },
    _sort:           { state: true },
    _sortOpen:       { state: true },
    _activeCategory: { state: true },
    _categories:     { state: true },
    _hasMore:        { state: true },

    // container
    containerWidth:        { attribute: 'container-width'         },
    containerMaxWidth:     { attribute: 'container-max-width'     },
    containerPadding:      { attribute: 'container-padding'       },
    containerBackground:   { attribute: 'container-background'    },
    containerBorderRadius: { attribute: 'container-border-radius' },
    containerBoxShadow:    { attribute: 'container-box-shadow'    },
    // card
    cardPadding:    { attribute: 'card-padding'    },
    cardDivider:    { attribute: 'card-divider'    },
    gridCardRadius: { attribute: 'grid-card-radius'},
    gridColumns:    { attribute: 'grid-columns'    },
    // title
    titleColor:      { attribute: 'title-color'       },
    titleFontSize:   { attribute: 'title-font-size'   },
    titleFontWeight: { attribute: 'title-font-weight' },
    titleFontFamily: { attribute: 'title-font-family' },
    titleHoverColor: { attribute: 'title-hover-color' },
    // excerpt
    excerptColor:    { attribute: 'excerpt-color'     },
    excerptFontSize: { attribute: 'excerpt-font-size' },
    // meta
    metaColor:     { attribute: 'meta-color'     },
    metaFontSize:  { attribute: 'meta-font-size' },
    authorColor:   { attribute: 'author-color'   },
    categoryColor: { attribute: 'category-color' },
    // image
    imageWidth:        { attribute: 'image-width'         },
    imageHeight:       { attribute: 'image-height'        },
    imageBorderRadius: { attribute: 'image-border-radius' },
    // header
    headerBorderColor: { attribute: 'header-border-color' },
    headerFontSize:    { attribute: 'header-font-size'    },
    // toggle
    toggleActiveColor:   { attribute: 'toggle-active-color'   },
    toggleInactiveColor: { attribute: 'toggle-inactive-color' },
    // freeform
    cssVars: { attribute: 'css-vars' },
  };

  attributeChangedCallback(name, _old, value) {
    super.attributeChangedCallback?.(name, _old, value);

    if (name === 'default-view') this._view = value === 'grid' ? 'grid' : 'list';
    if (name === 'default-sort') this._sort = value || 'newest';

    const cssAttrs = [
      'container-width', 'container-max-width', 'container-padding', 'container-background',
      'container-border-radius', 'container-box-shadow',
      'card-padding', 'card-divider', 'grid-card-radius', 'grid-columns',
      'title-color', 'title-font-size', 'title-font-weight',
      'title-font-family', 'title-hover-color',
      'excerpt-color', 'excerpt-font-size',
      'meta-color', 'meta-font-size', 'author-color', 'category-color',
      'image-width', 'image-height', 'image-border-radius',
      'header-border-color', 'header-font-size',
      'toggle-active-color', 'toggle-inactive-color',
    ];
    if (cssAttrs.includes(name)) this.style.setProperty(`--pl-${name}`, value);

    if (name === 'css-vars' && value) {
      value.split(';').forEach(pair => {
        const [k, ...rest] = pair.split(':');
        if (k && rest.length) this.style.setProperty(k.trim(), rest.join(':').trim());
      });
    }
  }

  constructor() {
    super();
    this.posts           = [];
    this._categories     = [];
    this.loading         = false;
    this.totalCount      = 0;
    this.defaultView     = 'list';
    this.defaultSort     = 'newest';
    this.baseUrl         = '';
    this.apiKey          = '';
    this.detailUrl       = '';
    this._view           = 'list';
    this._sort           = 'newest';
    this._sortOpen       = false;
    this._closeSort      = null;
    this._activeCategory = 'all';
    this.searchQuery     = '';
    this.semanticRatio   = 0;
    this._page           = 1;
    this._hasMore        = false;
    this._debounceTimer  = null;
    this._abortCtrl      = null;
    this._observer       = null;
    this._categoryTotals = new Map(); // cache: category value → global total count
  }

  // Builds the sidebar list immediately from loaded posts, then fires
  // _fetchMissingTotals to replace placeholder counts with real API totals.
  _buildCategories(posts, allTotal) {
    const seen = new Set();
    posts.forEach(p => { if (p.category && p.category !== 'all') seen.add(p.category); });

    const cats = [...seen].map(value => ({
      value,
      label: value,
      // Use cached total if available, fall back to loaded-post count as placeholder
      count: this._categoryTotals.get(value)
        ?? posts.filter(p => p.category === value).length,
    })).sort((a, b) => b.count - a.count);

    return [{ value: 'all', label: 'All', count: allTotal }, ...cats];
  }

  // Fetches global total count for each category not yet cached, in parallel.
  // Uses limit:1 so only estimatedTotalHits is needed — minimal payload.
  async _fetchMissingTotals(categoryValues) {
    const missing = categoryValues.filter(v => !this._categoryTotals.has(v));
    if (!missing.length) return;

    await Promise.all(missing.map(async cat => {
      try {
        const res = await fetch(this.baseUrl, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-KEY': this.apiKey },
          body:    JSON.stringify({ query: '', page: 1, limit: 1, semanticRatio: 0, filter: { topics: [cat] } }),
        });
        const data = await res.json();
        this._categoryTotals.set(cat, data.estimatedTotalHits ?? 0);
      } catch {
        this._categoryTotals.set(cat, 0);
      }
    }));

    // Re-render categories with real totals now in cache
    this._categories = this._buildCategories(this.posts, this.totalCount);
  }

  _pickCategory(value) {
    this._activeCategory = value;
    this.dispatchEvent(new CustomEvent('lw-category-change', { detail: { category: value }, bubbles: true, composed: true }));
    this._resetAndFetch();
  }

  _onPostClick(e) {
    const p = e.detail.post;
    const detail = {
      title:      p.title,
      url:        p.url,
      image:      p.image,
      summary:    p._summary || p.excerpt,
      author:     p.author,
      avatar:     p.avatar,
      date:       p.date,
      readTime:   p.readTime,
      postType:   p.category,
      categories: p._topics,
      tags:       p._topics,
      body:       p._body ? [{ type: 'paragraph', text: p._body }] : [],
    };
    sessionStorage.setItem('lw-blog-detail', JSON.stringify(detail));
    window.location.href = this.detailUrl;
  }

  _debounceFetch() {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this._resetAndFetch(), 500);
  }

  _resetAndFetch() {
    this._page    = 1;
    this._hasMore = false;
    this.posts    = [];
    this._fetchResults(this.searchQuery, 1, this.semanticRatio);
  }

  async _fetchResults(query, page, ratio) {
    if (this._abortCtrl) this._abortCtrl.abort();
    this._abortCtrl = new AbortController();
    this.loading = true;

    try {
      const body = { query, page, limit: PAGE_LIMIT, semanticRatio: ratio };
      if (this._activeCategory && this._activeCategory !== 'all') {
        body.filter = { topics: [this._activeCategory] };
      }

      const res = await fetch(this.baseUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': this.apiKey },
        body:    JSON.stringify(body),
        signal:  this._abortCtrl.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const hits = Array.isArray(data.hits) ? data.hits.map(mapHit) : [];

      this.posts      = page === 1 ? hits : [...this.posts, ...hits];
      this._hasMore   = hits.length === PAGE_LIMIT;
      this.totalCount = data.estimatedTotalHits ?? this.posts.length;

      // Show sidebar immediately with placeholder counts, then update with real totals
      this._categories = this._buildCategories(this.posts, this.totalCount);
      const catValues  = this._categories.filter(c => c.value !== 'all').map(c => c.value);
      this._fetchMissingTotals(catValues); // non-blocking; re-renders when done
      this.dispatchEvent(new CustomEvent('search-time-update', {
        detail: { ms: data.processingTimeMs ?? 0 }, bubbles: true, composed: true,
      }));

    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Search error:', err);
    } finally {
      if (!this._abortCtrl?.signal.aborted) this.loading = false;
    }
  }

  _setupObserver() {
    if (this._observer) this._observer.disconnect();
    const sentinel = this.shadowRoot?.querySelector('.pl-sentinel');
    if (!sentinel) return;
    this._observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && this._hasMore && !this.loading) {
        this._page += 1;
        this._fetchResults(this.searchQuery, this._page, this.semanticRatio);
      }
    }, { threshold: 0 });
    this._observer.observe(sentinel);
  }

  firstUpdated() {
    this._fetchResults('', 1, 0);
  }

  updated(changed) {
    // Only debounce when the value actually changed from a real prior value (not initial undefined)
    if ((changed.has('searchQuery')   && changed.get('searchQuery')   !== undefined) ||
        (changed.has('semanticRatio') && changed.get('semanticRatio') !== undefined)) {
      this._debounceFetch();
    }
    if (changed.has('posts') || changed.has('_hasMore')) {
      this._setupObserver();
    }
  }

  // ── Sort ────────────────────────────────────────────────────
  get _sortedPosts() {
    const posts = [...this.posts];
    switch (this._sort) {
      case 'newest':    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':    return posts.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'title-az':  return posts.sort((a, b) => (a.title  || '').localeCompare(b.title  || ''));
      case 'title-za':  return posts.sort((a, b) => (b.title  || '').localeCompare(a.title  || ''));
      case 'author-az': return posts.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
      case 'author-za': return posts.sort((a, b) => (b.author || '').localeCompare(a.author || ''));
      case 'longest':   return posts.sort((a, b) => (b.excerpt?.length || 0) - (a.excerpt?.length || 0));
      case 'shortest':  return posts.sort((a, b) => (a.excerpt?.length || 0) - (b.excerpt?.length || 0));
      default:          return posts;
    }
  }

  get _sortLabel() {
    return SORT_OPTIONS.find(o => o.value === this._sort)?.label ?? 'Sort';
  }

  _toggleSortMenu(e) {
    e.stopPropagation();
    this._sortOpen = !this._sortOpen;

    if (this._sortOpen) {
      this._closeSort = () => { this._sortOpen = false; };
      setTimeout(() => document.addEventListener('click', this._closeSort), 0);
    } else {
      document.removeEventListener('click', this._closeSort);
    }
  }

  _pickSort(value) {
    this._sort     = value;
    this._sortOpen = false;
    document.removeEventListener('click', this._closeSort);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._closeSort);
    if (this._observer) this._observer.disconnect();
    if (this._abortCtrl) this._abortCtrl.abort();
    clearTimeout(this._debounceTimer);
  }

  // ── View toggle ─────────────────────────────────────────────
  _setView(v) { this._view = v; }

  // ── Icon SVGs ───────────────────────────────────────────────
  _listIcon(active) {
    const c = active ? 'var(--pl-toggle-active-color,#374151)' : 'var(--pl-toggle-inactive-color,#c0c4cc)';
    return html`
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display:block">
        <circle cx="3" cy="3.5"  r="2"   fill="${c}"/>
        <rect   x="7" y="1.5"  width="12" height="4" rx="1.5" fill="${c}"/>
        <circle cx="3" cy="10"  r="2"   fill="${c}"/>
        <rect   x="7" y="8"    width="12" height="4" rx="1.5" fill="${c}"/>
        <circle cx="3" cy="16.5" r="2"   fill="${c}"/>
        <rect   x="7" y="14.5" width="12" height="4" rx="1.5" fill="${c}"/>
      </svg>`;
  }

  _gridIcon(active) {
    const c = active ? 'var(--pl-toggle-active-color,#374151)' : 'var(--pl-toggle-inactive-color,#c0c4cc)';
    return html`
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none" style="display:block">
        <rect x="1"  y="1"  width="7" height="7" rx="1.5" fill="${c}"/>
        <rect x="10" y="1"  width="7" height="7" rx="1.5" fill="${c}"/>
        <rect x="1"  y="10" width="7" height="7" rx="1.5" fill="${c}"/>
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="${c}"/>
      </svg>`;
  }

  _chevronIcon() {
    return html`
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display:block;flex-shrink:0">
        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: 'Source Sans 3', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .pl-outer {
      display: flex;
      align-items: flex-start;
      gap: 3rem;
      width: 100%;
    }

    .pl-container {
      flex: 1;
      min-width: 0;
      width:         var(--pl-container-width, 100%);
      max-width:     var(--pl-container-max-width, none);
      padding:       var(--pl-container-padding, 0);
      background:    var(--pl-container-background, #ffffff);
      border-radius: var(--pl-container-border-radius, 0);
      box-shadow:    var(--pl-container-box-shadow, none);
    }

    /* ── Sidebar ── */
    .pl-sidebar {
      width: 180px;
      flex-shrink: 0;
      padding-top: 0.6rem;
      padding-left: 2rem;
      border-left: 1px solid #e8e8e8;
      position: sticky;
      top: var(--pl-sidebar-top, 1rem);
      align-self: flex-start;
    }

    .pl-sidebar-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #111;
      margin-bottom: 1rem;
    }

    .pl-sidebar-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .pl-sidebar-item {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      padding: 0.38rem 0;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 0.8rem;
      color: #888;
      cursor: pointer;
      transition: color 0.15s;
      line-height: 1.4;
    }
    .pl-sidebar-item:hover { color: #444; }
    .pl-sidebar-item.active { color: #e07630; font-weight: 600; }

    .pl-sidebar-count {
      color: inherit;
    }

    /* ── Header ── */
    .pl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0 0.75rem;
      border-bottom: 1px solid var(--pl-header-border-color, #e0e0e0);
      gap: 0.75rem;
    }

    .pl-result-count {
      font-size: var(--pl-header-font-size, 14px);
      color: #555;
      font-weight: 400;
      white-space: nowrap;
    }

    .pl-header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    /* ── Toggle buttons ── */
    .pl-toggle {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .pl-toggle button {
      background: none;
      border: none;
      padding: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.15s;
      line-height: 0;
    }
    .pl-toggle button:hover { background: #f0f0f0; }

    /* ── Sort dropdown ── */
    .pl-sort {
      position: relative;
    }

    .pl-sort-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border: none;
      border-radius: 8px;
      background: #f3f4f6;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s;
    }
    .pl-sort-btn:hover { background: #e9eaec; }

    .pl-sort-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      min-width: 160px;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
      z-index: 500;
      overflow: hidden;
      /* animate */
      opacity: 0;
      transform: translateY(4px);
      pointer-events: none;
      transition: opacity 0.12s ease, transform 0.12s ease;
    }
    .pl-sort-menu.is-open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .pl-sort-option {
      display: block;
      width: 100%;
      padding: 9px 14px;
      background: none;
      border: none;
      text-align: left;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 14px;
      color: #000;
      cursor: pointer;
      transition: background 0.1s;
    }
    .pl-sort-option:hover    { background: #f5f5f5; }
    .pl-sort-option.selected { font-weight: 600; }

    /* ── List / Grid ── */
    .pl-list { display: block; }

    .pl-grid {
      display: grid;
      grid-template-columns: repeat(var(--pl-grid-columns, 3), minmax(0, 1fr));
      gap: 1rem;
      padding: 1rem 0;
    }

    @media (max-width: 600px) { .pl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 380px) { .pl-grid { grid-template-columns: minmax(0, 1fr); } }

    .pl-loading,
    .pl-empty {
      padding: 2.5rem 0;
      text-align: center;
      color: #bbb;
      font-size: 0.85rem;
    }

    .pl-sentinel { height: 1px; }

    .pl-footer {
      padding: 1rem 0;
      text-align: center;
      font-size: 14px;
      color: #bbb;
      border-top: 1px solid #f0f0f0;
    }

    /* ── Mobile category pills (shown only below 768px) ── */
    .pl-cats-mobile {
      display: none;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      gap: 0.5rem;
      padding: 0.75rem 0 0.25rem;
    }
    .pl-cats-mobile::-webkit-scrollbar { display: none; }

    .pl-cat-pill {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 999px;
      border: 1px solid #e5e5e5;
      background: #fff;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 0.78rem;
      color: #888;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .pl-cat-pill:hover  { background: #f5f5f5; color: #444; }
    .pl-cat-pill.active { background: #fde8d4; color: #e07630; border-color: #f9c9a4; font-weight: 600; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .pl-outer   { gap: 2rem; }
      .pl-sidebar { width: 160px; }
    }

    @media (max-width: 768px) {
      .pl-outer   { gap: 1.5rem; }
      .pl-sidebar { width: 140px; padding-left: 1.25rem; }
      .pl-sidebar-title { font-size: 0.95rem; }
      .pl-sidebar-item  { font-size: 0.75rem; }
      .pl-sort-btn { padding: 7px 10px; font-size: 13px; }
    }

    @media (max-width: 600px) {
      .pl-outer        { flex-direction: column; }
      .pl-sidebar      { display: none; }
      .pl-cats-mobile  { display: flex; }
      .pl-header       { flex-wrap: wrap; gap: 0.5rem; padding: 0.75rem 0; }
      .pl-result-count { font-size: 13px; }
      .pl-grid         { gap: 0.75rem; }
    }

    @media (max-width: 380px) {
      .pl-sort-btn  { padding: 6px 8px; font-size: 12px; gap: 5px; }
    }
  `;

  render() {
    const isGrid = this._view === 'grid';
    const sorted = this._activeCategory === 'all'
      ? this._sortedPosts
      : this._sortedPosts.filter(p => p.category === this._activeCategory);
    const total  = this.totalCount > sorted.length ? this.totalCount : 0;
    const countText = total
      ? `${sorted.length} results from ${total} items`
      : `${sorted.length} result${sorted.length !== 1 ? 's' : ''}`;

    // Initial load (no posts yet): show full-page spinner.
    // Lazy load (posts already visible): keep existing items, show bottom spinner.
    const isInitialLoad = this.loading && this.posts.length === 0;
    const items = isInitialLoad
      ? html`<div class="pl-loading">Loading posts…</div>`
      : sorted.length === 0
        ? html`<div class="pl-empty">No posts found.</div>`
        : repeat(
            sorted,
            post => post.id,
            post => html`
              <lw-blog-list-item .post=${post} .view=${this._view} @post-click=${this._onPostClick}></lw-blog-list-item>
            `
          );

    const sidebar = this._categories.length ? html`
      <aside class="pl-sidebar">
        <div class="pl-sidebar-title">Blog Categories</div>
        <ul class="pl-sidebar-list">
          ${this._categories.map(cat => html`
            <li>
              <button
                class="pl-sidebar-item ${this._activeCategory === cat.value ? 'active' : ''}"
                @click=${() => this._pickCategory(cat.value)}
              >${cat.label}${cat.count != null ? html` <span class="pl-sidebar-count">[${cat.count}]</span>` : ''}</button>
            </li>
          `)}
        </ul>
      </aside>
    ` : '';

    return html`
      <div class="pl-outer">
        <div class="pl-container">

          <div class="pl-header">
            <span class="pl-result-count">${countText}</span>

            <div class="pl-header-right">
              <!-- View toggle -->
              <div class="pl-toggle">
                <button aria-label="List view" title="List view"
                  @click=${() => this._setView('list')}>
                  ${this._listIcon(!isGrid)}
                </button>
                <button aria-label="Grid view" title="Grid view"
                  @click=${() => this._setView('grid')}>
                  ${this._gridIcon(isGrid)}
                </button>
              </div>

              <!-- Sort dropdown -->
              <div class="pl-sort">
                <button class="pl-sort-btn" @click=${this._toggleSortMenu}>
                  ${this._sortLabel}
                  ${this._chevronIcon()}
                </button>
                <div class="pl-sort-menu ${this._sortOpen ? 'is-open' : ''}">
                  ${SORT_OPTIONS.map(opt => html`
                    <button
                      class="pl-sort-option ${this._sort === opt.value ? 'selected' : ''}"
                      @click=${() => this._pickSort(opt.value)}
                    >${opt.label}</button>
                  `)}
                </div>
              </div>
            </div>
          </div>

          <!-- mobile horizontal category pills (hidden on desktop) -->
          ${this._categories.length ? html`
            <div class="pl-cats-mobile">
              ${this._categories.map(cat => html`
                <button
                  class="pl-cat-pill ${this._activeCategory === cat.value ? 'active' : ''}"
                  @click=${() => this._pickCategory(cat.value)}
                >${cat.label}${cat.count != null ? ` [${cat.count}]` : ''}</button>
              `)}
            </div>
          ` : ''}

          <div class=${isGrid ? 'pl-grid' : 'pl-list'}>
            ${items}
          </div>

          ${this._hasMore ? html`<div class="pl-sentinel"></div>` : ''}

          ${this.loading && this.posts.length > 0
            ? html`<div class="pl-loading">Loading more…</div>`
            : ''}

          ${!this.loading ? html`
            <div class="pl-footer">Showing ${sorted.length} posts</div>
          ` : ''}

        </div>

        ${sidebar}
      </div>
    `;
  }
}

customElements.define('lw-blog-list', LwBlogList);
