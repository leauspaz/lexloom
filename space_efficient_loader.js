
// space_efficient_loader.js - Drop-in module for Lexloom
// Include this file in your HTML before app_multi.js

const SpaceEfficientLoader = {
  wordsCache: new Map(),
  sentenceWordsCache: new Map(),
  posIndex: {},
  enabled: false,

  async load(urls, source) {
    this.enabled = true;

    // Load words dictionary
    const wordsResp = await fetch(urls.words);
    const wordsText = await wordsResp.text();
    const wordsRows = this.parseCSV(wordsText);

    this.wordsCache.clear();
    for (const row of wordsRows) {
      this.wordsCache.set(parseInt(row.word_id), {
        word_id: parseInt(row.word_id),
        lemma: row.lemma,
        text: row.text,
        pos: row.pos,
        genders: this.safeJSON(row.genders),
        meanings: this.safeJSON(row.meanings),
        case: row.case || '',
        tense: row.tense || '',
        person: row.person || '',
        number: row.number || '',
        gender: row.gender || '',
      });
    }

    // Load sentence-word mappings
    const swResp = await fetch(urls.sentenceWords);
    const swText = await swResp.text();
    const swRows = this.parseCSV(swText);

    this.sentenceWordsCache.clear();
    for (const row of swRows) {
      const sid = parseInt(row.sentence_id);
      if (!this.sentenceWordsCache.has(sid)) {
        this.sentenceWordsCache.set(sid, []);
      }
      this.sentenceWordsCache.get(sid).push({
        word_id: parseInt(row.word_id),
        token_index: parseInt(row.token_index),
        token_text: row.token_text,
      });
    }

    // Load POS index if available
    if (urls.posIndex) {
      try {
        const posResp = await fetch(urls.posIndex);
        const posText = await posResp.text();
        // Try JSON first, fallback to CSV parse
        if (posText.trim().startsWith('{')) {
          this.posIndex = JSON.parse(posText);
        } else {
          // Parse as CSV: pos,word_id1,word_id2,...
          const rows = this.parseCSV(posText);
          this.posIndex = {};
          rows.forEach(row => {
            const pos = row.pos || row[Object.keys(row)[0]];
            const ids = Object.values(row).slice(1).filter(v => v).map(v => parseInt(v)).filter(n => !isNaN(n));
            if (pos) this.posIndex[pos] = ids;
          });
        }
      } catch (e) {
        console.warn('POS index not available:', e.message);
        this.posIndex = {};
      }
    }

    console.log(`[SpaceEfficient] ${source}: ${this.wordsCache.size} words, ${this.sentenceWordsCache.size} sentences`);
    return this;
  },

  getWordData(sentenceId) {
    const mappings = this.sentenceWordsCache.get(sentenceId);
    if (!mappings) return [];
    return mappings.map(m => {
      const word = this.wordsCache.get(m.word_id);
      if (!word) return null;
      return {
        text: m.token_text || word.text,
        lemma: word.lemma,
        pos: word.pos,
        genders: word.genders,
        meanings: word.meanings,
        case: word.case,
        tense: word.tense,
        person: word.person,
        number: word.number,
        gender: word.gender,
      };
    }).filter(Boolean);
  },

  findWordsByPOS(pos) {
    const ids = this.posIndex[pos] || [];
    return ids.map(id => this.wordsCache.get(id)).filter(Boolean);
  },

  findWords(query, pos = null) {
    query = query.toLowerCase();
    const results = [];
    for (const [id, word] of this.wordsCache) {
      if (pos && word.pos !== pos) continue;
      if (word.lemma?.toLowerCase().includes(query) ||
        word.text?.toLowerCase().includes(query)) {
        results.push(word);
      }
    }
    return results;
  },

  parseCSV(text) {
    const result = Papa.parse(text, { header: true, skipEmptyLines: true });
    return result.data.map(row => {
      const clean = {};
      Object.entries(row).forEach(([k, v]) => {
        const key = String(k).trim().toLowerCase().replace(/^\uFEFF/, '');
        clean[key] = typeof v === 'string' ? v.trim() : v;
      });
      return clean;
    });
  },

  safeJSON(str) {
    try { return JSON.parse(str); } catch { return []; }
  },

  clear() {
    this.wordsCache.clear();
    this.sentenceWordsCache.clear();
    this.posIndex = {};
    this.enabled = false;
  }
};

// Export for module systems or attach to window
if (typeof window !== 'undefined') {
  window.SpaceEfficientLoader = SpaceEfficientLoader;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpaceEfficientLoader;
}
