# lw-web-components

A collection of Lit-based web components for the Levelworks blog platform. Built with [Lit](https://lit.dev/) via CDN — no build step required.

---

## Components

| Component | Tag | Description |
|---|---|---|
| [lw-blog](lw-blog/) | `<lw-blog>` | **Unified entry point** — composes all blog components into one tag |
| [lw-header](lw-header/) | `<lw-header>` | Site header with logo and Sign In button |
| [lw-insights-bar](lw-insights-bar/) | `<lw-insights-bar>` | Stats bar (blogs, searches, updated) with collapsible View Insights panel |
| [lw-blog-search](lw-blog-search/) | `<lw-blog-search>` | Search input with semantic ratio slider and search-time display |
| [lw-blog-list](lw-blog-list/) | `<lw-blog-list>` | Blog post list/grid with infinite scroll, dynamic category sidebar, and sort dropdown |
| [lw-blog-list-item](lw-blog-list-item/) | `<lw-blog-list-item>` | Individual blog post card (list or grid view) |
| [lw-blog-details](lw-blog-details/) | `<lw-blog-details>` | Full blog post detail view |
| [lw-summary](lw-summary/) | `<lw-summary>` | Overview section with citation hover cards |
| [lw-settings](lw-settings/) | `<lw-settings>` | Slide-out settings drawer for configuring search parameters |
| [lw-slider](lw-slider/) | `<lw-slider>` | Reusable range slider primitive used by `<lw-settings>` |

---

## Demo Page

Open `lw-blog/lw-blog.html` to see the full assembled page.

```
http://localhost:3000/lw-blog/lw-blog
```

---

## Local Development

A local proxy server is required to bypass CORS when calling the search API.

**Start the proxy:**
```bash
node proxy-server.js
```

The server runs on `http://localhost:3000` and does two things:
- Serves all static files (HTML/JS)
- Forwards `/api/*` requests to the DiscoverAI search backend (avoids CORS)

> `proxy-server.js` is excluded from git (see `.gitignore`) — it is for local dev only.

---

## Search API

Components connect to the DiscoverAI search API:

| Setting | Value |
|---|---|
| Endpoint | `POST /api/v1/search/all` |
| Auth | `X-API-KEY` header |
| Features | Full-text search, semantic ratio, category filter, infinite pagination |

---

## Quick Start — single tag

The `<lw-blog>` component is the recommended way to embed the full blog experience. It renders `<lw-insights-bar>`, `<lw-header>`, `<lw-blog-search>`, and `<lw-blog-list>` internally and wires all events automatically. No extra JavaScript needed.

```html
<lw-blog
  base-url="/api/v1/search/all"
  api-key="YOUR_API_KEY"
  detail-url="/lw-blog-details/lw-blog-details"
  demo-note="Demoing content & AI search functionality only. Demo not intended to visually match source site."
  blogs="124"
  updated="25 Jun 2026"
  searches="31.5K"
  unblocked="95%"
  logo-src="/assets/logo.png"
  branding-logo-src="/assets/branding-logo.png"
  logo-href="/"
  search-placeholder="Search articles…"
  slider-max="1"
  slider-step="0.1"
  style="--blog-search-top: 40px; --pl-sidebar-top: 155px;"
></lw-blog>

<script type="module">
  import './lw-blog/lw-blog.js';
</script>
```

---

## Component Reference

### `<lw-blog>` — unified component

All props from every child component are available directly on `<lw-blog>`.

**Insights bar**

| Attribute | Description | Default |
|---|---|---|
| `demo-note` | Left-side label text | Built-in demo message |
| `blogs` | Blogs stat value | `"87"` |
| `updated` | Updated stat value | `"18 Jun 2026"` |
| `searches` | Searches stat value | `"14.2K"` |
| `unblocked` | Searches Unblocked stat value | `"92%"` |

**Header**

| Attribute | Description | Default |
|---|---|---|
| `logo-src` | Logo image URL; shows a placeholder if missing or broken | — |
| `branding-logo-src` | Separate logo URL used inside the insights bar | — |
| `logo-href` | Logo link target | `"/"` |

**API / navigation**

| Attribute | Description |
|---|---|
| `base-url` | Search API endpoint |
| `api-key` | `X-API-KEY` header value |
| `detail-url` | Page navigated to when a post is clicked |

**Search bar**

| Attribute | Description | Default |
|---|---|---|
| `search-placeholder` | Input placeholder text | `"Search"` |
| `slider-max` | Semantic ratio slider maximum | `1` |
| `slider-step` | Semantic ratio slider step | `0.1` |
| `slider-label` | Label shown left of the slider | — |

**List**

| Attribute | Description | Default |
|---|---|---|
| `default-view` | Initial layout — `list` or `grid` | `"list"` |
| `default-sort` | Initial sort key | `"newest"` |

**CSS variables**

| Variable | Description | Default |
|---|---|---|
| `--blog-page-max-width` | Max width of the content area | `960px` |
| `--blog-page-padding` | Padding of the content area | `0 2rem 4rem` |
| `--blog-search-top` | Sticky top offset for the search bar | `40px` |
| `--pl-sidebar-top` | Sticky top offset for the category sidebar | `1rem` |

---

### `<lw-header>`

| Attribute | Description | Default |
|---|---|---|
| `logo-src` | Logo image URL; shows a placeholder if missing or broken | — |
| `branding-logo-src` | Separate logo URL used inside the insights bar | — |
| `logo-href` | Logo link target | `"/"` |

```html
<lw-header
  logo-src="/assets/logo.png"
  branding-logo-src="/assets/branding-logo.png"
  logo-href="/">
</lw-header>
```

If `logo-src` is omitted or the image fails to load, a placeholder box labelled **"Logo here"** is shown automatically.

---

### `<lw-insights-bar>`

| Attribute | Description |
|---|---|
| `demo-note` | Left-side label text |
| `logo-src` | Logo image URL shown inside the bar |
| `blogs` | Blogs stat value |
| `updated` | Updated stat value |
| `searches` | Searches stat value |
| `unblocked` | Searches Unblocked stat value |

```html
<lw-insights-bar
  blogs="124"
  updated="25 Jun 2026"
  searches="31.5K"
  unblocked="95%"
  demo-note="Demoing content & AI search functionality only.">
</lw-insights-bar>
```

---

### `<lw-blog-search>`

```html
<lw-blog-search
  placeholder="Search articles…"
  slider-max="1"
  slider-step="0.1"
  slider-label="Semantic">
</lw-blog-search>
```

Events fired: `search-change` (`detail.value`), `slider-change` (`detail.value`)

---

### `<lw-blog-list>`

Self-fetching — posts and categories are derived from the API automatically. No data needs to be passed in.

```html
<lw-blog-list
  base-url="/api/v1/search/all"
  api-key="YOUR_API_KEY"
  detail-url="/lw-blog-details/lw-blog-details"
  default-view="list"
  default-sort="newest">
</lw-blog-list>
```

**Category sidebar** is built dynamically from the fetched results. Each category's total count is resolved via a parallel lightweight API call (`limit: 1`) and cached — no repeated requests on scroll.

Events fired: `search-time-update` (`detail.ms`), `lw-category-change` (`detail.category`)

---

### `<lw-blog-details>`

Renders a single blog post in full detail view. Data is passed as a JS property.

```js
document.querySelector('lw-blog-details').post = {
  title, url, image, imageCaption,
  summary,
  author, avatar, date, readTime, postType,
  categories: [],
  tags: [],
  body: [
    { type: 'heading',   text: '...' },
    { type: 'paragraph', text: '...' },
    { type: 'image',     src: '...', alt: '...', caption: '...' },
  ]
};
```

**Styling attributes** (each maps to a `--pd-*` CSS variable):

| Attribute | Description |
|---|---|
| `container-width` | Width of the content container |
| `container-max-width` | Max width of the content container |
| `container-margin` | Margin of the content container |
| `container-background` | Background colour |
| `title-color` | Post title colour |
| `title-font-size` | Post title font size |
| `title-font-family` | Post title font family |
| `url-color` | Link colour |
| `image-border-radius` | Hero image border radius |
| `image-caption-color` | Image caption colour |
| `summary-color` | Summary text colour |
| `meta-label-color` | Meta label colour (Author, Date, etc.) |
| `meta-value-color` | Meta value colour |
| `body-color` | Body text colour |
| `body-line-height` | Body line height |
| `body-font-size` | Body font size |
| `section-label-color` | Section heading colour |
| `section-label-font-size` | Section heading font size |
| `css-vars` | Inline `--var: value; --var: value` pairs for bulk overrides |

---

### `<lw-summary>`

Overview section with optional citation hover cards.

| Property | Type | Description | Default |
|---|---|---|---|
| `heading` | String | Section title | `"Overview"` |
| `displayCitations` | String | `'none'` \| `'number'` \| `'chip'` \| `'link'` | `'chip'` |
| `paragraphs` | Array | Array of paragraph objects (see below) | `[]` |

**Paragraph object shape:**
```js
{
  text: String,
  citation?: {
    label: String,
    articles: [{ title, excerpt, image, url }]
  }
}
```

```js
document.querySelector('lw-summary').paragraphs = [
  {
    text: 'Children learn best through play.',
    citation: {
      label: 'Source 1',
      articles: [{ title: 'Play & Learning', excerpt: '...', image: '/img.jpg', url: '/post/1' }]
    }
  }
];
```

---

### `<lw-settings>`

Slide-out settings drawer.

| Property | Type | Description | Default |
|---|---|---|---|
| `open` | Boolean | Controls drawer open/closed state | `false` |
| `width` | String | Drawer width | `"300px"` |
| `top` | String | Top offset (CSS value) | — |

CSS variables: `--lw-drawer-top`, `--lw-drawer-width`

Events fired: `settings-open`, `settings-close`

---

### `<lw-slider>`

Reusable range slider primitive.

| Property | Type | Description | Default |
|---|---|---|---|
| `value` | Number | Current value | `0.5` |
| `min` | Number | Minimum value | `0` |
| `max` | Number | Maximum value | `10` |
| `step` | Number | Step increment | `0.1` |
| `label` | String | Label shown left of the slider | `""` |

```html
<lw-slider value="0.5" min="0" max="1" step="0.1" label="Semantic"></lw-slider>
```

Event fired: `slider-change` (`detail.value`)

---

## Tech Stack

- **[Lit 3](https://lit.dev/)** — web components via CDN, no build step
- **Shadow DOM** — scoped styles per component
- **Custom Events** — cross-component communication
- **IntersectionObserver** — infinite scroll
- **SessionStorage** — passing post data to the detail page

---

## Branch

Active development happens on the `raj-web-component` branch.
