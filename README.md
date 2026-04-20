# Project Index

A single-page portfolio listing your web dev projects with links to source code and live demos. Editorial / technical-journal aesthetic — warm paper tones, monospace meta, serif headings, no frameworks.

## Files

```
portfolio/
├── index.html      # Page markup + filter buttons
├── style.css       # All styling
├── app.js          # Renders the catalog, handles filters
├── projects.js     # ← YOUR DATA — edit this to add projects
└── README.md       # This file
```

## Adding a new project

Open `projects.js` and add a block to the `projects` array:

```javascript
{
  title: "My New Project",
  description: "One or two sentences about what it does.",
  tech: ["React", "TypeScript", "Node.js"],
  github: "https://github.com/you/repo",
  demo: "https://your-demo.com",
  year: 2026,
  status: "live",   // "live" | "wip" | "archived"
}
```

- Use `"#"` for `github` or `demo` if a link isn't ready — it renders as a muted placeholder instead of a broken link.
- `status` defaults to `"live"` if you omit it.
- Projects render in the order they appear in the array. Put newest first.

## Running it

No build step needed. Either:

```bash
# Just open it
open index.html

# Or serve it locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

The whole thing is static HTML/CSS/JS, so it works anywhere:

- **GitHub Pages**: push to a repo, enable Pages in settings → source: main branch.
- **Netlify / Vercel**: drag the folder into their dashboard, or connect the repo.
- **Any static host**: upload the four files.

## Filters

The page has four filter buttons: `All`, `Live`, `In Progress`, `Archived`. They filter by the `status` field on each project.

## Customizing the look

All design tokens live at the top of `style.css` in the `:root` block:

```css
--paper:   #f4efe6;   /* background */
--ink:     #1a1a1a;   /* main text */
--accent:  #c14a1f;   /* burnt orange accent */
```

Change these three values and the whole theme shifts.
