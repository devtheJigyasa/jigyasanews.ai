<p align="center">
  <!-- Optional: replace with your real logo file or remove this block -->
  <!-- <img src="assets/logo-arixion.png" alt="Arixion AI Logo" width="110" /> -->
</p>

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

- **What**: Frontend‑only prototype of a verification‑first AI experience (HTML, CSS, JS).[page:3]  
- **Why**: Shift AI from “answer generator” to **credibility layer** on top of noisy information.[page:3]  
- **How**: Opinionated UI flows for claims, guidance, and verification‑oriented usage, ready to be wired into real backends/APIs.[page:3]  

---

## Overview

The internet is optimized for speed, virality, and engagement, not for truth.[page:3]  
Arixion AI explores what happens when you flip that: the interface is designed around **verification first**, not endless chat.[page:3]

Instead of “ask me anything”, the product is centered on **claims**—things you want to check, question, or investigate.[page:3]  
This repo focuses on the **experience layer**: layout, flows, copy, and visual system for a verification‑first AI product.[page:3]

> Noise in → structured analysis → clearer, more verifiable insight out[page:3]

---

## Who Is This For?

Arixion AI is aimed at people who care more about **“Can I trust this?”** than **“Give me a quick summary.”**[page:3]

- Curious users who double‑check information.  
- Builders exploring AI products around **trust, credibility, and research**.  
- Designers and developers who want a starting point for verification‑centric UX.  

---

## Core Ideas

- **Verification‑first, not answer‑first** – Everything revolves around claims, context, and checking, not pure generation.[page:3]  
- **Opinionated UX** – Clear sections for claim input, guidance, and results to encourage better information habits.[page:3]  
- **Frontend‑only prototype** – Clean, framework‑free HTML/CSS/JS that you can drop into any stack or hook into your own APIs later.[page:3]  

---

## Features (Current Prototype)

- Structured **claim input** area (what are you checking?).[page:3]  
- Clear **analysis / method** sections to reveal the “how”, not just the “what”.[page:3]  
- Clean, responsive layout that works on both desktop and mobile.[page:3]  
- Visual system that feels like a real product, not a rough demo: typography, color, spacing, hierarchy.[page:3]  
- Ready to connect to any verification or search backend (NewsAPI, custom LLM, RAG, etc.)—but this repository itself is **pure frontend**.[page:3]  

> There is intentionally **no backend in this repo**. It’s the surface layer you can plug your own intelligence into.[page:3]

---

## Live Demo

- **Demo:** https://jigyasaquest.github.io/arixion-ai/[page:3]  

You can experience the full flow (claims → method → results views) directly in the browser.[page:3]

---

## Screenshots

### Desktop

- [Desktop home](assets/desktop-home.jpg) – Primary landing and entry point for verification.[page:3]  
- [Desktop scanner](assets/desktop-scanner.jpg) – Visual design for a scanning / capture flow.[page:3]  
- [Desktop method](assets/desktop-method.jpg) – “How it works” / method view.[page:3]  

### Mobile

- [Mobile home](assets/mobile-home.jpeg)[page:3]  
- [Mobile scanner](assets/mobile-scanner.jpeg)[page:3]  
- [Mobile method](assets/mobile-method.jpeg)[page:3]  
- [Mobile results](assets/mobile-results.jpeg)[page:3]  

---

## Brand & Product Narrative

### Brand System

| Element              | Value                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------|
| Brand name           | **Arixion AI**                                                                                |
| Former name          | **JigyasaNews.AI**                                                                            |
| Tagline              | **Intelligence That Verifies.**                                                               |
| One‑liner            | A verification‑first AI interface that filters digital noise into clearer, more trustworthy insight. |

[page:3]

### Visual Identity

- **Symbolism**: magnifying glass (investigation) + layered funnel (filtering).[page:3]  
- **Tone**: focused, analytical, trustworthy – no AI “magic” glitter.[page:3]  

**Color palette**

| Token           | Value     | Meaning                                      |
|-----------------|-----------|----------------------------------------------|
| Primary         | `#2563EB` | Trust, intelligence, signal                  |
| Accent          | `#10B981` | Verified, truth, confidence                  |
| Background      | `#0F172A` | Deep slate for product UI and landing pages  |
| Text Primary    | `#E5E7EB` | Main readable content                        |
| Muted Text      | `#9CA3AF` | Secondary text                               |
| Borders / Lines | `#1F2937` | Structure and separation                     |

[page:3]

**Typography**

- **Headings / logo**: Inter or Poppins, semibold–bold.  
- **Body**: Inter regular, comfortable line height for reading research content.[page:3]  

---

## Tech Stack

No frameworks, no build step, no hidden magic.[page:3]

- HTML5 – semantic structure.[page:3]  
- CSS3 – responsive layout, typography, and theming.[page:3]  
- Vanilla JavaScript – UI behavior and interactions.[page:3]  
- Static deployment – works on GitHub Pages, any static host, or your own server.[page:3]  

This makes Arixion AI easy to:[page:3]  

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
[page:3]

### 2. Run (quick way)

You can simply open `index.html` in your browser by double‑clicking it.[page:3]  
For a smoother experience, especially if you later add APIs, use a local server.[page:3]

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
[page:3]

You can also use VS Code Live Server, Nginx, or any other static server you prefer.[page:3]

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
[page:3]

---

## Roadmap

Planned directions for Arixion AI beyond this frontend prototype:[page:3]

- Plug into a real verification backend (NewsAPI, LLM, custom fact‑checking engine).  
- Source‑backed verification with explicit citations and transparency.  
- Claim credibility scoring with clear explanations.  
- Richer scanning / extraction flows for long content.  
- Research‑oriented dashboards for heavy users.  
- Trust layers for fast‑moving news and social content.  

---

## Contributing

Contributions are welcome—as long as they respect the core idea: **verification over hype**.[page:3]

You can help by:[page:3]

- Improving UI/UX and accessibility.  
- Refining flows for claims, method, and results.  
- Hardening the frontend structure and responsiveness.  
- Prototyping integrations with real verification backends.  

### Contribution Flow

1. Fork the repository.  
2. Create a feature branch.  
3. Make your changes.  
4. Open a pull request with a clear description and, ideally, screenshots.[page:3]  

---

## License

This project is licensed under the **MIT License**.[page:3]

---

## One‑Line Pitch

**Arixion AI — Intelligence That Verifies. A focused, frontend‑only starter for building AI products that care about truth, not just output.**[page:3]
