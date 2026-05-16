# HamSafar — Community Carpooling for Pakistan

A mobile-first carpooling web app built with Next.js 14, styled as a phone UI in the browser.

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ (comes with Node) | — |
| Git | any | https://git-scm.com |

---

## Run from scratch

```bash
# 1. Clone the repo
git clone <repo-url>
cd hamsafar

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Windows PowerShell — script execution error?

If you see `npm.ps1 cannot be loaded because running scripts is disabled`, run this once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Or use `cmd` instead of PowerShell:

```cmd
cmd /c "npm run dev"
```

---

## Other commands

```bash
npm run build    # production build (also checks for type/lint errors)
npm run start    # serve the production build
npm run lint     # run ESLint
```

---

## Tech stack

- **Next.js 14** — App Router, file-based routing
- **TypeScript** — strict types throughout
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations and transitions
- **Zustand** — global state with localStorage persistence
- **Lucide React** — icons
- **Sonner** — toast notifications

---

## Notes

- All data is **mock/local** — no backend or database required.
- State persists in `localStorage` between sessions.
- To reset all data: Profile → Settings → Reset Demo.
- The app is designed at **390px wide** (iPhone 14 size) — best viewed in a browser or with DevTools device emulation set to iPhone 14.
