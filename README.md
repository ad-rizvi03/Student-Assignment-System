# Student Assignment Dashboard (React + Tailwind)

This is a small demo project implementing a role-based assignment & review dashboard using React, Vite, and Tailwind CSS. It simulates backend data using localStorage and a mock dataset.

Key features
- Students can view their assignments and confirm their submission with a two-step verification flow.
- Admins (professors) can create assignments and view per-student submission progress visualized with progress bars.
- Responsive UI built with Tailwind CSS.
- Data persisted in browser localStorage.

Stack
- React 18
- Vite
- Tailwind CSS

Quick setup
1. Install dependencies:

```powershell
cd "c:\Users\S M ADNAN RIZVI\Desktop\Student Assignment System"
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
npm run preview
```

Folder structure
- `index.html` - app entry
- `package.json` - scripts & deps
- `src/`
  - `main.jsx` - React bootstrap
  - `App.jsx` - main app (role switch, persistence)
  - `data/mockData.js` - sample users & assignments
  - `utils/storage.js` - localStorage helpers
  - `views/` - `StudentView.jsx`, `AdminView.jsx`
  - `components/` - `AssignmentCard`, `ConfirmModal`, `ProgressBar`
  - `index.css` - Tailwind entry

Component structure & decisions
- App: top-level state and user switch. Persists data to localStorage for demo purposes.
- StudentView: shows only assignments assigned to that student. Implements double-confirm flow using two modal stages.
- AdminView: lists assignments created by the admin and shows per-student progress bars. Simple creation form to add assignments (assigned to all students by default).
- AssignmentCard & ProgressBar: small, reusable UI pieces.

Design notes & edge cases
- No backend: everything is stored in localStorage. Clearing storage resets to mock data.
- The double-confirm flow is client-only; in a real app you'd verify server-side timestamps and prevent fraud.
- The admin creation form is intentionally minimal to keep the demo focused.

Deployment
- This is a static SPA — you can deploy the `dist` folder produced by `npm run build` to Netlify, Vercel or any static hosting provider.

Next steps (optional)
- Add search/filter and sorting for assignments.
- Add per-assignment comments or grading metadata.
- Wire to a real backend (REST/GraphQL) and implement authentication.
