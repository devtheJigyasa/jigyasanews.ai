# Jigyasa News

**AI-Powered Fact-Checking and News Verification Tool**

Verify claims, detect misinformation, and learn to separate fact from fiction. Jigyasa News is a production-ready static web application built for academic research and educational purposes.

## Features

- **Claim Scanner** - Paste any headline, article snippet, or claim to get AI-powered analysis
- **Verdict Results** - Get clear TRUE, FALSE, or UNCERTAIN verdicts with confidence scores
- **Source Recommendations** - Links to trusted fact-checking sources for further verification
- **Dark/Light Mode** - Theme toggle with system preference detection
- **Responsive Design** - Works on desktop, tablet, and mobile
- **SIFT Guide** - Learn the Stop, Investigate, Find, Trace methodology
- **Keyboard Shortcuts** - Press Ctrl+Enter to scan claims quickly
- **Zero Data Storage** - No data is stored; 100% private

## Tech Stack

- **HTML5** - Semantic, accessible markup
- **CSS3** - Custom properties, responsive grid, dark/light themes
- **Vanilla JavaScript** - No frameworks, fully production-ready
- **GitHub Pages** - Free static hosting

## Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML structure with hero, scanner, results, stats, guide, and footer |
| `style.css` | Complete CSS with themes, responsive layout, and all component styles |
| `script.js` | Theme toggle, claim scanner, demo analysis engine, and API-ready structure |
| `README.md` | This documentation file |

## Quick Start

### Option 1: Open Locally

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. Start verifying claims immediately

### Option 2: Deploy with GitHub Pages

1. Go to your repository **Settings** > **Pages**
2. Select **Deploy from a branch**
3. Choose **main** branch and **/(root)** folder
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/jigyasanews.ai`

## How It Works

The current version includes a **demo analysis engine** that uses keyword-based heuristics to analyze claims. In production, you can replace the demo engine with a real LLM API.

### To Connect a Real API:

In `script.js`, find the scan button handler and replace the demo analysis with:

```javascript
const response = await fetch('YOUR_API_ENDPOINT', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ claim })
});
const result = await response.json();
showResult(result);
```

### Supported API Response Format:

```json
{
  "verdict": "true",
  "confidence": 87,
  "explanation": "This claim is supported by verified sources...",
  "sources": [
    { "name": "example.com", "url": "https://example.com" }
  ]
}
```

## SIFT Method

The app teaches the SIFT methodology for fact-checking:

- **S**top - Pause before reacting to claims
- **I**nvestigate - Look beyond screenshots and posts
- **F**ind - Search for credible reporting
- **T**race - Follow claims to their original source

## Customization

### Change Branding
Edit the brand name in `index.html` and the colors in `style.css`:

```css
:root {
  --color-primary: #0f6b63; /* Change to your brand color */
}
```

### Add Your Logo
Replace the SVG icon in the `.brand-mark` element with your own.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Built for academic research and educational purposes.

---

Made with by **Jigyasa** | AI Journalism Project 2026
