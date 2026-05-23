# UAP Files Browser — Implementation Plan

> *"The Truth Is Out There"*

A public Next.js web app for browsing the declassified UAP government document releases (May 2025). Users can explore PDFs, videos, and images in a moody, cinematic X-Files / government-black-site aesthetic.

---

## Vibe & Theme

**Codename: PROJECT LOOKING GLASS**

The design language draws from:
- Redacted government documents — heavy use of black bars, stamped text ("DECLASSIFIED", "TOP SECRET // NOFORN")
- CRT monitor / green phosphor terminal glow
- 1990s conspiracy-board aesthetics — string, pushpins, polaroid edges
- Deep space darkness — near-black backgrounds, nebula gradients bleeding through
- Subtle film grain and scanline overlays on every page
- Monospace + condensed sans-serif type pairing (e.g. `Share Tech Mono` + `Bebas Neue`)

Color palette:
```
--black:        #050508
--deep-space:   #0a0a14
--terminal:     #00ff9d   (primary glow — green phosphor)
--redacted:     #ff3c3c   (accent — danger / classified)
--amber:        #f5a623   (secondary glow — old CRT amber)
--paper:        #c8b89a   (document off-white)
--stamp-red:    #c0392b
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + RSC for fast initial load, easy API routes |
| Styling | Tailwind CSS + CSS custom properties | Utility-first + theming |
| Animation | Framer Motion | Page transitions, reveal effects |
| PDF Viewer | `react-pdf` (pdfjs-dist) | In-browser PDF render, no external service |
| Video Player | Custom `<video>` + HLS.js if needed | Native controls, styled |
| S3 Access | AWS SDK v3 (`@aws-sdk/client-s3`) in Route Handlers | Never expose credentials to client |
| Image Lightbox | Yet Another React Lightbox | Keyboard nav, zoom |
| Fonts | Google Fonts: Share Tech Mono, Bebas Neue, Special Elite | |
| Deployment | Vercel | Zero-config Next.js |

---

## App Structure

```
app/
├── layout.tsx              # Root layout — noise overlay, scanlines, global nav
├── page.tsx                # Landing / "transmission received" splash
├── files/
│   ├── page.tsx            # Main file browser (grid/list toggle)
│   └── [id]/
│       └── page.tsx        # Single file viewer
├── api/
│   ├── files/
│   │   └── route.ts        # Lists S3 objects, returns metadata
│   └── files/[id]/
│       └── route.ts        # Pre-signs URL for secure, time-limited access
components/
├── layout/
│   ├── NavBar.tsx
│   ├── NoiseOverlay.tsx    # SVG feTurbulence grain, fixed position
│   └── ScanlineOverlay.tsx # CSS repeating-linear-gradient scanlines
├── browser/
│   ├── FileGrid.tsx        # Responsive card grid
│   ├── FileCard.tsx        # Individual file card with type badge
│   ├── FilterBar.tsx       # Filter by type (PDF / VIDEO / IMAGE), date, keyword
│   └── FileTypeIcon.tsx    # Glowing SVG icons per type
├── viewers/
│   ├── PDFViewer.tsx       # react-pdf with custom toolbar
│   ├── VideoViewer.tsx     # Styled <video> with custom controls
│   └── ImageViewer.tsx     # Lightbox wrapper
└── ui/
    ├── GlitchText.tsx      # CSS glitch animation for headings
    ├── RedactedBar.tsx     # Animated black redaction bars
    ├── StampBadge.tsx      # "DECLASSIFIED" / "UNCLASSIFIED" stamps
    ├── TerminalLoader.tsx  # Typewriter-style loading states
    └── StaticNoise.tsx     # Brief TV-static transition between routes
```

---

## Pages & Layouts

### 1. Root Layout (`layout.tsx`)

Every page is wrapped in:
- **Noise overlay** — a fixed, full-screen SVG `feTurbulence` filter at ~3% opacity giving everything a film-grain look
- **Scanline overlay** — thin horizontal repeating lines at ~4% opacity, the classic CRT feel
- **Global nav** — a slim top bar reading `PROJECT LOOKING GLASS // DECLASSIFIED FILES` in terminal green monospace, with a slowly pulsing dot indicating "LIVE FEED ACTIVE"

### 2. Landing Page (`/`)

Full-viewport dramatic intro:

- **Background**: deep space gradient with a slowly rotating nebula mesh (CSS conic-gradient animation or a subtle canvas starfield)
- **Center**: a large, glitching glyph — an alien craft silhouette or the classic "flying saucer" SVG, pulsing with the terminal-green glow
- **Heading**: `CLASSIFIED AERIAL PHENOMENA RECORDS` in Bebas Neue, massive, with a CSS glitch animation that occasionally scrambles letters
- **Subheading** (typewriter effect): `// RELEASED MAY 2025 — BROWSE THE EVIDENCE`
- **CTA button**: `[ ACCESS FILES ]` — styled as a terminal command prompt, hover glows red, click triggers a brief TV-static full-screen wipe before navigating to `/files`
- **Footer ticker**: slow horizontal scroll of redacted-looking text — `██████ CASE NO. ████ // INCIDENT DATE ██/██/████ // LOCATION: ████████, NM // WITNESS COUNT: █`

### 3. File Browser (`/files`)

The main experience. Split into:

**Top bar**
- Breadcrumb: `> LOOKING_GLASS / ALL_FILES`
- File count: `[  247 RECORDS FOUND  ]` styled like a terminal readout
- View toggle: GRID | LIST (both styled, icons glow on hover)

**Filter sidebar (collapsible on mobile)**
- File type checkboxes: `[ PDF ]  [ VIDEO ]  [ IMAGE ]`
- Date range (releases are grouped by "May 8 Drop" and "May 22 Drop")
- Keyword search with a `>_` cursor prefix
- All filter UI styled as terminal form inputs — green borders, black fill, monospace labels

**File grid**
- Cards styled as old manila file folders or polaroid photos depending on type
- PDF cards: paper-texture background, a corner dog-ear fold, filename in monospace, page count badge
- Video cards: dark with a play button glyph that glows amber, duration badge
- Image cards: thumbnail with a scanline overlay, classified-stamp watermark at low opacity
- Each card has a `CASE #XXXX` generated identifier in the corner
- Hover: card lifts slightly, glow intensifies, a redaction bar slides across and back ("accessing...")
- New files (May 22 drop) get a red pulsing `NEW` badge

**List view (alternate)**
- Table rows styled like a terminal readout
- Columns: CASE # / FILE NAME / TYPE / SIZE / DATE / STATUS
- Row highlight on hover glows green
- Rows stagger-animate in on load (Framer Motion)

### 4. File Viewer (`/files/[id]`)

Layout depends on file type, but the chrome is always the same:

**Header bar**
- `< BACK TO FILES` — breadcrumb
- Filename in large monospace
- `DECLASSIFIED` stamp badge (red, rotated ~-8deg, slightly worn texture)
- File metadata row: type, size, release date, case number

**PDF Viewer**
- Full-width `react-pdf` viewer with custom controls
- Navigation: `[ << PREV ]  [ PAGE 12 / 47 ]  [ NEXT >> ]` in terminal style
- Zoom in/out controls
- Background behind the PDF is deep black — the white document pages feel like they're floating
- Subtle drop shadow on pages with a faint green glow edge

**Video Viewer**
- Full-width player, aspect-ratio locked
- Custom controls bar: play/pause, timeline scrubber (styled as a signal frequency line), volume, fullscreen
- Timeline scrubber shows a waveform-style visualization
- "RECORDING" indicator badge (blinking red dot) while playing

**Image Viewer**
- Centered image with lightbox zoom
- Navigation arrows for any related images in the same release batch
- EXIF / metadata panel below: "LOCATION: UNKNOWN", "SOURCE: DECLASSIFIED DOD RECORDS"

---

## S3 Integration

All S3 interaction happens server-side in Route Handlers — no credentials touch the browser.

### `GET /api/files`
- Uses `ListObjectsV2` to enumerate the bucket
- Groups by prefix/folder if organized (e.g. `may-8/`, `may-22/`)
- Returns structured metadata: `{ id, key, name, type, size, lastModified, releaseDate }`
- Response cached with `next: { revalidate: 3600 }` — bucket doesn't change often

### `GET /api/files/[id]`
- Takes the file key, generates a presigned URL with 15-minute expiry via `GetObjectCommand`
- Returns `{ url, metadata }` — client uses the presigned URL directly
- This keeps the bucket private while allowing public browsing

### S3 Bucket Setup (documented for deploy)
- Bucket: private (no public access)
- CORS: allow GET from the app domain
- Folder convention: `pdfs/`, `videos/`, `images/` or by release date

---

## Animations & Micro-interactions

| Trigger | Effect |
|---|---|
| Page load | Rows/cards stagger-fade in (Framer Motion, 30ms stagger) |
| Route change | Full-screen TV static wipe (CSS animation, ~300ms) |
| Card hover | Lift + glow + brief redaction bar sweep |
| PDF page turn | Slide transition between pages |
| Filter apply | Grid items shuffle with layout animation |
| Landing CTA click | Static burst → fade to black → browser page |
| "NEW" badge | Slow red pulse |
| Nav logo | Occasional letter glitch on a random interval |

---

## Responsive Strategy

- **Desktop (≥1280px)**: Filter sidebar visible, 4-col grid
- **Tablet (768–1279px)**: Filter sidebar collapses to top filter bar, 2-col grid
- **Mobile (<768px)**: Filter bar is a bottom sheet, single-col grid, simplified nav

---

## Performance Notes

- PDFs are rendered client-side via pdfjs-dist — only load the worker on the viewer page (dynamic import)
- S3 presigned URLs mean no media passes through the Next.js server
- `react-pdf` renders one page at a time with virtualized scroll for large documents
- Images use `next/image` with S3 presigned URLs (or a public CDN URL) for optimization
- File list cached at edge for 1 hour — re-fetches lazily

---

## Stretch / Phase 2 (not now, just noted)

- AI document summarization (Claude API) — "Summarize this document in 3 bullet points"
- Full-text search across PDFs (extract text, index in a vector DB)
- "Red string" connection board — a visual map linking related documents
- Audio: ambient drone soundtrack playing under the site (toggle)
- User annotations / highlights on PDFs

---

## Suggested Directory / File Checklist for Phase 1

```
[ ] next.config.ts              — image domains, env vars
[ ] tailwind.config.ts          — custom theme tokens
[ ] app/layout.tsx
[ ] app/page.tsx                — landing
[ ] app/files/page.tsx          — browser
[ ] app/files/[id]/page.tsx     — viewer
[ ] app/api/files/route.ts
[ ] app/api/files/[id]/route.ts
[ ] components/layout/NavBar.tsx
[ ] components/layout/NoiseOverlay.tsx
[ ] components/layout/ScanlineOverlay.tsx
[ ] components/browser/FileGrid.tsx
[ ] components/browser/FileCard.tsx
[ ] components/browser/FilterBar.tsx
[ ] components/viewers/PDFViewer.tsx
[ ] components/viewers/VideoViewer.tsx
[ ] components/viewers/ImageViewer.tsx
[ ] components/ui/GlitchText.tsx
[ ] components/ui/StampBadge.tsx
[ ] components/ui/TerminalLoader.tsx
[ ] components/ui/StaticNoise.tsx
```

---

*End of plan. The truth is out there — and now it loads in under 2 seconds.*
