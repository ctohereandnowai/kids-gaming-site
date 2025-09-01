/*
  scripts.js
  - Loads branding.json, theme.json, games.json
  - Applies theme variables and font
  - Populates logo, favicon, slogan, social links, contact
  - Renders game cards
  - Starts a countdown timer

  TODO: student exercise ideas
  - Add a search/filter by game difficulty or name
  - Add dark mode toggle using CSS variables
  - Add keyboard navigation for game cards
*/

(function () {
  const els = {
    favicon: document.getElementById('favicon'),
    logo: document.getElementById('brand-logo'),
    title: document.getElementById('site-title'),
    heroTitle: document.getElementById('hero-title'),
    heroTagline: document.getElementById('hero-tagline'),
    slogan: document.getElementById('brand-slogan'),
    social: document.getElementById('social-links'),
    email: document.getElementById('contact-email'),
    mobile: document.getElementById('contact-mobile'),
    orgName: document.getElementById('org-name'),
    year: document.getElementById('year'),
    gamesGrid: document.getElementById('games-grid'),
    countdown: {
      days: document.getElementById('cd-days'),
      hours: document.getElementById('cd-hours'),
      mins: document.getElementById('cd-mins'),
      secs: document.getElementById('cd-secs'),
    },
  };

  function loadJSON(path) {
    return fetch(path).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`);
      return r.json();
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    const colors = theme?.colors || {};
    if (colors.primary) root.style.setProperty('--primary', colors.primary);
    if (colors.accent) root.style.setProperty('--accent', colors.accent);
    if (colors.bg) root.style.setProperty('--bg', colors.bg);
    if (colors.text) root.style.setProperty('--text', colors.text);
    if (colors.surface) root.style.setProperty('--surface', colors.surface);

    const font = theme?.font;
    if (font) {
      root.style.setProperty('--font', `'${font}', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      const family = encodeURIComponent(font);
      link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;600;700;800&display=swap`;
      document.head.appendChild(link);
    }
  }

  function applyBrand(brand) {
    if (!brand) return;
    const org = brand.organizationName || 'Your Organization';
    const title = brand.siteTitle || 'Kids Gaming Site';
    const logo = brand.logo?.title || brand.logo || null;
    const favicon = brand.logo?.favicon || brand.favicon || null;

    if (els.title) els.title.textContent = title;
    if (els.heroTitle) els.heroTitle.textContent = title;
    if (els.slogan && brand.slogan) els.slogan.textContent = brand.slogan;
    if (els.logo && logo) els.logo.src = logo;
    if (els.favicon && favicon) els.favicon.href = favicon;
    if (els.orgName) els.orgName.textContent = `© ${new Date().getFullYear()} ${org}`;
    if (els.year) els.year.textContent = `${new Date().getFullYear()}`;

    if (brand.contact) {
      if (els.email && brand.contact.email) {
        els.email.href = `mailto:${brand.contact.email}`;
        els.email.textContent = brand.contact.email;
      }
      if (els.mobile && brand.contact.mobile) {
        const tel = brand.contact.mobile.replace(/\s+/g, '');
        els.mobile.href = `tel:${tel}`;
        els.mobile.textContent = brand.contact.mobile;
      }
    } else {
      // Back-compat for provided branding.json structure
      if (els.email && brand.email) {
        els.email.href = `mailto:${brand.email}`;
        els.email.textContent = brand.email;
      }
      if (els.mobile && brand.mobile) {
        const tel = String(brand.mobile).replace(/\s+/g, '');
        els.mobile.href = `tel:${tel}`;
        els.mobile.textContent = brand.mobile;
      }
    }

    const social = brand.socialMedia || {};
    if (els.social && typeof els.social === 'object') {
      els.social.innerHTML = '';
      Object.entries(social).forEach(([key, url]) => {
        if (!url) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.ariaLabel = key;
        const img = document.createElement('img');
        const avatar = brand.chatbot?.avatar || brand.chatbot?.face;
        if (avatar) img.src = avatar;
        else img.src = 'assets/icons/social.png';
        img.alt = `${key} icon`;
        a.appendChild(img);
        a.appendChild(document.createTextNode(key));
        li.appendChild(a);
        els.social.appendChild(li);
      });
    }
  }

  function renderGames(games) {
    if (!Array.isArray(games) || !els.gamesGrid) return;
    els.gamesGrid.innerHTML = '';
    for (const g of games) {
      const card = document.createElement('article');
      card.className = 'card';
      card.tabIndex = 0; // basic keyboard focus
      card.setAttribute('role', 'listitem');

      const img = document.createElement('img');
      img.src = g.thumb || 'assets/images/placeholder.png';
      img.alt = `${g.name} thumbnail`;
      card.appendChild(img);

      const body = document.createElement('div');
      body.className = 'card-body';
      const h3 = document.createElement('h3');
      h3.textContent = g.name;
      const p = document.createElement('p');
      p.textContent = g.description || '';
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = g.difficulty ? `Difficulty: ${g.difficulty}` : 'Play';
      const link = document.createElement('a');
      link.className = 'btn';
      link.href = g.url || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Play Now';
      body.append(h3, p, pill, link);
      card.appendChild(body);

      els.gamesGrid.appendChild(card);
    }
  }

  function startCountdown(targetISO) {
    if (!targetISO) return;
    const target = new Date(targetISO).getTime();
    if (Number.isNaN(target)) return;
    function tick() {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      if (els.countdown.days) els.countdown.days.textContent = String(d);
      if (els.countdown.hours) els.countdown.hours.textContent = String(h).padStart(2, '0');
      if (els.countdown.mins) els.countdown.mins.textContent = String(m).padStart(2, '0');
      if (els.countdown.secs) els.countdown.secs.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  async function init() {
    try {
      const [branding, theme, gamesData] = await Promise.all([
        loadJSON('data/branding.json').catch(() => null),
        loadJSON('data/theme.json').catch(() => null),
        loadJSON('data/games.json').catch(() => null),
      ]);
      if (theme) applyTheme(theme);
      if (branding?.brand) applyBrand(branding.brand); else if (branding) applyBrand(branding);

      if (gamesData) {
        if (gamesData.siteTitle && els.title) {
          els.title.textContent = gamesData.siteTitle;
          if (els.heroTitle) els.heroTitle.textContent = gamesData.siteTitle;
        }
        if (gamesData.tagline && els.heroTagline) {
          els.heroTagline.textContent = gamesData.tagline;
        }
        if (Array.isArray(gamesData.games)) {
          renderGames(gamesData.games);
        }
        if (gamesData.countdownTarget) startCountdown(gamesData.countdownTarget);
      }
    } catch (err) {
      console.error('Initialization failed', err);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
