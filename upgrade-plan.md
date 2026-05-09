# ReadiumX Upgrade Plan: Transition to Cloudflare & Clerk

This document outlines the strategic roadmap for upgrading the ReadiumX tech stack and migrating infrastructure to Cloudflare. The primary goals are to improve performance, simplify authentication management, and leverage edge-native capabilities.

## 🎯 Objectives
- **Infrastructure**: Migrate from Railway to Cloudflare Pages.
- **Authentication**: Replace Lucia Auth with Clerk for managed user identity and simplified flows.
- **Next.js**: Upgrade to Next.js 16 (utilizing React 19 features).
- **Data Fetching**: Transition from SWR to TanStack Query (React Query) with persistent client-side caching.
- **Server Actions**: Enhance ZSA (Zod Server Actions) integration with TanStack Query.
- **Edge Optimization**: Move heavy extraction logic to Cloudflare Workers.

---

## 📅 Phase 1: Foundation & Tooling Upgrade
**Goal**: Update the core framework and prepare for the Cloudflare environment.

1.  **Framework Upgrade**:
    - Upgrade `next` to latest.
    - Upgrade `react` and `react-dom` to `19.0.0` (or latest).
    - Install `@cloudflare/next-on-pages` for deployment compatibility.
2.  **Server Action Enhancements**:
    - Upgrade `zsa` and `zsa-react` to latest versions.
    - Install `zsa-react-query` to bridge Server Actions with TanStack Query hooks.
3.  **Cloudflare Adapter**:
    - Switch the Next.js runtime configuration to `edge` where applicable.
    - Ensure Turso (LibSQL) is using the `@libsql/client/web` driver for edge compatibility.

---

## 🔐 Phase 2: Authentication Migration (Lucia → Clerk)
**Goal**: Remove self-managed session logic and replace it with Clerk's managed service.

1.  **Clerk Integration**:
    - Install `@clerk/nextjs`.
    - Setup Clerk middleware to replace the existing `middleware.ts` logic.
    - Implement custom Clerk UI components to maintain the "premium" aesthetic.
2.  **Database Cleanup**:
    - Remove `sessions` and `accounts` tables from `server/db/schema.ts` (Clerk will manage these).
    - Update `users` table to use `clerkId` as the primary identifier.
3.  **Code Deletion**:
    - Delete `server/auth.ts`, `data-access/accounts.ts`, and all Lucia-specific adapters.
    - Remove `arctic` and `lucia` dependencies.
4.  **Email Removal**:
    - Deprecate `Resend` for auth-related emails (Clerk handles verification/magic links).
    - Retain `Resend` only for specific application-level notifications if needed.

---

## 🔄 Phase 3: Data Fetching Refactor (SWR → TanStack Query)
**Goal**: Implement a robust caching and synchronization layer.

1.  **Setup TanStack Query**:
    - Install `@tanstack/react-query` and `@tanstack/query-sync-storage-persister`.
    - Configure the `QueryClient` with a persistence layer using `localStorage` for offline-first capabilities.
2.  **Refactor Hooks**:
    - Replace all `useSWR` calls with `useQuery`.
    - Migrate mutations (currently handled by raw Server Actions or ZSA) to `useMutation` via `zsa-react-query`.
3.  **Global State**:
    - Evaluate if any `zustand` state can be moved into TanStack Query's cache to reduce complexity.

---

## ⚡ Phase 4: Edge Optimization & Extraction
**Goal**: Leverage Cloudflare's global network for heavy lifting.

1.  **Extraction Worker**:
    - Move the `cheerio`/`playwright` extraction logic into a standalone Cloudflare Worker.
    - This avoids blocking the main Next.js thread and allows for better scaling.
    - Use the worker as a private internal API called by the Next.js App Router.
2.  **Edge Caching**:
    - Implement Cloudflare KV or Durable Objects for short-term caching of extracted article content to minimize re-scraping.

---

## 🧹 Phase 5: Cleanup & Deployment
**Goal**: Finalize the migration and go live.

1.  **Environment Variables**:
    - Migrate secrets from Railway to Cloudflare Pages environment variables.
2.  **Build Optimization**:
    - Run `npx @cloudflare/next-on-pages` to validate the build.
3.  **Testing**:
    - End-to-end testing of the auth flow (Clerk).
    - Verify database connectivity from the edge (Turso).
4.  **Dependency Purge**:
    - Uninstall `lucia`, `arctic`, `swr`, and unused `crypto` utilities.

---

## 🛠️ Required Dependencies to Install
```bash
pnpm add next@latest react@latest react-dom@latest @clerk/nextjs @tanstack/react-query @tanstack/query-sync-storage-persister zsa-react-query @cloudflare/next-on-pages
```

## 🗑️ Dependencies to Remove
```bash
pnpm remove lucia arctic @lucia-auth/adapter-drizzle swr
```
