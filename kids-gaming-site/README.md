# Kids Gaming Site

A simple, data-driven site scaffold for ages 10–15. Branding, theme, and content are powered by JSON files for easy customization and learning.

## How it works

- `data/branding.json` controls organization info: logo, favicon, slogan, contact, social media.
- `data/theme.json` defines CSS variables (colors, font). The script loads the Google Font automatically.
- `data/games.json` sets the site title, tagline, countdown target, and game cards.

When the page loads, `scripts.js` fetches the JSON files and updates the DOM and CSS variables. Edit the JSON files and refresh to see changes immediately.

## Files

- `index.html` – semantic HTML with sections for hero, games, about, and footer.
- `styles.css` – mobile-first styles with CSS variables and accessible focus states.
- `scripts.js` – loads JSON, applies theme/branding, renders games, and runs a countdown.
- `data/branding.json` – org branding data.
- `data/theme.json` – theme colors and font.
- `data/games.json` – site text and games list.

## Try it locally

You can open `index.html` directly in a browser. If you use fetch and run into CORS while opening the file via `file://`, serve it via a local server.

Optional commands (PowerShell):

```powershell
# If you have Python installed
python -m http.server 5500
# Then open http://localhost:5500/kids-gaming-site/
```

## Learning checkpoints (look for TODO markers)

- Add a CTA button in the hero that scrolls to the games list.
- Implement search/filter by name or difficulty.
- Add a dark mode toggle by switching CSS variables.
- Improve keyboard navigation between game cards.

## Deployment

This repo includes an optional GitHub Pages Action workflow. Push to `main` and enable Pages on the repository to serve from the root or from the `gh-pages` Action if used.
