# 🗺️ ToolKit Pro — Project Roadmap

## ✅ Phase 1: Foundation (DONE — v1.0)
> Core website with professional UI and working tools

### Completed
- [x] Professional dark navy + cyan design system
- [x] Space Grotesk + Inter typography pairing
- [x] Custom cursor with glow + particle trail effect
- [x] Smooth cursor ring that follows with lag
- [x] Fixed navbar with scroll blur effect
- [x] Hero section with animated floating cards
- [x] Scroll-reveal animations on all sections
- [x] Fully responsive (mobile + tablet + desktop)
- [x] Toast notification system

### Tools Shipped (v1.0)
| Tool | Status | Tech Used |
|---|---|---|
| 🖼️ Image Compressor | ✅ Live | Canvas API |
| 📐 Image Resizer | ✅ Live | Canvas API |
| 🔄 Image Converter | ✅ Live | Canvas API + Blob |
| 📄 PDF Compressor | ✅ Live (basic) | FileReader + ArrayBuffer |
| 🔗 PDF Merger | ✅ Live (basic) | FileReader + ArrayBuffer |
| 🔐 Base64 Encoder/Decoder | ✅ Live | Native JS btoa/atob |
| 🎨 Color Picker + Palette | ✅ Live | Canvas color math |
| 📝 Text Analyzer | ✅ Live | Regex word counting |

---

## 🚧 Phase 2: Power Tools (v2.0)
> Advanced tools with better compression and real PDF support

### Tools to Add
- [ ] **PDF Splitter** — Extract individual pages from a PDF
- [ ] **PDF to Images** — Convert each PDF page to PNG/JPG
- [ ] **Image to PDF** — Combine multiple images into one PDF
- [ ] **SVG Optimizer** — Clean and minify SVG files
- [ ] **CSV to JSON / JSON to CSV** — Data format converter
- [ ] **QR Code Generator** — Generate scannable QR codes from any URL/text
- [ ] **Password Generator** — Strong, customizable passwords
- [ ] **Markdown Preview** — Live Markdown to HTML renderer

### Improvements
- [ ] Integrate **PDF.js** (Mozilla) for real PDF rendering and page extraction
- [ ] Add **pako.js** (zlib) for actual PDF content stream compression
- [ ] Drag-to-reorder for PDF merger file list
- [ ] Preview thumbnail for uploaded images before processing
- [ ] Side-by-side before/after comparison slider for image tools
- [ ] Batch image processing (upload multiple images at once)

---

## 🔮 Phase 3: AI-Powered Tools (v3.0)
> Smart tools using browser AI or lightweight cloud APIs

### Tools to Add
- [ ] **AI Background Remover** — Remove backgrounds from images using ML (transformers.js)
- [ ] **Smart Image Upscaler** — 2x/4x upscale using ESRGAN model in browser
- [ ] **PDF Summarizer** — Extract and summarize PDF text using Claude API
- [ ] **OCR (Image to Text)** — Extract text from images using Tesseract.js
- [ ] **AI Color Palette Generator** — Generate palettes from text description
- [ ] **Grammar Fixer** — Fix grammar and rephrase text

### Tech Stack for Phase 3
- `@xenova/transformers` — Run ML models in the browser (WASM)
- `tesseract.js` — Browser OCR
- Anthropic Claude API — Text summarization and AI features

---

## 🏗️ Phase 4: Platform Features (v4.0)
> Turn the tool collection into a platform

### Features
- [ ] **Tool Search Bar** — Search across all available tools
- [ ] **Dark / Light mode toggle**
- [ ] **Tool usage history** — LocalStorage-based recent actions
- [ ] **Favorites / Pinned Tools**
- [ ] **PWA (Progressive Web App)** — Install offline on any device
- [ ] **Keyboard shortcut guide** (Alt+T = jump to tools, etc.)
- [ ] **Tool API** — Let developers call tools programmatically
- [ ] **Multi-language support** (Hindi, Spanish, French)

---

## 📁 File Structure
```
toolkit-pro/
│
├── index.html        ← Main HTML (all tools, sections, structure)
├── style.css         ← All styles (design tokens, animations, responsive)
├── script.js         ← All JS logic (tools, cursor, scroll, interactions)
│
├── ROADMAP.md        ← This file
│
└── (future)
    ├── tools/
    │   ├── pdf.js
    │   ├── image.js
    │   └── text.js
    ├── lib/
    │   ├── pdf.min.js    (PDF.js)
    │   └── pako.min.js   (zlib compression)
    └── sw.js             (Service Worker for PWA)
```

---

## 🛠️ How to Add a New Tool

1. **HTML** — Add a new `.tool-card` div inside `#tools > .tools-grid` in `index.html`
2. **Drop Zone** — Use the `drop-zone` pattern with a file input
3. **Controls** — Add sliders, selects, or inputs inside `.tool-controls`
4. **JS** — In `script.js`, call `setupDropZone(...)` and add click handler for your button
5. **Result** — Use `showResult(boxId, html)` and `makeDownloadLink(blob, filename, label)` helpers

```js
// Template for new tool
setupDropZone('myToolDrop', 'myToolInput', 'image', files => {
  myFile = files[0];
  document.getElementById('myToolControls').style.display = 'flex';
  showToast('File loaded!');
});

document.getElementById('myToolBtn').addEventListener('click', () => {
  if (!myFile) return showToast('Please upload a file first.');
  // ... your processing logic ...
  showResult('myToolResult', `<div>Done!</div>${makeDownloadLink(blob, 'output.jpg', 'Download')}`);
});
```

---

## 🎨 Design Tokens (Quick Reference)

| Token | Value | Use |
|---|---|---|
| `--navy-900` | `#080c1a` | Page background |
| `--navy-800` | `#0d1228` | Section backgrounds |
| `--cyan` | `#00d4ff` | Primary accent, CTAs |
| `--cyan-glow` | `rgba(0,212,255,0.15)` | Hover glows, card accents |
| `--card-bg` | `rgba(13,18,40,0.85)` | Tool cards |
| `--card-border` | `rgba(0,212,255,0.12)` | Card borders |
| `--white-dim` | `rgba(240,244,255,0.6)` | Body text, descriptions |

---

## 📊 Performance Targets
| Metric | Target |
|---|---|
| First Contentful Paint | < 1.2s |
| Time to Interactive | < 2s |
| Lighthouse Score | > 90 |
| Mobile Score | > 85 |
| Zero external API calls | ✅ (Phase 1-2) |
| Offline capable | Phase 4 (PWA) |

---

*Last updated: 2026 · ToolKit Pro v1.0*
