const html = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const focusInputBtn = document.getElementById("focus-input-btn");
const sampleClaimBtn = document.getElementById("sample-claim-btn");
const cameraLaunchBtn = document.getElementById("camera-launch-btn");
const openCameraBtn = document.getElementById("open-camera-btn");
const scannerForm = document.getElementById("scanner-form");
const claimInput = document.getElementById("claim-input");
const charCounter = document.getElementById("char-counter");
const resultContent = document.getElementById("result-content");
const statusBadge = document.getElementById("status-badge");

const cameraModal = document.getElementById("camera-modal");
const cameraCloseBtn = document.getElementById("camera-close");
const cameraVideo = document.getElementById("camera-video");
const cameraCanvas = document.getElementById("camera-canvas");
const captureBtn = document.getElementById("capture-btn");
const retakeBtn = document.getElementById("retake-btn");
const verifyImageBtn = document.getElementById("verify-image-btn");
const capturedPreview = document.getElementById("captured-preview");
const scanProgress = document.getElementById("scan-progress");
const scanProgressBar = document.getElementById("scan-progress-bar");
const scanProgressLabel = document.getElementById("scan-progress-label");
const scanExtractedResult = document.getElementById("scan-extracted-result");
const newScanBtn = document.getElementById("new-scan-btn");

const SAMPLE_CLAIM =
  "Breaking: Scientists confirm a viral drink can cure all seasonal illnesses in 24 hours.";

let stream = null;
let capturedImageUrl = "";
let lastExtractedText = "";

function setTheme(nextTheme) {
  html.setAttribute("data-theme", nextTheme);
}

themeToggle?.addEventListener("click", () => {
  const current = html.getAttribute("data-theme") === "light" ? "light" : "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

function updateCounter() {
  const count = claimInput.value.length;
  charCounter.textContent = `${count} / 1000`;
}

claimInput?.addEventListener("input", updateCounter);

focusInputBtn?.addEventListener("click", () => {
  claimInput.value = SAMPLE_CLAIM;
  updateCounter();
  claimInput.focus();
  claimInput.scrollIntoView({ behavior: "smooth", block: "center" });
});

sampleClaimBtn?.addEventListener("click", () => {
  claimInput.value = SAMPLE_CLAIM;
  updateCounter();
  claimInput.focus();
});

claimInput?.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    scannerForm.requestSubmit();
  }
});

function verdictFromText(text) {
  const normalized = text.toLowerCase();
  let label = "Needs verification";
  let tone = "uncertain";
  let confidence = 74;
  const reasons = [];

  if (
    normalized.includes("breaking") ||
    normalized.includes("shocking") ||
    normalized.includes("must share") ||
    normalized.includes("viral")
  ) {
    reasons.push("Contains urgency or virality language.");
    confidence -= 8;
  }

  if (
    normalized.includes("always") ||
    normalized.includes("never") ||
    normalized.includes("100%") ||
    normalized.includes("cure all")
  ) {
    reasons.push("Uses absolute or exaggerated wording.");
    tone = "false";
    label = "High risk claim";
    confidence = 32;
  }

  if (
    normalized.includes("according to") ||
    normalized.includes("report") ||
    normalized.includes("study")
  ) {
    reasons.push("Mentions a possible source or evidence cue.");
    if (tone !== "false") {
      confidence += 6;
    }
  }

  if (!reasons.length) {
    reasons.push("The claim needs source tracing and independent confirmation.");
  }

  if (tone !== "false" && confidence >= 78) {
    tone = "true";
    label = "Likely credible";
  }

  if (tone !== "false" && confidence < 78) {
    tone = "uncertain";
    label = "Needs verification";
  }

  return {
    label,
    tone,
    confidence: Math.max(18, Math.min(96, confidence)),
    reasons
  };
}

function renderResult(claimText, sourceType = "Text input") {
  const cleanClaim = claimText.trim();
  if (!cleanClaim) return;

  const analysis = verdictFromText(cleanClaim);

  statusBadge.className = `status-badge ${analysis.tone}`;
  statusBadge.textContent = analysis.label;

  resultContent.innerHTML = `
    <div class="report-card">
      <div class="report-summary">
        <div class="report-claim">
          <strong>Scanned input:</strong><br />
          ${escapeHtml(cleanClaim)}
        </div>

        <div class="report-grid">
          <div class="report-stat">
            <span>Source</span>
            <strong>${escapeHtml(sourceType)}</strong>
          </div>
          <div class="report-stat">
            <span>Confidence</span>
            <strong>${analysis.confidence}%</strong>
          </div>
          <div class="report-stat">
            <span>Verdict</span>
            <strong>${escapeHtml(analysis.label)}</strong>
          </div>
        </div>

        <div class="report-block">
          <h4>Why this result</h4>
          <ul>
            ${analysis.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
          </ul>
        </div>

        <div class="report-block">
          <h4>Suggested next steps</h4>
          <ul>
            <li>Check the original source and publication date.</li>
            <li>Look for coverage from multiple credible outlets.</li>
            <li>Trace whether the wording was cropped or reframed.</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById("results")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function renderLoading(message = "Running verification pass…") {
  statusBadge.className = "status-badge pending";
  statusBadge.textContent = "Scanning";
  resultContent.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner" aria-hidden="true"></div>
      <h3>${escapeHtml(message)}</h3>
      <p>Evaluating credibility cues and verification signals.</p>
    </div>
  `;
}

scannerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = claimInput.value.trim();

  if (!text) {
    claimInput.focus();
    return;
  }

  renderLoading("Running text verification…");

  await wait(700);
  renderResult(text, "Text input");
});

async function openCamera() {
  try {
    cameraModal.hidden = false;
    document.body.classList.add("modal-open");

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      },
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
  cameraVideo.srcObject = null;
}

function closeCamera() {
  stopCamera();
  cameraModal.hidden = true;
  document.body.classList.remove("modal-open");
}

openCameraBtn?.addEventListener("click", openCamera);
cameraLaunchBtn?.addEventListener("click", openCamera);
cameraCloseBtn?.addEventListener("click", closeCamera);

cameraModal?.addEventListener("click", (event) => {
  if (event.target === cameraModal) {
    closeCamera();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cameraModal.hidden) {
    closeCamera();
  }
});

captureBtn?.addEventListener("click", () => {
  if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) return;

  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;

  const ctx = cameraCanvas.getContext("2d");
  ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

  capturedImageUrl = cameraCanvas.toDataURL("image/png");
  capturedPreview.src = capturedImageUrl;
  scanExtractedResult.textContent = "Image captured. Click “Verify now” to extract text.";
});

retakeBtn?.addEventListener("click", () => {
  capturedImageUrl = "";
  lastExtractedText = "";
  capturedPreview.removeAttribute("src");
  scanExtractedResult.textContent = "Capture an image to extract text.";
  scanProgress.hidden = true;
  scanProgressBar.style.width = "0%";
});

verifyImageBtn?.addEventListener("click", async () => {
  if (!capturedImageUrl) {
    alert("Please capture an image first.");
    return;
  }

  scanProgress.hidden = false;
  scanProgressBar.style.width = "0%";
  scanProgressLabel.textContent = "Extracting text from image…";
  scanExtractedResult.textContent = "OCR in progress...";

  try {
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: (msg) => {
        if (msg.status) {
          scanProgressLabel.textContent = msg.status;
        }
        if (typeof msg.progress === "number") {
          scanProgressBar.style.width = `${Math.round(msg.progress * 100)}%`;
        }
      }
    });

    const result = await worker.recognize(capturedImageUrl);
    await worker.terminate();

    const text = (result?.data?.text || "").trim();
    lastExtractedText = text;

    scanProgressBar.style.width = "100%";

    if (!text) {
      scanExtractedResult.textContent =
        "No readable text was detected. Try improving lighting or moving closer.";
      return;
    }

    scanExtractedResult.textContent = text;
    claimInput.value = text.slice(0, 1000);
    updateCounter();

    renderLoading("Running camera-based verification…");
    await wait(700);
    renderResult(text, "Camera OCR");
  } catch (error) {
    console.error(error);
    scanExtractedResult.textContent =
      "OCR failed. Please try again with a clearer image.";
    scanProgressLabel.textContent = "Scan failed";
  }
});

newScanBtn?.addEventListener("click", () => {
  capturedImageUrl = "";
  lastExtractedText = "";
  capturedPreview.removeAttribute("src");
  scanExtractedResult.textContent = "Capture an image to extract text.";
  scanProgress.hidden = true;
  scanProgressBar.style.width = "0%";
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.15
  }
);

document.querySelectorAll(".reveal").forEach((item) => {
  revealObserver.observe(item);
});

updateCounter();
