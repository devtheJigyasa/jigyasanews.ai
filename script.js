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
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2m0 14v2m7-9h2M3 12h2m13.36-6.36l-1.42 1.42M6.06 17.94l-1.42 1.42M18 18l-1.42-1.42M6.06 6.06L4.64 4.64"></path><circle cx="12" cy="12" r="5"></circle></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
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
