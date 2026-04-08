const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');
const input = document.getElementById('claimInput');
const count = document.getElementById('charCount');
const scanBtn = document.getElementById('scanBtn');

let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
root.setAttribute('data-theme', theme);

function renderThemeIcon(mode) {
  toggle.innerHTML = mode === 'dark'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

renderThemeIcon(theme);

toggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);
  renderThemeIcon(theme);
});

input.addEventListener('input', () => {
  count.textContent = input.value.length;
});

scanBtn.addEventListener('click', () => {
  if (!input.value.trim()) {
    alert('Paste a claim first.');
    input.focus();
    return;
  }
  alert('Connect this button to your API or backend inside script.js.');
});
