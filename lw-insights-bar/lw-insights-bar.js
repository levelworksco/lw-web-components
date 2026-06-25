import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class LwInsightsBar extends LitElement {

  static properties = {
    demoNote:          { type: String, attribute: 'demo-note'           },
    blogs:             { type: String },
    updated:           { type: String },
    searches:          { type: String },
    searchesUnblocked: { type: String, attribute: 'searches-unblocked'  },
    _open:             { state: true },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Stats bar ── */
    .bar {
      display: flex;
      align-items: center;
      background: #fffcf8;
      border-top: 1px solid #f9ede2;
      border-bottom: 2px solid #f9ede2;
      padding: 0 2rem;
      min-height: 40px;
      gap: 0;
    }

    .demo-note {
      font-size: 14px;
      color: #3C3C43;
      font-style: normal;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 1.5rem;
    }

    .stats {
      display: flex;
      align-items: stretch;
      flex-shrink: 0;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0 1.1rem;
      border-left: 2px solid #f9ede2;
    }

    .stat-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #B37040;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .stat-value {
      font-size: 0.8rem;
      font-weight: 700;
      color: #111;
      white-space: nowrap;
    }

    /* ── View Insights button ── */
    .insights-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-left: 1.1rem;
      padding: 0.8rem 0.9rem;
      background: #F3DFCF;
      border: 1px solid #fddcba;
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 600;
      color: #c2601a;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s;
      line-height: 1;
    }
    .insights-btn:hover { background: #fde8d4; border-color: #f9b27a; }

    .insights-btn svg {
      transition: transform 0.2s ease;
    }
    .insights-btn.is-open svg {
      transform: rotate(180deg);
    }

    /* ── Expandable panel ── */
    .panel-wrap {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease;
    }
    .panel-wrap.is-open {
      max-height: 400px;
    }

    .panel {
      border: 1px solid #ececec;
      border-top: none;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 220px;
    }

    /* ── Coming soon ── */
    .coming-soon {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .cs-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fef3ea;
      border: 1px solid #fddcba;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #f97316;
    }

    .cs-label {
      font-size: 1rem;
      font-weight: 600;
      color: #222;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .bar          { padding: 0 1.25rem; }
      .demo-note    { font-size: 12px; }
      .stat         { padding: 0 0.75rem; }
      .stat-label   { font-size: 0.62rem; }
      .stat-value   { font-size: 0.72rem; }
      .insights-btn { padding: 0.65rem 0.7rem; font-size: 0.72rem; margin-left: 0.75rem; }
    }

    @media (max-width: 600px) {
      /* wrap to 2 rows: demo-note top, all stats + button below */
      .bar        { flex-wrap: wrap; height: auto; padding: 0.35rem 1.25rem; row-gap: 0.3rem; }
      .demo-note  { flex: 0 0 100%; padding-right: 0; white-space: nowrap; }
      .stat-label { display: block; }
      .stat       { padding: 0 0.6rem; border-left-width: 1px; }
      .stats .stat:first-child { border-left: none; padding-left: 0; }
      .insights-btn { margin-left: auto; padding: 0.5rem 0.7rem; }
    }

    @media (max-width: 480px) {
      .bar          { padding: 0.35rem 1rem; }
      .stat         { padding: 0 0.5rem; }
      .insights-btn { margin-left: 0.5rem; }
    }
  `;

  constructor() {
    super();
    this.demoNote          = 'Demoing content & AI search functionality only. Demo not intended to visually match source site.';
    this.blogs             = '87';
    this.updated           = '18 Jun 2026 3:20 PM IST';
    this.searches          = '14.2K';
    this.searchesUnblocked = '92%';
    this._open             = false;
  }

  _toggle() { this._open = !this._open; }

  render() {
    return html`
      <div class="bar">
        <span class="demo-note">${this.demoNote}</span>

        <div class="stats">
          <div class="stat">
            <span class="stat-label">Blogs</span>
            <span class="stat-value">${this.blogs}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Updated</span>
            <span class="stat-value">${this.updated}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Searches</span>
            <span class="stat-value">${this.searches}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Searches Unblocked</span>
            <span class="stat-value">${this.searchesUnblocked}</span>
          </div>
        </div>

        <button class="insights-btn ${this._open ? 'is-open' : ''}" @click=${this._toggle}>
          View Insights
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="panel-wrap ${this._open ? 'is-open' : ''}">
        <div class="panel">
          <div class="coming-soon">
            <span class="cs-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L4.5 13.5H11L10 22l9.5-12H14L13 2Z"/>
              </svg>
            </span>
            <span class="cs-label">Coming Soon</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('lw-insights-bar', LwInsightsBar);
