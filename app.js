"use strict";

/* ── Space-Efficient Data Sources (Google Sheets) ─────────── */
// Each language has 4 CSV exports from Google Sheets:
//   gid=0  sentences.csv
//   gid=1  words.csv  
//   gid=2  sentence_words.csv
//   gid=3  pos_index.json (or CSV if Sheets can't do JSON)
//
// Replace these placeholder URLs with your actual Google Sheets pub URLs.
// To get a URL: File → Share → Publish to web → Select sheet/tab → CSV
//
// For multiple tabs in one sheet, use &gid=0, &gid=1, etc. or separate sheets.

const LANG_DATA_SOURCES = {
  'DE': {
    name: 'Deutsch',
    sentences: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS2VCQobR8YGI0tBQWwexNYG6eEiclg2O3KQMX9CLbSVj9oX2Rx0i6fz4XFNferqY-7aApz4ivCUgKq/pub?output=csv',
    words: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlwssNy7fhucoeoyHYNNsXs7AiZs_EsLUmq-Hpc6s20iDk2LbVWjd_08Bb1wX367G1yznL1LGv9Xb8/pub?output=csv',
    sentenceWords: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0cjsmE38l96p-VEqMATnN25t2hhTKN2S3No6Y4Kbj0Q3RkW3bgcZZ3FAkDrinAUIEc_4qxpeQezl1/pub?output=csv',
    posIndex: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2gYPs4Q_lR_dBiVzZSAsgbvyhcCHkCzP2UjB3vVafv1M2Jmc8nKrrMKNMb462T6z1FMUzuJ6E466l/pub?output=csv',
  },
  'FR': {
    name: 'French',
    sentences: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZ8p79vfAVYsWcE3VAEBDAkkaKy1ZC8flRAAR0FMBz1azCp145E_KhCjoka0bLGfazr5BcHHyn2Jfm/pub?output=csv',
    words: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTI_y3PL1nC6KM6oiUy8Q2z6GjQhOzxnOrKyXCB7ysynjN4jo3vhJUyBMmELwlKtPfHZerdyFGu_cuU/pub?output=csv',
    sentenceWords: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6K1Yp03fv__ldDQtr-GcwvEecQxIZiIYOZx7LkpDjLaaQ2CHppUFLT_BL4TXq0xTrThSF7TXPVTQQ/pub?output=csv',
    posIndex: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsnZ4W8aj7sLZth5UdDvzP4LoTY9h-Bi20cCKA8S0O3bUPuFCEbZCFbvTjv9Ev3JM49C_Ejxxx-v5K/pub?output=csv',
  },
  'IT': {
    name: 'Italian',
    sentences: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlB0oV3OPAv48ljUqpR_aSa2WH8diTt1sm0Vji2fW-AykWQRMXxqZNmD0z2sYfD_nt-xlAMWe3kwDD/pub?output=csv',
    words: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRc-N3xfLgX3A8UDm0__CVRRVXgupLgySKTlVAdQnKbJNf9Tv4gqRSaylPQroL21AYr14V6KOsbjjd/pub?output=csv',
    sentenceWords: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSxhsU80RQfWvirUpjria4-E7KpPz_j8bF9Tb79od3xzDd5lZQdcOsSMBOUlPioqciXLRPrH9PXi2v8/pub?output=csv',
    posIndex: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTgqtQgI_oZt7r1gfPAzUOkT2Aj8Ie34cpdIRiAuw3iHugrf6A3_eo65E8ChKgR8GgQLjHUUEqw2aDt/pub?output=csv',
  },
  'ES': {
    name: 'Español',
    sentences: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKNbx_l2zcMpAS0YN2k7JXg8hM_ENMM4eYKcxvYpeEAHxmEGJLEMRl-Y31ZNHU4WSQ0VOEPBtzil1d/pub?output=csv',
    words: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQtbrJWCNQBAPGOUu5ej3RkooGphJ2IpjohDJAzrWxwpnAGvPeAVg0pqynwdYxQFwvhz8YT3bC0Tlo/pub?output=csv',
    sentenceWords: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTAxcVfOqjOdotbyQzwxmXFvZGptJsNcBrllI7miz_tKdWhb_oWsJ2osna7fmsHKUea2vIkaIIE-m4s/pub?output=csv',
    posIndex: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAMrTiGWInXN9e7v9H3T4-qUimdQ9aQQk74T2aaDcWzKJq9835EKqPecPO5G6FeU5A6CHEWutq45oi/pub?output=csv',
  },
  'PT': {
    name: 'Português',
    sentences: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSneWHHtCt-nQt9svB8yb9lXkw_2pNer3nZ-a8Eji6MVC2n6Gu3vtwHo_yKjHmzH1MKMuRno6vkghTZ/pub?output=csv',
    words: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQAJVjbD9bexujwFojzb11IF63X3SkZGYYWlbp_2gmcAZdlsBxWkGlmKY2nu1-PQSlC-bgq303Yhb2m/pub?output=csv',
    sentenceWords: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9YgLdPbWOc0vOOCifOqBeHY2aJFpbvCgQnkfFS6oWBfLm3MsxVpCnrwIMmpKksHDFbhRwuUkZJILQ/pub?output=csv',
    posIndex: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRr7Cy_reAOC8-NL_FOc2joWuGwNlye_HMQfHU3Y5CPvKNB-5N54UC0tqLZDQWYeS5HNbXk8gDASErK/pub?output=csv',
  },
  /*
  'PL': {
    name: 'Polish',
    sentences: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ88aFAyS-LHKYeuYMauRuMubDRNA0dBpjnupVRURmgz412-eNBMM48joJn5SKKQrK9qatdkTXkQNKm/pub?output=csv',
    words: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDx2G-Y5SgXhf1m8QtbQju20wqcqZptfA5B7LEU3FxZ4nFjY2BdOvH6Wje-UlI2TO50d23-6P5FFkV/pub?output=csv',
    sentenceWords: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFM5c8dfN-EVVTE_I4Prsb1WWPWMKza-J4-lCjTSvENBCx3eOKx_npibYVr201ePIYSY4q5UI8XaB7/pub?output=csv',
    posIndex: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs_7GwDScMFY92Leh_KUpXoupX4CWqDMiiovHFoFlFPvGg48DDjta_k3cgc2Kkz9kRrxDNsRSCRNS3/pub?output=csv',
  },
  */
};

/* ── Language Feature Availability ──────────────────────── */
// Which filters/features are available per language
const LANG_FEATURES = {
  'DE': { has_two_way_prep: true, separable_verb: true, genitive_attr: true, adj_declension: true, reflexive_verb: true },
  'ES': { has_two_way_prep: false, separable_verb: false, genitive_attr: false, adj_declension: false, reflexive_verb: true },
  'FR': { has_two_way_prep: false, separable_verb: false, genitive_attr: false, adj_declension: false, reflexive_verb: true },
  'IT': { has_two_way_prep: false, separable_verb: false, genitive_attr: false, adj_declension: false, reflexive_verb: true },
  'PL': { has_two_way_prep: false, separable_verb: false, genitive_attr: false, adj_declension: true, reflexive_verb: true },
  'PT': { has_two_way_prep: false, separable_verb: false, genitive_attr: false, adj_declension: false, reflexive_verb: true },
  'ZH': { has_two_way_prep: false, separable_verb: false, genitive_attr: false, adj_declension: false, reflexive_verb: false },
};

function getCurrentLangFeatures() {
  if (S.lang === 'All' || !LANG_FEATURES[S.lang]) {
    // If All or unknown, show all filters (let data decide)
    return { has_two_way_prep: true, separable_verb: true, genitive_attr: true, adj_declension: true, reflexive_verb: true };
  }
  return LANG_FEATURES[S.lang];
}

/* ── State ──────────────────────────────────────────────── */
const S = {
  allRows: [], filtered: [], pool: [], poolIndex: 0,
  languages: [], categories: [],
  lang: 'DE', level: 'All',
  source: 'DE',
  autoPlay: true, presMode: false, presRevealed: false,
  creatorFlip: 'mix', currentFlip: false, flipMap: {}, revealed: false, randomize: true,
  theme: 'hammerhead', fontSize: 22,
  keyReveal: ' ', keyNext: 'ArrowRight', keyPrev: 'ArrowLeft', keyTTS: 's',
  customVars: {}, ttsVoice: '',
  wordStyles: { NOUN: 'underline', VERB: 'dotted' },
  // New filter state
  filterMode: 'topic',
  filterSelections: {
    topic: ['All'],
    grammar: ['All'],
    sentence_type: ['All'],
    inclusions: ['All'],
    adj_declension: ['All'],
    verb_frame: ['All']
  }
};

const ALL_FILTER_MODES = [
  { key: 'topic', label: 'Topic', always: true },
  { key: 'grammar', label: 'Grammar', always: true },
  { key: 'sentence_type', label: 'Sentence Type', always: true },
  { key: 'inclusions', label: 'Inclusions', always: true },
  { key: 'adj_declension', label: 'Adj. Declension', always: false, langKey: 'adj_declension' },
  { key: 'verb_frame', label: 'Verb Frame', always: true },
];

const ALL_INCLUSION_OPTIONS = [
  { key: 'has_two_way_prep', label: 'Two-way Preposition', langKey: 'has_two_way_prep' },
  { key: 'separable_verb', label: 'Separable Verb', langKey: 'separable_verb' },
  { key: 'reflexive_verb', label: 'Reflexive Verb', langKey: 'reflexive_verb' },
  { key: 'genitive_attr', label: 'Genitive Attribute', langKey: 'genitive_attr' }
];

function getFilterModes() {
  const features = getCurrentLangFeatures();
  return ALL_FILTER_MODES.filter(m => m.always || features[m.langKey]);
}

function getInclusionOptions() {
  const features = getCurrentLangFeatures();
  return ALL_INCLUSION_OPTIONS.filter(o => features[o.langKey]);
}

// Backward compat aliases
const FILTER_MODES = ALL_FILTER_MODES;
const INCLUSION_OPTIONS = ALL_INCLUSION_OPTIONS;

const COLOR_VARS = [
  { key: '--bg', label: 'Background' },
  { key: '--bg2', label: 'Background 2' },
  { key: '--bg3', label: 'Background 3' },
  { key: '--border', label: 'Border' },
  { key: '--text', label: 'Text' },
  { key: '--text-dim', label: 'Text Dim' },
  { key: '--head', label: 'Heading' },
  { key: '--accent', label: 'Accent' },
  { key: '--card-bg', label: 'Card BG' },
  { key: '--card-border', label: 'Card Border' },
];

/* ── DOM ─────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

$('hamburger-btn').addEventListener('click', () => {
  $('topbar-drawer').classList.toggle('open');
});

$$('#font-btns .font-btn').forEach(b => b.addEventListener('click', () => {
  S.fontFamily = b.dataset.font;
  $$('#font-btns .font-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  if (S.fontFamily === 'inherit') {
    document.documentElement.style.removeProperty('--sans');
    document.documentElement.style.removeProperty('--mono');
  } else {
    document.documentElement.style.setProperty('--sans', S.fontFamily);
    document.documentElement.style.setProperty('--mono', S.fontFamily);
  }
  saveSettings();
}));

/* ── Cursor (GSAP) ──────────────────────────────────────── */
function initCursor() {
  const cur = $('cursor');
  if (!cur || !window.gsap) return;
  const onMove = e => gsap.to(cur, { x: e.clientX, y: e.clientY, duration: 0.25, ease: 'power2.out' });
  const onOver = e => { if (e.target.closest('a,button,.customcursor')) cur.classList.add('cursor--hover'); };
  const onOut = e => { if (e.target.closest('a,button,.customcursor')) cur.classList.remove('cursor--hover'); };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('pointerover', onOver);
  window.addEventListener('pointerout', onOut);
}

/* ── Settings scrollbar auto-hide ───────────────────────── */
function initSettingsScroll() {
  const panel = $('settings-panel'); if (!panel) return;
  let timer;
  panel.addEventListener('scroll', () => {
    panel.classList.add('scrolling');
    clearTimeout(timer);
    timer = setTimeout(() => panel.classList.remove('scrolling'), 800);
  });
}

/* ── Custom dropdowns ───────────────────────────────────── */
function makeDropdown(containerId, options, current, onChange) {
  const wrap = $(containerId);
  if (!wrap) return;
  wrap.innerHTML = '';

  const btn = document.createElement('div');
  btn.className = 'custom-select-btn';
  btn.innerHTML = `<span class="csd-label">${current}</span><span class="custom-select-arrow">▾</span>`;

  const list = document.createElement('div');
  list.className = 'custom-select-list';

  options.forEach(opt => {
    const item = document.createElement('div');
    item.className = 'custom-select-option' + (opt === current ? ' selected' : '');
    item.textContent = opt;
    item.addEventListener('click', e => {
      e.stopPropagation();
      list.querySelectorAll('.custom-select-option').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      btn.querySelector('.csd-label').textContent = opt;
      list.classList.remove('open');
      btn.classList.remove('open');
      onChange(opt);
    });
    list.appendChild(item);
  });

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = list.classList.contains('open');
    $$('.custom-select-list.open').forEach(l => l.classList.remove('open'));
    $$('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
    if (!isOpen) { list.classList.add('open'); btn.classList.add('open'); }
  });

  wrap.appendChild(btn);
  wrap.appendChild(list);
}

// close dropdowns when clicking outside
document.addEventListener('click', () => {
  $$('.custom-select-list.open').forEach(l => l.classList.remove('open'));
  $$('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
});

/* ── Scramble ────────────────────────────────────────────── */
const CHARS = 'αβγδεζηθλμνξπρστυφχψωΔΣΩ'.split('');
function scrambleTick(el, target, frame, total, cb) {
  if (frame >= total) { el.textContent = target; cb && cb(); return; }
  el.textContent = target.split('').map((ch, i) =>
    i < Math.floor(frame / total * target.length)
      ? ch : ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('');
  requestAnimationFrame(() => scrambleTick(el, target, frame + 1, total, cb));
}
function scramble(el, text, ms, cb) {
  el.classList.add('scrambling');
  scrambleTick(el, text, 0, Math.round((ms || 360) / 16), () => {
    el.classList.remove('scrambling'); cb && cb();
  });
}

/* ── IndexedDB Cache ─────────────────────────────────────── */
const DB_NAME = 'lexloom_cache';
const DB_VERSION = 1;
const STORE_NAME = 'csv_cache';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'source' });
      }
    };
  });
}

async function getCachedCSV(source) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(source);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

async function setCachedCSV(source, text, version) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ source, text, version, timestamp: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error('Cache save failed:', e);
  }
}

/* ── CSV ─────────────────────────────────────────────────── */
function splitCSV(line) {
  const r = []; let cur = '', q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { r.push(cur); cur = ''; }
    else cur += ch;
  }
  r.push(cur); return r;
}

function parseCSV(text) {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true
  });

  return result.data
    .map(row => {
      const clean = {};
      Object.entries(row).forEach(([k, v]) => {
        const key = String(k)
          .trim()
          .toLowerCase()
          .replace(/^\uFEFF/, '');
        clean[key] = typeof v === 'string' ? v.trim() : v;
      });
      return clean;
    })
    .filter(r => r.language && r.level && r.english && r.translation && r.category);
}

/* ── Space-Efficient Load ───────────────────────────────── */
/* ── Language Data Cache (IndexedDB) ────────────────────── */
const LANG_DB_NAME = 'lexloom_lang_cache';
const LANG_DB_VERSION = 1;
const LANG_STORE = 'lang_data';

function openLangDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LANG_DB_NAME, LANG_DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(LANG_STORE)) {
        db.createObjectStore(LANG_STORE, { keyPath: 'key' });
      }
    };
  });
}

async function getLangCache(key) {
  try {
    const db = await openLangDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(LANG_STORE, 'readonly');
      const store = tx.objectStore(LANG_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) { return null; }
}

async function setLangCache(key, text, timestamp) {
  try {
    const db = await openLangDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(LANG_STORE, 'readwrite');
      const store = tx.objectStore(LANG_STORE);
      const req = store.put({ key, text, timestamp });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) { console.error('Cache save failed:', e); }
}

async function clearLangCache(lang) {
  try {
    const db = await openLangDB();
    const tx = db.transaction(LANG_STORE, 'readwrite');
    const store = tx.objectStore(LANG_STORE);
    const keys = [`${lang}_sentences`, `${lang}_words`, `${lang}_sentenceWords`, `${lang}_posIndex`];
    for (const k of keys) store.delete(k);
  } catch (e) { console.error('Cache clear failed:', e); }
}

/* ── Fast spinner helper ────────────────────────────────── */
const SPINNER_CHARS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
function startSpinner(msg) {
  let i = 0;
  const interval = setInterval(() => {
    i = (i + 1) % SPINNER_CHARS.length;
    setLoadStatus(`${msg} ${SPINNER_CHARS[i]}`);
  }, 80);
  return interval;
}
function stopSpinner(interval) {
  if (interval) clearInterval(interval);
}

/* ── Fetch with cache-first strategy ────────────────────── */
async function fetchWithCache(url, cacheKey, actionName) {
  // Check IndexedDB cache first
  const cached = await getLangCache(cacheKey);
  if (cached && cached.text) {
    return { text: cached.text, fromCache: true };
  }

  // Not cached — fetch from network
  const spinner = startSpinner(`${actionName}`);
  try {
    const resp = await fetch(url);
    stopSpinner(spinner);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    if (text.trim().startsWith('<')) throw new Error('got HTML, not CSV — check sharing permissions');
    // Save to cache
    await setLangCache(cacheKey, text, Date.now());
    return { text, fromCache: false };
  } catch (e) {
    stopSpinner(spinner);
    throw e;
  }
}

/* ── Load language data with full caching ───────────────── */
async function loadLanguageData(lang) {
  const config = LANG_DATA_SOURCES[lang];
  if (!config) throw new Error(`No data source for ${lang}`);

  // Clear all filters FIRST so UI is responsive while loading
  clearAllFilters();

  setLoadStatus(`Checking cache for ${config.name}...`);

  try {
    // 1. Load words (cache-first)
    const wordsResult = await fetchWithCache(config.words, `${lang}_words`, `Downloading ${config.name} words`);
    if (wordsResult.fromCache) {
      setLoadStatus(`Loading ${config.name} words from cache ⠿`);
    } else {
      setLoadStatus(`Downloaded ${config.name} words ✓`);
    }

    // 2. Load sentence-word mappings (cache-first)
    const swResult = await fetchWithCache(config.sentenceWords, `${lang}_sentenceWords`, `Downloading ${config.name} links`);
    if (swResult.fromCache) {
      setLoadStatus(`Loading ${config.name} links from cache ⠿`);
    } else {
      setLoadStatus(`Downloaded ${config.name} links ✓`);
    }

    // 3. Load POS index (cache-first, optional)
    let posText = null;
    if (config.posIndex) {
      try {
        const posResult = await fetchWithCache(config.posIndex, `${lang}_posIndex`, `Downloading ${config.name} index`);
        posText = posResult.text;
        if (posResult.fromCache) {
          setLoadStatus(`Loading ${config.name} index from cache ⠿`);
        } else {
          setLoadStatus(`Downloaded ${config.name} index ✓`);
        }
      } catch (e) {
        console.warn('POS index unavailable:', e.message);
      }
    }

    // 4. Parse word data into SpaceEfficientLoader
    setLoadStatus(`Parsing ${config.name} dictionary.`);
    await new Promise(r => setTimeout(r, 10)); // let UI update

    SpaceEfficientLoader.wordsCache.clear();
    const wordsRows = SpaceEfficientLoader.parseCSV(wordsResult.text);
    for (const row of wordsRows) {
      SpaceEfficientLoader.wordsCache.set(parseInt(row.word_id), {
        word_id: parseInt(row.word_id),
        lemma: row.lemma,
        text: row.text,
        pos: row.pos,
        genders: SpaceEfficientLoader.safeJSON(row.genders),
        meanings: SpaceEfficientLoader.safeJSON(row.meanings),
        case: row.case || '',
        tense: row.tense || '',
        person: row.person || '',
        number: row.number || '',
        gender: row.gender || '',
      });
    }

    // 5. Parse sentence-word mappings
    SpaceEfficientLoader.sentenceWordsCache.clear();
    const swRows = SpaceEfficientLoader.parseCSV(swResult.text);
    for (const row of swRows) {
      const sid = parseInt(row.sentence_id);
      if (!SpaceEfficientLoader.sentenceWordsCache.has(sid)) {
        SpaceEfficientLoader.sentenceWordsCache.set(sid, []);
      }
      SpaceEfficientLoader.sentenceWordsCache.get(sid).push({
        word_id: parseInt(row.word_id),
        token_index: parseInt(row.token_index),
        token_text: row.token_text,
      });
    }

    // 6. Parse POS index
    SpaceEfficientLoader.posIndex = {};
    if (posText) {
      try {
        if (posText.trim().startsWith('{')) {
          SpaceEfficientLoader.posIndex = JSON.parse(posText);
        } else {
          const rows = SpaceEfficientLoader.parseCSV(posText);
          rows.forEach(row => {
            const pos = row.pos || row[Object.keys(row)[0]];
            const ids = Object.values(row).slice(1).filter(v => v).map(v => parseInt(v)).filter(n => !isNaN(n));
            if (pos) SpaceEfficientLoader.posIndex[pos] = ids;
          });
        }
      } catch (e) {
        console.warn('POS index parse failed:', e.message);
      }
    }

    SpaceEfficientLoader.enabled = true;
    console.log(`[SpaceEfficient] ${config.name}: ${SpaceEfficientLoader.wordsCache.size} words, ${SpaceEfficientLoader.sentenceWordsCache.size} sentences`);

    // 7. Load sentences CSV (cache-first)
    const sentResult = await fetchWithCache(config.sentences, `${lang}_sentences`, `Downloading ${config.name} sentences`);
    if (sentResult.fromCache) {
      setLoadStatus(`Loading ${config.name} sentences from cache ⠿`);
    } else {
      setLoadStatus(`Downloaded ${config.name} sentences ✓`);
    }

    // 8. Parse sentences
    const parseSpinner = startSpinner(`Parsing ${config.name} sentences`);
    await new Promise(r => setTimeout(r, 50));

    const sentences = SpaceEfficientLoader.parseCSV(sentResult.text);
    stopSpinner(parseSpinner);

    if (!sentences.length) throw new Error('no sentences');

    // 9. Merge with word data
    S.allRows = sentences.map((row, idx) => {
      const sid = parseInt(row.sentence_id !== undefined ? row.sentence_id : idx);
      const wordData = SpaceEfficientLoader.getWordData(sid);
      return {
        ...row,
        language: lang,
        word_data: wordData.length ? JSON.stringify(wordData) : '[]',
      };
    });

    setLoadStatus(`Loaded ${S.allRows.length.toLocaleString()} sentences for ${config.name}`);
    afterLoad();
    setTimeout(hideLoadStatus, 2000);

  } catch (e) {
    setLoadStatus(`Load failed: ${e.message}`);
    setTimeout(hideLoadStatus, 4000);
    throw e;
  }
}

// Backward compat: loadCSV now delegates to loadLanguageData
async function loadCSV(url, source) {
  // source is now the language code directly
  return loadLanguageData(source);
}

function setLoadStatus(msg) {
  const el = $('load-status');
  el.textContent = msg;
  el.style.display = 'block';
}

function hideLoadStatus() {
  $('load-status').style.display = 'none';
}

function afterLoad() {
  buildLangDropdown();
  buildLevelDropdown();
  buildFilterModeDropdown();
  applyFilters();
  buildFilterChips();
  buildPool();
  renderCard();
}

/* ── Language handling ──────────────────────────────────── */
async function handleLanguageChange(newLang) {
  const oldLang = S.lang;
  S.lang = newLang;

  // Load new language data if different from current
  if (LANG_DATA_SOURCES[newLang] && newLang !== oldLang) {
    try {
      await loadLanguageData(newLang);
      // loadLanguageData already calls clearAllFilters() + afterLoad()
    } catch (err) {
      console.error(err);
      S.lang = oldLang;
      alert('Failed to load data for ' + newLang);
    }
  } else {
    applyFilters();
    buildPool();
    renderCard();
  }

  $('flip-label').textContent = getFlipLabel();
  saveSettings();
}

/* ── Filters ─────────────────────────────────────────────── */
function buildLangDropdown() {
  const langs = Object.keys(LANG_DATA_SOURCES);
  const current = S.lang;
  makeDropdown('lang-dropdown', langs, current, val => {
    handleLanguageChange(val);
  });
  // Mobile version
  const mobileLang = $('lang-dropdown-mobile');
  if (mobileLang) {
    makeDropdown('lang-dropdown-mobile', langs, current, val => {
      handleLanguageChange(val);
    });
  }
}

function buildLevelDropdown() {
  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  makeDropdown('level-dropdown', levels, S.level, val => {
    S.level = val; applyFilters(); buildPool(); renderCard();
  });
  // Mobile version
  const mobileLevel = $('level-dropdown-mobile');
  if (mobileLevel) {
    makeDropdown('level-dropdown-mobile', levels, S.level, val => {
      S.level = val; applyFilters(); buildPool(); renderCard();
    });
  }
}

/* ── Filter Mode Dropdown ───────────────────────────────── */
function buildFilterModeDropdown() {
  const modes = getFilterModes();
  const options = modes.map(m => m.label);
  // If current mode is not available for this language, reset to topic
  const currentMode = modes.find(m => m.key === S.filterMode);
  if (!currentMode) {
    S.filterMode = 'topic';
  }
  const current = modes.find(m => m.key === S.filterMode)?.label || 'Topic';
  makeDropdown('filter-mode-dropdown', options, current, val => {
    const mode = modes.find(m => m.label === val)?.key || 'topic';
    S.filterMode = mode;
    buildFilterChips();
    applyFilters();
    buildPool();
    renderCard();
  });
}

/* ── Clear All Filters ──────────────────────────────────── */
function clearAllFilters() {
  S.filterSelections = {
    topic: ['All'],
    grammar: ['All'],
    sentence_type: ['All'],
    inclusions: ['All'],
    adj_declension: ['All'],
    verb_frame: ['All']
  };
  // Don't reset language, only reset level
  S.level = 'All';
  buildLevelDropdown();
  buildFilterChips();
  applyFilters();
  buildPool();
  renderCard();
  saveSettings();
}

/* ── Filter Chips ───────────────────────────────────────── */
function getFilterValues(mode) {
  switch (mode) {
    case 'topic':
      return [...new Set(S.allRows.map(r => r.category))].filter(Boolean).sort();
    case 'grammar':
      return [...new Set(S.allRows.map(r => r.grammar).filter(Boolean)
        .flatMap(g => g.split('|').map(s => s.trim()))
      )].sort();
    case 'sentence_type':
      return [...new Set(S.allRows.map(r => r.sentence_type))].filter(Boolean)
        .map(v => capitalizeWords(v)).sort();
    case 'inclusions':
      return getInclusionOptions().map(o => o.label);
    case 'adj_declension':
      return [...new Set(S.allRows.map(r => r.adj_declension))].filter(Boolean)
        .map(v => capitalizeWords(v.replace(/_/g, ' '))).sort();
    case 'verb_frame':
      return [...new Set(S.allRows.map(r => r.verb_frame))].filter(Boolean)
        .map(v => capitalizeWords(v.replace(/_/g, ' '))).sort();
    default:
      return [];
  }
}

function capitalizeWords(str) {
  if (!str) return '';
  return str.split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function buildFilterChips() {
  const mode = S.filterMode;
  const values = getFilterValues(mode);
  const bar = $('cat-chips');
  const currentSelections = S.filterSelections[mode];

  let html = `<button class="chip ${currentSelections.includes('All') ? 'active' : ''}" data-val="All">All</button>`;

  values.forEach(val => {
    if (!val) return;
    const isActive = currentSelections.includes(val);
    html += `<button class="chip ${isActive ? 'active' : ''}" data-val="${esc(val)}">${esc(val)}</button>`;
  });

  bar.innerHTML = html;

  bar.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
    const val = b.dataset.val;
    const sel = S.filterSelections[mode];

    if (val === 'All') {
      S.filterSelections[mode] = ['All'];
    } else {
      S.filterSelections[mode] = sel.filter(c => c !== 'All');
      if (S.filterSelections[mode].includes(val)) {
        S.filterSelections[mode] = S.filterSelections[mode].filter(c => c !== val);
      } else {
        S.filterSelections[mode].push(val);
      }
      if (!S.filterSelections[mode].length) S.filterSelections[mode] = ['All'];
    }

    syncFilterChips();
    applyFilters();
    buildPool();
    renderCard();
  }));

  updateActiveFiltersSummary();
  updateClearButton();
}

function syncFilterChips() {
  const mode = S.filterMode;
  const sel = S.filterSelections[mode];
  $$('#cat-chips .chip').forEach(b => {
    const val = b.dataset.val;
    const isActive = sel.includes('All') ? val === 'All' : sel.includes(val);
    b.classList.toggle('active', isActive);
  });
  updateActiveFiltersSummary();
  updateClearButton();
}

function updateClearButton() {
  const wrap = $('filter-mode-wrap');
  if (!wrap) return;

  let btn = $('clear-filters-btn');
  const hasFilters = Object.values(S.filterSelections).some(sel => !sel.includes('All')) || S.level !== 'All';

  if (hasFilters) {
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'clear-filters-btn';
      btn.className = 'clear-filters-btn';
      btn.textContent = '✕ Clear';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        clearAllFilters();
      });
      wrap.appendChild(btn);
    }
    btn.style.display = 'inline-flex';
  } else if (btn) {
    btn.style.display = 'none';
  }
}

function updateActiveFiltersSummary() {
  const summary = $('active-filters-summary');
  if (!summary) return;

  const activeFilters = [];

  if (S.level !== 'All') activeFilters.push(`Level: ${S.level}`);

  Object.entries(S.filterSelections).forEach(([mode, vals]) => {
    if (!vals.includes('All')) {
      const modeLabel = FILTER_MODES.find(m => m.key === mode)?.label || mode;
      vals.forEach(v => activeFilters.push(`${modeLabel}: ${v}`));
    }
  });

  if (activeFilters.length === 0) {
    summary.innerHTML = '';
  } else {
    summary.innerHTML = activeFilters.map(f => `<span class="active-filter-tag">${f}</span>`).join('');
  }
}

function applyFilters() {
  let r = S.allRows;

  // Language filter
  if (S.lang !== 'All') r = r.filter(x => x.language === S.lang);

  // Level filter
  if (S.level !== 'All') r = r.filter(x => x.level === S.level);

  // Topic filter (was category)
  if (!S.filterSelections.topic.includes('All')) {
    r = r.filter(x => S.filterSelections.topic.includes(x.category));
  }

  // Grammar filter
  if (!S.filterSelections.grammar.includes('All')) {
    r = r.filter(x => {
      if (!x.grammar) return false;
      const grammars = x.grammar.split('|').map(s => s.trim());
      return S.filterSelections.grammar.some(g => grammars.includes(g));
    });
  }

  // Sentence type filter
  if (!S.filterSelections.sentence_type.includes('All')) {
    r = r.filter(x => {
      const val = capitalizeWords(x.sentence_type || '');
      return S.filterSelections.sentence_type.includes(val);
    });
  }

  // Inclusions filter (boolean columns) — only check available features
  if (!S.filterSelections.inclusions.includes('All')) {
    const availableOptions = getInclusionOptions();
    r = r.filter(x => {
      return S.filterSelections.inclusions.some(incLabel => {
        const option = availableOptions.find(o => o.label === incLabel);
        if (!option) return false;
        const val = x[option.key];
        const strVal = String(val).toLowerCase().trim();
        return strVal === 'true' || strVal === '1' || strVal === 'yes';
      });
    });
  }

  // Adjective declension filter
  if (!S.filterSelections.adj_declension.includes('All')) {
    r = r.filter(x => {
      const val = capitalizeWords((x.adj_declension || '').replace(/_/g, ' '));
      return S.filterSelections.adj_declension.includes(val);
    });
  }

  // Verb frame filter
  if (!S.filterSelections.verb_frame.includes('All')) {
    r = r.filter(x => {
      const val = capitalizeWords((x.verb_frame || '').replace(/_/g, ' '));
      return S.filterSelections.verb_frame.includes(val);
    });
  }

  S.filtered = r;
  updateStats();
}

function updateStats() {
  const statsEl = $('stats-text');
  if (!statsEl) return;

  if (!S.filtered.length) {
    statsEl.innerHTML = '';
    return;
  }

  const filtersAreActive = Object.values(S.filterSelections).some(sel => !sel.includes('All')) || S.level !== 'All' || S.lang !== 'All';
  const mode = S.filterMode;

  // Always show available count for the current filter mode (total unique values)
  let uniqueCount = 0;
  let label = 'Topics';

  switch (mode) {
    case 'topic':
      uniqueCount = new Set(S.allRows.map(r => r.category)).size;
      label = 'Topics';
      break;
    case 'grammar':
      uniqueCount = new Set(S.allRows.map(r => r.grammar).filter(Boolean)
        .flatMap(g => g.split('|').map(s => s.trim()))).size;
      label = 'Grammar Types';
      break;
    case 'sentence_type':
      uniqueCount = new Set(S.allRows.map(r => r.sentence_type)).size;
      label = 'Sentence Types';
      break;
    case 'inclusions':
      uniqueCount = getInclusionOptions().length;
      label = 'Inclusions';
      break;
    case 'adj_declension':
      uniqueCount = new Set(S.allRows.map(r => r.adj_declension)).size;
      label = 'Declensions';
      break;
    case 'verb_frame':
      uniqueCount = new Set(S.allRows.map(r => r.verb_frame)).size;
      label = 'Verb Frames';
      break;
  }

  if (filtersAreActive) {
    statsEl.innerHTML = `<span>${S.filtered.length.toLocaleString()}</span> Sentences Selected &nbsp;·&nbsp; <span>${uniqueCount}</span> ${label} Available`;
  } else {
    statsEl.innerHTML = `<span>${S.filtered.length.toLocaleString()}</span> Sentences &nbsp;·&nbsp; <span>${uniqueCount}</span> ${label} Available`;
  }
}

/* ── Pool ────────────────────────────────────────────────── */
function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; }
  return b;
}
function buildPool() {
  S.pool = S.randomize ? shuffle(S.filtered) : [...S.filtered];
  S.poolIndex = 0;
  const offset = Math.random() < 0.5 ? 0 : 1;
  S.flipMap = {};
  let i = 0;
  while (i < S.pool.length) {
    const run = Math.random() < 1 ? 1 : 2;
    const val = (i + offset) % 2 === 0;
    for (let j = 0; j < run && i < S.pool.length; j++, i++) S.flipMap[i] = val;
  }
}

function currentRow() { return S.pool[S.poolIndex] || null; }

/* ── Word Data Parsing ───────────────────────────────────── */
function parseWordData(row) {
  if (!row.word_data) return [];
  try {
    const data = JSON.parse(row.word_data);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function getWordStyleClass(pos) {
  const style = S.wordStyles[pos] || '';
  if (!style) return '';
  return `word-${style}`;
}

// Build a comprehensive word map with multiple matching strategies
function buildWordMap(wordData) {
  const map = new Map();

  wordData.forEach(wd => {
    const lemma = (wd.lemma || wd.text || '').toLowerCase().trim();
    const text = (wd.text || '').toLowerCase().trim();
    if (!lemma && !text) return;

    const forms = new Set();

    if (lemma) forms.add(lemma);
    if (text) forms.add(text);

    // German-specific: handle common inflections
    if (lemma) {
      forms.add(lemma);

      const stem = lemma
        .replace(/en$/, '')
        .replace(/n$/, '')
        .replace(/e$/, '')
        .replace(/er$/, '')
        .replace(/es$/, '')
        .replace(/em$/, '')
        .replace(/t$/, '')
        .replace(/st$/, '')
        .replace(/te$/, '')
        .replace(/test$/, '')
        .replace(/ten$/, '')
        .replace(/tet$/, '')
        .replace(/et$/, '')
        .replace(/est$/, '')
        .replace(/ete$/, '')
        .replace(/etet$/, '')
        .replace(/e$/, '')
        .replace(/t$/, '')
        .replace(/st$/, '')
        .replace(/e$/, '');

      if (stem && stem.length >= 2 && stem !== lemma) {
        forms.add(stem);
      }
    }

    // Also add without umlauts for broader matching
    forms.forEach(form => {
      const normalized = form
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ß/g, 'ss');
      if (normalized !== form) forms.add(normalized);
    });

    // Store all forms pointing to this word data
    forms.forEach(form => {
      if (form.length >= 2) {
        map.set(form, wd);
      }
    });
  });

  return map;
}

function buildWordHTML(text, wordData) {
  if (!wordData || !wordData.length) return esc(text);

  const wordMap = buildWordMap(wordData);

  // Split text into words and punctuation - keep delimiters
  const tokens = text.split(/(\s+|[.,!?;:"'()\-])/);

  return tokens.map(token => {
    if (!token.trim()) return esc(token);

    // Clean token for matching - remove punctuation and normalize
    const cleanToken = token.toLowerCase()
      .replace(/[^a-zäöüßáéíóúñç]/gi, '');

    if (!cleanToken) return esc(token);

    // Try exact match first
    let wordInfo = wordMap.get(cleanToken);

    // Try stem match (remove common endings)
    if (!wordInfo) {
      const stem = cleanToken
        .replace(/en$/, '')
        .replace(/n$/, '')
        .replace(/e$/, '')
        .replace(/er$/, '')
        .replace(/es$/, '')
        .replace(/em$/, '')
        .replace(/t$/, '')
        .replace(/st$/, '')
        .replace(/te$/, '')
        .replace(/test$/, '')
        .replace(/ten$/, '')
        .replace(/tet$/, '')
        .replace(/et$/, '')
        .replace(/est$/, '')
        .replace(/ete$/, '')
        .replace(/etet$/, '')
        .replace(/e$/, '');

      if (stem && stem.length >= 2) {
        wordInfo = wordMap.get(stem);
      }
    }

    // Try without umlauts
    if (!wordInfo) {
      const normalized = cleanToken
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ß/g, 'ss');
      wordInfo = wordMap.get(normalized);
    }

    if (wordInfo) {
      const pos = wordInfo.pos || '';
      const styleClass = getWordStyleClass(pos);
      const tooltipData = JSON.stringify(wordInfo).replace(/"/g, '&quot;');
      return `<span class="word-token ${styleClass}" data-word="${tooltipData}">${esc(token)}</span>`;
    }

    return esc(token);
  }).join('');
}

function attachWordHoverEvents(container) {
  if (!container) return;
  container.querySelectorAll('.word-token').forEach(token => {
    token.addEventListener('mouseenter', e => {
      try {
        const data = JSON.parse(token.dataset.word);
        showWordTooltip(e, data);
      } catch (err) { }
    });
    token.addEventListener('mouseleave', hideWordTooltip);
  });
}

function showWordTooltip(e, wordData) {
  const tooltip = $('word-tooltip');
  if (!tooltip || !wordData) return;

  let content = '';

  if (wordData.pos === 'NOUN') {
    const genders = wordData.genders || [];
    const genderStr = genders.map(g => {
      const map = { m: '♂ m', f: '♀ f', n: '⚲ n' };
      return map[g] || g;
    }).join(', ');

    const meanings = (wordData.meanings || []).slice(0, 5);
    const caseStr = wordData.case ? `<div class="tt-case">Case: ${wordData.case}</div>` : '';

    content = `
      <div class="tt-header">
        <span class="tt-pos noun">NOUN</span>
        ${genderStr ? `<span class="tt-gender">${genderStr}</span>` : ''}
      </div>
      <div class="tt-lemma">${esc(wordData.lemma || wordData.text)}</div>
      ${caseStr}
      <div class="tt-meanings">
        ${meanings.map((m, i) => `<div class="tt-meaning">${i + 1}. ${esc(m)}</div>`).join('')}
      </div>
    `;
  } else if (wordData.pos === 'VERB') {
    const meanings = (wordData.meanings || []).slice(0, 5);
    const tense = wordData.tense ? `<div class="tt-tense">Tense: ${esc(wordData.tense)}</div>` : '';

    content = `
      <div class="tt-header">
        <span class="tt-pos verb">VERB</span>
      </div>
      <div class="tt-lemma">${esc(wordData.lemma || wordData.text)}</div>
      ${tense}
      <div class="tt-meanings">
        ${meanings.map((m, i) => `<div class="tt-meaning">${i + 1}. ${esc(m)}</div>`).join('')}
      </div>
    `;
  } else {
    const meanings = (wordData.meanings || []).slice(0, 5);
    content = `
      <div class="tt-header">
        <span class="tt-pos">${esc(wordData.pos || 'WORD')}</span>
      </div>
      <div class="tt-lemma">${esc(wordData.lemma || wordData.text)}</div>
      <div class="tt-meanings">
        ${meanings.map((m, i) => `<div class="tt-meaning">${i + 1}. ${esc(m)}</div>`).join('')}
      </div>
    `;
  }

  tooltip.innerHTML = content;
  tooltip.classList.add('active');

  // Position tooltip with viewport awareness
  requestAnimationFrame(() => {
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = rect.left;
    let top = rect.bottom + 8;

    // Keep tooltip within viewport horizontally
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (left < 10) left = 10;

    // If tooltip goes below viewport, show above instead
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = rect.top - tooltipRect.height - 8;
    }
    if (top < 10) top = rect.bottom + 8;

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  });
}

function hideWordTooltip() {
  const tooltip = $('word-tooltip');
  if (tooltip) tooltip.classList.remove('active');
}

/* ── Card ────────────────────────────────────────────────── */
function renderCard() {
  const row = currentRow(), grid = $('cards-grid');
  S.revealed = false;
  if (!row) { grid.innerHTML = ''; $('empty-state').classList.add('active'); return; }
  $('empty-state').classList.remove('active');

  const showTarget = S.currentFlip !== undefined ? S.currentFlip : S.creatorFlip === true;
  const primary = showTarget ? row.translation : row.english;
  const secondary = showTarget ? row.english : row.translation;

  const wordData = parseWordData(row);
  const primaryHTML = buildWordHTML(primary, wordData);
  const secondaryHTML = buildWordHTML(secondary, wordData);

  grid.innerHTML = `
    <div class="card" id="main-card">
      <div class="card-meta">
        <span class="card-level">${esc(row.level)}</span>
        <span>${esc(row.category)}</span>
        <span>${esc(row.language)}</span>
      </div>
      <div class="card-primary" id="card-primary" style="font-size:${S.fontSize}px"></div>
      <div class="card-secondary hidden" id="card-secondary" style="font-size:${S.fontSize}px">&nbsp;</div>
      <div class="card-hint" id="card-hint">Click to reveal</div>
      <button class="card-tts" id="card-tts-btn" title="Speak">
        <svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      </button>
    </div>`;

  // Set the HTML content with word tokens
  const cardPrimary = $('card-primary');
  const cardSecondary = $('card-secondary');

  cardPrimary.innerHTML = primaryHTML;
  attachWordHoverEvents(cardPrimary);

  // Store secondary HTML for reveal
  cardSecondary.dataset.html = secondaryHTML;

  // Scramble the primary text (plain text, then restore HTML)
  scramble(cardPrimary, primary, 400, () => {
    cardPrimary.innerHTML = primaryHTML;
    attachWordHoverEvents(cardPrimary);
  });

  $('main-card').addEventListener('click', e => { if (!e.target.closest('#card-tts-btn')) revealCard(); });
  $('card-tts-btn').addEventListener('click', e => { e.stopPropagation(); speakCurrent(); });
  if (S.presMode) renderPresCard();
}

function revealCard() {
  if (S.revealed) return;
  S.revealed = true;
  const row = currentRow(); if (!row) return;
  const showTarget = S.currentFlip !== undefined ? S.currentFlip : S.creatorFlip === true;
  const secondary = showTarget ? row.english : row.translation;
  const secondaryHTML = $('card-secondary').dataset.html || esc(secondary);

  const sec = $('card-secondary');
  sec.classList.remove('hidden');
  sec.innerHTML = secondaryHTML;

  // Attach hover events to revealed text
  attachWordHoverEvents(sec);

  scramble(sec, secondary, 360, () => {
    sec.innerHTML = secondaryHTML;
    attachWordHoverEvents(sec);
    if (S.autoPlay) speak(row.translation, row.language);
  });
  $('main-card').classList.add('revealed');
  $('card-hint').textContent = '';
}

function goNext() {
  if (!S.pool.length) return;
  S.poolIndex = (S.poolIndex + 1) % S.pool.length;
  if (S.creatorFlip === 'mix' && S.flipMap[S.poolIndex] === undefined)
    S.flipMap[S.poolIndex] = Math.random() < 0.5;
  S.currentFlip = S.creatorFlip === 'mix' ? S.flipMap[S.poolIndex] : S.creatorFlip === true;
  renderCard();
}
function goPrev() {
  if (!S.pool.length) return;
  S.poolIndex = (S.poolIndex - 1 + S.pool.length) % S.pool.length;
  S.currentFlip = S.creatorFlip === 'mix' ? (S.flipMap[S.poolIndex] ?? Math.random() < 0.5) : S.creatorFlip === true;
  renderCard();
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── TTS ─────────────────────────────────────────────────── */
const LANG_MAP = { German: 'de', French: 'fr', Polish: 'pl', Spanish: 'es', Italian: 'it', Japanese: 'ja' };
let allVoices = [];

function loadVoices() {
  allVoices = speechSynthesis.getVoices();
  populateVoiceSelect();
}
if (window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function populateVoiceSelect() {
  const sel = $('tts-voice-select'); if (!sel) return;
  const row = currentRow();
  const langCode = row ? (LANG_MAP[row.language] || '') : '';
  const relevant = allVoices.filter(v => !langCode || v.lang.toLowerCase().startsWith(langCode));
  const pool = relevant.length ? relevant : allVoices;
  sel.innerHTML = '<option value="">Default</option>';
  pool.forEach((v, i) => {
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    if (v.name === S.ttsVoice) opt.selected = true;
    sel.appendChild(opt);
  });
}

function speak(text, lang) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (S.ttsVoice) {
    const v = allVoices.find(v => v.name === S.ttsVoice);
    if (v) u.voice = v;
  }
  const code = LANG_MAP[lang] || 'de';
  u.lang = allVoices.find(v => v.name === S.ttsVoice)?.lang || code + '-' + code.toUpperCase();
  speechSynthesis.speak(u);
}
function speakCurrent() {
  const row = currentRow(); if (!row) return;
  speak(row.translation, row.language);
}

/* ── Present mode ────────────────────────────────────────── */
function enterPres() {
  S.presMode = true; S.presRevealed = false;
  $('presentation-mode').classList.add('active');
  $('streamer-btn').classList.add('active');
  $('streamer-btn-desktop').classList.add('active');
  S.currentFlip = S.creatorFlip === 'mix' ? S.flipMap[S.poolIndex] : S.creatorFlip === true;
  renderPresCard();
}
function exitPres() {
  S.presMode = false;
  $('presentation-mode').classList.remove('active');
  $('streamer-btn').classList.remove('active');
  $('streamer-btn-desktop').classList.remove('active');
}
function renderPresCard() {
  const row = currentRow(); if (!row) return;
  const showTarget = S.currentFlip !== undefined ? S.currentFlip : S.creatorFlip === true;
  const primary = showTarget ? row.translation : row.english;
  const secondary = showTarget ? row.english : row.translation;
  const pPrim = $('pres-primary'), pSec = $('pres-secondary');

  const wordData = parseWordData(row);
  const primaryHTML = buildWordHTML(primary, wordData);
  const secondaryHTML = buildWordHTML(secondary, wordData);

  $('pres-meta').innerHTML = `
  <div style="display:flex;gap:24px">
    <span class="pres-level">${esc(row.level)}</span>
    <span>${esc(row.language)}</span>
  </div>
  <div>${esc(row.category)}</div>`;

  // Set HTML with word tokens for primary
  pPrim.innerHTML = primaryHTML;
  attachWordHoverEvents(pPrim);

  // Store secondary for reveal - keep truly hidden until reveal
  pSec.dataset.html = secondaryHTML;
  pSec.classList.add('hidden');
  pSec.innerHTML = '&nbsp;';
  pSec.style.opacity = '0';

  S.presRevealed = false;
  pPrim.style.fontSize = S.fontSize + 'px';
  pSec.style.fontSize = S.fontSize + 'px';
  $('pres-progress-bar').style.width = ((S.poolIndex + 1) / S.pool.length * 100) + '%';
}

function presReveal() {
  if (S.presRevealed) return;
  S.presRevealed = true;
  const row = currentRow(); if (!row) return;
  const pSec = $('pres-secondary');
  const secondaryHTML = pSec.dataset.html || '';
  const showTarget = S.currentFlip !== undefined ? S.currentFlip : S.creatorFlip === true;
  const secondary = showTarget ? row.english : row.translation;

  pSec.classList.remove('hidden');
  pSec.style.opacity = '1';
  pSec.innerHTML = secondaryHTML;
  attachWordHoverEvents(pSec);

  scramble(pSec, secondary, 360, () => {
    pSec.innerHTML = secondaryHTML;
    attachWordHoverEvents(pSec);
    if (S.autoPlay) speak(row.translation, row.language);
  });
}
function presNext() {
  S.presRevealed = false;
  goNext();
  renderPresCard();
}
function presPrev() {
  S.presRevealed = false;
  goPrev();
  renderPresCard();
}

/* ── Mute toggle ─────────────────────────────────────────── */
const ICON_ON = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
const ICON_OFF = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
function syncMuteBtn() {
  $('mute-icon').innerHTML = S.autoPlay ? ICON_ON : ICON_OFF;
  $('mute-btn').classList.toggle('active', !S.autoPlay);
  $('mute-btn').title = S.autoPlay ? 'Auto-play ON' : 'Auto-play OFF';
  const muteBtnMobile = $('mute-btn-mobile');
  if (muteBtnMobile) {
    muteBtnMobile.classList.toggle('active', !S.autoPlay);
    muteBtnMobile.title = S.autoPlay ? 'Auto-play ON' : 'Auto-play OFF';
    const mobileIcon = muteBtnMobile.querySelector('svg');
    if (mobileIcon) mobileIcon.innerHTML = S.autoPlay ? ICON_ON : ICON_OFF;
  }
}

/* ── Theme ───────────────────────────────────────────────── */
function applyTheme(name) {
  S.theme = name;
  document.documentElement.dataset.theme = name;
  $$('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.theme === name));
  syncColorPickers();
  saveSettings();
}

/* ── Font size ───────────────────────────────────────────── */
function applyFontSize(px) {
  S.fontSize = Math.max(8, Math.min(72, parseInt(px) || 22));
  $$('.fs-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.fs) === S.fontSize));
  const known = [14, 18, 22, 26];
  const ci = $('fs-custom-input');
  if (known.includes(S.fontSize)) ci.value = '';
  else ci.value = S.fontSize;
  renderCard();
  saveSettings();
}

/* ── Color pickers ───────────────────────────────────────── */
function buildColorPickers() {
  const grid = $('color-grid'); if (!grid) return;
  grid.innerHTML = '';
  COLOR_VARS.forEach(({ key, label }) => {
    const row = document.createElement('div');
    row.className = 'color-row';
    const swatchId = 'sw' + key.replace(/--/g, '').replace(/-/g, '_');
    row.innerHTML = `
      <span class="color-label">${label}</span>
      <div class="color-swatch" id="${swatchId}">
        <input type="color" data-var="${key}"/>
      </div>
      <input type="text" class="color-hex" data-var="${key}" maxlength="7" placeholder="#000000"/>`;
    grid.appendChild(row);
    const picker = row.querySelector('input[type=color]');
    const hexEl = row.querySelector('.color-hex');
    const swatch = row.querySelector('.color-swatch');
    picker.addEventListener('input', () => {
      hexEl.value = picker.value.toUpperCase();
      swatch.style.background = picker.value;
      setCustomVar(key, picker.value);
    });
    hexEl.addEventListener('change', () => {
      const v = normalizeHex(hexEl.value); if (!v) return;
      hexEl.value = v.toUpperCase(); picker.value = v;
      swatch.style.background = v; setCustomVar(key, v);
    });
  });
}

function syncColorPickers() {
  const computed = getComputedStyle(document.documentElement);
  COLOR_VARS.forEach(({ key }) => {
    const raw = computed.getPropertyValue(key).trim();
    const hex = cssToHex(raw) || '#000000';
    const swatchId = 'sw' + key.replace(/--/g, '').replace(/-/g, '_');
    const sw = $(swatchId); if (!sw) return;
    sw.style.background = S.customVars[key] || hex;
    const picker = sw.querySelector('input[type=color]');
    const hexEl = sw.parentElement.querySelector('.color-hex');
    const finalHex = S.customVars[key] || hex;
    if (picker) picker.value = finalHex;
    if (hexEl) hexEl.value = finalHex.toUpperCase();
  });
}

function setCustomVar(key, value, save = true) {
  document.documentElement.style.setProperty(key, value);
  S.customVars[key] = value;
  if (save) saveSettings();
}
function resetCustomVars() {
  COLOR_VARS.forEach(({ key }) => document.documentElement.style.removeProperty(key));
  S.customVars = {};
  syncColorPickers();
  saveSettings();
}
function normalizeHex(val) {
  val = val.trim().replace(/^#/, '');
  if (val.length === 3) val = val.split('').map(c => c + c).join('');
  if (val.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(val)) return null;
  return '#' + val;
}
function cssToHex(color) {
  if (!color) return null;
  color = color.trim();
  if (color.startsWith('#')) return normalizeHex(color);
  const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return null;
}

/* ── Word Style Settings ────────────────────────────────── */
function buildWordStyleSettings() {
  $$('.word-style-select').forEach(sel => {
    const pos = sel.dataset.pos;
    if (S.wordStyles[pos]) sel.value = S.wordStyles[pos];

    sel.addEventListener('change', () => {
      S.wordStyles[pos] = sel.value;
      saveSettings();
      renderCard();
    });
  });
}

function syncWordStyleSettings() {
  $$('.word-style-select').forEach(sel => {
    const pos = sel.dataset.pos;
    sel.value = S.wordStyles[pos] || '';
  });
}

/* ── Settings persist ────────────────────────────────────── */
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('ll_v3') || '{}');
    if (s.theme) applyTheme(s.theme); else applyTheme('hammerhead');
    if (s.fontSize) S.fontSize = s.fontSize;
    if (s.keyReveal !== undefined) S.keyReveal = s.keyReveal;
    if (s.keyNext !== undefined) S.keyNext = s.keyNext;
    if (s.keyPrev !== undefined) S.keyPrev = s.keyPrev;
    if (s.keyTTS !== undefined) S.keyTTS = s.keyTTS;
    if (s.randomize !== undefined) S.randomize = s.randomize;
    if (s.autoPlay !== undefined) S.autoPlay = s.autoPlay;
    if (s.ttsVoice !== undefined) S.ttsVoice = s.ttsVoice;
    if (s.customVars) {
      S.customVars = s.customVars;
      Object.entries(S.customVars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    }
    if (s.wordStyles) {
      S.wordStyles = s.wordStyles;
    } else {
      S.wordStyles = { NOUN: 'underline', VERB: 'dotted', ADJ: 'wavy' };
    }
    if (s.filterSelections) {
      S.filterSelections = { ...S.filterSelections, ...s.filterSelections };
    }
    if (s.filterMode) {
      S.filterMode = s.filterMode;
    }
    if (s.lang) {
      S.lang = s.lang;
    }
    if (s.level) {
      S.level = s.level;
    }
  } catch (e) { applyTheme('hammerhead'); }
}
function saveSettings() {
  localStorage.setItem('ll_v3', JSON.stringify({
    theme: S.theme, fontSize: S.fontSize,
    keyReveal: S.keyReveal, keyNext: S.keyNext, keyPrev: S.keyPrev, keyTTS: S.keyTTS,
    randomize: S.randomize, autoPlay: S.autoPlay, ttsVoice: S.ttsVoice, customVars: S.customVars,
    wordStyles: S.wordStyles, filterSelections: S.filterSelections, filterMode: S.filterMode,
    lang: S.lang, level: S.level,
  }));
}

function syncSettingsUI() {
  $$('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.theme === S.theme));
  $$('.fs-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.fs) === S.fontSize));
  const known = [14, 18, 22, 26];
  if (!known.includes(S.fontSize)) $('fs-custom-input').value = S.fontSize;
  syncToggle('toggle-random', S.randomize);
  syncMuteBtn();
  const km = { 'key-reveal-input': S.keyReveal, 'key-next-input': S.keyNext, 'key-prev-input': S.keyPrev, 'key-tts-input': S.keyTTS };
  Object.entries(km).forEach(([id, val]) => { const el = $(id); if (el) el.value = keyLabel(val); });
  updateKeyHints();
  syncWordStyleSettings();
}
function syncToggle(id, val) { const el = $(id); if (el) el.classList.toggle('on', val); }

/* ── Key helpers ─────────────────────────────────────────── */
function keyLabel(k) {
  if (!k || k === ' ') return 'Space';
  if (k === 'ArrowRight') return '→';
  if (k === 'ArrowLeft') return '←';
  if (k === 'ArrowUp') return '↑';
  if (k === 'ArrowDown') return '↓';
  return k.length === 1 ? k.toUpperCase() : k;
}
function matchKey(e, k) { return e.key === k || (k.length === 1 && e.key.toLowerCase() === k.toLowerCase()); }
function updateKeyHints() {
  const m = { 'hint-reveal-key': S.keyReveal, 'hint-next-key': S.keyNext, 'hint-prev-key': S.keyPrev, 'hint-tts-key': S.keyTTS };
  Object.entries(m).forEach(([id, val]) => { const el = $(id); if (el) el.textContent = keyLabel(val); });
}

/* ── Keyboard ────────────────────────────────────────────── */
function handleKey(e) {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (S.presMode) {
    if (e.key === 'Escape') { exitPres(); return; }
    if (matchKey(e, S.keyReveal)) { e.preventDefault(); presReveal(); return; }
    if (matchKey(e, S.keyNext)) { e.preventDefault(); presNext(); return; }
    if (matchKey(e, S.keyPrev)) { e.preventDefault(); presPrev(); return; }
    if (matchKey(e, S.keyTTS)) { e.preventDefault(); speakCurrent(); return; }
    return;
  }
  if (e.key === 'Escape') {
    $('settings-overlay').classList.remove('active');
    $('upload-overlay').classList.remove('active');
    return;
  }
  if (matchKey(e, S.keyReveal)) { e.preventDefault(); revealCard(); return; }
  if (matchKey(e, S.keyNext)) { e.preventDefault(); goNext(); return; }
  if (matchKey(e, S.keyPrev)) { e.preventDefault(); goPrev(); return; }
  if (matchKey(e, S.keyTTS)) { e.preventDefault(); speakCurrent(); return; }
}

/* ── Upload ──────────────────────────────────────────────── */
let pendingUploadFiles = [];

function detectFileType(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('sentence_words')) return 'sentenceWords';
  if (lower.includes('sentences')) return 'sentences';
  if (lower.includes('words') && !lower.includes('sentence')) return 'words';
  if (lower.includes('pos_index')) return 'posIndex';
  return 'merged'; // fallback: single merged CSV
}

async function handleUploadFiles(files) {
  pendingUploadFiles = [...files];
  const fileMap = {};

  for (const file of files) {
    const type = detectFileType(file.name);
    fileMap[type] = file;
  }

  // Check if it's a space-efficient set (4 files) or single merged CSV
  const hasSpaceEfficient = fileMap.sentences && fileMap.words && fileMap.sentenceWords;

  if (hasSpaceEfficient) {
    // Space-efficient mode: load words, sentenceWords, posIndex, then sentences
    $('upload-status').className = 'upload-status';
    $('upload-status').textContent = 'Loading space-efficient set...';

    try {
      // 1. Load words
      if (fileMap.words) {
        $('upload-status').textContent = 'Parsing words.csv...';
        const wordsText = await fileMap.words.text();
        const wordsRows = SpaceEfficientLoader.parseCSV(wordsText);
        SpaceEfficientLoader.wordsCache.clear();
        for (const row of wordsRows) {
          SpaceEfficientLoader.wordsCache.set(parseInt(row.word_id), {
            word_id: parseInt(row.word_id),
            lemma: row.lemma,
            text: row.text,
            pos: row.pos,
            genders: SpaceEfficientLoader.safeJSON(row.genders),
            meanings: SpaceEfficientLoader.safeJSON(row.meanings),
            case: row.case || '',
            tense: row.tense || '',
            person: row.person || '',
            number: row.number || '',
            gender: row.gender || '',
          });
        }
      }

      // 2. Load sentence-word mappings
      if (fileMap.sentenceWords) {
        $('upload-status').textContent = 'Parsing sentence_words.csv...';
        const swText = await fileMap.sentenceWords.text();
        const swRows = SpaceEfficientLoader.parseCSV(swText);
        SpaceEfficientLoader.sentenceWordsCache.clear();
        for (const row of swRows) {
          const sid = parseInt(row.sentence_id);
          if (!SpaceEfficientLoader.sentenceWordsCache.has(sid)) {
            SpaceEfficientLoader.sentenceWordsCache.set(sid, []);
          }
          SpaceEfficientLoader.sentenceWordsCache.get(sid).push({
            word_id: parseInt(row.word_id),
            token_index: parseInt(row.token_index),
            token_text: row.token_text,
          });
        }
      }

      // 3. Load POS index (optional)
      SpaceEfficientLoader.posIndex = {};
      if (fileMap.posIndex) {
        $('upload-status').textContent = 'Parsing pos_index...';
        const posText = await fileMap.posIndex.text();
        try {
          if (posText.trim().startsWith('{')) {
            SpaceEfficientLoader.posIndex = JSON.parse(posText);
          } else {
            const rows = SpaceEfficientLoader.parseCSV(posText);
            rows.forEach(row => {
              const pos = row.pos || row[Object.keys(row)[0]];
              const ids = Object.values(row).slice(1).filter(v => v).map(v => parseInt(v)).filter(n => !isNaN(n));
              if (pos) SpaceEfficientLoader.posIndex[pos] = ids;
            });
          }
        } catch (e) {
          console.warn('POS index parse failed:', e.message);
        }
      }

      SpaceEfficientLoader.enabled = true;

      // 4. Load sentences
      $('upload-status').textContent = 'Parsing sentences.csv...';
      const sentText = await fileMap.sentences.text();
      const sentences = SpaceEfficientLoader.parseCSV(sentText);

      if (!sentences.length) throw new Error('No sentences found');

      // Detect language from first sentence or default to 'UP'
      const detectedLang = sentences[0].language || 'UP';

      S.allRows = sentences.map((row, idx) => {
        const sid = parseInt(row.sentence_id !== undefined ? row.sentence_id : idx);
        const wordData = SpaceEfficientLoader.getWordData(sid);
        return {
          ...row,
          language: detectedLang,
          word_data: wordData.length ? JSON.stringify(wordData) : '[]',
        };
      });

      $('upload-status').className = 'upload-status ok';
      $('upload-status').textContent = `✓ Loaded ${S.allRows.length} sentences from space-efficient set`;

    } catch (err) {
      $('upload-status').className = 'upload-status err';
      $('upload-status').textContent = '✗ ' + err.message;
      return;
    }

  } else if (fileMap.merged || files.length === 1) {
    // Single merged CSV mode
    const file = fileMap.merged || files[0];
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (!rows.length) throw new Error('No valid rows found. Check column headers.');
      S.allRows = rows;
      $('upload-status').className = 'upload-status ok';
      $('upload-status').textContent = `✓ Loaded ${rows.length} sentences from ${file.name}`;
    } catch (err) {
      $('upload-status').className = 'upload-status err';
      $('upload-status').textContent = '✗ ' + err.message;
      return;
    }
  } else {
    $('upload-status').className = 'upload-status err';
    $('upload-status').textContent = '✗ Need 4 files (sentences, words, sentence_words, pos_index) or 1 merged CSV';
    return;
  }

  // Common: refresh UI
  buildLangDropdown(); buildLevelDropdown();
  buildFilterModeDropdown(); buildFilterChips();
  applyFilters(); buildPool(); renderCard();
  setTimeout(() => $('upload-overlay').classList.remove('active'), 1600);
}

// Legacy single-file handler
function handleUpload(file) {
  handleUploadFiles([file]);
}

/* ── Attach events ───────────────────────────────────────── */
function attachEvents() {
  $('mute-btn').addEventListener('click', () => { S.autoPlay = !S.autoPlay; syncMuteBtn(); saveSettings(); });
  const muteBtnMobile = $('mute-btn-mobile');
  if (muteBtnMobile) muteBtnMobile.addEventListener('click', () => { S.autoPlay = !S.autoPlay; syncMuteBtn(); saveSettings(); });
  $('streamer-btn').addEventListener('click', () => S.presMode ? exitPres() : enterPres());
  $('streamer-btn-desktop').addEventListener('click', () => S.presMode ? exitPres() : enterPres());

  $('settings-btn').addEventListener('click', () => {
    $('settings-overlay').classList.add('active');
    populateVoiceSelect();
    syncColorPickers();
  });
  const settingsBtnMobile = $('settings-btn-mobile');
  if (settingsBtnMobile) settingsBtnMobile.addEventListener('click', () => {
    $('settings-overlay').classList.add('active');
    populateVoiceSelect();
    syncColorPickers();
  });
  $('settings-close').addEventListener('click', () => $('settings-overlay').classList.remove('active'));
  $('settings-overlay').addEventListener('click', e => { if (e.target === $('settings-overlay')) $('settings-overlay').classList.remove('active'); });

  // Info overlay
  const infoBtn = $('info-btn-desktop');
  if (infoBtn) infoBtn.addEventListener('click', () => $('info-overlay').classList.add('active'));
  const infoBtnMobile = $('info-btn-mobile');
  if (infoBtnMobile) infoBtnMobile.addEventListener('click', () => $('info-overlay').classList.add('active'));
  $('info-close').addEventListener('click', () => $('info-overlay').classList.remove('active'));
  $('info-overlay').addEventListener('click', e => { if (e.target === $('info-overlay')) $('info-overlay').classList.remove('active'); });

  $('upload-btn').addEventListener('click', () => $('upload-overlay').classList.add('active'));
  const uploadBtnMobile = $('upload-btn-mobile');
  if (uploadBtnMobile) uploadBtnMobile.addEventListener('click', () => $('upload-overlay').classList.add('active'));
  $('upload-close').addEventListener('click', () => $('upload-overlay').classList.remove('active'));
  $('upload-overlay').addEventListener('click', e => { if (e.target === $('upload-overlay')) $('upload-overlay').classList.remove('active'); });
  $('upload-file-input').addEventListener('change', e => { if (e.target.files.length) handleUploadFiles(e.target.files); });
  const drop = $('upload-drop');
  drop.addEventListener('click', () => $('upload-file-input').click());
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
  drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); if (e.dataTransfer.files.length) handleUploadFiles(e.dataTransfer.files); });

  $$('.theme-dot').forEach(d => d.addEventListener('click', () => applyTheme(d.dataset.theme)));

  $$('.fs-btn').forEach(b => b.addEventListener('click', () => applyFontSize(b.dataset.fs)));
  $('fs-custom-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const v = parseInt(e.target.value);
      if (v >= 8 && v <= 72) { $$('.fs-btn').forEach(b => b.classList.remove('active')); applyFontSize(v); }
    }
  });
  $('fs-custom-input').addEventListener('blur', e => {
    const v = parseInt(e.target.value);
    if (v >= 8 && v <= 72) { $$('.fs-btn').forEach(b => b.classList.remove('active')); applyFontSize(v); }
  });

  $('tts-voice-select').addEventListener('change', e => { S.ttsVoice = e.target.value; saveSettings(); });

  $('toggle-random').addEventListener('click', () => {
    S.randomize = !S.randomize; syncToggle('toggle-random', S.randomize);
    buildPool(); renderCard(); saveSettings();
  });

  $('custom-reset').addEventListener('click', resetCustomVars);

  function remapKey(inputId, stateKey) {
    $(inputId).addEventListener('keydown', e => {
      e.preventDefault();
      S[stateKey] = e.key;
      e.target.value = keyLabel(e.key);
      updateKeyHints(); saveSettings();
    });
  }
  remapKey('key-reveal-input', 'keyReveal');
  remapKey('key-next-input', 'keyNext');
  remapKey('key-prev-input', 'keyPrev');
  remapKey('key-tts-input', 'keyTTS');

  $('prev-btn').addEventListener('click', goPrev);
  $('next-btn').addEventListener('click', goNext);
  $('reveal-btn').addEventListener('click', revealCard);

  function getFlipLabel() {
    const langName = (S.lang && S.lang !== 'All') ? (LANG_DATA_SOURCES[S.lang]?.name || S.lang) : 'Target';
    if (S.creatorFlip === false) return `EN → ${langName}`;
    if (S.creatorFlip === true) return `EN ← ${langName}`;
    return `EN ⇄ ${langName}`;
  }

  $('flip-btn').addEventListener('click', () => {
    if (S.creatorFlip === false) S.creatorFlip = true;
    else if (S.creatorFlip === true) S.creatorFlip = 'mix';
    else S.creatorFlip = false;
    S.currentFlip = S.creatorFlip === 'mix' ? S.flipMap[S.poolIndex] : S.creatorFlip === true;
    $('flip-label').textContent = getFlipLabel();
    renderCard();
  });

  $('pres-reveal-btn').addEventListener('click', presReveal);
  $('pres-next-btn').addEventListener('click', presNext);
  $('pres-prev-btn').addEventListener('click', presPrev);
  $('pres-tts-btn').addEventListener('click', speakCurrent);
  $('pres-exit-btn').addEventListener('click', exitPres);

  document.addEventListener('keydown', handleKey);

  buildColorPickers();
  buildWordStyleSettings();
  syncSettingsUI();
  $('controls-row').style.display = 'flex';
}

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initCursor();
  initSettingsScroll();
  attachEvents();

  // Apply default font
  S.fontFamily = "'Inconsolata', monospace";
  document.documentElement.style.setProperty('--sans', S.fontFamily);
  document.documentElement.style.setProperty('--mono', S.fontFamily);
  $$('#font-btns .font-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.font === S.fontFamily);
  });

  // Load default language (DE)
  const defaultLang = S.lang || 'DE';
  S.lang = defaultLang;
  loadLanguageData(defaultLang);
});
