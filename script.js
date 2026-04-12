// ===== CONFIG =====
const SAMPLE_CLAIMS = [
  "PM of India is Narendra Modi",
  "Drinking hot water cures all viral illnesses",
  "The capital of France is Paris",
  "NASA found alien life on Mars",
  "Eating garlic can completely prevent flu",
  "The president of the USA is Donald Trump",
  "A viral video proves the moon landing was fake",
  "Vaccines cause all chronic diseases",
  "The Great Wall of China is visible from space",
  "India won independence in 1947",
  "Shocking: one fruit can melt belly fat overnight",
  "The Earth revolves around the Sun",
  "A new study says chocolate cures diabetes",
  "The CEO of Tesla is Elon Musk",
  "Breaking: scientists reverse aging in humans completely",
  "Mount Everest is the tallest mountain above sea level",
  "A WhatsApp forward says banks will shut for 10 days",
  "The capital of Japan is Tokyo",
  "A miracle oil can regrow hair in 24 hours",
  "The Taj Mahal is in Agra"
];

// NewsAPI developer plan is mainly for development/testing.
// In browser-only apps, your key is exposed.
const NEWS_API_KEY = "yMaSo0KoEyc0SkhZGUGx6LXTm3Qhv_8iQGn7au2hB-CSg3WK";
const NEWS_API_MIN_INTERVAL_MS = 2500;
let lastNewsApiCall = 0;

const TRUSTED_DOMAINS = [
  "bbc.com",
  "reuters.com",
  "apnews.com",
  "aljazeera.com",
  "thehindu.com",
  "indianexpress.com",
  "ndtv.com",
  "timesofindia.indiatimes.com"
];

// ===== DOM HELPERS =====
const $ = (sel) => document.querySelector(sel);
const html = document.documentElement;

const themeToggle = $("[data-theme-toggle]");
const focusInputBtn = $("#focus-input-btn");
const sampleClaimBtn = $("#sample-claim-btn");
const cameraLaunchBtn = $("#camera-launch-btn");
const openCameraBtn = $("#open-camera-btn");
const scannerForm = $("#scanner-form");
const claimInput = $("#claim-input");
const charCounter = $("#char-counter");
const resultContent = $("#result-content");
const statusBadge = $("#status-badge");

const cameraModal = $("#camera-modal");
const cameraCloseBtn = $("#camera-close");
const cameraVideo = $("#camera-video");
const cameraCanvas = $("#camera-canvas");
const captureBtn = $("#capture-btn");
const retakeBtn = $("#retake-btn");
const verifyImageBtn = $("#verify-image-btn");
const capturedPreview = $("#captured-preview");
const scanProgress = $("#scan-progress");
const scanProgressBar = $("#scan-progress-bar");
const scanProgressLabel = $("#scan-progress-label");
const scanExtractedResult = $("#scan-extracted-result");
const newScanBtn = $("#new-scan-btn");

const on = (el, evt, handler) => el && el.addEventListener(evt, handler);

// ===== STATE =====
let stream = null;
let capturedImageUrl = "";
let lastExtractedText = "";
let ocrWorkerPromise = null;
let sampleRotationTimer = null;
let currentSampleIndex = 0;

// ===== THEME =====
function setTheme(nextTheme) {
  html.setAttribute("data-theme", nextTheme);
}

on(themeToggle, "click", () => {
  const current = html.getAttribute("data-theme") === "light" ? "light" : "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// ===== INPUT / COUNTER =====
function updateCounter() {
  if (!claimInput || !charCounter) return;
  const text = claimInput.value || "";
  charCounter.textContent = `${text.length} / 1000`;
}

on(claimInput, "input", updateCounter);

function getRandomSampleIndex() {
  return Math.floor(Math.random() * SAMPLE_CLAIMS.length);
}

function rotateSampleClaim() {
  if (!claimInput) return;
  currentSampleIndex = (currentSampleIndex + 1) % SAMPLE_CLAIMS.length;
  claimInput.placeholder = SAMPLE_CLAIMS[currentSampleIndex];
}

function startSampleRotation() {
  if (!claimInput) return;
  stopSampleRotation();
  currentSampleIndex = getRandomSampleIndex();
  claimInput.placeholder = SAMPLE_CLAIMS[currentSampleIndex];

  sampleRotationTimer = setInterval(() => {
    rotateSampleClaim();
  }, 4000);
}

function stopSampleRotation() {
  if (sampleRotationTimer) {
    clearInterval(sampleRotationTimer);
    sampleRotationTimer = null;
  }
}

function fillSampleClaim() {
  if (!claimInput) return;
  claimInput.value = SAMPLE_CLAIMS[currentSampleIndex] || SAMPLE_CLAIMS[0];
  updateCounter();
  claimInput.focus();
}

on(focusInputBtn, "click", () => {
  fillSampleClaim();
  claimInput?.scrollIntoView({ behavior: "smooth", block: "center" });
});

on(sampleClaimBtn, "click", fillSampleClaim);

on(claimInput, "focus", stopSampleRotation);

on(claimInput, "blur", () => {
  if (!claimInput.value.trim()) {
    startSampleRotation();
  }
});

on(claimInput, "keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter" && scannerForm) {
    event.preventDefault();
    scannerForm.requestSubmit();
  }
});

// ===== CLAIM HELPER HEURISTIC =====
function verdictFromText(text) {
  const normalized = (text || "").toLowerCase();
  let label = "Needs manual verification";
  let tone = "uncertain";
  let confidence = 70;
  const reasons = [];

  if (
    normalized.includes("breaking") ||
    normalized.includes("shocking") ||
    normalized.includes("must share") ||
    normalized.includes("viral")
  ) {
    reasons.push("Contains urgency or virality wording.");
    confidence -= 8;
  }

  if (
    normalized.includes("always") ||
    normalized.includes("never") ||
    normalized.includes("100%") ||
    normalized.includes("cure all") ||
    normalized.includes("overnight") ||
    normalized.includes("miracle")
  ) {
    reasons.push("Contains absolute or exaggerated wording.");
    label = "Contains suspicious wording";
    tone = "warning";
    confidence = 34;
  }

  if (
    normalized.includes("according to") ||
    normalized.includes("report") ||
    normalized.includes("study")
  ) {
    reasons.push("Includes a source-like cue that still needs checking.");
    confidence += 4;
  }

  if (looksLikeBasicFact(normalized)) {
    reasons.push("This looks like a basic factual claim, so reference sources may be more useful than recent news.");
    label = "Basic fact claim";
    tone = "informational";
    confidence = 76;
  }

  if (looksLikeHealthClaim(normalized)) {
    reasons.push("Health-related claims should be checked with official medical or scientific sources.");
    if (label !== "Contains suspicious wording") {
      label = "Health claim";
      tone = "warning";
    }
  }

  if (!reasons.length) {
    reasons.push("This claim still needs source checking and context review.");
  }

  return {
    label,
    tone,
    confidence: clamp(confidence, 20, 95),
    reasons
  };
}

function looksLikeBasicFact(text) {
  const patterns = [
    /\b(pm|prime minister|president|capital|ceo|founder|located|tallest)\b/,
    /\bis\b/,
    /\bof\b|in\b/
  ];
  return patterns.every((pattern) => pattern.test(text));
}

function looksLikeHealthClaim(text) {
  return (
    text.includes("cure") ||
    text.includes("treat") ||
    text.includes("medicine") ||
    text.includes("doctor") ||
    text.includes("disease") ||
    text.includes("virus") ||
    text.includes("illness") ||
    text.includes("flu") ||
    text.includes("diabetes") ||
    text.includes("vaccine")
  );
}

// ===== NEWS API =====
async function fetchNewsApiArticles(claimText) {
  const now = Date.now();
  if (now - lastNewsApiCall < NEWS_API_MIN_INTERVAL_MS) {
    await wait(NEWS_API_MIN_INTERVAL_MS - (now - lastNewsApiCall));
  }

  const query = buildNewsQuery(claimText);
  const endpoint =
    `https://newsapi.org/v2/everything?` +
    `q=${encodeURIComponent(query)}` +
    `&language=en` +
    `&sortBy=relevancy` +
    `&pageSize=5` +
    `&apiKey=${encodeURIComponent(NEWS_API_KEY)}`;

  const response = await fetch(endpoint, { method: "GET" });
  lastNewsApiCall = Date.now();

  if (!response.ok) {
    throw new Error(`News API failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error(data.message || "News API returned an error");
  }

  return Array.isArray(data.articles) ? data.articles.slice(0, 5) : [];
}

function buildNewsQuery(claimText) {
  const clean = (claimText || "").trim().replace(/\s+/g, " ");
  if (!clean) return "";

  const words = clean.split(" ").filter(Boolean);
  if (words.length <= 8) return `"${clean}"`;

  const filtered = words.filter((word) => word.length > 3).slice(0, 8);
  return filtered.join(" ");
}

// ===== WIKIPEDIA =====
async function fetchWikipediaSummary(claimText) {
  const query = buildWikipediaQuery(claimText);
  if (!query) return null;

  const searchUrl =
    `https://en.wikipedia.org/w/api.php?` +
    `action=query` +
    `&list=search` +
    `&srsearch=${encodeURIComponent(query)}` +
    `&utf8=1` +
    `&format=json` +
    `&origin=*`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    throw new Error(`Wikipedia search failed: ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  const firstResult = searchData?.query?.search?.[0];

  if (!firstResult?.title) return null;

  const title = firstResult.title;
  const summaryUrl =
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const summaryResponse = await fetch(summaryUrl);
  if (!summaryResponse.ok) {
    throw new Error(`Wikipedia summary failed: ${summaryResponse.status}`);
  }

  const summaryData = await summaryResponse.json();

  return {
    title: summaryData.title || title,
    extract: summaryData.extract || "No summary available.",
    url:
      summaryData?.content_urls?.desktop?.page ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    source: "Wikipedia"
  };
}

function buildWikipediaQuery(claimText) {
  const clean = (claimText || "").trim();
  if (!clean) return "";

  const normalized = clean.toLowerCase();
  const patternsToStrip = [
    "breaking:",
    "shocking:",
    "breaking",
    "shocking",
    "viral",
    "must share"
  ];

  let query = normalized;
  patternsToStrip.forEach((part) => {
    query = query.replaceAll(part, "");
  });

  return query.replace(/\s+/g, " ").trim().slice(0, 120);
}

// ===== ANALYSIS AGGREGATION =====
function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function normalizeArticles(articles) {
  return (articles || []).map((article) => {
    const host = getHostname(article.url || "");
    const trusted = TRUSTED_DOMAINS.some(
      (domain) => host === domain || host.endsWith(`.${domain}`)
    );

    return {
      title: article.title || "Untitled article",
      description: article.description || "No description available.",
      url: article.url || "#",
      image: article.urlToImage || "",
      source: article.source?.name || host || "Unknown source",
      published: article.publishedAt || "",
      trusted
    };
  });
}

function buildCombinedAnalysis(claimText, articles, wiki = null) {
  const base = verdictFromText(claimText);
  const normalizedArticles = normalizeArticles(articles);

  let label = base.label;
  let tone = base.tone;
  let confidence = base.confidence;
  const reasons = [...base.reasons];

  const articleCount = normalizedArticles.length;
  const trustedCount = normalizedArticles.filter((a) => a.trusted).length;

  if (looksLikeBasicFact((claimText || "").toLowerCase())) {
    reasons.push("For basic facts, Wikipedia or official reference sources may help more than recent news.");
  }

  if (articleCount === 0) {
    reasons.push("No strong related source matches were found in recent news results.");
    if (label !== "Health claim" && label !== "Contains suspicious wording") {
      label = wiki ? "Reference source found" : "No strong source match";
      tone = wiki ? "informational" : "uncertain";
    }
    confidence -= 8;
  } else if (articleCount <= 2) {
    reasons.push("A small number of related articles were found.");
    if (label !== "Contains suspicious wording") {
      label = "Some related coverage found";
    }
    confidence += 4;
  } else {
    reasons.push("Multiple related articles were found.");
    if (label !== "Contains suspicious wording") {
      label = "Related coverage found";
    }
    confidence += 8;
  }

  if (trustedCount >= 2) {
    reasons.push("Some matches come from widely recognised outlets.");
    confidence += 6;
  }

  if (wiki) {
    reasons.push("A matching Wikipedia summary was also found.");
    confidence += 4;
  }

  return {
    label,
    tone,
    confidence: clamp(confidence, 20, 95),
    reasons,
    articles: normalizedArticles,
    wiki
  };
}

// ===== RENDERING =====
function renderResult(claimText, sourceType = "Text input", analysisData = null) {
  if (!resultContent || !statusBadge) return;

  const cleanClaim = (claimText || "").trim();
  if (!cleanClaim) return;

  const analysis = analysisData || {
    ...verdictFromText(cleanClaim),
    articles: [],
    wiki: null
  };

  statusBadge.className = `status-badge ${analysis.tone}`;
  statusBadge.textContent = analysis.label;

  const wikiHtml = analysis.wiki
    ? `
      <div class="report-block">
        <h4>Wikipedia summary</h4>
        <article class="article-card">
          <h5>${escapeHtml(analysis.wiki.title)}</h5>
          <p>${escapeHtml(analysis.wiki.extract)}</p>
          <div class="article-meta">
            <span>${escapeHtml(analysis.wiki.source)}</span>
          </div>
          <a href="${analysis.wiki.url}" target="_blank" rel="noopener noreferrer">Open Wikipedia</a>
        </article>
      </div>
    `
    : `
      <div class="report-block">
        <h4>Wikipedia summary</h4>
        <p>No matching Wikipedia summary was found.</p>
      </div>
    `;

  const articlesHtml =
    analysis.articles && analysis.articles.length
      ? `
        <div class="report-block">
          <h4>Related sources</h4>
          <div class="article-list">
            ${analysis.articles
              .map(
                (article) => `
              <article class="article-card">
                <h5>${escapeHtml(article.title)}</h5>
                <p>${escapeHtml(article.description)}</p>
                <div class="article-meta">
                  <span>${escapeHtml(article.source)}</span>
                  ${article.trusted ? `<span class="trusted-tag">Recognised outlet</span>` : ""}
                </div>
                ${
                  article.url && article.url !== "#"
                    ? `<a href="${article.url}" target="_blank" rel="noopener noreferrer">Open source</a>`
                    : ""
                }
              </article>
            `
              )
              .join("")}
          </div>
        </div>
      `
      : `
        <div class="report-block">
          <h4>Related sources</h4>
          <p>No strong related sources were found for this wording.</p>
        </div>
      `;

  resultContent.innerHTML = `
    <div class="report-card">
      <div class="report-summary">
        <div class="report-claim">
          <strong>Scanned claim:</strong><br />
          ${escapeHtml(cleanClaim)}
        </div>

        <div class="report-grid">
          <div class="report-stat">
            <span>Input type</span>
            <strong>${escapeHtml(sourceType)}</strong>
          </div>
          <div class="report-stat">
            <span>Match strength</span>
            <strong>${analysis.confidence}%</strong>
          </div>
          <div class="report-stat">
            <span>Signal</span>
            <strong>${escapeHtml(analysis.label)}</strong>
          </div>
        </div>

        <div class="report-block">
          <h4>Why this appeared</h4>
          <ul>
            ${analysis.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
          </ul>
        </div>

        <div class="report-block">
          <h4>Suggested next steps</h4>
          <ul>
            <li>Review the original wording and publication date.</li>
            <li>Open multiple linked sources before trusting the claim.</li>
            <li>Check whether the claim is missing context or reframed.</li>
          </ul>
        </div>

        <div class="report-block">
          <h4>Important</h4>
          <p>This Claim Helper suggests related sources and wording cues. It does not determine whether a claim is true or false on its own.</p>
        </div>

        ${wikiHtml}
        ${articlesHtml}
      </div>
    </div>
  `;

  const resultsRoot = document.getElementById("results");
  resultsRoot?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function renderLoading(message = "Running Claim Helper…") {
  if (!statusBadge || !resultContent) return;
  statusBadge.className = "status-badge pending";
  statusBadge.textContent = "Checking";
  resultContent.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner" aria-hidden="true"></div>
      <h3>${escapeHtml(message)}</h3>
      <p>Reviewing wording cues and looking for related sources.</p>
    </div>
  `;
}

// ===== ANALYSIS RUNNER =====
async function runClaimAnalysis(text, sourceType = "Text input") {
  const cleanText = (text || "").trim().slice(0, 1000);
  if (!cleanText) return;

  renderLoading("Running Claim Helper…");

  const baseAnalysis = {
    ...verdictFromText(cleanText),
    articles: [],
    wiki: null
  };

  await wait(350);
  renderResult(cleanText, `${sourceType} · Claim Helper`, baseAnalysis);

  let articles = [];
  let wiki = null;

  try {
    articles = await fetchNewsApiArticles(cleanText);
  } catch (error) {
    console.error("News API error:", error);
  }

  try {
    wiki = await fetchWikipediaSummary(cleanText);
  } catch (error) {
    console.error("Wikipedia error:", error);
  }

  const combined = buildCombinedAnalysis(cleanText, articles, wiki);

  if (!articles.length && !wiki) {
    combined.reasons.push(
      "No related news articles or Wikipedia summary could be fetched right now."
    );
  }

  renderResult(
    cleanText,
    `${sourceType} · Claim Helper + News API + Wikipedia`,
    combined
  );
}

// ===== FORM SUBMIT (TEXT) =====
on(scannerForm, "submit", async (event) => {
  event.preventDefault();
  if (!claimInput) return;

  const text = claimInput.value.trim();
  if (!text) {
    claimInput.focus();
    return;
  }

  const truncated = text.slice(0, 1000);
  if (truncated !== text) {
    claimInput.value = truncated;
    updateCounter();
  }

  toggleFormDisabled(true);

  try {
    await runClaimAnalysis(truncated, "Text input");
  } finally {
    toggleFormDisabled(false);
  }
});

// ===== CAMERA + OCR =====
async function openCamera() {
  if (!cameraModal || !cameraVideo) return;

  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    alert("Camera access needs HTTPS or localhost in a supported browser.");
    return;
  }

  try {
    cameraModal.hidden = false;
    document.body.classList.add("modal-open");

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });

    cameraVideo.srcObject = stream;
    await cameraVideo.play();
  } catch (error) {
    cameraModal.hidden = true;
    document.body.classList.remove("modal-open");
    alert("Unable to access camera. Please allow camera permission and try again.");
    console.error(error);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  if (cameraVideo) cameraVideo.srcObject = null;
}

function closeCamera() {
  stopCamera();
  if (cameraModal) {
    cameraModal.hidden = true;
  }
  document.body.classList.remove("modal-open");
}

on(openCameraBtn, "click", openCamera);
on(cameraLaunchBtn, "click", openCamera);
on(cameraCloseBtn, "click", closeCamera);

on(cameraModal, "click", (event) => {
  if (event.target === cameraModal) closeCamera();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cameraModal && !cameraModal.hidden) {
    closeCamera();
  }
});

on(captureBtn, "click", () => {
  if (!cameraVideo || !cameraCanvas || !capturedPreview || !scanExtractedResult) return;
  if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) return;

  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;

  const ctx = cameraCanvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

  capturedImageUrl = cameraCanvas.toDataURL("image/png");
  capturedPreview.src = capturedImageUrl;
  scanExtractedResult.textContent = "Image captured. Click “Verify now” to extract text.";
});

on(retakeBtn, "click", resetScanState);
on(newScanBtn, "click", resetScanState);

on(verifyImageBtn, "click", async () => {
  if (!capturedImageUrl) {
    alert("Please capture an image first.");
    return;
  }

  if (!scanProgress || !scanProgressBar || !scanProgressLabel || !scanExtractedResult) return;

  scanProgress.hidden = false;
  scanProgressBar.style.width = "0%";
  scanProgressLabel.textContent = "Extracting text from image…";
  scanExtractedResult.textContent = "OCR in progress...";

  toggleOcrButtons(true);

  try {
    const worker = await getOcrWorker();
    const result = await worker.recognize(capturedImageUrl);

    const text = (result?.data?.text || "").trim();
    lastExtractedText = text;
    scanProgressBar.style.width = "100%";

    if (!text) {
      scanExtractedResult.textContent =
        "No readable text was detected. Try improving lighting or moving closer.";
      return;
    }

    scanExtractedResult.textContent = text;

    if (claimInput) {
      claimInput.value = text.slice(0, 1000);
      updateCounter();
    }

    await runClaimAnalysis(text, "Camera OCR");
  } catch (error) {
    console.error(error);
    scanExtractedResult.textContent =
      "OCR failed. Please try again with a clearer image.";
    scanProgressLabel.textContent = "Scan failed";
  } finally {
    toggleOcrButtons(false);
  }
});

// ===== OCR WORKER MANAGEMENT =====
async function getOcrWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = Tesseract.createWorker("eng", 1, {
      logger: (msg) => {
        if (!scanProgressLabel || !scanProgressBar) return;
        if (msg.status) scanProgressLabel.textContent = msg.status;
        if (typeof msg.progress === "number") {
          scanProgressBar.style.width = `${Math.round(msg.progress * 100)}%`;
        }
      }
    });
  }
  return ocrWorkerPromise;
}

// ===== UTILITIES =====
function resetScanState() {
  capturedImageUrl = "";
  lastExtractedText = "";
  if (capturedPreview) capturedPreview.removeAttribute("src");
  if (scanExtractedResult) {
    scanExtractedResult.textContent = "Capture an image to extract text.";
  }
  if (scanProgress) scanProgress.hidden = true;
  if (scanProgressBar) scanProgressBar.style.width = "0%";
}

function toggleFormDisabled(disabled) {
  if (!scannerForm) return;
  const elements = scannerForm.querySelectorAll("input, textarea, button");
  elements.forEach((el) => {
    el.disabled = disabled;
  });
}

function toggleOcrButtons(disabled) {
  [captureBtn, retakeBtn, verifyImageBtn, newScanBtn].forEach((btn) => {
    if (btn) btn.disabled = disabled;
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((item) => {
  revealObserver.observe(item);
});

// Init
updateCounter();
startSampleRotation();
