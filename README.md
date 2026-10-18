# FORGE — Flagship Engineering Social Platform & Project Registry

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**FORGE** is a modern social platform and software registry designed specifically for software engineers, systems builders, and open-source contributors. It enables developers to showcase ongoing builds, publish technical milestones, discover collaboration opportunities, and build peer networks based on real engineering output.

---

## 🌟 Key Features

- **Luminous Glassmorphic Design System**: Engineered with bright frosted glass cards, subtle dual-layer borders, gentle indigo gradient accents, and micro-interactions designed for clarity and legibility.
- **Projects & Software Registry**: Comprehensive directory of builds with live status filters (`SHIPPED`, `ACTIVE`, `MVP`, `ALPHA`, `PLANNING`), technology tags, and direct repository/demo links.
- **Milestone & Architecture Journeys**: Project pages document the evolution of software through chronological engineering checkpoints, architectural notes, and verification links.
- **Team & Collaboration Postings**: Direct creator-to-collaborator matching with designated engineering roles, application workflows, and acceptance management.
- **Interactive Feed & Discussions**: Rich developer updates categorized by type (`Update`, `Insight`, `Question`, `Collab`), threaded technical comments, and bookmarking.
- **Builder Profiles & Growth Metrics**: Public profiles displaying currently building, learning, and exploring stacks alongside engineering focus indicators.
- **Robust Persistence & Dual-Mode Architecture**: Supports live Firebase Authentication and Firestore synchronization, with an integrated zero-latency local fallback data store.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Styling & UI Tokens** | Vanilla CSS Design Tokens, Dual-layer Frosted Glassmorphism (`backdrop-filter`) |
| **Icons** | Lucide React |
| **Routing** | Zero-dependency client-side history router with URL synchronization |
| **Backend & Auth** | Firebase Auth (Google & Email/Password) + Cloud Firestore |
| **Build & Tooling** | Vite 8 + Rollup + Oxlint |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jharajiv315/CodeAlpha_SocialMedia.git
   cd CodeAlpha_SocialMedia
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Firebase project configuration keys if connecting to live Firestore. If unconfigured, the application runs seamlessly using local state persistence.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Typecheck & Lint**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 📂 Project Structure

```
CodeAlpha_SocialMedia/
├── src/
│   ├── components/
│   │   ├── builds/        # BuildCard, BuildHeader, MilestoneTimeline, CollabSection
│   │   ├── common/        # Avatar, Badge, Button, Modal, Input, Toast, Skeleton
│   │   ├── feed/          # PostCard, PostComposer, CommentSection
│   │   ├── layout/        # Navbar, MobileNav, Sidebar
│   │   └── profile/       # ProfileHeader, CurrentlySection
│   ├── config/            # Firebase config, constants
│   ├── hooks/             # useAuth, useRouter, useToast
│   ├── pages/             # HomePage, ExplorePage, BuildsDirectoryPage, BuildDetailPage, NetworkPage, SettingsPage
│   ├── services/          # authService, dataService, seedData
│   ├── types/             # Domain TypeScript definitions
│   ├── App.tsx            # Root application router & modals
│   ├── main.tsx           # Entry point
│   └── index.css          # Luminous flagship glassmorphic design system
├── public/                # Static assets & brand icons
├── index.html             # HTML5 template with modern fonts
└── vite.config.ts         # Vite bundler configuration
```

---

## 📄 License

This project is licensed under the MIT License.
