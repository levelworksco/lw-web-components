import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import '../lw-blog/lw-blog.js';

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-blog-page>
//
// Entry point. Holds the connection config, fetches the page
// content from `src`, and passes the whole API response to
// <lw-blog> as a single `data` object. <lw-blog> never fetches —
// it distributes the data to its child components.
//
// ATTRIBUTES — connection config:
//   src         (String)  content API endpoint (fetched here)
//   base-url    (String)  search API endpoint (used by lw-blog-list)
//   api-key     (String)  X-API-KEY header value
//   detail-url  (String)  page opened on post click
//
// Expected `src` response shape (passed straight through to lw-blog):
//   {
//     demoNote, barLogoSrc, blogs, updated, searches, unblocked,
//     logoSrc, logoHref,
//     searchPlaceholder, sliderMax, sliderStep, sliderLabel,
//     defaultView, defaultSort,
//     summaryHeading, summaryCitations, summaryParagraphs,
//   }
// ─────────────────────────────────────────────────────────────

export class LwBlogPage extends LitElement {

  static properties = {
    src:       { attribute: 'src'        },
    baseUrl:   { attribute: 'base-url'   },
    apiKey:    { attribute: 'api-key'    },
    detailUrl: { attribute: 'detail-url' },
    _data:     { state: true },
  };

  static styles = css`
    :host { display: block; }
  `;

  constructor() {
    super();
    this.src       = '';
    this.baseUrl   = '';
    this.apiKey    = '';
    this.detailUrl = '';
    this._data     = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchData();
  }

  updated(changedProps) {
    if (changedProps.has('src') || changedProps.has('apiKey')) this._fetchData();
  }

  async _fetchData() {
    if (!this.src) return;
    const headers = {};
    if (this.apiKey) headers['X-API-KEY'] = this.apiKey;
    const res = await fetch(this.src, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    this._data = await res.json();
  }

  render() {
    return html`
      <lw-blog
        base-url=${this.baseUrl}
        api-key=${this.apiKey}
        detail-url=${this.detailUrl}
        .data=${this._data}
      ></lw-blog>
    `;
  }
}

customElements.define('lw-blog-page', LwBlogPage);
