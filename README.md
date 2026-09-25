# MÚRÀ

**Prepare yourself.** (Pronounced *moo-rah*.)

MÚRÀ is the operating system for preparing students before university: curated essentials, intelligent recommendations, planning tools, university-specific guidance and personal preparation journeys.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · shadcn/ui conventions (Radix) · Lucide · next-themes · React Hook Form + Zod · TanStack Query · Geist

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## The homepage story

The page unfolds as a narrative, not a storefront:

| Chapter | Sections |
| --- | --- |
| Arrival | Hero with a cursor-parallax walnut desk and floating Preparation panel |
| — | Living Preparation: a scroll-driven desk that assembles itself (20% → 45% → 73% → 100%) |
| Understanding | Why MÚRÀ Exists · Preparation Timeline |
| Planning | AI Preparation Builder · University Explorer |
| Preparation | Curated Collections · Planning Tools |
| Confidence | Student Dashboard preview · Editorial Resources |
| University | Closing statement |

## Architecture

```
app/
  page.tsx                     Homepage composition
  resources/[slug]/page.tsx    Statically generated editorial guides
  api/recommendations          POST — validates answers (Zod) and builds a pack
  api/universities/[id]        GET — university guide data (TanStack Query)
  api/sign-in                  POST — magic-link sign-in (validation only; delivery is stubbed)
components/
  scene/                       Hand-drawn SVG desk objects + the parallax / assembly scene
  sections/                    One component per homepage chapter
  site/                        Nav, ⌘K search, sign-in, theme toggle, footer
  ui/                          Primitives: Button, Dialog, Input, ProgressRing, Reveal…
lib/
  builder.ts                   Shared Zod schema + recommendation engine
  data/                        Universities, essentials, timeline, collections, articles
```

### Design system

Tokens live in `app/globals.css` (light: early morning; dark: the hour before dawn). Glass is reserved for floating layers. All motion uses a single calm easing curve and respects `prefers-reduced-motion` through `MotionConfig reducedMotion="user"` plus CSS fallbacks.

### Imagery

There is no stock photography. Every desk object — laptop with a real 3D hinge, planner that unfolds, backpack, ID card, headphones — is drawn in SVG with light entering from the left, so the scene stays crisp, themable and light.

## Accessibility

Semantic landmarks, skip link, keyboard-operable timeline (arrow keys), combobox search (⌘K or `/`), labelled forms with inline errors, visible focus rings, reduced-motion support, and responsive layouts from 360px upward.

## Notes

University guidance is general and should be confirmed with each institution. Sign-in validates input but does not yet send email.
