import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import '../lw-slider/lw-slider.js';

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-blog-search>
//
// PROPERTIES:
//   open         (Boolean) — show the component; hidden by default, default false
//   placeholder  (String)  — input placeholder,      default "Search"
//   value        (String)  — current search query,   default ""
//   sliderValue  (Number)  — range slider value,     default 0.5
//   sliderMin    (Number)  — range slider minimum,   default 0
//   sliderMax    (Number)  — range slider maximum,   default 10
//   sliderStep   (Number)  — range slider step,      default 0.1
//   sliderLabel  (String)  — label shown left of slider, default ""
//   searchTime   (Number)  — ms taken; shown in sidebar col aligned with Blog Categories
//
// EVENTS:
//   search-change  — detail: { value: String }
//   slider-change  — detail: { value: Number }
// ─────────────────────────────────────────────────────────────

export class LwBlogSearch extends LitElement {

  static properties = {
    open:        { type: Boolean, reflect: true },
    placeholder: { type: String },
    value:       { type: String },
    sliderValue: { type: Number, attribute: 'slider-value' },
    sliderMin:   { type: Number, attribute: 'slider-min'   },
    sliderMax:   { type: Number, attribute: 'slider-max'   },
    sliderStep:  { type: Number, attribute: 'slider-step'  },
    sliderLabel: { type: String, attribute: 'slider-label' },
    searchTime:  { type: Number, attribute: 'search-time'  },
  };

  static styles = css`
    :host {
      display: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      color: #3c3c3c;
      -webkit-font-smoothing: antialiased;
    }
    :host([open]) {
      display: block;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* mirrors lw-blog-list .pl-outer: flex row, same gap + sidebar width */
    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .cols {
      display: flex;
      align-items: flex-start;
      gap: 3rem;
    }

    /* left: stretches to fill space left by sidebar — same as .pl-container flex:1 */
    .main-col {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* right: same width + padding as .pl-sidebar (180px wide, 2rem left pad, border) */
    .sidebar-col {
      width: 180px;
      flex-shrink: 0;
      padding-left: 2rem;
      border-left: 1px solid #e8e8e8;
      display: flex;
      align-items: flex-start;
      padding-top: 0.6rem;
    }

    /* ── Search input ── */
    .search-row {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border: 1px solid #e5e5e5;
      border-radius: 999px;
      padding: 0 16px;
      height: 42px;
      gap: 10px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .search-row:focus-within {
      border-color: #c8c8c8;
      box-shadow: 0 0 0 3px rgba(0,0,0,.05);
      background: #fff;
    }

    .search-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      color: #999;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #1a1a1a;
      line-height: 1;
    }
    .search-input::placeholder { color: #aaa; }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      border: none;
      background: #d0d0d0;
      border-radius: 50%;
      cursor: pointer;
      color: #fff;
      padding: 0;
      line-height: 1;
      transition: background 0.15s;
    }
    .clear-btn:hover { background: #aaa; }

    .search-time {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .search-time-value {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f97316;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }
    .search-time-value span {
      font-size: 0.75rem;
      font-weight: 500;
      color: #000;
      letter-spacing: 0;
    }
    .search-time-label {
      font-size: 0.72rem;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }

    .divider {
      height: 1px;
      background: #e5e5e5;
      margin-top: 12px;
    }

    /* collapse sidebar col below 640px (matches blog-list breakpoint) */
    @media (max-width: 640px) {
      .cols         { gap: 1.5rem; }
      .sidebar-col  { display: none; }
    }

    @media (max-width: 480px) {
      .search-row   { height: 38px; padding: 0 14px; }
      .search-input { font-size: 13.5px; }
    }
  `;

  constructor() {
    super();
    this.open        = false;
    this.placeholder = 'Search';
    this.value       = '';
    this.sliderValue = 0.5;
    this.sliderMin   = 0;
    this.sliderMax   = 10;
    this.sliderStep  = 0.1;
    this.sliderLabel = '';
    this.searchTime  = null;
  }

  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('search-change', {
      detail: { value: this.value },
      bubbles: true, composed: true,
    }));
  }

  _clear() {
    this.value = '';
    this.dispatchEvent(new CustomEvent('search-change', {
      detail: { value: '' },
      bubbles: true, composed: true,
    }));
    this.shadowRoot.querySelector('.search-input')?.focus();
  }

  _onSliderChange(e) {
    this.sliderValue = e.detail.value;
    this.dispatchEvent(new CustomEvent('slider-change', {
      detail: { value: this.sliderValue },
      bubbles: true, composed: true,
    }));
  }

  render() {
    return html`
      <div class="wrapper">

        <div class="cols">
          <div class="main-col">
            <div class="search-row">
              <svg class="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8.5" cy="8.5" r="5.5"/>
                <line x1="13.5" y1="13.5" x2="18" y2="18"/>
              </svg>
              <input
                class="search-input"
                type="text"
                .value=${this.value}
                placeholder=${this.placeholder}
                @input=${this._onInput}
              />
              ${this.value ? html`
                <button class="clear-btn" @click=${this._clear} aria-label="Clear search">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round">
                    <line x1="1" y1="1" x2="7" y2="7"/>
                    <line x1="7" y1="1" x2="1" y2="7"/>
                  </svg>
                </button>` : ''}
            </div>

            <lw-slider
              style="display:none"
              .value=${this.sliderValue}
              .min=${this.sliderMin}
              .max=${this.sliderMax}
              .step=${this.sliderStep}
              .label=${this.sliderLabel}
              @slider-change=${this._onSliderChange}
            ></lw-slider>
          </div>

          <div class="sidebar-col">
            ${this.searchTime != null ? html`
              <div class="search-time">
                <div class="search-time-value">${this.searchTime}<span> ms</span></div>
                <div class="search-time-label">Search time</div>
              </div>` : ''}
          </div>
        </div>

        <div class="divider"></div>

      </div>
    `;
  }
}

customElements.define('lw-blog-search', LwBlogSearch);
