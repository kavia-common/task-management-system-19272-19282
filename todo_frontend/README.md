# Nuxt Todo Frontend

A Nuxt 3 SPA for authentication and task management.

## Configure API base URL

Create `.env` (or set env vars) using `.env.example`:

```
NUXT_PUBLIC_API_BASE=http://localhost:4000
```

This should point to the todo_backend base URL.

## Scripts

- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

## Features

- Sign up, login, logout
- JWT stored in localStorage (SPA constraint)
- View, create, edit, delete tasks
- Responsive minimal UI, no external CSS deps

## Notes

- If backend uses a different port/host, change `NUXT_PUBLIC_API_BASE`.
- On 401 responses, the app clears session and redirects to login.
