import { LitElement, html, css }
  from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class LwHeader extends LitElement {

  static properties = {
    signInLabel: { type: String, attribute: 'sign-in-label' },
    signInHref:  { type: String, attribute: 'sign-in-href'  },
    logoHref:    { type: String, attribute: 'logo-href'     },
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
      max-width: 900px;
      margin: 0 auto;
      padding: 0 2rem;
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
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 20px;
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
  `;

  constructor() {
    super();
    this.signInLabel = 'Sign In';
    this.signInHref  = '#';
    this.logoHref    = '/';
  }

  render() {
    return html`
      <header class="header">

        <a class="logo" href=${this.logoHref}>
          <img src="logo.png" alt="Logo" class="logo-icon">
        </a>

        <a class="sign-in" href=${this.signInHref}>${this.signInLabel}</a>

      </header>
    `;
  }
}

customElements.define('lw-header', LwHeader);
