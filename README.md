# Arixion AI

**Intelligence That Verifies.**

Arixion AI is a verification-first AI engine that filters digital noise through layered analysis so you see only trustworthy, verifiable insights.

> Formerly: JigyasaNews.AI / Curious News

---

![GitHub Pages Deployment](https://img.shields.io/github/deployments/JigyasaQuest/arixion-ai/github-pages?label=deploy&logo=github&style=flat-square)
![License](https://img.shields.io/github/license/JigyasaQuest/arixion-ai?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/JigyasaQuest/arixion-ai?style=flat-square)
![Made in India](https://img.shields.io/badge/Made%20in-India-orange?style=flat-square)

---

## What is Arixion AI?

Arixion AI helps you verify claims in a noisy, fragmented information landscape.  
Paste a headline, quote, or snippet and Arixion runs a verification-first pipeline that analyzes the text, checks for misleading framing, and guides you toward more reliable sources.

The goal: make “verify first, share later” feel as fast and natural as reading the headline itself.

## Features

- **Claim Scanner** – Paste any headline, article snippet, or claim to get AI-powered analysis.
- **Verdict Results** – Clear TRUE, FALSE, or UNCERTAIN verdicts with confidence hints.
- **Source Recommendations** – Pointers toward trusted fact-checking and reference sources for deeper checks.
- **SIFT Guide Built-in** – Stop, Investigate, Find, Trace methodology surfaced in plain language to teach healthy skepticism.
- **Dark/Light Mode** – Theme toggle with system preference detection.
- **Responsive UI** – Works on desktop, tablet, and mobile.
- **Zero Data Storage** – No claim data is stored on the server; everything runs client-side in your browser.

## Brand & UI System

- **Primary color**: `#2563EB` – trust blue
- **Accent color**: `#10B981` – verified green
- **Background**: `#0F172A` – deep slate
- **Typography**: Inter or Poppins for headings; Inter for body text.

**Logo concept**  
A magnifying glass integrated with a layered funnel icon, representing analysis → filtering → verified truth (minimal, flat, tech/startup feel).

## Tech Stack

- **HTML5** – Semantic, accessible markup.
- **CSS3** – Modern layout with responsive breakpoints.
- **JavaScript (ES6+)** – Vanilla JS, no frameworks.
- **GitHub Pages** – Static hosting for the live demo.

## Live Demo

GitHub Pages deployment is already configured.

- **URL** (once DNS/Pages is ready):  
  `https://devtheJigyasa.github.io/arixion-ai/`

> If the link shows a 404, wait a few minutes for GitHub Pages to finish deploying or check the Deployments tab.

## Getting Started

Clone the repository and open it locally.

```bash
# Clone
git clone https://github.com/JigyasaQuest/arixion-ai.git

cd arixion-ai
```

Because this is a static site, you can either open `index.html` directly in your browser or use a simple local server (recommended):

```bash
# Using Python 3
python -m http.server 8000

# Then open:
# http://localhost:8000/index.html
```

No additional build step is required; all logic runs in the browser.

## Roadmap

- Deeper multi-source cross-checking across diverse publishers.
- Browser extension for in-page claim scanning.
- Exportable verification reports and shareable verdict summaries.
- More transparent model explanations for each verdict.

## Contributing

Contributions, issues, and feature ideas are welcome.

- Open an issue for bugs, feature requests, or UX suggestions.
- Fork the repo and create a feature branch for pull requests.
- Keep PRs focused on one change at a time.
- When reporting bugs, include clear repro steps and browser info.

Before opening a PR, please:

- Keep the design consistent with the existing brand system (colors, typography, tone).
- Make sure the UI works on both mobile and desktop.
- Run a quick manual verification that claim scanning, verdict display, and theming still work.

## License

MIT License – free to use for educational and research purposes.  
See [`LICENSE`](./LICENSE) for full details.
