# 🎓 ExamSys — Examination System Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20AR-26A69A?style=for-the-badge&logo=googletranslate&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A production-ready, role-based examination management frontend built with React 19 + TypeScript**

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Pages & Routes](#-pages--routes) • [Backend API Repository](https://github.com/ahmads1990/ExaminationSystemWebAPI) • [Contributing](#-contributing)

</div>

---

> ⚙️ **Backend Project**: The ASP.NET Core Web API for this application is hosted at [https://github.com/ahmads1990/ExaminationSystemWebAPI](https://github.com/ahmads1990/ExaminationSystemWebAPI).

## 📖 Overview


**ExamSys Frontend** is the client-side counterpart to the [ExaminationSystem Web API](https://github.com/ahmads1990/ExaminationSystemWebAPI). Built with **React 19**, **TypeScript**, and **Vite**, it delivers a fully-featured examination platform for two distinct user roles — Instructors and Students — with a clean, responsive UI that adapts to both light and dark modes.

The application handles the full academic lifecycle: from registration and email verification, through course management and exam creation, to real-time timed exam-taking with a countdown timer, automatic submission, and instant result display.

### 🎯 Key Highlights

- 🏗️ **Feature-Sliced Structure** — Pages, services, API layer, and components organized by domain
- 👥 **Dual-Role UX** — Completely separate Instructor and Student flows with role-based route guards
- 🔐 **Dual-Token Auth** — JWT + Refresh Token with silent refresh via Axios interceptors
- ⏱️ **Timed Exam Engine** — Live countdown derived from the exam-scoped JWT `exp` claim with auto-submit
- 🌍 **i18n Ready** — Full English & Arabic (RTL) localization via `i18next`
- 🌙 **Dark Mode** — CSS custom-property theming persisted in `localStorage`
- 📱 **Fully Responsive** — Mobile-first layouts with collapsible sidebar drawer
- ✨ **Polished UX** — Loading skeletons, empty states, toast notifications, and animated transitions

---

## ✨ Features

### 🔐 Authentication & Account Management
- Role-based registration for **Students** and **Instructors** (tabbed form)
- OTP-based **email verification** with resend support
- **Forgot / Reset Password** flow via email link
- **Change Password** from the authenticated dashboard
- Automatic silent token refresh on `401` via Axios interceptor
- Logout with token cleanup

### 🏢 Instructor — Course & Exam Management
- **My Courses** — List, create, edit, and delete courses with enrollment limits
- **Exam Management** — Full lifecycle: Draft → Published → Archived, with per-exam configuration (duration, max attempts, shuffle, pass marks)
- **Question Bank** — Add / edit / delete MCQ questions with Easy / Medium / Hard difficulty and dynamic answer choices
- **Question Assignment** — Assign or unassign questions to exams; partial-rejection feedback shown per item
- **Exam Submissions** — Paginated table of all student attempts per exam (name, status, grade, completion time)
- **Instructor Dashboard** — Course stats cards: enrolled students, exam count, average scores
- **Analytics & Grading** — Dedicated pages for exam analytics and manual grading

### 🎓 Student — Exam Taking Flow
- **Browse & Enroll** — Discover all available courses and enroll in one click
- **Student Dashboard** — Enrolled courses and all available upcoming exams in one view
- **Exam Start Page** — Exam metadata, rules, and attempt limit info before committing
- **Live Exam Taking** — One question at a time, answer auto-saved per selection, question navigator bar showing progress
- **Countdown Timer** — Real-time timer derived from exam-scoped JWT; auto-submits on expiry
- **Exam Results** — Instant score, max grade, pass/fail badge, completion time; handles `GradingInProgress` state gracefully
- **Exam History** — Full paginated history of all past attempts with links to individual results
- **Calendar View** — Upcoming exam schedule at a glance

### 🖥️ Shared & Polish
- **Loading Skeletons** — Pulsing card and table placeholders replace spinners for every list page
- **Empty States** — Contextual icon + message + CTA when lists are empty
- **Global Error Toasts** — API error codes mapped to user-friendly messages via `react-hot-toast`
- **404 / Unauthorized Pages** — Graceful error boundaries for unknown routes and permission violations
- **Dark Mode** — Sun/Moon toggle in the navbar; Bootstrap + custom components both adapt

---

## 🏗️ Architecture

### Source Tree

```
src/
├── api/                    ← Typed request/response DTOs
│   ├── requests/           ← AuthRequests, CourseRequests, ExamRequests, …
│   └── responses/          ← ApiResponse base type, all domain response DTOs
│
├── components/             ← Reusable UI components
│   ├── common/             ← AppPagination, EmptyState, SkeletonCard, SkeletonTable, …
│   ├── instructor/         ← AddCourseModal, QuestionEditor, AssignQuestionsModal, …
│   └── questions/          ← Question-specific sub-components
│
├── contexts/               ← React Contexts (AuthContext, ThemeContext)
├── enums/                  ← Shared enums (ApiErrorCode, ExamAttemptStatus, …)
├── hooks/                  ← Custom hooks (usePagination, …)
├── i18n/                   ← i18next config + locale files (en.json, ar.json)
├── layouts/                ← AuthLayout, MainLayout (sidebar + navbar shell)
├── pages/
│   ├── auth/               ← Login, Register, VerifyEmail, Forgot/Reset/ChangePassword
│   ├── common/             ← Profile, Settings, About, Contact, Help, Privacy, Terms
│   ├── errors/             ← UnauthorizedPage
│   ├── instructor/         ← Dashboard, Courses, Exams, Questions, Submissions, Grading, Analytics
│   └── student/            ← Dashboard, Courses, ExamStart, ExamTaking, ExamResult, History, Calendar
│
├── services/               ← API call functions, one file per domain
├── styles/                 ← Global component styles (components.css, animations)
├── types/                  ← TypeScript interfaces (auth.ts, …)
├── utils/                  ← Shared helpers
├── App.tsx                 ← Route tree (BrowserRouter + role-guarded Route groups)
├── main.tsx                ← App entry point (providers: Auth, Theme, i18n)
└── index.css               ← Design tokens — CSS custom properties for both themes
```

### Layer Diagram

```mermaid
graph TD
    subgraph Browser["🌐 Browser"]
        UI["React 19 UI\nPages · Components · Layouts"]
    end

    subgraph State["🧠 State Layer"]
        AC["AuthContext\nJWT · User · Role"]
        TC["ThemeContext\nLight / Dark"]
        I18N["i18next\nEN · AR (RTL)"]
    end

    subgraph DataLayer["📡 Data Layer"]
        SVC["Services\nauthService · courseService\nexamService · questionService\ninstructorService · studentExamService"]
        AXIOS["Axios Instance\nBase URL · Interceptors\nToken Refresh · Error Mapping"]
    end

    subgraph API["🖥️ Backend (ExamSys Web API)"]
        WEBAPI["ASP.NET Core 8\nREST API"]
    end

    UI -->|"reads/writes"| AC
    UI -->|"reads/writes"| TC
    UI -->|"t()"| I18N
    UI -->|"calls"| SVC
    SVC -->|"HTTP"| AXIOS
    AXIOS -->|"HTTPS requests"| WEBAPI
```

### Component Dependency Map

```mermaid
graph LR
    subgraph Entry["Entry"]
        MAIN["main.tsx"]
    end

    subgraph Providers["Providers"]
        TP["ThemeProvider"]
        AP["AuthProvider"]
        I18N["I18nextProvider"]
    end

    subgraph Shell["Shell"]
        APP["App.tsx\nBrowserRouter + Routes"]
        AL["AuthLayout"]
        ML["MainLayout\nNavbar · Sidebar"]
    end

    subgraph Guards["Route Guards"]
        PR["ProtectedRoute\nrole check"]
    end

    subgraph Pages["Pages"]
        AUTH["Auth Pages"]
        INST["Instructor Pages"]
        STU["Student Pages"]
        COM["Common Pages"]
    end

    MAIN --> TP --> AP --> I18N --> APP
    APP --> AL --> AUTH
    APP --> ML --> PR
    PR --> INST
    PR --> STU
    PR --> COM
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as React App
    participant IC as AuthContext
    participant SVC as authService
    participant API as Web API

    User->>UI: Submit login form
    UI->>SVC: login(email, password)
    SVC->>API: POST /api/v1/Auth/login
    API-->>SVC: { accessToken, refreshToken }
    SVC-->>IC: setTokens(access, refresh)
    IC->>IC: decode JWT → extract role, name
    IC-->>UI: user state updated
    UI->>UI: RootRedirect → /instructor/dashboard OR /student/dashboard

    Note over UI,API: On any 401 response...
    UI->>API: Request with expired token
    API-->>UI: 401 Unauthorized
    UI->>SVC: refreshToken()
    SVC->>API: POST /api/v1/Auth/refresh-token
    API-->>SVC: new accessToken
    SVC-->>UI: Retry original request silently
```

---

## ⏱️ Exam Taking Flow

```mermaid
flowchart TD
    A([Student Dashboard]) -->|clicks Take Exam| B[ExamStartPage\n/student/exams/:id/start]
    B --> C{Read exam rules\nAttempt limit OK?}
    C -->|Begin Exam| D["POST /api/v1/StudentExams/start\n→ exam-scoped JWT issued"]
    D --> E[ExamTakingPage\n/student/exams/take\nFull-screen, no MainLayout]
    E --> F["GET /api/v1/StudentExams/questions\n→ load all MCQ questions"]
    F --> G[Show Question 1 of N\nNavigator bar visible]
    G -->|Select answer| H["POST /api/v1/StudentExams/answer\nauto-saved per selection"]
    H --> G
    G -->|Navigate| G
    E --> I{Timer reaches 0?}
    I -->|Yes auto-submit| J["POST /api/v1/StudentExams/submit"]
    G -->|Manual Submit| J
    J --> K[ExamResultPage\n/student/exams/result]
    K --> L{Grading status?}
    L -->|Instant| M["Show score · grade\npass/fail badge"]
    L -->|GradingInProgress| N["Show pending message\n← Back button"]
```

---

## 🗺️ Route Map

```mermaid
graph TD
    ROOT["/"] -->|role=Instructor| IDASH["/instructor/dashboard"]
    ROOT -->|role=Student| SDASH["/student/dashboard"]

    subgraph PublicRoutes["🔓 Public — AuthLayout"]
        LOGIN["/login"]
        REG["/register"]
        VERIFY["/verify-email"]
        FORGOT["/forgot-password"]
        RESET["/reset-password"]
    end

    subgraph InstructorRoutes["👨‍🏫 Instructor Only"]
        IDASH
        ICOURSES["/instructor/courses"]
        IEXAMS["/instructor/exams"]
        IQUESTIONS["/instructor/exams/:id/questions"]
        ISUBS["/instructor/exams/:id/submissions"]
        IGRADE["/instructor/grading"]
        IANA["/instructor/analytics"]
    end

    subgraph StudentRoutes["👨‍🎓 Student Only"]
        SDASH
        SCOURSES["/courses"]
        SEXSTART["/student/exams/:id/start"]
        SEXTAKE["/student/exams/take 🖥️ fullscreen"]
        SEXRESULT["/student/exams/result"]
        SHIST["/student/history"]
        SCAL["/student/calendar"]
    end

    subgraph SharedRoutes["🔒 Any Authenticated"]
        CHANGEPW["/change-password"]
        SETTINGS["/settings"]
        PROFILE["/profile"]
        SUPPORT["/support"]
    end

    subgraph ErrorRoutes["⚠️ Error Pages"]
        UNAUTH["/unauthorized"]
        NF["/* → 404"]
    end
```

---

## 🌙 Theme & i18n Architecture

```mermaid
graph LR
    subgraph ThemeSystem["🎨 Theme System"]
        CSS["index.css\nCSS Custom Properties\n:root · [data-theme=dark]"]
        TC["ThemeContext\nuseTheme hook"]
        LS1["localStorage\napp_theme"]
        NAV1["Navbar\nSun/Moon Toggle"]
    end

    subgraph I18nSystem["🌍 i18n System"]
        CFG["i18n/config.ts\ni18next init"]
        EN["locales/en.json"]
        AR["locales/ar.json (RTL)"]
        LS2["localStorage\napp_lang"]
        NAV2["Navbar\nLanguage Dropdown"]
        DIR["document dir\nltr / rtl"]
    end

    NAV1 -->|toggle| TC --> CSS
    TC --> LS1
    NAV2 -->|changeLanguage| CFG --> EN & AR
    CFG --> LS2
    CFG --> DIR
```

---

## 🛠️ Tech Stack

```mermaid
graph LR
    subgraph Core["⚛️ Core"]
        R["React 19"]
        TS["TypeScript 5.7"]
        V["Vite 6 + SWC"]
    end

    subgraph Routing["🗺️ Routing"]
        RR["React Router v7"]
    end

    subgraph HTTP["📡 HTTP"]
        AX["Axios\nInterceptors · Refresh"]
    end

    subgraph UI["🎨 UI"]
        BS["Bootstrap 5.3\nReact-Bootstrap"]
        LC["lucide-react\nIcons"]
        RS["react-select\nDropdowns"]
        LT["lottie-react\nAnimations"]
    end

    subgraph UX["✨ UX"]
        HT["react-hot-toast\nToasts"]
        TT["@tanstack/react-table\nHeadless Tables"]
    end

    subgraph Intl["🌍 Intl"]
        I18["i18next\nreact-i18next"]
    end

    subgraph Tooling["🔧 Tooling"]
        ES["ESLint 9"]
        PT["Prettier\n+ import organizer"]
    end

    R --- TS --- V
    V --> RR
    V --> AX
    V --> BS & LC & RS & LT
    V --> HT & TT
    V --> I18
```

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| TypeScript | ~5.7 | Type safety across the entire codebase |
| Vite + SWC | 6 | Lightning-fast dev server & build |
| React Router DOM | v7 | Client-side routing with nested layouts |
| Axios | ^1.7 | HTTP client with interceptor-based token refresh |
| Bootstrap + React-Bootstrap | 5.3 | Responsive grid, modals, offcanvas, forms |
| i18next + react-i18next | 26 / 17 | Full EN/AR localization with RTL support |
| react-hot-toast | ^2.6 | Non-intrusive toast notifications |
| @tanstack/react-table | v8 | Headless table primitives |
| react-select | ^5.10 | Accessible, searchable dropdowns |
| lucide-react | ^0.563 | Consistent icon set |
| lottie-react / dotlottie-react | — | Animated illustrations for empty & loading states |
| Prettier | — | Opinionated code formatting (import organizer included) |
| ESLint | 9 | Linting with React Hooks + Refresh plugins |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A running instance of the [ExaminationSystem Web API](https://github.com/ahmads1990/ExaminationSystemWebAPI)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmads1990/ExaminationSystemReact.git
cd ExaminationSystemReact

# 2. Install dependencies
npm install

# 3. Configure the API base URL
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL
```

### Environment Variables

```env
# .env.example
VITE_API_BASE_URL=https://localhost:7001
```

### Running Locally

```bash
npm run dev
# → http://localhost:5173
```

### Other Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check & build for production (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |

---

## 📄 Pages & Routes

### 🔐 Auth Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email + password login |
| Register | `/register` | Tabbed Student / Instructor registration |
| Verify Email | `/verify-email` | OTP input + resend option |
| Forgot Password | `/forgot-password` | Request reset link by email |
| Reset Password | `/reset-password` | Set new password via token |
| Change Password | `/change-password` | Change password while authenticated |

### 👨‍🏫 Instructor Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/instructor/dashboard` | Course stats — enrollments, exam counts |
| Courses | `/instructor/courses` | CRUD for courses |
| Exams | `/instructor/exams` | Full exam lifecycle management |
| Questions | `/instructor/exams/:id/questions` | Question bank per exam |
| Submissions | `/instructor/exams/:id/submissions` | Student attempt review |
| Grading | `/instructor/grading` | Manual grading interface |
| Analytics | `/instructor/analytics` | Exam performance analytics |

### 👨‍🎓 Student Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/student/dashboard` | Enrolled courses + available exams |
| Courses | `/courses` | Browse all courses, enroll |
| Exam Start | `/student/exams/:id/start` | Exam info & rules before starting |
| Exam Taking | `/student/exams/take` | Full-screen timed exam environment |
| Exam Result | `/student/exams/result` | Score, grade, pass/fail after submission |
| Exam History | `/student/history` | Paginated history of all attempts |
| Calendar | `/student/calendar` | Upcoming exam schedule |

---

## 🌍 Localization (i18n)

The app ships with full **English** and **Arabic (RTL)** support via `i18next`.

```
src/i18n/
├── config.ts          ← i18next initialization (language detection, fallback)
└── locales/
    ├── en.json        ← English translations
    └── ar.json        ← Arabic translations
```

A language switcher in the top navbar lets users toggle between locales at runtime. All UI strings — including navigation labels, form placeholders, error messages, and modal titles — are routed through the `t()` helper.

---

## 🔗 Related Projects

| Project | Repository | Description |
|---------|------------|-------------|
| **ExamSys Web API** | [ExaminationSystemWebAPI](https://github.com/ahmads1990/ExaminationSystemWebAPI) | .NET 8 Clean Architecture backend powering this frontend |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit using conventional commits: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ — part of the **ExamSys** full-stack project

</div>
