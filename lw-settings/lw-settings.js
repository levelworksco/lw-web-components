import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import '../lw-slider/lw-slider.js';

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-settings>
//
// PROPERTIES:
//   open   (Boolean) — drawer open state, default false
//   width  (String)  — drawer width,      default "300px"
//
// EVENTS:
//   settings-open   — fired when drawer opens
//   settings-close  — fired when drawer closes
// ─────────────────────────────────────────────────────────────

export class LwSettings extends LitElement {

  static properties = {
    open:  { type: Boolean },
    width: { type: String },
    top:   { type: String },
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .drawer {
      position: fixed;
      top: var(--lw-drawer-top, 42px);
      right: 0;
      height: calc(100dvh - var(--lw-drawer-top, 42px));
      width: var(--lw-drawer-width, 300px);
      background: #fff;
      border-left: 1px solid #e8e8e8;
      box-shadow: -8px 0 32px rgba(0,0,0,0.08);
      transform: translateX(100%);
      transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
      z-index: 500;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .drawer.is-open {
      transform: translateX(0);
    }

    /* ── Header ── */
    .drawer-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0 1.25rem;
      height: 41px;
      border-bottom: 1px solid #f0f0f0;
      flex-shrink: 0;
    }

    .drawer-title {
      flex: 1;
      font-size: 0.92rem;
      font-weight: 700;
      color: #111;
      letter-spacing: -0.01em;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      cursor: pointer;
      color: #aaa;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
      flex-shrink: 0;
    }
    .close-btn:hover { background: #f5f5f5; color: #333; }

    /* ── Body ── */
    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* ── Section ── */
    .section-title {
      font-size: 0.65rem;
      font-weight: 700;
      color: #bbb;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.6rem;
    }

    /* ── Setting row ── */
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .setting-row:last-child { border-bottom: none; }

    .slider-row {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }
    .slider-row lw-slider {
      width: 100%;
    }

    .setting-label {
      font-size: 0.82rem;
      color: #333;
      font-weight: 500;
      line-height: 1.4;
    }
    .setting-desc {
      font-size: 0.72rem;
      color: #aaa;
      margin-top: 1px;
    }

    /* ── Toggle switch ── */
    .toggle {
      position: relative;
      width: 36px;
      height: 20px;
      flex-shrink: 0;
    }
    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }
    .toggle-track {
      position: absolute;
      inset: 0;
      background: #e0e0e0;
      border-radius: 999px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .toggle-track::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.18);
      transition: transform 0.2s;
    }
    .toggle input:checked + .toggle-track { background: #f97316; }
    .toggle input:checked + .toggle-track::after { transform: translateX(16px); }

    /* ── Select ── */
    .setting-select {
      font-size: 0.78rem;
      font-family: inherit;
      color: #333;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 4px 8px;
      background: #fafafa;
      outline: none;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .setting-select:focus { border-color: #f97316; }

    /* ── Responsive overlay (≤768px) ── */
    @media (max-width: 1024px) {
      .drawer {
        width: 100% !important;
        top: var(--lw-drawer-top, 42px);
        height: calc(100dvh - var(--lw-drawer-top, 42px));
        box-shadow: none;
        border-left: none;
      }
    }

    /* ── Footer ── */
    .drawer-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid #f0f0f0;
      flex-shrink: 0;
    }

    .version-tag {
      font-size: 0.7rem;
      color: #ccc;
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.open  = false;
    this.width = '300px';
    this.top   = '42px';
  }

  connectedCallback() {
    super.connectedCallback();
    // Global command channel — works no matter where the trigger lives
    // (light DOM or nested inside another component's shadow DOM).
    this._onToggleCmd = (e) => {
      const next = e.detail && typeof e.detail.open === 'boolean'
        ? e.detail.open
        : !this.open;
      this._setOpen(next);
    };
    window.addEventListener('lw-settings-toggle', this._onToggleCmd);

    this._onResize = () => { if (this._isMobile()) this._applyPush(false); };
    window.addEventListener('resize', this._onResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('lw-settings-toggle', this._onToggleCmd);
    window.removeEventListener('resize', this._onResize);
    this._applyPush(false);
  }

  _isMobile() {
    return window.innerWidth <= 1024;
  }

  // Push only the .page content area — bar and header are never touched.
  // Handles both light DOM (blog.html) and lw-blog shadow DOM cases.
  _applyPush(value) {
    if (this._isMobile()) { this._setPush(''); return; }
    this._setPush(value ? this.width : '');
  }

  _setPush(width) {
    const ease = 'padding-right 0.28s cubic-bezier(0.4,0,0.2,1)';

    // Collect lw-header elements (light DOM + lw-blog shadow)
    const headers = [
      ...document.querySelectorAll('lw-header'),
      ...[...document.querySelectorAll('lw-blog')]
        .map(el => el.shadowRoot?.querySelector('lw-header'))
        .filter(Boolean),
    ];

    // Collect .page elements (light DOM + lw-blog shadow)
    const pages = [
      ...document.querySelectorAll('.page'),
      ...[...document.querySelectorAll('lw-blog')]
        .map(el => el.shadowRoot?.querySelector('.page'))
        .filter(Boolean),
    ];

    // Push the inner .header div (shadow root) so the centered content shifts correctly
    headers.forEach(host => {
      const inner = host.shadowRoot?.querySelector('.header');
      const target = inner ?? host;
      target.style.transition   = ease;
      target.style.paddingRight = width;
    });

    pages.forEach(el => {
      el.style.transition   = ease;
      el.style.paddingRight = width;
    });
  }

  _setOpen(value) {
    this.open = value;
    if (value) {
      const bar = document.querySelector('lw-insights-bar');
      this.top  = bar ? `${Math.round(bar.getBoundingClientRect().height)}px` : '42px';
    }
    this._applyPush(value);
    window.dispatchEvent(new CustomEvent('lw-settings-changed', {
      detail: { open: value },
    }));
  }

  toggle() { this._setOpen(!this.open); }

  close = () => { this._setOpen(false); }

  render() {
    return html`
      <div class="drawer ${this.open ? 'is-open' : ''}"
           style="--lw-drawer-width: ${this.width}; --lw-drawer-top: ${this.top}">

        <div class="drawer-header">
          <span class="drawer-title">Settings</span>
          <button class="close-btn" @click=${this.close} aria-label="Close settings">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="1" y1="1" x2="13" y2="13"/>
              <line x1="13" y1="1" x2="1" y2="13"/>
            </svg>
          </button>
        </div>

        <div class="drawer-body">

          <div>
            <div class="section-title">Display</div>
            <div class="setting-row">
              <div>
                <div class="setting-label">Default view</div>
                <div class="setting-desc">List or grid layout on load</div>
              </div>
              <select class="setting-select">
                <option value="list">List</option>
                <option value="grid">Grid</option>
              </select>
            </div>
            <div class="setting-row slider-row">
              <div class="setting-label">Semantic ratio</div>
              <lw-slider min="0" max="1" step="0.1" value="0.5"></lw-slider>
            </div>
          </div>

          <div>
            <div class="section-title">Search</div>
            <div class="setting-row">
              <div>
                <div class="setting-label">Semantic search</div>
                <div class="setting-desc">Enable AI-powered relevance ranking</div>
              </div>
              <label class="toggle">
                <input type="checkbox" checked />
                <span class="toggle-track"></span>
              </label>
            </div>
          </div>

        </div>

        <div class="drawer-footer">
          <div class="version-tag">lw-settings v1.0</div>
        </div>

      </div>
    `;
  }
}

customElements.define('lw-settings', LwSettings);
