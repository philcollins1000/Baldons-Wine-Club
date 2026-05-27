/* =============================================
   Baldons Wine Club — Main JavaScript
   ============================================= */

/* ── Mobile nav toggle ── */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target))
        navLinks.classList.remove('open');
    });
  }

  // Mark active nav link
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
});

/* ── Google Sheets loader ── */
async function loadSheet(tabName) {
  if (!BWC_CONFIG.SHEET_ID || BWC_CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
    return null; // Not configured yet — caller should use sample data
  }
  const url = `https://docs.google.com/spreadsheets/d/${BWC_CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Sheet fetch failed');
    const csv = await res.text();
    return parseCSV(csv);
  } catch (e) {
    console.warn('Could not load Google Sheet:', e);
    return null;
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (values[i] || '').replace(/^"|"$/g, '').trim();
    });
    return obj;
  });
}

/* ── Members area password gate ── */
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkMembersPassword(inputPassword) {
  const hash = await sha256(inputPassword.toLowerCase().trim());
  return hash === BWC_CONFIG.MEMBERS_PASSWORD_HASH;
}

function initMembersGate() {
  const gate    = document.getElementById('members-gate');
  const content = document.getElementById('members-content');
  const form    = document.getElementById('password-form');
  const input   = document.getElementById('members-password');
  const error   = document.getElementById('password-error');
  if (!gate || !content) return;

  // Check session storage for already-authenticated
  if (sessionStorage.getItem('bwc-member-auth') === 'true') {
    gate.style.display    = 'none';
    content.style.display = 'block';
    return;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const ok = await checkMembersPassword(input.value);
    if (ok) {
      sessionStorage.setItem('bwc-member-auth', 'true');
      gate.style.display    = 'none';
      content.style.display = 'block';
    } else {
      error.style.display = 'block';
      input.value = '';
      input.focus();
    }
  });
}

/* ── Contact form (fake submit — works with Netlify Forms if hosted there) ── */
function initContactForm() {
  const form = document.getElementById('join-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('form-success').style.display = 'block';
    form.style.display = 'none';
  });
}

/* ── Render Events ── */
const SAMPLE_EVENTS = [
  { Date:'14 Jun 2026', Title:'Summer Rosé Evening', Venue:'The Seven Stars, Marsh Baldon', Description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A comparative tasting of six rosés from Provence and beyond.', Type:'Tasting' },
  { Date:'19 Jul 2026', Title:'Languedoc & Roussillon Night', Venue:'The Village Hall, Toot Baldon', Description:'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Six wines from southern France, matched with food.', Type:'Tasting' },
  { Date:'09 Aug 2026', Title:'Members BBQ & Bring a Bottle', Venue:'Baldon Green', Description:'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Informal summer gathering — bring your favourite bottle.', Type:'Social' },
  { Date:'13 Sep 2026', Title:'New World Cabernets', Venue:'The Seven Stars, Marsh Baldon', Description:'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', Type:'Tasting' },
  { Date:'11 Oct 2026', Title:'Bordeaux vs Napa — The Showdown', Venue:'The Seven Stars, Marsh Baldon', Description:'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', Type:'Tasting' },
  { Date:'28 Nov 2026', Title:'Christmas Wine & Cheese Evening', Venue:'The Village Hall, Toot Baldon', Description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', Type:'Social' },
];

function renderEvents(containerId, events) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = events || SAMPLE_EVENTS;
  if (!items.length) { container.innerHTML = '<p class="loading">No upcoming events found.</p>'; return; }

  container.innerHTML = items.map(ev => {
    const d = ev.Date || '';
    const parts = d.split(' ');
    const day   = parts[0] || '';
    const month = parts[1]?.substring(0,3) || '';
    const tagClass = ev.Type === 'Social' ? 'tag-social' : ev.Type === 'Trip' ? 'tag-trip' : 'tag-tasting';
    return `<div class="event-card">
      <div class="event-date"><div class="day">${day}</div><div class="month">${month}</div></div>
      <div class="event-info">
        <h3>${ev.Title}</h3>
        <p>📍 ${ev.Venue} &nbsp;·&nbsp; ${ev.Description}</p>
      </div>
      <span class="event-tag ${tagClass}">${ev.Type}</span>
    </div>`;
  }).join('');
}

async function loadAndRenderEvents(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '<p class="loading">Loading events</p>';
  const data = await loadSheet('Events');
  renderEvents(containerId, data);
}

/* ── Render Wines ── */
const SAMPLE_WINES = [
  { Name:"Château Lorem Ipsum", Region:"Bordeaux, France", Grape:"Cabernet Sauvignon / Merlot", Year:"2020", Rating:"★★★★☆", Price:"£22", BuyLink:"#", Notes:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Structured and elegant with dark fruit and cedar." },
  { Name:"Dolor Sit Amet Reserva", Region:"Rioja, Spain", Grape:"Tempranillo", Year:"2019", Rating:"★★★★★", Price:"£18", BuyLink:"#", Notes:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium." },
  { Name:"Adipiscing Elit Blanc", Region:"Burgundy, France", Grape:"Chardonnay", Year:"2021", Rating:"★★★★☆", Price:"£26", BuyLink:"#", Notes:"Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam." },
  { Name:"Consectetur Pinot Noir", Region:"Central Otago, NZ", Grape:"Pinot Noir", Year:"2022", Rating:"★★★★☆", Price:"£28", BuyLink:"#", Notes:"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit." },
  { Name:"Eiusmod Tempor Rosé", Region:"Provence, France", Grape:"Grenache / Cinsault", Year:"2023", Rating:"★★★★☆", Price:"£16", BuyLink:"#", Notes:"Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae." },
  { Name:"Incididunt Ut Labore", Region:"Mendoza, Argentina", Grape:"Malbec", Year:"2021", Rating:"★★★☆☆", Price:"£14", BuyLink:"#", Notes:"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium." },
];

function renderWines(containerId, wines) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = wines || SAMPLE_WINES;
  container.innerHTML = items.map(w => `
    <div class="card wine-card">
      <div class="card-body">
        <span class="wine-region">${w.Region}</span>
        <h3>${w.Name}</h3>
        <div class="subtitle">${w.Grape} · ${w.Year}</div>
        <div class="rating">${w.Rating}</div>
        <p>${w.Notes}</p>
        <div class="price">${w.Price}</div>
        ${w.BuyLink && w.BuyLink !== '#' ? `<a href="${w.BuyLink}" class="buy-link" target="_blank">Where to buy →</a>` : ''}
      </div>
    </div>`).join('');
}

async function loadAndRenderWines(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '<p class="loading">Loading wine library</p>';
  const data = await loadSheet('Wines');
  renderWines(containerId, data);
}
