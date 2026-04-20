# Expanding Cards

A lightweight, interactive UI component where a row of image panels expand and collapse on click. Click any panel and it smoothly grows to fill the available space while the other panels shrink, with a labelled overlay fading in on the active panel.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Customization](#customization)
- [Browser Support](#browser-support)
- [Known Issues](#known-issues)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Demo

The component renders a horizontal strip of five image panels. On page load, the first panel is expanded by default. Clicking any other panel shifts the expanded state to the clicked one, with a smooth 700ms transition.

**Visual behavior:**
- Inactive panel: narrow, label hidden
- Active panel: ~70% of the row width, label fades in from the bottom-left corner

---

## Features

- **Zero dependencies** — plain HTML, CSS, and vanilla JavaScript
- **Smooth flex-based animation** — no layout thrashing, just CSS transitions
- **Responsive** — adapts to mobile screens via a media query
- **Delayed label reveal** — text fades in after the expansion settles, for a polished feel
- **Minimal JavaScript** — the script only toggles a single CSS class; all visuals are CSS-driven

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Flexbox, transitions, media queries) |
| Behavior | Vanilla JavaScript (ES6) |
| Font | [Muli](https://fonts.google.com/specimen/Muli) via Google Fonts |
| Images | [Unsplash](https://unsplash.com/) CDN |

---

## Project Structure

```
expanding-cards/
├── index.html      # Markup — 5 panels inside a flex container
├── style.css       # Layout, animations, responsive rules
└── script.js       # Click handlers that toggle the `active` class
```

Three files, no build step, no package manager.

---

## Getting Started

### Option 1: Open directly in a browser

```bash
# Clone or download the project, then:
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option 2: Serve locally (recommended for development)

Any static server works. For example, using Python:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

Or with Node.js:

```bash
npx serve .
```

---

## How It Works

The component uses a **CSS-driven state pattern**: all visual state lives in CSS, keyed off an `active` class. JavaScript's only job is to move that class from one panel to another on click.

### 1. The layout (CSS Flexbox)

The `.container` is a flex row holding five `.panel` children. Each panel has:

- `flex: 0.5` by default (narrow, collapsed state)
- `flex: 5` when it has the `active` class (expanded state)

Because flex distributes *remaining space proportionally*, the active panel ends up ~10× wider than the others. With 4 inactive panels (0.5 each = 2.0) plus 1 active panel (5.0), the active panel occupies **5 / 7 ≈ 71%** of the row's width.

### 2. The animation (CSS transitions)

A `transition: all 700ms ease-in` on `.panel` smooths the flex change into an animation. The `<h3>` label uses a separate transition with a `0.4s` delay so it fades in only *after* the panel has mostly finished expanding:

```
0ms    → click, panel starts expanding
~400ms → label begins fading in
~700ms → label fully visible, panel fully expanded
```

### 3. The behavior (JavaScript)

```javascript
const panels = document.querySelectorAll(".panel");

panels.forEach((panel) => {
  panel.addEventListener("click", () => {
    removeActiveClasses();       // clear active from all panels
    panel.classList.add("active"); // mark the clicked one active
  });
});

function removeActiveClasses() {
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });
}
```

The clear-then-set pattern enforces the invariant *"exactly one panel is active at a time."*

---

## Customization

### Change the images

Edit the inline `background-image` URLs in `index.html`. Any image URL works — local assets or CDN links:

```html
<div class="panel" style="background-image: url('your-image.jpg')">
  <h3>Your Label</h3>
</div>
```

### Add or remove panels

Add more `.panel` divs inside `.container`. The flex layout automatically distributes space across however many panels you include. JavaScript needs no changes — it picks up any element with the `.panel` class.

### Adjust the expansion ratio

In `style.css`, tweak the `flex` values:

```css
.panel         { flex: 0.5; }   /* collapsed size */
.panel.active  { flex: 5;   }   /* expanded size  */
```

Increase the active value (e.g., `flex: 10`) for a more dramatic expansion, or lower it (e.g., `flex: 2`) for a gentler one.

### Change the animation speed

Edit the transition duration on `.panel`:

```css
.panel {
  transition: all 700ms ease-in;   /* change 700ms to taste */
}
```

Remember to update the label's transition delay in `.panel.active h3` to match — it should be ~60% of the panel's duration.

### Adjust the mobile breakpoint

The 4th and 5th panels are hidden below 480px. To change this:

```css
@media (max-width: 768px) {   /* e.g., hide on tablets too */
  .panel:nth-of-type(4),
  .panel:nth-of-type(5) { display: none; }
}
```

---

## Browser Support

Works in all modern browsers:

| Browser | Support |
|---|---|
| Chrome / Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Opera | ✅ Full |
| IE 11 | ⚠️ Partial (flexbox quirks; not officially supported) |

The CSS uses a `-webkit-transition` prefix for legacy Safari/Chrome compatibility, though this is no longer strictly necessary for modern versions.

---

## Known Issues

These are minor issues in the current codebase that don't affect functionality but should be addressed before production use:

1. **Stray closing `</div>`** in `index.html` — there's an extra `</div>` after the five panels. Browsers tolerate it, but it's invalid markup.
2. **Missing unprefixed `transition`** — only the `-webkit-transition` is declared on `.panel`. The unprefixed `transition` should be added for full standards compliance.
3. **No keyboard accessibility** — panels are `<div>` elements, not focusable. Keyboard users cannot navigate or activate them.
4. **No ARIA attributes** — screen readers have no way to know which panel is selected.
5. **External image dependency** — images are loaded from Unsplash's CDN. If the CDN is unreachable, panels render empty.
6. **`@import` for Google Fonts** — blocks parallel downloads. Prefer `<link rel="preconnect">` + `<link rel="stylesheet">` in the HTML `<head>` for better performance.

---

## Future Enhancements

Ideas for extending the component:

### Accessibility improvements

- Add `role="button"` and `tabindex="0"` to each panel so keyboard users can focus them.
- Listen for `keydown` on Enter/Space to trigger the same behavior as click.
- Add `aria-expanded` / `aria-selected` to convey state to screen readers.

### Behavior improvements

- **Auto-cycling**: change the active panel every few seconds for a hero-banner effect.
- **Hover activation** (optional): expand on hover instead of click using the CSS `:hover` selector — no JS needed.
- **Event delegation**: replace per-panel listeners with a single listener on `.container` for better performance and dynamic-panel support.

### Responsive improvements

- On mobile, stack panels vertically (`flex-direction: column`) instead of hiding the last two.
- Alternatively, convert to a horizontal scroll carousel on narrow screens.

### Simpler implementations

This component can also be built with:

- **Zero JavaScript** using hidden radio inputs + the `:checked` selector.
- **Zero JavaScript** using the modern CSS `:has()` selector.

Both approaches eliminate the JS file entirely and (in the radio version) give keyboard accessibility for free.

---

## License

This is a demo/learning project. Feel free to use, modify, and distribute.

Images courtesy of [Unsplash](https://unsplash.com/) under the [Unsplash License](https://unsplash.com/license).

Font: [Muli](https://fonts.google.com/specimen/Muli) via Google Fonts.

---

## Credits

A classic frontend mini-project pattern popularized by Brad Traversy's *50 Projects in 50 Days* series and widely used as a CSS Flexbox teaching example.
