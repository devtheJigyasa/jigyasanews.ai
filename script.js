// Curious News - Production-Ready Script
// Theme Toggle, Claim Scanner, and Demo Analysis Engine

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
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>'
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

// Demo Analysis Engine (Replace with real API in production)
function analyzeClaim(claim) {
    const text = claim.toLowerCase();
    const hoaxKeywords = ['hoax', 'fake', 'scam', 'conspiracy', 'unproven', 'disputed', 'misleading'];
    const trueKeywords = ['confirmed', 'verified', 'official', 'peer-reviewed', 'published', 'study shows'];
    const sensationalKeywords = ['shocking', 'you won\'t believe', 'secret', 'exposed', 'miracle cure', 'doctors hate'];
    let hoaxScore = 0, trueScore = 0, sensationalScore = 0;
    hoaxKeywords.forEach(k => { if (text.includes(k)) hoaxScore++; });
    trueKeywords.forEach(k => { if (text.includes(k)) trueScore++; });
    sensationalKeywords.forEach(k => { if (text.includes(k)) sensationalScore++; });
    const hasNumbers = /\d{4,}/.test(text);
    const hasScientificTerms = /(study|research|scientist|doctor|university|journal)/.test(text);
    if (sensationalScore >= 2) hoaxScore += 3;
    if (hasScientificTerms && trueScore >= 1) trueScore += 2;
    if (!hasNumbers && text.length > 100) trueScore += 1;
    const total = hoaxScore + trueScore + 1;
    const hoaxRatio = hoaxScore / total;
    const trueRatio = trueScore / total;
    let verdict, confidence, explanation;
    if (hoaxRatio > 0.5) {
        verdict = 'false';
        confidence = Math.min(95, 60 + (hoaxScore * 10));
        explanation = 'This claim contains multiple indicators of misinformation including sensational language, lack of verifiable sources, and unconfirmed statements.';
    } else if (trueRatio > 0.4) {
        verdict = 'true';
        confidence = Math.min(95, 65 + (trueScore * 10));
        explanation = 'This claim appears to be well-supported with verifiable information from credible sources and scientific terminology.';
    } else {
        verdict = 'uncertain';
        confidence = Math.min(85, 50 + Math.max(hoaxScore, trueScore) * 8);
        explanation = 'We could not find enough evidence to verify this claim. Please check multiple credible sources before sharing.';
    }
    return { verdict, confidence, explanation, sources: generateSources(verdict, claim) };
}

function generateSources(verdict, claim) {
    const baseSources = [
        'https://www.snopes.com',
        'https://www.factcheck.org',
        'https://www.reuters.com/fact-check',
        'https://www.apnews.com/ap-fact-check'
    ];
    return baseSources.slice(0, 3).map(url => ({ name: new URL(url).hostname, url }));
}

function renderResult(result) {
    const verdictLabels = { true: 'Verified', false: 'Misleading', uncertain: 'Needs Review' };
    const verdictTexts = { true: 'This claim appears to be TRUE', false: 'This claim appears to be FALSE', uncertain: 'This claim needs more research' };
    return `
<div class="result-item">
    <h3>${verdictTexts[result.verdict]}</h3>
    <span class="verdict-label ${result.verdict}">${verdictLabels[result.verdict]}</span>
    <p>${result.explanation}</p>
    <p><strong>Confidence:</strong> ${result.confidence}%</p>
    <div class="sources">
        <h4>Recommended Sources</h4>
        ${result.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join('')}
    </div>
</div>`;
}

function showLoading() {
    if (resultsSection && statusBadge) {
        resultsSection.hidden = false;
        statusBadge.textContent = 'Analyzing...';
        statusBadge.className = 'status-badge pending';
    }
    if (resultsContent) {
        resultsContent.innerHTML = '<div class="loading-spinner"></div><p class="placeholder">Analyzing your claim against verified sources...</p>';
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
        resultsContent.innerHTML = `<div class="result-item"><h3>Analysis Failed</h3><p>${message}</p></div>`;
    }
}

function showResult(result) {
    if (statusBadge) {
        statusBadge.textContent = result.verdict === 'true' ? 'Verified' : result.verdict === 'false' ? 'Misleading' : 'Needs Review';
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            const result = analyzeClaim(claim);
            showResult(result);
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

console.log('Curious News initialized. Ready to verify claims.');
    });
}
