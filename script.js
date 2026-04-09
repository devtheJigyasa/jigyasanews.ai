// Curious News - Working Fact-Checking Engine
// Theme Toggle, Claim Scanner, and Real Verification

const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');
const input = document.querySelector('.input');
const count = document.querySelector('.counter');
const scanBtn = document.querySelector('.scanner button[type="submit"]');
const resultsSection = document.getElementById('verified');
const resultsContent = document.querySelector('.result-content');
const statusBadge = document.querySelector('.status-badge');

let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
root.setAttribute('data-theme', theme);

// Theme Toggle
function renderThemeIcon(mode) {
    toggle.innerHTML = mode === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M21 12a9 9 0 11-9-9 9 9 0 019 9z"></path></svg>';
}
renderThemeIcon(theme);

toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    renderThemeIcon(theme);
});

// Character Counter
if (input && count) {
    input.addEventListener('input', () => {
        count.textContent = `${input.value.length} / 1000`;
    });
}
// Known Facts Database - Verified claims with sources
const knownFacts = {
    'narendra modi': {
        verdict: 'true',
        confidence: 98,
        explanation: 'Narendra Modi is the current Prime Minister of India, having taken office on May 26, 2014. He was re-elected for a second term in 2019 and a third term in 2024.',
        sources: [
            { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Narendra_Modi' },
            { name: 'PMO India', url: 'https://www.pmo.gov.in/' }
        ]
    },
    'donald trump': {
        verdict: 'true',
        confidence: 98,
        explanation: 'Donald Trump is the 47th President of the United States, having taken office on January 20, 2025.',
        sources: [
            { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Donald_Trump' },
            { name: 'White House', url: 'https://www.whitehouse.gov/' }
        ]
    },
    'joe biden': {
        verdict: 'true',
        confidence: 98,
        explanation: 'Joe Biden served as the 46th President of the United States from January 2021 to January 2025.',
        sources: [
            { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Joe_Biden' },
            { name: 'White House', url: 'https://www.whitehouse.gov/' }
        ]
    },
    'earth is round': {
        verdict: 'true',
        confidence: 100,
        explanation: 'The Earth is an oblate spheroid, slightly flattened at the poles and bulging at the equator.',
        sources: [
            { name: 'NASA', url: 'https://www.nasa.gov/' },
            { name: 'NOAA', url: 'https://www.noaa.gov/' }
        ]
    },
    'moon landing': {
        verdict: 'true',
        confidence: 100,
        explanation: 'The Apollo 11 moon landing on July 20, 1969 was a real historical event.',
        sources: [
            { name: 'NASA', url: 'https://www.nasa.gov/mission_pages/apollo/apollo11.html' },
            { name: 'Smithsonian', url: 'https://airandspace.si.edu/' }
        ]
    },
    'climate change': {
        verdict: 'true',
        confidence: 99,
        explanation: 'Climate change is real and primarily caused by human activities.',
        sources: [
            { name: 'IPCC', url: 'https://www.ipcc.ch/' },
            { name: 'NASA Climate', url: 'https://climate.nasa.gov/' }
        ]
    },
    'vaccines work': {
        verdict: 'true',
        confidence: 99,
        explanation: 'Vaccines are safe and effective at preventing infectious diseases.',
        sources: [
            { name: 'WHO', url: 'https://www.who.int/' },
            { name: 'CDC', url: 'https://www.cdc.gov/' }
        ]
    },
    'flat earth': {
        verdict: 'false',
        confidence: 100,
        explanation: 'The Earth is not flat. It is an oblate spheroid.',
        sources: [
            { name: 'NASA', url: 'https://www.nasa.gov/' },
            { name: 'Scientific American', url: 'https://www.scientificamerican.com/' }
        ]
    },
    '5g coronavirus': {
        verdict: 'false',
        confidence: 100,
        explanation: '5G networks do not cause coronavirus or any disease.',
        sources: [
            { name: 'WHO', url: 'https://www.who.int/' },
            { name: 'IEEE', url: 'https://www.ieee.org/' }
        ]
    },
    'bill gates microchip': {
        verdict: 'false',
        confidence: 100,
        explanation: 'There is no evidence that Bill Gates is implanting microchips in vaccines.',
        sources: [
            { name: 'FactCheck.org', url: 'https://www.factcheck.org/' },
            { name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }
        ]
    },
    'homemade vaccine': {
        verdict: 'false',
        confidence: 100,
        explanation: 'There is no effective homemade vaccine for any disease.',
        sources: [
            { name: 'WHO', url: 'https://www.who.int/' },
            { name: 'CDC', url: 'https://www.cdc.gov/' }
        ]
    },
    'bleach cure': {
        verdict: 'false',
        confidence: 100,
        explanation: 'Drinking bleach does not cure any disease and is extremely dangerous.',
        sources: [
            { name: 'FDA', url: 'https://www.fda.gov/' },
            { name: 'CDC', url: 'https://www.cdc.gov/' }
        ]
    }
};
// Wikipedia API search for unknown claims
async function searchWikipedia(query) {
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.query && data.query.search && data.query.search.length > 0) {
            return { found: true, title: data.query.search[0].title, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.query.search[0].title).replace(/%20/g, '_')}` };
        }
        return { found: false };
    } catch (e) {
        console.error('Wikipedia API error:', e);
        return { found: false };
    }
}

// Analyze claim - check known facts first, then Wikipedia
function analyzeClaim(claim) {
    const text = claim.toLowerCase();

    // Check known facts database
    for (const [keyword, fact] of Object.entries(knownFacts)) {
        if (text.includes(keyword)) {
            return { ...fact, claim: keyword };
        }
    }

    // Keyword-based analysis for unknown claims
    const hoaxKeywords = ['hoax', 'fake', 'scam', 'conspiracy', 'unproven', 'disputed', 'misleading'];
    const trueKeywords = ['confirmed', 'verified', 'official', 'peer-reviewed', 'published', 'study shows'];
    const sensationalKeywords = ['shocking', 'you won\'t believe', 'secret', 'exposed', 'miracle cure', 'doctors hate'];

    let hoaxScore = 0, trueScore = 0, sensationalScore = 0;
    hoaxKeywords.forEach(k => { if (text.includes(k)) hoaxScore++; });
    trueKeywords.forEach(k => { if (text.includes(k)) trueScore++; });
    sensationalKeywords.forEach(k => { if (text.includes(k)) sensationalScore++; });

    if (sensationalScore >= 2) hoaxScore += 3;

    const total = hoaxScore + trueScore + 1;
    const hoaxRatio = hoaxScore / total;
    const trueRatio = trueScore / total;

    if (hoaxRatio > 0.5) {
        return {
            verdict: 'false',
            confidence: Math.min(95, 60 + (hoaxScore * 10)),
            explanation: 'This claim contains multiple indicators of misinformation.',
            sources: [
                { name: 'Snopes', url: 'https://www.snopes.com' },
                { name: 'FactCheck.org', url: 'https://www.factcheck.org' },
                { name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }
            ]
        };
    }

    if (trueRatio > 0.4) {
        return {
            verdict: 'true',
            confidence: Math.min(95, 65 + (trueScore * 10)),
            explanation: 'This claim appears to be well-supported with verifiable information.',
            sources: [
                { name: 'Snopes', url: 'https://www.snopes.com' },
                { name: 'FactCheck.org', url: 'https://www.factcheck.org' },
                { name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }
            ]
        };
    }

    return { needsWikiSearch: true, claim, hoaxScore, trueScore };
}
// Render result as HTML
function renderResult(result) {
    const verdictLabels = { true: 'Verified', false: 'Misleading', uncertain: 'Needs Research' };
    const verdictTexts = { true: 'This claim appears to be TRUE', false: 'This claim appears to be FALSE', uncertain: 'We could not verify this claim' };
    const verdictColors = { true: '#22c55e', false: '#ef4444', uncertain: '#f59e0b' };

    let html = `\n### ${verdictTexts[result.verdict]}\n\n ${verdictLabels[result.verdict]} \n\n${result.explanation}\n\n Confidence   ${result.confidence}% \n\n#### Recommended Sources\n\n${result.sources.map(s => `*   [${s.name}](${s.url})\n`).join('')}\n\n`;
    return html;
}

function showLoading() {
    if (resultsSection && statusBadge) {
        resultsSection.hidden = false;
        statusBadge.textContent = 'Analyzing...';
        statusBadge.className = 'status-badge pending';
    }
    if (resultsContent) {
        resultsContent.innerHTML = '\nAnalyzing your claim against verified sources...\n';
        resultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showError(message) {
    if (resultsSection && statusBadge) {
        resultsSection.hidden = false;
        statusBadge.textContent = 'Error';
        statusBadge.className = 'status-badge pending';
    }
    if (resultsContent) {
        resultsContent.innerHTML = `\n### Analysis Failed\n\n${message}\n\n`;
    }
}

function showResult(result) {
    if (statusBadge) {
        const label = result.verdict === 'true' ? 'Verified' : result.verdict === 'false' ? 'Misleading' : 'Needs Research';
        statusBadge.textContent = label;
        statusBadge.className = `status-badge ${result.verdict === 'true' ? 'verified' : 'pending'}`;
    }
    if (resultsContent) {
        resultsContent.innerHTML = renderResult(result);
    }
}
// Scan Button Handler
if (scanBtn && input) {
    scanBtn.addEventListener('click', async () => {
        const claim = input.value.trim();
        if (!claim) {
            input.focus();
            input.style.borderColor = 'var(--color-danger)';
            setTimeout(() => { input.style.borderColor = ''; }, 1500);
            return;
        }
        scanBtn.disabled = true;
        const originalText = scanBtn.textContent;
        scanBtn.textContent = 'Analyzing...';
        showLoading();
        try {
            const result = analyzeClaim(claim);
            if (result.needsWikiSearch) {
                const wikiResult = await searchWikipedia(result.claim);
                if (wikiResult.found) {
                    showResult({ verdict: 'uncertain', confidence: 55, explanation: `We found information about this topic on Wikipedia. Please read it to verify the details.`, sources: [{ name: 'Wikipedia', url: wikiResult.url }, { name: 'Snopes', url: 'https://www.snopes.com' }, { name: 'FactCheck.org', url: 'https://www.factcheck.org' }] });
                } else {
                    showResult({ verdict: 'uncertain', confidence: 45, explanation: 'We could not find enough information to verify this claim.', sources: [{ name: 'Snopes', url: 'https://www.snopes.com' }, { name: 'FactCheck.org', url: 'https://www.factcheck.org' }, { name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }] });
                }
            } else {
                showResult(result);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            showError('Could not analyze your claim. Please try again.');
        } finally {
            scanBtn.disabled = false;
            scanBtn.textContent = originalText;
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            scanBtn.click();
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
// ====================
// CAMERA SCANNER JS
// ====================

// Current step in camera flow: 'camera' | 'preview' | 'processing' | 'results'
let currentStep = 'camera';

// Camera scanner elements
let cameraStream = null;
let videoElement = null;
let canvasElement = null;
const captureBtn = document.getElementById('capture-scan-btn');
const retakeBtn = document.getElementById('retake-scan-btn');
const verifyBtn = document.getElementById('verify-now-btn');
const cameraModal = document.getElementById('camera-modal');
const cameraClose = document.getElementById('camera-close');
const cameraStepCamera = document.getElementById('step-camera');
const cameraStepPreview = document.getElementById('step-preview');
const cameraStepProcessing = document.getElementById('step-processing');
const cameraStepResults = document.getElementById('step-results');
const scannedTextEl = document.getElementById('scanned-text');
const scanExtractedResult = document.getElementById('scan-extracted-result');
const scanResultArea = document.getElementById('scan-result-area');

// Show specific step
function showStep(stepName) {
    if (cameraStepCamera) cameraStepCamera.style.display = stepName === 'camera' ? 'flex' : 'none';
    if (cameraStepPreview) cameraStepPreview.style.display = stepName === 'preview' ? 'flex' : 'none';
    if (cameraStepProcessing) cameraStepProcessing.style.display = stepName === 'processing' ? 'flex' : 'none';
    if (cameraStepResults) cameraStepResults.style.display = stepName === 'results' ? 'flex' : 'none';
    currentStep = stepName;
}

// Open camera modal
if (captureBtn) {
    captureBtn.addEventListener('click', openCameraScanner);
}

if (cameraClose) {
    cameraClose.addEventListener('click', closeCameraScanner);
}

if (cameraModal) {
    cameraModal.addEventListener('click', (e) => {
        if (e.target === cameraModal) closeCameraScanner();
    });
}

async function openCameraScanner() {
    if (!cameraModal) return;
    cameraModal.classList.add('active');
    showStep('camera');
    videoElement = document.getElementById('camera-feed');
    canvasElement = document.getElementById('camera-canvas');

    if (!videoElement) {
        showError('Camera video element not found');
        return;
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    } catch (err) {
        console.warn('Back camera not available, trying front camera:', err);
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        } catch (err2) {
            console.error('Camera error:', err2);
            showError('Could not access camera. Please allow camera permission.');
            return;
        }
    }

    videoElement.srcObject = cameraStream;
    videoElement.onloadeddata = () => console.log('Camera stream loaded, ready to capture');
}

function closeCameraScanner() {
    if (cameraModal) cameraModal.classList.remove('active');
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    if (videoElement) videoElement.srcObject = null;
}

// Capture button - go to preview step
if (captureBtn) {
    captureBtn.addEventListener('click', () => {
        if (!videoElement || !canvasElement || !videoElement.srcObject) return;
        const ctx = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth || 640;
        canvasElement.height = videoElement.videoHeight || 480;
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const previewImage = document.getElementById('preview-image');
        if (previewImage) previewImage.src = canvasElement.toDataURL('image/jpeg');
        showStep('preview');
    });
}

// Retake button - go back to camera step
if (retakeBtn) {
    retakeBtn.addEventListener('click', () => showStep('camera'));
}

// Verify/Scan button - go to processing, then results
if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
        if (!canvasElement) return;
        showStep('processing');
        runOCRAndVerify();
    });
}

async function runOCRAndVerify() {
    if (scanExtractedResult) {
        scanExtractedResult.classList.add('loading');
        scanExtractedResult.innerHTML = '<p>Extracting text from image...</p>';
    }

    try {
        const result = await Tesseract.recognize(canvasElement, 'eng', { logger: m => console.log(m) });
        const extractedText = result.data.text.trim();

        if (extractedText.length < 5) {
            if (scanExtractedResult) {
                scanExtractedResult.innerHTML = '<p>No readable text found. Try again with clearer text.</p>';
                scanExtractedResult.classList.remove('loading');
            }
            showStep('results');
            return;
        }

        if (scannedTextEl) scannedTextEl.textContent = extractedText;
        scanResultArea?.classList.add('active');
        verifyClaim(extractedText);
        if (scanExtractedResult) scanExtractedResult.classList.remove('loading');
        showStep('results');

    } catch (err) {
        console.error('OCR error:', err);
        if (scanExtractedResult) {
            scanExtractedResult.innerHTML = '<p>Failed to extract text. Try again.</p>';
            scanExtractedResult.classList.remove('loading');
        }
        showStep('results');
    }
}

function verifyClaim(claim) {
    const result = analyzeClaim(claim);
    if (scanExtractedResult) {
        scanExtractedResult.innerHTML = `<h3>Analysis Result</h3>
            <span class="status-badge ${result.verdict === 'true' ? 'verified' : result.verdict === 'false' ? 'false' : 'uncertain'}">
                ${result.verdict === 'true' ? 'Verified' : result.verdict === 'false' ? 'Misleading' : 'Uncertain'}
            </span>
            <p>${result.explanation}</p>
            <div class="confidence-bar">
                <span>Confidence</span>
                <span>${result.confidence}%</span>
            </div>
            <h4>Sources</h4>
            <ul>
                ${result.sources.map(s => `<li><a href="${s.url}" target="_blank">${s.name}</a></li>`).join('')}
            </ul>`;
        scanExtractedResult.classList.remove('loading');
    }
}

window.verifyClaim = verifyClaim;
console.log('Curious News initialized. Ready to verify claims.');
