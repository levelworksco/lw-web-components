import { LitElement, html, css, repeat }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import '../lw-blog-list-item/lw-blog-list-item.js';

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-blog-list>
// Single tag the user places. Supports list/grid toggle.
// Uses <lw-blog-list-item> internally.
//
// ATTRIBUTES → CSS vars (--pl-<name>):
//   container-width, container-max-width, container-padding, container-background
//   container-border-radius, container-box-shadow
//   card-padding, card-divider, grid-card-radius, grid-columns
//   title-color, title-font-size, title-font-weight,
//   title-font-family, title-hover-color
//   excerpt-color, excerpt-font-size
//   meta-color, meta-font-size, author-color, category-color
//   image-width, image-height, image-border-radius
//   header-border-color, header-font-size
//   toggle-active-color, toggle-inactive-color
//   css-vars  →  freeform "key:val; key:val"
//
// DATA:
//   posts      (JS property) — array of post objects
//   loading    (attribute)   — show loading state
//   list-label (attribute)   — header text
//   default-view (attribute) — 'list' | 'grid'
// ─────────────────────────────────────────────────────────────
export class LwBlogList extends LitElement {

  static properties = {
    posts:       { type: Array   },
    loading:     { type: Boolean },
    listLabel:   { attribute: 'list-label'    },
    defaultView: { attribute: 'default-view'  },

    // internal state
    _view: { state: true },

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
    headerBorderColor:  { attribute: 'header-border-color'  },
    headerFontSize:     { attribute: 'header-font-size'     },
    // toggle
    toggleActiveColor:   { attribute: 'toggle-active-color'   },
    toggleInactiveColor: { attribute: 'toggle-inactive-color' },
    // freeform
    cssVars: { attribute: 'css-vars' },
  };

  attributeChangedCallback(name, _old, value) {
    super.attributeChangedCallback?.(name, _old, value);

    if (name === 'default-view') {
      this._view = value === 'grid' ? 'grid' : 'list';
    }

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

    if (cssAttrs.includes(name)) {
      this.style.setProperty(`--pl-${name}`, value);
    }

    if (name === 'css-vars' && value) {
      value.split(';').forEach(pair => {
        const [k, ...rest] = pair.split(':');
        if (k && rest.length) {
          this.style.setProperty(k.trim(), rest.join(':').trim());
        }
      });
    }
  }

  constructor() {
    super();
    this.posts       = [];
    this.loading     = false;
    this.listLabel   = 'Latest Posts';
    this.defaultView = 'list';
    this._view       = 'list';
  }

  _setView(v) { this._view = v; }

  // ── icon SVGs ──────────────────────────────────────────────
  _listIcon(active) {
    const color = active
      ? 'var(--pl-toggle-active-color, #f58220)'
      : 'var(--pl-toggle-inactive-color, #bbb)';
    return html`
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="display:block">
        <rect x="1" y="2"  width="16" height="3" rx="1" fill="${color}"/>
        <rect x="1" y="7"  width="16" height="3" rx="1" fill="${color}"/>
        <rect x="1" y="12" width="16" height="3" rx="1" fill="${color}"/>
      </svg>`;
  }

  _gridIcon(active) {
    const color = active
      ? 'var(--pl-toggle-active-color, #f58220)'
      : 'var(--pl-toggle-inactive-color, #bbb)';
    return html`
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="display:block">
        <rect x="1"  y="1"  width="7" height="7" rx="1.5" fill="${color}"/>
        <rect x="10" y="1"  width="7" height="7" rx="1.5" fill="${color}"/>
        <rect x="1"  y="10" width="7" height="7" rx="1.5" fill="${color}"/>
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="${color}"/>
      </svg>`;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: 'Source Sans 3', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .pl-container {
      width:         var(--pl-container-width, 100%);
      max-width:     var(--pl-container-max-width, 720px);
      margin:        0 auto;
      padding:       var(--pl-container-padding, 0 1.5rem);
      background:    var(--pl-container-background, #ffffff);
      border-radius: var(--pl-container-border-radius, 6px);
      box-shadow:    var(--pl-container-box-shadow, 0 1px 8px rgba(0,0,0,0.07));
    }

    /* header row: label left, toggle icons right */
    .pl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.1rem 0 0.6rem;
      border-bottom: 1px solid var(--pl-header-border-color, #e0e0e0);
    }

    .pl-header h2 {
      font-family:    'Source Sans 3', sans-serif;
      font-size:      var(--pl-header-font-size, 0.72rem);
      font-weight:    700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #222;
      margin: 0;
    }

    /* toggle buttons */
    .pl-toggle {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .pl-toggle button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.15s;
      line-height: 0;
    }
    .pl-toggle button:hover { background: #f5f5f5; }

    /* list mode: items stacked */
    .pl-list { display: block; }

    /* grid mode: 3-column grid */
    .pl-grid {
      display: grid;
      grid-template-columns: repeat(var(--pl-grid-columns, 3), 1fr);
      gap: 1rem;
      padding: 1rem 0;
    }

    @media (max-width: 600px) {
      .pl-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 380px) {
      .pl-grid { grid-template-columns: 1fr; }
    }

    .pl-loading,
    .pl-empty {
      padding: 2.5rem 0;
      text-align: center;
      color: #bbb;
      font-size: 0.85rem;
    }

    .pl-footer {
      padding: 1rem 0;
      text-align: center;
      font-size: 0.75rem;
      color: #bbb;
      border-top: 1px solid #f0f0f0;
    }
  `;

  render() {
    const isGrid = this._view === 'grid';

    const items = this.loading
      ? html`<div class="pl-loading">Loading posts…</div>`
      : this.posts.length === 0
        ? html`<div class="pl-empty">No posts found.</div>`
        : repeat(
            this.posts,
            post => post.id,
            (post) => html`
              <lw-blog-list-item
                .post=${post}
                .view=${this._view}
              ></lw-blog-list-item>
            `
          );

    return html`
      <div class="pl-container">

        <div class="pl-header">
          <h2>${this.listLabel}</h2>
          <div class="pl-toggle">
            <button
              aria-label="List view"
              title="List view"
              aria-pressed=${!isGrid}
              @click=${() => this._setView('list')}
            >
              ${this._listIcon(!isGrid)}
            </button>
            <button
              aria-label="Grid view"
              title="Grid view"
              aria-pressed=${isGrid}
              @click=${() => this._setView('grid')}
            >
              ${this._gridIcon(isGrid)}
            </button>
          </div>
        </div>

        <div class=${isGrid ? 'pl-grid' : 'pl-list'}>
          ${items}
        </div>

        ${!this.loading ? html`
          <div class="pl-footer">
            Showing all ${this.posts.length} posts
          </div>
        ` : ''}

      </div>
    `;
  }
}

customElements.define('lw-blog-list', LwBlogList);
