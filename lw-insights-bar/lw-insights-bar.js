import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

const _ICON_URL = new URL('../icon.png', import.meta.url).href;

export class LwInsightsBar extends LitElement {

  static properties = {
    demoNote:          { type: String, attribute: 'demo-note'           },
    logoSrc:           { type: String, attribute: 'logo-src'            },
    blogs:             { type: String },
    updated:           { type: String },
    searches:          { type: String },
    unblocked: { type: String, attribute: 'unblocked'  },
    _open:             { state: true },
    _settingsOpen:     { state: true },
    _logoError:        { state: true },
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
      padding: 0 0 0 2rem;
      min-height: 40px;
      gap: 0;
    }

    .demo-note {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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

    .bar-logo {
      width: 20px;
      height: 20px;
      object-fit: contain;
      flex-shrink: 0;
      display: block;
      border-radius: 3px;
    }

    .bar-logo-placeholder {
      width: 20px;
      height: 20px;
      object-fit: contain;
      flex-shrink: 0;
      display: block;
      border-radius: 3px;
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
      display: inline-flex;
      align-items: center;
      gap: 0.22rem;
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

    /* ── Info icon + tooltip ── */
    .info-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .info-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #f5f5f5;
      border: 1px solid #d0d0d0;
      color: #B37040;
      font-size: 11px;
      font-weight: 700;
      font-style: normal;
      line-height: 12px;
      cursor: default;
      margin-left: 0.25rem;
      flex-shrink: 0;
      user-select: none;
      vertical-align: middle;
    }

    .info-tooltip {
      display: none;
      position: absolute;
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 400;
      line-height: 1.5;
      white-space: nowrap;
      padding: 0.45rem 0.7rem;
      border-radius: 6px;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.18);
    }

    .info-tooltip::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-bottom-color: #1a1a1a;
    }

    .info-wrap:hover .info-tooltip {
      display: block;
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

    /* ── Settings gear button ── */
    .settings-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin: 0 0.5rem;
      background: none;
      border: 1px solid transparent;
      border-radius: 6px;
      color: #000;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .settings-btn:hover {
      background: #F3DFCF;
      border-color: #fddcba;
    }
    .settings-btn.is-open {
      background: #f97316;
      border-color: #f97316;
      color: #fff;
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

    @media (max-width: 1023px) {
      /* Stack into 3 rows: demo-note, stats band, button row */
      .bar {
        flex-wrap: wrap;
        min-height: 0;
        padding: 0;
        align-items: stretch;
      }

      /* Row 1 — demo note (wraps to multiple lines) */
      .demo-note {
        align-items: flex-start;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        line-height: 1.4;
        padding: 0.85rem 1.25rem;
      }

      /* Row 2 — stats on their own peach band */
      .stats {
        flex: 0 0 100%;
        min-width: 0;
        background: #fdf2e9;
        border-top: 1px solid #f9ede2;
        border-bottom: 1px solid #f9ede2;
      }
      .stat {
        flex: 1 1 0;
        min-width: 0;            /* allow shrink below content width — prevents overflow */
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        text-align: center;
        gap: 0.2rem;
        padding: 0.7rem 0.3rem;
        border-left: 1px solid #f4dcc7;
        overflow-wrap: anywhere;
      }
      .stats .stat:first-child { border-left: none; }
      .stat-label {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
        white-space: normal;
        line-height: 1.2;
      }
      .stat-value { white-space: normal; line-height: 1.25; }

      /* Tooltip — anchor to the right edge and wrap so it can't run off-screen */
      .info-tooltip {
        white-space: normal;
        width: min(240px, 80vw);
        left: auto;
        right: 0;
        transform: none;
      }
      .info-tooltip::after {
        left: auto;
        right: 14px;
        transform: none;
      }

      /* Row 3 — View Insights on the left, gear pushed to the right */
      .insights-btn {
        margin: 0.7rem 0 0.7rem 1.25rem;
        padding: 0.55rem 0.8rem;
      }
      .settings-btn { margin-left: auto; margin-right: 1rem; margin-top: 0.7rem; }
    }

    @media (max-width: 480px) {
      .demo-note    { font-size: 13px; padding: 0.75rem 1rem; }
      .stat         { padding: 0.6rem 0.3rem; }
      .insights-btn { margin-left: 1rem; }
    }
  `;

  constructor() {
    super();
    this.demoNote          = 'Demoing content & AI search functionality only. Demo not intended to visually match source site.';
    this.logoSrc           = '../../logo.png';
    this.blogs             = '87';
    this.updated           = '18 Jun 2026 3:20 PM IST';
    this.searches          = '14.2K';
    this.unblocked = '92%';
    this._open             = false;
    this._settingsOpen     = false;
    this._logoError        = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Stay in sync with the drawer no matter who opened/closed it.
    this._onSettingsChanged = (e) => { this._settingsOpen = !!(e.detail && e.detail.open); };
    window.addEventListener('lw-settings-changed', this._onSettingsChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('lw-settings-changed', this._onSettingsChanged);
  }

  updated(changed) { if (changed.has('logoSrc')) this._logoError = false; }

  _toggle() { this._open = !this._open; }

  _toggleSettings() {
    // Fire a global command; <lw-settings> listens for it wherever it lives.
    window.dispatchEvent(new CustomEvent('lw-settings-toggle', {
      detail: { open: !this._settingsOpen },
    }));
  }

  render() {
    return html`
      <div class="bar">
        <span class="demo-note">
          ${this.logoSrc && !this._logoError
            ? html`<img class="bar-logo" src=${this.logoSrc} alt="" aria-hidden="true"
                        @error=${() => { this._logoError = true; }}>`
            : html`<img class="bar-logo-placeholder" src=${_ICON_URL} alt="" aria-hidden="true">`}
          ${this.demoNote}
        </span>

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
            <span class="stat-label">
              Unblocked
              <span class="info-wrap">
                <em class="info-icon">i</em>
                <span class="info-tooltip">
                  % of searches that returned relevant results<br>
                  without manual filtering or re-queries.
                </span>
              </span>
            </span>
            <span class="stat-value">${this.unblocked}</span>
            
          </div>
        </div>

        <button class="insights-btn ${this._open ? 'is-open' : ''}" @click=${this._toggle}>
          View Insights
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button class="settings-btn ${this._settingsOpen ? 'is-open' : ''}"
                @click=${this._toggleSettings} aria-label="Settings">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
