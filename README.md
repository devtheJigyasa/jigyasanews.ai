<p align="center">
  <a href="https://jigyasaquest.github.io/arixion-ai/">
    <img src="https://img.shields.io/badge/Live%20Demo-Open-2563EB?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/JigyasaQuest/arixion-ai">
    <img src="https://img.shields.io/badge/GitHub-Repository-111827?style=for-the-badge&logo=github" alt="Repository" />
  </a>
  <a href="https://github.com/JigyasaQuest/arixion-ai/issues">
    <img src="https://img.shields.io/badge/Issues-Feedback-10B981?style=for-the-badge" alt="Issues" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Verification--First-AI-2563EB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-10B981?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Made%20in-India-FF9933?style=for-the-badge" />
</p>

<h1 align="center">Arixion AI</h1>
<p align="center"><b>Intelligence That Verifies.</b></p>

<p align="center">
  Arixion AI is a verification‑first AI interface that tackles one core problem of the internet: separating signal from noise.
</p>

---

## TL;DR

- **What**: Frontend‑only prototype of a verification‑first AI experience (HTML, CSS, JS).  
- **Why**: Shift AI from “answer generator” to a **credibility layer** on top of noisy information.  
- **How**: Opinionated UI flows for claims, guidance, and verification‑oriented usage, ready to be wired into real backends/APIs.  

---

## Overview

The internet is optimized for speed, virality, and engagement, not for truth.[page:2]  
Arixion AI explores what happens when you flip that: the interface is designed around **verification first**, not endless chat.[page:2]

Instead of “ask me anything”, the product is centered on **claims**—things you want to check, question, or investigate.[page:2]  
This repo focuses on the **experience layer**: layout, flows, copy, and visual system for a verification‑first AI product.[page:2]

> Noise in → structured analysis → clearer, more verifiable insight out

---

## Why It’s Different

Most AI UIs are optimized for speed and volume of answers.  
Arixion AI is optimized for **trust, structure, and clarity**.

- Pushes users to think in terms of *claims* instead of open‑ended chatting.  
- Makes room in the layout for “method” and “how we got here”, not just final results.  
- Is intentionally **frontend‑only** here, so you can plug in any intelligence layer you want without being forced into a stack.  

---

## Who Is This For?

Arixion AI is aimed at people who care more about **“Can I trust this?”** than **“Give me a quick summary.”**

- Curious users who double‑check information.  
- Builders exploring AI products around **trust, credibility, and research**.  
- Designers and developers who want a starting point for verification‑centric UX.  

---

## Core Ideas

- **Verification‑first, not answer‑first** – Everything revolves around claims, context, and checking, not pure generation.  
- **Opinionated UX** – Clear sections for claim input, guidance, and results to encourage better information habits.  
- **Frontend‑only prototype** – Clean, framework‑free HTML/CSS/JS that you can drop into any stack or hook into your own APIs later.  

---

## Features (Current Prototype)

- Structured **claim input** area (what are you checking?).  
- Clear **analysis / method** sections to reveal the “how”, not just the “what”.  
- Clean, responsive layout that works on both desktop and mobile.  
- Visual system that feels like a shipped product: typography, color, spacing, hierarchy.  
- Ready to connect to any verification or search backend (NewsAPI, custom LLM, RAG, etc.)—but this repository itself is **pure frontend**.  

> There is intentionally **no backend in this repo**. It’s the surface layer you can plug your own intelligence into.

---

## Live Demo

- **Demo:** https://jigyasaquest.github.io/arixion-ai/[page:2]  

You can experience the full flow (claims → method → results views) directly in the browser.[page:2]

---

## Screenshots

### Desktop

- [Desktop home](assets/desktop-home.jpg) – Primary landing and entry point for verification.  
- [Desktop scanner](assets/desktop-scanner.jpg) – Visual design for a scanning / capture flow.  
- [Desktop method](assets/desktop-method.jpg) – “How it works” / method view.  

### Mobile

- [Mobile home](assets/mobile-home.jpeg)  
- [Mobile scanner](assets/mobile-scanner.jpeg)  
- [Mobile method](assets/mobile-method.jpeg)  
- [Mobile results](assets/mobile-results.jpeg)  

---

## Brand & Product Narrative

### Brand System

| Element   | Value                                                                                      |
|----------|--------------------------------------------------------------------------------------------|
| Brand    | **Arixion AI**                                                                            |
| Former   | **JigyasaNews.AI**                                                                        |
| Tagline  | **Intelligence That Verifies.**                                                           |
| One‑liner| A verification‑first AI interface that filters digital noise into clearer, trustworthy insight. |

### Visual Identity

- **Symbolism**: magnifying glass (investigation) + layered funnel (filtering).  
- **Tone**: focused, analytical, trustworthy – no AI “magic” glitter.  

**Color palette**

| Token           | Value     | Meaning                                      |
|-----------------|-----------|----------------------------------------------|
| Primary         | `#2563EB` | Trust, intelligence, signal                  |
| Accent          | `#10B981` | Verified, truth, confidence                  |
| Background      | `#0F172A` | Deep slate for product UI and landing pages  |
| Text Primary    | `#E5E7EB` | Main readable content                        |
| Muted Text      | `#9CA3AF` | Secondary text                               |
| Borders / Lines | `#1F2937` | Structure and separation                     |

**Typography**

- **Headings**: Inter or Poppins, semibold–bold.  
- **Body**: Inter regular, with comfortable line height for reading research content.  

---

## Tech Stack

No frameworks, no build step, no hidden magic.

- HTML5 – semantic structure.  
- CSS3 – responsive layout, typography, and theming.  
- Vanilla JavaScript – UI behavior and interactions.  
- Static deployment – works on GitHub Pages, any static host, or your own server.[page:2]  

This makes Arixion AI easy to:

- Integrate into existing stacks.  
- Wrap inside Electron / Tauri.  
- Connect to any REST/GraphQL/LLM API you like.  

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/JigyasaQuest/arixion-ai.git
cd arixion-ai
```

### 2. Run (quick way)

You can simply open `index.html` in your browser by double‑clicking it.  
For a smoother experience, especially if you later add APIs, use a local server.

### 3. Run with a simple server (recommended)

If you have Python installed:

```bash
# from the project root
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use VS Code Live Server, Nginx, or any other static server you prefer.[page:2]

---

## Project Structure

```text
arixion-ai/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── desktop-home.jpg
    ├── desktop-scanner.jpg
    ├── desktop-method.jpg
    ├── mobile-home.jpeg
    ├── mobile-scanner.jpeg
    ├── mobile-method.jpeg
    └── mobile-results.jpeg
```

---

## Roadmap

Planned directions for Arixion AI beyond this frontend prototype:

- Plug into a real verification backend (NewsAPI, LLM, custom fact‑checking engine).  
- Source‑backed verification with explicit citations and transparency.  
- Claim credibility scoring with clear explanations.  
- Richer scanning / extraction flows for long content.  
- Research‑oriented dashboards for heavy users.  
- Trust layers for fast‑moving news and social content.  

---

## Contributing

Contributions are welcome—as long as they respect the core idea: **verification over hype**.

You can help by:

- Improving UI/UX and accessibility.  
- Refining flows for claims, method, and results.  
- Hardening the frontend structure and responsiveness.  
- Prototyping integrations with real verification backends.  

### Contribution Flow

1. Fork the repository.  
2. Create a feature branch.  
3. Make your changes.  
4. Open a pull request with a clear description and, ideally, screenshots.[page:2]  

---

## License

This project is licensed under the **MIT License**.[page:2]

---

## One‑Line Pitch

**Arixion AI — Intelligence That Verifies. A focused, frontend‑only starter for building AI products that care about truth, not just output.**
