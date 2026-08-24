import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import '../lw-insights-bar/lw-insights-bar.js';
import '../lw-header/lw-header.js';
import '../lw-settings/lw-settings.js';
import '../lw-blog-search/lw-blog-search.js';
import '../lw-blog-list/lw-blog-list.js';
import '../lw-summary/lw-summary.js';

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-blog>
//
// Composes the blog UI and distributes each value to the right
// child component. Never fetches — <lw-blog-page> fetches the API
// and passes the whole response in via the `data` property. Fields
// on `data` take precedence over the matching attributes, which act
// as fallbacks/defaults (used when rendering <lw-blog> standalone).
//
// PROPERTIES — content:
//   data                (Object)  full API response from lw-blog-page
//
// ATTRIBUTES — connection config:
//   base-url            (String)  search API endpoint (used by lw-blog-list)
//   api-key             (String)  X-API-KEY header value
//   detail-url          (String)  page opened on post click
//
// ATTRIBUTES — insights bar:
//   demo-note           (String)
//   bar-logo-src        (String)
//   blogs               (String)
//   updated             (String)
//   searches            (String)
//   unblocked           (String)
//
// ATTRIBUTES — header:
//   logo-src            (String)
//   logo-href           (String)
//
// ATTRIBUTES / PROPERTIES — summary (lw-blog-overview):
//   summary-heading     (String)  section title
//   summary-citations   (String)  'none' | 'number' | 'chip' | 'link'
//   summaryParagraphs   (Array)   paragraph/citation data (property only)
//
// ATTRIBUTES — search bar:
//   search-placeholder  (String)
//   slider-max          (Number)
//   slider-step         (Number)
//   slider-label        (String)
//
// ATTRIBUTES — list:
//   default-view        (String)  'list' | 'grid'
//   default-sort        (String)
//
// CSS VARIABLES (set on <lw-blog> host):
//   --blog-page-max-width   max-width of content area  (default 960px)
//   --blog-page-padding     padding of content area    (default 0 2rem 4rem)
//   --blog-search-top       sticky top for search bar  (default 40px)
//   --pl-sidebar-top        sticky top for list sidebar
// ─────────────────────────────────────────────────────────────

export class LwBlog extends LitElement {

  static properties = {
    // content (full API response from lw-blog-page)
    data:      { type: Object },

    // connection config
    baseUrl:   { attribute: 'base-url'   },
    apiKey:    { attribute: 'api-key'    },
    detailUrl: { attribute: 'detail-url' },

    // insights bar
    demoNote:   { attribute: 'demo-note'    },
    barLogoSrc: { attribute: 'bar-logo-src' },
    blogs:      { attribute: 'blogs'        },
    updated:    { attribute: 'updated'      },
    searches:   { attribute: 'searches'     },
    unblocked:  { attribute: 'unblocked'    },

    // header
    logoSrc:  { attribute: 'logo-src'  },
    logoHref: { attribute: 'logo-href' },

    // summary
    summaryHeading:    { attribute: 'summary-heading'   },
    summaryCitations:  { attribute: 'summary-citations' },
    summaryParagraphs: { type: Array },

    // search bar
    searchPlaceholder: { attribute: 'search-placeholder' },
    sliderMax:         { type: Number, attribute: 'slider-max'  },
    sliderStep:        { type: Number, attribute: 'slider-step' },
    sliderLabel:       { attribute: 'slider-label' },

    // list
    defaultView: { attribute: 'default-view' },
    defaultSort: { attribute: 'default-sort' },

    // internal wiring
    _searchQuery:   { state: true },
    _semanticRatio: { state: true },
    _searchTime:    { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    lw-insights-bar {
      position: sticky;
      top: 0;
      z-index: 600;
    }

    .page {
      max-width: var(--blog-page-max-width, 960px);
      margin: 0 auto;
      padding: var(--blog-page-padding, 0 2rem 4rem);
    }

    lw-blog-search {
      display: block;
      position: sticky;
      top: var(--blog-search-top, 40px);
      z-index: 100;
      background: #fff;
      padding: 1rem 0 0.5rem;
      box-shadow: 0 6px 12px -2px rgba(255,255,255,1),
                  0 10px 16px -4px rgba(255,255,255,0.9);
    }

    lw-blog-list {
      position: relative;
      z-index: 0;
    }

    @media (max-width: 768px) {
      .page { padding: var(--blog-page-padding, 0 1.25rem 3rem); }
    }

    @media (max-width: 480px) {
      .page          { padding: var(--blog-page-padding, 0 1rem 2.5rem); }
      lw-blog-search { padding: 0.75rem 0 0.25rem; }
    }
  `;

  constructor() {
    super();
    // content
    this.data              = null;
    // connection config
    this.baseUrl           = '';
    this.apiKey            = '';
    this.detailUrl         = '';
    // insights bar
    this.demoNote          = '';
    this.barLogoSrc        = '';
    this.blogs             = '';
    this.updated           = '';
    this.searches          = '';
    this.unblocked         = '';
    // header
    this.logoSrc           = '';
    this.logoHref          = '';
    // summary
    this.summaryHeading    = 'Overview';
    this.summaryCitations  = 'chip';
    this.summaryParagraphs = [];
    // search bar
    this.searchPlaceholder = 'Search';
    this.sliderMax         = 1;
    this.sliderStep        = 0.1;
    this.sliderLabel       = '';
    // list
    this.defaultView       = 'list';
    this.defaultSort       = 'newest';
    // internal
    this._searchQuery      = '';
    this._semanticRatio    = 0;
    this._searchTime       = null;
  }

  _onSearchChange(e)     { this._searchQuery   = e.detail.value; }
  _onSliderChange(e)     { this._semanticRatio = e.detail.value; }
  _onSearchTimeUpdate(e) { this._searchTime    = e.detail.ms;    }

  render() {
    // `data` from lw-blog-page takes precedence; fall back to attributes.
    const d = this.data ?? {};
    const summaryParagraphs = d.summaryParagraphs ?? this.summaryParagraphs;
    return html`
      <lw-insights-bar
        demo-note=${d.demoNote     ?? this.demoNote}
        logo-src=${d.barLogoSrc    ?? this.barLogoSrc}
        blogs=${d.blogs            ?? this.blogs}
        updated=${d.updated        ?? this.updated}
        searches=${d.searches      ?? this.searches}
        unblocked=${d.unblocked    ?? this.unblocked}
      ></lw-insights-bar>

      <lw-header
        logo-src=${d.logoSrc       ?? this.logoSrc}
        logo-href=${d.logoHref     ?? this.logoHref}
      ></lw-header>

      <div class="page">
        <lw-blog-search
          placeholder=${d.searchPlaceholder ?? this.searchPlaceholder}
          slider-max=${d.sliderMax   ?? this.sliderMax}
          slider-step=${d.sliderStep ?? this.sliderStep}
          slider-label=${d.sliderLabel ?? this.sliderLabel}
          .searchTime=${this._searchTime}
          @search-change=${this._onSearchChange}
          @slider-change=${this._onSliderChange}
        ></lw-blog-search>

        ${summaryParagraphs?.length
          ? html`
              <lw-blog-overview
                heading=${d.summaryHeading      ?? this.summaryHeading}
                displayCitations=${d.summaryCitations ?? this.summaryCitations}
                .paragraphs=${summaryParagraphs}
              ></lw-blog-overview>
            `
          : ''}

        <lw-blog-list
          base-url=${this.baseUrl}
          api-key=${this.apiKey}
          detail-url=${this.detailUrl}
          default-view=${d.defaultView ?? this.defaultView}
          default-sort=${d.defaultSort ?? this.defaultSort}
          .searchQuery=${this._searchQuery}
          .semanticRatio=${this._semanticRatio}
          @search-time-update=${this._onSearchTimeUpdate}
        ></lw-blog-list>
      </div>

      <lw-settings></lw-settings>
    `;
  }
}

customElements.define('lw-blog', LwBlog);
