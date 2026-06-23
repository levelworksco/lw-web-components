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
      gap: 1.25rem;
      align-items: flex-start;
      padding: var(--pl-card-padding, 1.6rem 0);
      border-bottom: 1px solid var(--pl-card-divider, #e5e5e5);
    }
    :host(:last-child) .list-row { border-bottom: none; }

    .list-content { flex: 1; min-width: 0; }

    .list-title {
      font-size:   var(--pl-title-font-size,   1.15rem);
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
      font-size:   var(--pl-excerpt-font-size, 14px);
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
      font-size: var(--pl-meta-font-size, 12px);
      color:     var(--pl-meta-color,     #999);
    }

    .list-image {
      width:         var(--pl-image-width,  145px);
      height:        var(--pl-image-height, 110px);
      flex-shrink:   0;
      border-radius: var(--pl-image-border-radius, 8px);
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
      border-radius: var(--pl-grid-card-radius, 12px);
      height: 100%;
      border-bottom: 1px solid var(--pl-card-divider, #e5e5e5);
      box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
    }

    .grid-image {
      width: 100%;
      aspect-ratio: 16/10;
      overflow: hidden;
      border-radius: var(--pl-grid-card-radius, 12px) var(--pl-grid-card-radius, 12px) 0 0;
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
      flex-direction: column;
      gap: 0.3rem;
      font-size: var(--pl-meta-font-size, 12px);
      color:     var(--pl-meta-color,     #999);
      margin-top: auto;
    }

    .grid-meta-author-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .grid-meta-date-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .grid-meta-category {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 5px;
      background: var(--pl-category-bg, #fde8d4);
      color: var(--pl-category-color, #e07630);
      font-weight: 500;
      font-size: 12px;
      white-space: nowrap;
      align-self: flex-start;
    }

    /* shared meta pieces */
    .meta-author   { color: var(--pl-author-color, #444); font-weight: 500; }
    .meta-dot      { color: #ccc; }
    .meta-category {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 5px;
      background: var(--pl-category-bg, #fde8d4);
      color: var(--pl-category-color, #e07630);
      font-weight: 500;
      font-size: 12px;
      white-space: nowrap;
    }

    .meta-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .meta-avatar-placeholder {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #9ca3af;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      flex-wrap: wrap;
    }

    .image-placeholder {
      width:100%; height:100%; background:#e8e4df;
      display:flex; align-items:center; justify-content:center; font-size:1.5rem;
    }

    @media (max-width: 480px) {
      .list-image { width:80px; height:60px; }
    }
  `;

  constructor() { super(); this.post = {}; this.view = 'list'; }

  _avatar(avatar, author) {
    return avatar
      ? html`<img class="meta-avatar" src="${avatar}" alt="${author}" />`
      : html`<span class="meta-avatar-placeholder">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </span>`;
  }

  _gridMeta(author, avatar, date, readTime, category) {
    return html`
      <div class="grid-meta-author-row">
        ${this._avatar(avatar, author)}
        <span class="meta-author">${author}</span>
      </div>
      <div class="grid-meta-date-row">
        <span>${date}</span>
        ${readTime ? html`<span class="meta-dot">•</span><span>${readTime}</span>` : ''}
      </div>
      ${category ? html`<span class="grid-meta-category">${category}</span>` : ''}
    `;
  }

  _meta(author, avatar, date, readTime, category) {
    return html`
      <div class="meta-row">
        ${this._avatar(avatar, author)}
        <span class="meta-author">${author}</span>
        <span class="meta-dot">•</span>
        <span>${date}</span>
        ${readTime ? html`<span class="meta-dot">•</span><span>${readTime}</span>` : ''}
        ${category ? html`<span class="meta-dot">•</span><span class="meta-category">${category}</span>` : ''}
      </div>
    `;
  }

  render() {
    const {
      title    = '',
      excerpt  = '',
      author   = '',
      avatar   = '',
      date     = '',
      readTime = '',
      category = '',
      image,
    } = this.post;
    const img = image
      ? html`<img src="${image}" alt="${title}" />`
      : html`<div class="image-placeholder">📖</div>`;

    const onClick = () => this.dispatchEvent(new CustomEvent('post-click', {
      detail: { post: this.post }, bubbles: true, composed: true,
    }));

    if (this.view === 'grid') {
      return html`
        <div class="grid-card" style="cursor:pointer" @click=${onClick}>
          <div class="grid-image">${img}</div>
          <div class="grid-body">
            <div class="grid-title">${title}</div>
            <div class="grid-excerpt">${excerpt}</div>
            <div class="grid-meta">${this._gridMeta(author, avatar, date, readTime, category)}</div>
          </div>
        </div>
      `;
    }

    // default: list
    return html`
      <div class="list-row" style="cursor:pointer" @click=${onClick}>
        <div class="list-content">
          <h3 class="list-title">${title}</h3>
          <div class="list-excerpt">${excerpt}</div>
          <div class="list-meta">${this._meta(author, avatar, date, readTime, category)}</div>
        </div>
        <div class="list-image">${img}</div>
      </div>
    `;
  }
}

customElements.define('lw-blog-list-item', LwBlogListItem);
