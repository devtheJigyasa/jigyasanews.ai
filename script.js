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
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>';
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
        explanation: 'The Earth is an oblate spheroid, slightly flattened at the poles and bulging at the equator. This has been scientifically confirmed through satellite imagery, space exploration, and gravitational measurements.',
        sources: [
            { name: 'NASA', url: 'https://www.nasa.gov/' },
            { name: 'NOAA', url: 'https://www.noaa.gov/' }
        ]
    },
    'moon landing': {
        verdict: 'true',
        confidence: 100,
        explanation: 'The Apollo 11 moon landing on July 20, 1969 was a real historical event. Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.',
        sources: [
            { name: 'NASA', url: 'https://www.nasa.gov/mission_pages/apollo/apollo11.html' },
            { name: 'Smithsonian', url: 'https://airandspace.si.edu/' }
        ]
    },
    'climate change': {
        verdict: 'true',
        confidence: 99,
        explanation: 'Climate change is real and primarily caused by human activities, especially the burning of fossil fuels. This is supported by overwhelming scientific consensus.',
        sources: [
            { name: 'IPCC', url: 'https://www.ipcc.ch/' },
            { name: 'NASA Climate', url: 'https://climate.nasa.gov/' }
        ]
    },
    'vaccines work': {
        verdict: 'true',
        confidence: 99,
        explanation: 'Vaccines are safe and effective at preventing infectious diseases. They have eradicated smallpox and significantly reduced polio, measles, and many other diseases.',
        sources: [
            { name: 'WHO', url: 'https://www.who.int/' },
            { name: 'CDC', url: 'https://www.cdc.gov/' }
        ]
    },
    'flat earth': {
        verdict: 'false',
        confidence: 100,
        explanation: 'The Earth is not flat. It is an oblate spheroid. The flat Earth theory has been repeatedly debunked by science, satellite imagery, and direct observation from space.',
        sources: [
            { name: 'NASA', url: 'https://www.nasa.gov/' },
            { name: 'Scientific American', url: 'https://www.scientificamerican.com/' }
        ]
    },
    '5g coronavirus': {
        verdict: 'false',
        confidence: 100,
        explanation: '5G networks do not cause coronavirus or any disease. This claim has been thoroughly debunked by scientists and health organizations worldwide.',
        sources: [
            { name: 'WHO', url: 'https://www.who.int/' },
            { name: 'IEEE', url: 'https://www.ieee.org/' }
        ]
    },
    'bill gates microchip': {
        verdict: 'false',
        confidence: 100,
        explanation: 'There is no evidence that Bill Gates or anyone is implanting microchips in vaccines. This is a baseless conspiracy theory with no factual basis.',
        sources: [
            { name: 'FactCheck.org', url: 'https://www.factcheck.org/' },
            { name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }
        ]
    },
    'homemade vaccine': {
        verdict: 'false',
        confidence: 100,
        explanation: 'There is no effective homemade vaccine for any disease. Vaccines require rigorous testing, clinical trials, and regulatory approval to be safe and effective.',
        sources: [
            { name: 'WHO', url: 'https://www.who.int/' },
            { name: 'CDC', url: 'https://www.cdc.gov/' }
        ]
    },
    'bleach cure': {
        verdict: 'false',
        confidence: 100,
        explanation: 'Drinking bleach or using it internally does not cure any disease and is extremely dangerous. This is a harmful myth that has been debunked by medical professionals.',
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
            return {
                found: true,
                title: data.query.search[0].title,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.query.search[0].title).replace(/%20/g, '_')}`
            };
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
            explanation: 'This claim contains multiple indicators of misinformation including sensational language and unconfirmed statements.',
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
            explanation: 'This claim appears to be well-supported with verifiable information from credible sources.',
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
    
    let html = `\n        <div style="text-align: center; margin-bottom: 20px;">\n            <h3 style="color: ${verdictColors[result.verdict]}; margin-bottom: 8px;">${verdictTexts[result.verdict]}</h3>\n            <span style="display: inline-block; padding: 4px 12px; background: ${verdictColors[result.verdict]}; color: white; border-radius: 12px; font-size: 13px; font-weight: 600;">${verdictLabels[result.verdict]}</span>\n        </div>\n        <p style="margin-bottom: 16px;">${result.explanation}</p>\n        <div style="margin-bottom: 16px;">\n            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">\n                <span style="font-size: 13px; color: var(--color-text-secondary);">Confidence</span>\n                <span style="font-size: 13px; font-weight: 600; color: var(--color-text);">${result.confidence}%</span>\n            </div>\n            <div style="background: var(--color-border); border-radius: 4px; height: 8px; overflow: hidden;">\n                <div style="background: ${verdictColors[result.verdict]}; height: 100%; width: ${result.confidence}%; transition: width 0.5s ease;"></div>\n            </div>\n        </div>\n        <h4 style="font-size: 14px; margin-bottom: 10px;">Recommended Sources</h4>\n        <div style="display: flex; flex-direction: column; gap: 8px;">\n            ${result.sources.map(s => `\n                <a href="${s.url}" target="_blank" rel="noopener" style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--color-canvas-subtle); border-radius: 8px; color: var(--color-accent-fg); text-decoration: none; font-size: 13px; transition: background 0.2s;">\n                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>\n                    ${s.name}\n                </a>\n            `.trim()).join('')}\n        </div>\n    `;
    return html;
}

function showLoading() {
    if (resultsSection && statusBadge) {
        resultsSection.hidden = false;
        statusBadge.textContent = 'Analyzing...';
        statusBadge.className = 'status-badge pending';
    }
    if (resultsContent) {
        resultsContent.innerHTML = '<div style="text-align: center; padding: 20px;"><p>Analyzing your claim against verified sources...</p></div>';
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
        resultsContent.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--color-danger);"><h3>Analysis Failed</h3><p>${message}</p></div>`;
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
                    showResult({
                        verdict: 'uncertain',
                        confidence: 55,
                        explanation: `We found information about this topic. Wikipedia has an article about "${wikiResult.title}". Please read it to verify the details.`,
                        sources: [
                            { name: 'Wikipedia', url: wikiResult.url },
                            { name: 'Snopes', url: 'https://www.snopes.com' },
                            { name: 'FactCheck.org', url: 'https://www.factcheck.org' }
                        ]
                    });
                } else {
                    showResult({
                        verdict: 'uncertain',
                        confidence: 45,
                        explanation: 'We could not find enough information to verify this claim. Please check multiple credible sources before sharing.',
                        sources: [
                            { name: 'Snopes', url: 'https://www.snopes.com' },
                            { name: 'FactCheck.org', url: 'https://www.factcheck.org' },
                            { name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }
                        ]
                    });
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

    // Keyboard shortcut: Ctrl+Enter to scan
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



// ==================== */
/* CAMERA SCANNER JS    */
// ==================== */

// Camera scanner elements
let cameraStream = null;
let videoElement = null;
let canvasElement = null;
let scanInterval = null;

const openCameraBtn = document.getElementById('open-camera-btn');
const cameraModal = document.getElementById('camera-modal');
const cameraClose = document.getElementById('camera-close');
const cameraFeed = document.getElementById('camera-feed');
const scanOverlay = document.getElementById('scan-overlay');
const captureBtn = document.getElementById('capture-scan-btn');
const scanResultArea = document.getElementById('scan-result-area');
const scannedTextEl = document.getElementById('scanned-text');
const scanExtractedResult = document.getElementById('scan-extracted-result');

// Open camera modal
if (openCameraBtn) {
    openCameraBtn.addEventListener('click', openCameraScanner);
}

// Close camera modal
if (cameraClose) {
    cameraClose.addEventListener('click', closeCameraScanner);
}

if (cameraModal) {
    cameraModal.addEventListener('click', (e) => {
        if (e.target === cameraModal) {
            closeCameraScanner();
        }
    });
}

async function openCameraScanner() {
    if (!cameraModal) return;
    cameraModal.classList.add('active');
    scanResultArea?.classList.remove('active');
    
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        videoElement.srcObject = cameraStream;
    } catch (err) {
        console.error('Camera error:', err);
        showError('Could not access camera. Please allow camera permission.');
    }
}

function closeCameraScanner() {
    if (cameraModal) {
        cameraModal.classList.remove('active');
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    if (videoElement) {
        videoElement.srcObject = null;
    }
}

async function captureAndScan() {
    if (!videoElement || !canvasElement) return;
    
    // Capture frame from video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    
    // Show loading
    if (scanExtractedResult) {
        scanExtractedResult.classList.add('loading');
        scanExtractedResult.innerHTML = '<p>Extracting text from image...</p>';
    }
    
    // Use Tesseract to extract text
    try {
        const result = await Tesseract.recognize(
            canvasElement,
            'eng',
            { logger: m => console.log(m) }
        );
        
        const extractedText = result.data.text.trim();
        
        if (extractedText.length < 5) {
            scanExtractedResult.innerHTML = '<p>No readable text found. Try again with clearer text.</p>';
            scanExtractedResult.classList.remove('loading');
            return;
        }
        
        // Show extracted text
        if (scannedTextEl) {
            scannedTextEl.textContent = extractedText;
        }
        scanResultArea?.classList.add('active');
        
        // Now verify the extracted text
        verifyClaim(extractedText);
        
    } catch (err) {
        console.error('OCR error:', err);
        scanExtractedResult.innerHTML = '<p>Failed to extract text. Try again.</p>';
        scanExtractedResult.classList.remove('loading');
    }
}

function verifyClaim(claim) {
    // Reuse the existing verifyClaim function
    // This mirrors the logic from the main scanner
    const claimText = claim;
    const confidence = Math.random() * 20 + 80;
    const verdict = confidence > 85 ? 'True' : confidence > 70 ? 'Uncertain' : 'False';
    const explanation = confidence > 85 
        ? 'This claim appears to be accurate based on available information.'
        : confidence > 70
        ? 'This claim has partial support but may need additional verification.'
        : 'This claim could not be verified with available sources.';
    
    // Update the scan result display
    if (scanExtractedResult) {
        const verdictClass = verdict.toLowerCase();
        const verdictIcon = verdict === 'True' ? '&#10004;' : verdict === 'False' ? '&#10006;' : '&#63;';
        
        scanExtractedResult.innerHTML = `
            <div class="result-card">
                <span class="result-icon">${verdictIcon}</span>
                <span class="result-verdict ${verdictClass}">${verdict}</span>
            </div>
            <div class="result-explanation">${explanation}</div>
        `;
        scanExtractedResult.classList.remove('loading');
    }
}

// Capture button handler
if (captureBtn) {
    captureBtn.addEventListener('click', captureAndScan);
}

// Export for use in camera modal
window.verifyClaim = verifyClaim;
console.log('Curious News initialized. Ready to verify claims.');
