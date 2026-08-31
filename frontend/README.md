# MujMart Frontend

The frontend of MujMart is a modern, responsive web application built with Next.js. For the full system architecture and backend roadmap, see the **[Root README.md](file:///Users/souvik/Project/MujMart/README.md)**.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API (Auth, Demo, Cart)

## Key Features Implemented
- **Login & Signup**: Beautifully designed auth pages with Google OAuth support and Demo Modes for both Customer and Admin.
- **Admin Panel**: Complete dashboard for managing listings, users, disputes, and margins.
- **Marketplace**: Hero banners, category filtering, responsive listing grids.
- **Product Details**: Photo galleries and detailed listing information.
- **User Profile**: Custom profile pages with user-specific listings and ratings.

## How to Run
1.  Enter the directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`

## Recent Fixes
- Fixed `@/` path alias resolution in `tsconfig.json`.
- Removed unused imports to keep code clean.
