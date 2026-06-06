# Lexloom

> Sentence-based language learning flashcards — built for learners, streamers, and polyglots.

[Live Demo](https://leauspaz.github.io/lexloom)

---

## What is Lexloom?

Lexloom is a **browser-based flashcard app** for learning languages through full sentences rather than isolated vocabulary. It pulls from a curated CSV dataset of graded sentences (CEFR A1–C2) and presents them with a sleek, distraction-free interface inspired by terminal aesthetics and mechanical keyboards.

Unlike traditional flashcard apps, Lexloom focuses on **contextual grammar**; every sentence is tagged with grammar topics, sentence types, declensions, verb frames, and inclusion features (separable verbs, two-way prepositions, reflexive verbs, genitive attributes). Hover over any word to see its lemma, part of speech, gender, case, and English meanings.

---

## Features

### Core

- **Sentence-based flashcards** — English on one side, target language on the other (or vice versa, or mixed)
- **CEFR level filtering** — A1, A2, B1, B2, C1, C2
- **Multi-dimensional filtering** — by topic, grammar, sentence type, inclusions, adjective declension, or verb frame
- **Text-to-speech (TTS)** — auto-plays on reveal with configurable voices
- **Presentation mode** — full-screen study mode with progress bar, designed for streaming or classroom use
- **Offline caching** — CSV data cached in IndexedDB for instant reloads
- **Custom CSV upload** — bring your own sentence dataset

### Visual

- **36 themes** — 18 dark, 18 light, all hand-picked from the mechanical keyboard community
- **Custom theme editor** — Ability to tweak every CSS variable live
- **17 font families**
- **Adjustable font size**
- **Custom cursor** — smooth GSAP-powered cursor with hover states (desktop)
- **Text scramble animation** — cards scramble on load with Greek Alphabets

### Word Analysis

- **Hover tooltips** — hover any word to see:
  - Lemma (dictionary form)
  - Part of speech (NOUN, VERB) More to be added in the future
  - Gender (♂ m, ♀ f, ⚲ n)
  - Grammatical case & tense
  - Up to 5 English meanings
- **Visual POS styling** — nouns underlined, verbs dotted, fully customizable

### Keyboard Controls

| Key | Action |
|-----|--------|
| `Space` | Reveal card |
| `→` | Next card |
| `←` | Previous card |
| `S` | Speak (TTS) |
| `Esc` | Exit presentation mode / close overlays |

All shortcuts are remappable in Settings.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Language | Vanilla JavaScript (ES6+) |
| Styling | CSS custom properties (variables) |
| CSV Parsing | PapaParse |
| Animation | GSAP (cursor), CSS transitions (UI) |
| Storage | IndexedDB (cache), localStorage (settings) |
| Hosting | GitHub Pages |

---

## CSV Format

Lexloom accepts CSV files with the following columns. A header row is required.

### Required

| Column | Description |
|--------|-------------|
| `language` | Language name (e.g., `German`, `French`) |
| `level` | CEFR level: `A1`, `A2`, `B1`, `B2`, `C1`, `C2` |
| `english` | English sentence |
| `translation` | Target language sentence |
| `category` | Topic tag (e.g., `Travel`, `Food`, `Work`) |

### Optional (for enhanced features)

| Column | Description |
|--------|-------------|
| `grammar` | Pipe-separated tags: `Passive\|Relative Clause\|Subjunctive` |
| `sentence_type` | e.g., `statement`, `question`, `imperative` |
| `word_data` | JSON array of word objects (see below) |
| `tense` | e.g., `Präsens`, `Perfekt`, `Präteritum` |
| `has_two_way_prep` | `TRUE` / `FALSE` |
| `separable_verb` | `TRUE` / `FALSE` |
| `reflexive_verb` | `TRUE` / `FALSE` |
| `genitive_attr` | `TRUE` / `FALSE` |
| `adj_declension` | e.g., `weak_declension`, `strong_declension` |
| `verb_frame` | e.g., `accusative`, `dative`, `genitive` |

### `word_data` JSON Format

```json
[
  {
    "text": "Häuser",
    "lemma": "Haus",
    "pos": "NOUN",
    "genders": ["n"],
    "case": "Nominative",
    "meanings": ["house", "home", "building"]
  },
  {
    "text": "gehen",
    "lemma": "gehen",
    "pos": "VERB",
    "tense": "Präsens",
    "meanings": ["to go", "to walk", "to leave"]
  }
]
```

---

## Architecture

```
index.html          — Single-page markup
style.css           — 36 themes + responsive layout + component styles
app.js              — State management, CSV loading, filtering, rendering, TTS
```

### State (`S` object)

All application state lives in a single `S` object:

- `allRows` — raw CSV data
- `filtered` — after language/level/filter chips
- `pool` — shuffled (or ordered) study deck
- `poolIndex` — current card position
- `filterSelections` — active filter chips per mode
- `customVars` — user-defined theme colors
- `wordStyles` — noun/verb decoration preferences

### Data Flow

1. **Load** — CSV fetched from Google Sheets (or uploaded), parsed with PapaParse, cached in IndexedDB
2. **Filter** — language + level + active filter chips → `filtered`
3. **Pool** — `filtered` shuffled (or not) → `pool`
4. **Render** — current row → HTML with word tokenization → scramble animation → card display
5. **Reveal** — secondary text shown, TTS fires (if enabled), word tooltips attach

---

## Development

No build step. Clone and open `index.html` in a browser, or serve with any static server:

```bash
git clone https://github.com/leauspaz/lexloom.git
cd lexloom
python -m http.server 8000
# open http://localhost:8000
```

### Adding a Language

1. Add a CSV source to `CSV_SOURCES` in `app.js`:

   ```js
   'FR': {
     url: 'https://docs.google.com/spreadsheets/d/.../pub?output=csv',
     version: 1
   }
   ```

2. Map it in `LANG_SOURCE_MAP`:

   ```js
   'FR': 'FR'
   ```

3. The language dropdown will auto-populate from the `language` column in the CSV.

### Adding a Theme

1. Add CSS variables to `style.css` under `[data-theme="your_theme"]`
2. Add a dot to the Settings panel in `index.html`:

   ```html
   <span class="theme-dot" data-theme="your_theme" style="background:#hexcolor" title="Your Theme"></span>
   ```

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core | ✅ | ✅ | ✅ | ✅ |
| TTS | ✅ | ✅ | ✅ | ✅ |
| IndexedDB | ✅ | ✅ | ✅ | ✅ |
| `color-mix()` | ✅ 111+ | ✅ 88+ | ✅ 16.2+ | ✅ 111+ |
| Custom cursor | ✅ | ✅ | ✅ | ✅ |

---

## License

MIT — see [LICENSE](LICENSE)

---

Built with ❤️ by [leauspaz](https://github.com/leauspaz)
