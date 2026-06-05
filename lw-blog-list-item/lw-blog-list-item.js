import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-blog-list-item>
// Renders one post in list OR grid mode.
// view prop is passed down from <lw-blog-list>.
// ─────────────────────────────────────────────────────────────
export class LwBlogListItem extends LitElement {

  static properties = {
    post: { type: Object },
    view: { type: String }, // 'list' | 'grid'
  };

  static styles = css`
    :host { display: block; animation: fadeUp 0.25s ease both; animation-delay: 0.1s; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ══════════════════════════════
       LIST VIEW
    ══════════════════════════════ */
    .list-row {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: var(--pl-card-padding, 1.1rem 0);
      border-bottom: 1px solid var(--pl-card-divider, #e5e5e5);
    }
    :host(:last-child) .list-row { border-bottom: none; }

    .list-content { flex: 1; min-width: 0; }

    .list-title {
      font-size:   var(--pl-title-font-size,   1rem);
      font-weight: var(--pl-title-font-weight, 700);
      color:       var(--pl-title-color,       #111);
      line-height: 1.3;
      margin-bottom: 0.35rem;
      cursor: pointer;
      transition: color 0.15s;
      font-family: var(--pl-title-font-family, 'Source Sans 3', sans-serif);
    }
    .list-title:hover { color: var(--pl-title-hover-color, #555); }

    .list-excerpt {
      font-size:   var(--pl-excerpt-font-size, 0.84rem);
      color:       var(--pl-excerpt-color,     #444);
      line-height: 1.65;
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .list-meta {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      flex-wrap: wrap;
      font-size: var(--pl-meta-font-size, 0.72rem);
      color:     var(--pl-meta-color,     #999);
    }

    .list-image {
      width:         var(--pl-image-width,  130px);
      height:        var(--pl-image-height, 90px);
      flex-shrink:   0;
      border-radius: var(--pl-image-border-radius, 4px);
      overflow:      hidden;
      background:    #ddd;
    }
    .list-image img { width:100%; height:100%; object-fit:cover; display:block; }

    /* ══════════════════════════════
       GRID VIEW
    ══════════════════════════════ */
    .grid-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: var(--pl-grid-card-radius, 6px);
      overflow: hidden;
      height: 100%;
    }

    .grid-image {
      width: 100%;
      aspect-ratio: 16/10;
      overflow: hidden;
      background: #ddd;
      flex-shrink: 0;
    }
    .grid-image img { width:100%; height:100%; object-fit:cover; display:block; }

    .grid-body {
      padding: 0.85rem 0.85rem 0.75rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .grid-title {
      font-size:   var(--pl-title-font-size,   0.95rem);
      font-weight: var(--pl-title-font-weight, 700);
      color:       var(--pl-title-color,       #111);
      line-height: 1.3;
      margin-bottom: 0.35rem;
      cursor: pointer;
      transition: color 0.15s;
      font-family: var(--pl-title-font-family, 'Source Sans 3', sans-serif);
    }
    .grid-title:hover { color: var(--pl-title-hover-color, #555); }

    .grid-excerpt {
      font-size:   var(--pl-excerpt-font-size, 0.8rem);
      color:       var(--pl-excerpt-color,     #555);
      line-height: 1.6;
      margin-bottom: 0.6rem;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .grid-meta {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      flex-wrap: wrap;
      font-size: var(--pl-meta-font-size, 0.68rem);
      color:     var(--pl-meta-color,     #999);
      margin-top: auto;
    }

    /* shared meta pieces */
    .meta-author   { color: var(--pl-author-color,   #999); font-weight: 400; }
    .meta-dot      { color: #ccc; }
    .meta-category { color: var(--pl-category-color, #999); font-weight: 400; }

    .image-placeholder {
      width:100%; height:100%; background:#e8e4df;
      display:flex; align-items:center; justify-content:center; font-size:1.5rem;
    }

    @media (max-width: 480px) {
      .list-image { width:80px; height:60px; }
    }
  `;

  constructor() { super(); this.post = {}; this.view = 'list'; }

  _meta(author, date, category) {
    return html`
      <span class="meta-author">${author}</span>
      <span class="meta-dot">•</span>
      <span>${date}</span>
      <span class="meta-dot">•</span>
      <span class="meta-category">${category}</span>
    `;
  }

  render() {
    const {
      title    = '',
      excerpt  = '',
      author   = '',
      date     = '',
      category = '',
      image,
    } = this.post;
    const img = image
      ? html`<img src="${image}" alt="${title}" />`
      : html`<div class="image-placeholder">📖</div>`;

    if (this.view === 'grid') {
      return html`
        <div class="grid-card">
          <div class="grid-image">${img}</div>
          <div class="grid-body">
            <div class="grid-title">${title}</div>
            <div class="grid-excerpt">${excerpt}</div>
            <div class="grid-meta">${this._meta(author, date, category)}</div>
          </div>
        </div>
      `;
    }

    // default: list
    return html`
      <div class="list-row">
        <div class="list-content">
          <h3 class="list-title">${title}</h3>
          <div class="list-excerpt">${excerpt}</div>
          <div class="list-meta">${this._meta(author, date, category)}</div>
        </div>
        <div class="list-image">${img}</div>
      </div>
    `;
  }
}

customElements.define('lw-blog-list-item', LwBlogListItem);
