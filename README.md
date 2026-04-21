# Project Index

A single-page portfolio listing your web dev projects with links to source code and live demos. Editorial / technical-journal aesthetic — warm paper tones, monospace meta, serif headings, no frameworks, no build step...

Projects are driven by a `projects.json` file that you edit directly. The page supports **live search** (across title, description, and tech tags) and **status filters** (All / Live / In Progress / Archived).

## Files

```
portfolio/
├── index.html       # Page markup
├── style.css        # All styling
├── app.js           # Fetches JSON, renders catalog, handles search/filters
├── projects.json    # ← YOUR DATA — edit this to add projects
└── README.md        # This file
```

## Adding a project

Open `projects.json` and add an object to the array:

```json
{
  "title": "My New Project",
  "description": "One or two sentences describing what it does.",
  "tech": ["React", "TypeScript", "Node.js"],
  "github": "https://github.com/you/repo",
  "demo": "https://your-demo.com",
  "year": 2026,
  "status": "live"
}
```

### JSON schema

| Field         | Type     | Required | Notes                                              |
| ------------- | -------- | -------- | -------------------------------------------------- |
| `title`       | string   | yes      | Project name                                       |
| `description` | string   | yes      | Short summary (searchable)                         |
| `tech`        | string[] | yes      | Tech tags — shown as `#tag` chips (searchable)     |
| `github`      | string   | yes      | GitHub URL, or `"#"` for a muted placeholder       |
| `demo`        | string   | yes      | Live demo URL, or `"#"` for a muted placeholder    |
| `year`        | number   | no       | Shown in the right column                          |
| `status`      | string   | no       | `"live"` (default), `"wip"`, or `"archived"`       |

Projects render in the order they appear in the array. Put newest first.

## Running it locally

Because the page fetches `projects.json`, opening `index.html` directly via `file://` won't work — browsers block `fetch()` from local files. Serve the folder with any static server:

```bash
# Python (any OS with Python 3)
python3 -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

If you open `index.html` directly without a server, the page tells you so and points you here.

## Deploying

The whole thing is static, so it works anywhere:

- **GitHub Pages** — push the folder to a repo, enable Pages in settings → source: main branch
- **Netlify / Vercel** — drag the folder into their dashboard, or connect the repo
- **Any static host** — upload the four files

## Features

- **Search** — live-filters as you type, matches title, description, and tech tags, highlights matches
- **Status filters** — All / Live / In Progress / Archived, driven by the `status` field
- **Result counter** — shows `Showing X of Y` whenever a filter or search is active
- **Keyboard shortcuts** — Esc clears the search
- **Staggered reveal** — entries fade in sequentially on load
- **Fully responsive** — reflows cleanly on mobile
- **Accessible** — respects `prefers-reduced-motion`, semantic markup, `aria-live` result region, `rel="noopener"` on external links
- **XSS-safe** — all JSON values are HTML-escaped before rendering

## Customizing the look

All design tokens live at the top of `style.css` in the `:root` block:

```css
--paper:   #f4efe6;   /* background */
--ink:     #1a1a1a;   /* main text */
--accent:  #c14a1f;   /* burnt orange accent — links, highlights, "live" badge */
```

Change these three values and the whole theme shifts. The fonts (JetBrains Mono + Fraunces) are loaded from Google Fonts in `index.html` — swap them if you'd like a different pairing.
