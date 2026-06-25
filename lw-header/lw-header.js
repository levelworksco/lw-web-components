import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class LwHeader extends LitElement {

  static properties = {
    signInLabel: { type: String, attribute: 'sign-in-label' },
    signInHref:  { type: String, attribute: 'sign-in-href'  },
    logoHref:    { type: String, attribute: 'logo-href'     },
    logoSrc:     { type: String, attribute: 'logo-src'      },
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
      padding: 0;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* ── Logo ── */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      text-decoration: none;
      color: inherit;
      user-select: none;
    }

    .logo-icon {
      height: 20px;
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
      flex-shrink: 0;
    }


    /* ── Sign-in button ── */
    .sign-in {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 1.3rem;
      background: #f97316;
      color: #fff;
      font-family: inherit;
      font-size: 0.92rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s;
      line-height: 1.4;
    }
    .sign-in:hover { background: #ea6c0a; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .header    { padding: 0 1.25rem; }
    }

    @media (max-width: 480px) {
      .header    { padding: 0 1rem; height: 52px; }
      .sign-in   { padding: 0.4rem 1rem; font-size: 0.85rem; }
      .logo-icon { height: 26px; }
      .logo-placeholder { height: 26px; font-size: 0.7rem; }
    }
  `;

  constructor() {
    super();
    this.signInLabel = 'Sign In';
    this.signInHref  = '#';
    this.logoHref    = '/';
    this.logoSrc     = '';
  }

  _logoPlaceholder() {
    return html`
      <div class="logo-placeholder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        Logo here
      </div>
    `;
  }

  render() {
    return html`
      <header class="header">

        <a class="logo" href=${this.logoHref}>
          ${this.logoSrc
            ? html`
                <img
                  class="logo-icon"
                  src=${this.logoSrc}
                  alt="Logo"
                  @error=${e => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div class="logo-placeholder" style="display:none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  Logo here
                </div>`
            : this._logoPlaceholder()
          }
        </a>

        <a class="sign-in" href=${this.signInHref}>${this.signInLabel}</a>

      </header>
    `;
  }
}

customElements.define('lw-header', LwHeader);
