const fs = require('fs');

let css = fs.readFileSync('css/styles.css', 'utf8');

const fontHeader = `@import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300;400;500;600;700;800&family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&display=swap');

@font-face {
  font-family: 'funnel';
  src: url('/fonts/FunnelDisplay-s.p.2xty_ze311ap2.woff2') format('woff2');
  font-display: swap;
  font-weight: 300 800;
}

@font-face {
  font-family: 'Funnel Display';
  src: url('/fonts/FunnelDisplay-s.p.2xty_ze311ap2.woff2') format('woff2');
  font-display: swap;
  font-weight: 300 800;
}

@font-face {
  font-family: 'geist';
  src: url('/fonts/Geist-s.p.2xgg6xh-upisd.woff2') format('woff2');
  font-display: swap;
  font-weight: 300 800;
}

@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-s.p.2xgg6xh-upisd.woff2') format('woff2');
  font-display: swap;
  font-weight: 300 800;
}

@font-face {
  font-family: 'geistMono';
  src: url('/fonts/GeistMono-s.p.1r21m8mjt8-gs.woff2') format('woff2');
  font-display: swap;
  font-weight: 300 800;
}

@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMono-s.p.1r21m8mjt8-gs.woff2') format('woff2');
  font-display: swap;
  font-weight: 300 800;
}

:root {
  --font-funnel: 'Funnel Display', 'funnel', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-geist: 'Geist', 'geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', 'geistMono', ui-monospace, SFMono-Regular, monospace;
  --font-display: var(--font-funnel);
  --font-sans: var(--font-geist);
  --font-mono: var(--font-geist-mono);
}

html, body {
  font-family: var(--font-sans) !important;
}

.font-display, .display-xl, .display-l, .display-m, h1, h2, h3, .font-funnel {
  font-family: var(--font-display) !important;
}

.font-sans, p, span, a, label, input, select, button, .font-geist {
  font-family: var(--font-sans);
}

.font-mono, .num, code, pre, .font-geist-mono {
  font-family: var(--font-mono) !important;
}
`;

// Prepend to CSS
css = fontHeader + '\n' + css;

fs.writeFileSync('css/styles.css', css);
console.log('css/styles.css patched with Funnel and Geist font families.');
