import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class LwHeader extends LitElement {

  static properties = {
    logoHref:       { type: String, attribute: 'logo-href'        },
    logoSrc:        { type: String, attribute: 'logo-src'         },
    brandingLogoSrc:{ type: String, attribute: 'branding-logo-src'},
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: #ffffff;
      border-bottom: 1px solid #e8e8e8;
      font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .header {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* ── Left logo ── */
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      text-decoration: none;
      color: inherit;
      user-select: none;
      flex-shrink: 0;
    }

    .logo-icon {
      height: 32px;
      width: auto;
      display: block;
    }

    .logo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 32px;
      padding: 0 10px;
      border-radius: 6px;
      background: #f3f3f3;
      border: 1px dashed #d0d0d0;
      color: #bbb;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
    }

    /* ── Header title ── */
    .title {
      font-size: 1rem;
      font-weight: 700;
      color: #111;
      flex: 1;
      text-align: center;
      letter-spacing: -0.01em;
    }

    /* ── Powered-by badge ── */
    .branding {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      text-decoration: none;
      color: inherit;
      padding: 0.3rem 0.75rem 0.3rem 0.6rem;
      border-radius: 8px;
      transition: background 0.15s, border-color 0.15s;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .branding-label {
      font-size: 0.65rem;
      font-weight: 600;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      line-height: 1;
    }

    .branding-divider {
      width: 1px;
      height: 18px;
      background: #e5e5e5;
      flex-shrink: 0;
    }

    .branding-logo {
      display: block;
      height: 10px;
      width: auto;
    }

    .branding-logo-placeholder {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.82rem;
      font-weight: 700;
      color: #111;
      letter-spacing: -0.02em;
    }
    .branding-logo-placeholder svg { color: #f97316; flex-shrink: 0; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .header { padding: 0 1.25rem; }
    }

    @media (max-width: 480px) {
      .header         { padding: 0 1rem; height: 52px; }
      .logo-icon      { height: 26px; }
      .logo-placeholder { height: 26px; font-size: 0.7rem; }
      .branding       { padding: 0.25rem 0.6rem 0.25rem 0.5rem; }
      .branding-logo  { height: 18px; }
      .branding-label { font-size: 0.6rem; }
    }
  `;

  constructor() {
    super();
    this.logoHref        = '/';
    this.logoSrc         = 'https://cdn.prod.website-files.com/6708c7a3184789577d6c10c5/6719ebf2084d87becf07347b_Levelworks%20Logo%20-%20On%20Light%20Background.png';
    this.brandingLogoSrc = 'https://cdn.prod.website-files.com/6708c7a3184789577d6c10c5/6719ebf2084d87becf07347b_Levelworks%20Logo%20-%20On%20Light%20Background.png';
  }

  render() {
    return html`
      <header class="header">

        <a class="logo" href=${this.logoHref}>
          ${this.logoSrc
            ? html`<img class="logo-icon" src=${this.logoSrc} alt="Logo"
                        @error=${e => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}>
                   <div class="logo-placeholder" style="display:none">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                       <rect x="3" y="3" width="18" height="18" rx="2"/>
                       <circle cx="8.5" cy="8.5" r="1.5"/>
                       <path d="M21 15l-5-5L5 21"/>
                     </svg>
                     Logo here
                   </div>`
            : html`<div class="logo-placeholder">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                       <rect x="3" y="3" width="18" height="18" rx="2"/>
                       <circle cx="8.5" cy="8.5" r="1.5"/>
                       <path d="M21 15l-5-5L5 21"/>
                     </svg>
                     Logo here
                   </div>`
          }
        </a>

        <div class="title">AI Search Demo</div>

        <a class="branding" href="https://www.levelworks.co/" target="_blank" rel="noreferrer noopener">
          <span class="branding-label">Powered by</span>
          ${this.brandingLogoSrc
            ? html`<img class="branding-logo" src=${this.brandingLogoSrc} alt="Levelworks"
                        @error=${e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}>
                   <span class="branding-logo-placeholder" style="display:none">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11L10 22l9.5-12H14L13 2Z"/></svg>
                     Levelworks
                   </span>`
            : html`<span class="branding-logo-placeholder">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11L10 22l9.5-12H14L13 2Z"/></svg>
                     Levelworks
                   </span>`
          }
        </a>

      </header>
    `;
  }
}

customElements.define('lw-header', LwHeader);
