# User Explorer

A Next.js (App Router) + TypeScript application that fetches users from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users), displays them in a searchable list, and demonstrates conscious React performance decisions.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **User list** — Displays name, email, and company for each user
- **Case-insensitive search** — Filter users by name or email in real-time
- **Debounced input** — Search only triggers after 300ms of idle typing
- **UI states** — Loading spinner, error message, and empty state are handled explicitly
- **Responsive grid** — 1 column on mobile, 2 on tablet, 3 on desktop

## Project Structure

```
src/
├── app/
│   ├── globals.css          # CSS variables, reset, theme
│   ├── layout.tsx           # Root layout (Server Component)
│   └── page.tsx             # Root page (Server Component)
├── components/
│   ├── SearchInput/         # Search input with clear button
│   ├── StatusMessage/       # Loading / error / empty states
│   ├── UserCard/            # Individual user card
│   ├── UserExplorer/        # Main orchestrator (Client Component)
│   └── UserList/            # Responsive card grid
├── hooks/
│   ├── useDebounce.ts       # Generic debounce hook
│   └── useUsers.ts          # Data fetching with loading/error states
└── types/
    └── user.ts              # User interface (only displayed fields)
```

## Architecture Decisions

### Server Component + Single Client Boundary

`page.tsx` and `layout.tsx` are Server Components. All interactivity lives inside the `UserExplorer` component, which is the **only** `"use client"` boundary. This means:

- The page shell renders on the server for fast initial load
- JavaScript for interactivity is scoped to what's actually interactive
- No unnecessary client-side code for static parts of the layout

### Client-Side Data Fetching (instead of Server-Side)

The task requires explicit management of loading, error, and empty states. Fetching on the client with `useEffect` in a custom `useUsers` hook lets us demonstrate:

- Explicit `useState` for `isLoading` / `error` / `data`
- `AbortController` cleanup to prevent state updates on unmounted components
- Error handling for both network failures and non-OK HTTP responses

If this were a production app with SEO requirements, server-side fetching with Suspense boundaries would be preferred.

### TypeScript — Intentional, Not Just for Errors

The `User` type only includes fields we actually display (`id`, `name`, `email`, `company.name`). This keeps the contract minimal and intentional rather than mirroring the entire API response shape.

All component props are explicitly typed with interfaces — no `any`, no implicit types.

## Performance Decisions

Each optimization below is deliberate and targeted at a specific problem:

### 1. `useDebounce` (300ms delay)

**Problem**: Without debouncing, every keystroke would trigger `Array.filter()` over the full user list and re-render all cards.

**Solution**: The raw `query` state updates immediately (so the input feels responsive), but `debouncedQuery` only updates after 300ms of idle time. Filtering is driven by `debouncedQuery`.

**Why 300ms?** It's a well-tested sweet spot — fast enough that users don't notice the delay, slow enough to batch rapid keystrokes.

### 2. `useMemo` for Filtered Results

**Problem**: The `Array.filter()` + `toLowerCase()` operation would run on every render, even if unrelated state changed.

**Solution**: `useMemo` with `[users, debouncedQuery]` dependencies ensures the filtering only recalculates when inputs actually change.

**When it matters**: If the user list grows to thousands of entries, skipping unnecessary filter passes becomes significant.

### 3. `React.memo` on `UserCard`

**Problem**: When the filtered list changes, React re-renders all children by default — even cards whose props haven't changed.

**Solution**: `React.memo` on `UserCard` performs a shallow comparison of the `user` prop. Cards that haven't changed skip rendering entirely.

**Why not on `UserList`?** Because `UserList` receives a new array reference every time the filter runs, so `memo` would never skip — it would just add overhead.

### 4. `useCallback` for `handleSearchChange`

**Problem**: Without `useCallback`, a new function reference is created on every render, which would cause `SearchInput` (wrapped in `React.memo`) to re-render unnecessarily.

**Solution**: `useCallback` with an empty dependency array creates a stable reference that persists across renders.

## Constraints

As specified in the task requirements:

- **No state management libraries** — only React `useState`
- **No data-fetching libraries** — only the Fetch API
- **No UI frameworks** — only CSS Modules
- **Only allowed**: Next.js, TypeScript, CSS Modules, Fetch API

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
