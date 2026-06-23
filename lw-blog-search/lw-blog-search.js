import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

// ─────────────────────────────────────────────────────────────
// COMPONENT: <lw-blog-search>
//
// PROPERTIES:
//   placeholder  (String)  — input placeholder,      default "Search"
//   value        (String)  — current search query,   default ""
//   sliderValue  (Number)  — range slider value,     default 0
//   sliderMin    (Number)  — range slider minimum,   default 0
//   sliderMax    (Number)  — range slider maximum,   default 10
//   sliderStep   (Number)  — range slider step,      default 0.1
//   sliderLabel  (String)  — label shown left of slider, default ""
//   results      (Number)  — result count to display
//   searchTime   (Number)  — ms taken, shown as "Search took Xms"
//
// EVENTS:
//   search-change  — detail: { value: String }
//   slider-change  — detail: { value: Number }
// ─────────────────────────────────────────────────────────────

export class LwBlogSearch extends LitElement {

  static properties = {
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
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      color: #3c3c3c;
      -webkit-font-smoothing: antialiased;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 15px;
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

    /* ── Slider row ── */
    .slider-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 4px;
    }

    .slider-label {
      font-size: 12px;
      color: #888;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .slider {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      height: 3px;
      border-radius: 99px;
      outline: none;
      cursor: pointer;
      background: linear-gradient(
        to right,
        #f97316 0%,
        #f97316 var(--pct, 0%),
        #e0e0e0 var(--pct, 0%),
        #e0e0e0 100%
      );
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #f97316;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,.18);
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
      box-shadow: 0 2px 8px rgba(249,115,22,.35);
    }
    .slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border: none;
      border-radius: 50%;
      background: #f97316;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,.18);
    }

    .slider-value {
      font-size: 14px;
      color: #555;
      min-width: 32px;
      text-align: left;
      flex-shrink: 0;
    }

    .search-time {
      font-size: 14px;
      color: #6b7280;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .divider {
      height: 1px;
      background: #e5e5e5;
    }

    @media (max-width: 480px) {
      .search-row { height: 38px; padding: 0 14px; }
      .search-input { font-size: 13.5px; }
      .search-time { font-size: 11px; }
    }
  `;

  constructor() {
    super();
    this.placeholder = 'Search';
    this.value       = '';
    this.sliderValue = 0;
    this.sliderMin   = 0;
    this.sliderMax   = 10;
    this.sliderStep  = 0.1;
    this.sliderLabel = '';
    this.searchTime  = null;
  }

  _sliderPct() {
    const range = this.sliderMax - this.sliderMin;
    if (range === 0) return 0;
    return ((this.sliderValue - this.sliderMin) / range) * 100;
  }

  _formatSliderValue(v) {
    return Number.isInteger(this.sliderStep) ? String(v) : v.toFixed(1);
  }

  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('search-change', {
      detail: { value: this.value },
      bubbles: true, composed: true,
    }));
  }

  _onSlider(e) {
    this.sliderValue = Number(e.target.value);
    this.dispatchEvent(new CustomEvent('slider-change', {
      detail: { value: this.sliderValue },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const pct = this._sliderPct();

    return html`
      <div class="wrapper">

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
        </div>

        <div class="slider-row">
          ${this.sliderLabel ? html`<span class="slider-label">${this.sliderLabel}</span>` : ''}
          <input
            class="slider"
            type="range"
            min=${this.sliderMin}
            max=${this.sliderMax}
            step=${this.sliderStep}
            .value=${String(this.sliderValue)}
            style="--pct: ${pct}%"
            @input=${this._onSlider}
          />
          <span class="slider-value">${this._formatSliderValue(this.sliderValue)}</span>
          ${this.searchTime != null ? html`<span class="search-time">Search took ${this.searchTime}ms</span>` : ''}
        </div>

        <div class="divider"></div>

      </div>
    `;
  }
}

customElements.define('lw-blog-search', LwBlogSearch);
