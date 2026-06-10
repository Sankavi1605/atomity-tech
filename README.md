# Atomity

Cloud Infrastructure Intelligence — a scrollytelling landing page with a 224-frame scroll-driven image sequence background.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 6**
- **Tailwind CSS 3.4**

## Features

- **Scrollytelling background** — 224 image frames from Cloudflare R2 scrub through as you scroll, creating a video-like experience driven entirely by scroll position
- **Glassmorphism UI** — frosted glass cards with `backdrop-blur`, translucent borders, and inset highlights
- **8 full-screen sections** — Brand, Vision, Control Plane, Topology, Savings, Developer Console, Metrics, Launch
- **Interactive elements** — savings calculator sliders, deploy/clear terminal buttons
- **Responsive** — works on desktop and mobile with touch scroll support
- **Fixed header** — glass-effect navigation bar with section links
- **Fixed footer** — subtle branding bar masking the bottom edge

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
├── index.html
├── src/
│   ├── main.tsx          # React entry point
│   ├── App.tsx           # Main application component
│   └── index.css         # Tailwind directives + base styles
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── tsconfig.json
```

## How the Scrollytelling Works

The page is 800vh tall (8 sections × 100vh). A `scroll` event listener maps `window.scrollY` to a frame number (1–224). The background `<img>` swaps its `src` attribute to the corresponding frame URL on Cloudflare R2, creating a smooth scroll-linked animation. Content cards fade in/out based on which section is currently in the viewport.

## License

MIT
