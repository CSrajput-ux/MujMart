<div align="center">

  <img src="frontend/public/logo.jpg" alt="MUJMart Logo" width="110" style="border-radius: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />

  # 🛒 MUJMart

  ### **The Next-Gen Campus Marketplace & P2P Trading Platform for Manipal University Jaipur**

  <p align="center">
    <b>A secure, student-exclusive ecosystem to Buy, Sell, Rent, Share, and Negotiate with Escrow-protected UPI transactions.</b>
  </p>

  <p align="center">
    <a href="https://github.com/CSrajput-ux/MujMart/stargazers"><img src="https://img.shields.io/github/stars/CSrajput-ux/MujMart?style=for-the-badge&logo=starship&color=F59E0B" alt="Stars" /></a>
    <a href="https://github.com/CSrajput-ux/MujMart/network/members"><img src="https://img.shields.io/github/forks/CSrajput-ux/MujMart?style=for-the-badge&color=3B82F6" alt="Forks" /></a>
    <a href="https://github.com/CSrajput-ux/MujMart/issues"><img src="https://img.shields.io/github/issues/CSrajput-ux/MujMart?style=for-the-badge&color=10B981" alt="Issues" /></a>
    <a href="https://github.com/CSrajput-ux/MujMart/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge" alt="License" /></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Prisma_5-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </p>

  <br />

  <p align="center">
    <a href="#-the-problem--our-solution"><b>The Vision</b></a> •
    <a href="#-key-features"><b>Key Features</b></a> •
    <a href="#-system-architecture"><b>Architecture</b></a> •
    <a href="#-transaction--escrow-protocol"><b>Escrow Engine</b></a> •
    <a href="#-tech-stack"><b>Tech Stack</b></a> •
    <a href="#-api-reference"><b>API Reference</b></a> •
    <a href="#-quickstart-guide"><b>Getting Started</b></a> •
    <a href="#-project-structure"><b>Structure</b></a>
  </p>

</div>

---

## 💡 The Problem & Our Solution

### ❌ The Campus Problem
At **Manipal University Jaipur (MUJ)**, thousands of hostelers and day-scholars buy, sell, or rent textbooks, electronics, mattresses, kettles, cycles, and lab equipment every semester. However:
- Deals happen in cluttered, spam-ridden WhatsApp & Telegram groups.
- No identity verification leads to scams, ghosting, and unsafe meetups.
- Sellers struggle to receive timely payments; buyers lack escrow protection.
- Chat history gets buried within hours with no search filters or categories.

### ✅ The MUJMart Solution
**MUJMart** replaces fragmented chat groups with an all-in-one, high-performance platform:
- 🛡️ **Campus-Only Verified Ecosystem**: Authenticated student profiles with trust/reputation scoring (`repScore`) and deal counters.
- 💬 **Live Anonymous Negotiation**: Real-time Socket.io chat threads that shield personal contact info until a deal is locked.
- 💳 **Escrow-Secured Payments**: UPI dynamic QR payments with UTR verification and 5% platform safety margin before seller payout.
- 🔄 **Multi-Mode Commerce**: Sell, Resale, Rent, Free (Giveaways), Task Sharing, and Project Request collaborations.
- ⚖️ **Integrated Dispute Arbitration**: Formal dispute logging and Admin resolution dashboard for complete peace of mind.

---

## ✨ Key Features

### 🛍️ 1. Multi-Tier Marketplace & Discovery
- **Comprehensive Listing Modes**:
  - `sell`: Direct item sales with instant deal closing.
  - `resale`: Second-hand hostel gear with condition tags (*New*, *Good*, *Fair*, *Damaged*).
  - `rent`: Short-term lending with return timelines and deposit tracking.
  - `free`: Campus giveaways and donation drives.
  - `share`: Shared study materials, room resources, and rides.
- **Rich Media & Attachments**: Upload multi-image galleries and document attachments securely via Cloudinary.
- **Smart Filtering & Search**: Instant full-text search across categories, price bands, condition ratings, and expiry deadlines.
- **Automated Lifecycle**: 7-day auto-expiry timers, marking items as `active`, `sold`, `expired`, or `removed`.

### 💬 2. Real-Time Negotiation Engine (Socket.io)
- **Direct Listing-Linked Threads**: Every conversation is tied to a specific listing to avoid context loss.
- **Stateful Negotiations**: Real-time deal states: `open` ➔ `accepted` ➔ `rejected` ➔ `closed`.
- **Content Masking (`contentGuard`)**: Server-side regex filtering automatically blocks phone numbers and external social handles during anonymous talks.
- **Persistent Message Store**: Chat history preserved in PostgreSQL with instant synchronization across devices.

### 💳 3. Escrow Transaction & Margin Engine
- **UPI QR & Reference Generation**: Built-in dynamic UPI payment rendering via `qrcode.react`.
- **UTR & Screenshot Submission**: Buyers upload their UPI transaction reference number (UTR) and payment screenshot for audit.
- **State Machine Safeguard**:
  `pending_payment` ➔ `verifying_payment` ➔ `escrow` ➔ `ready_for_payout` ➔ `completed` (or `refunded`).
- **Platform Margin Tracking**: 5% fee calculation automatically recorded per deal for platform sustainability.

### 🤝 4. Campus Projects & Task Collaboration
- **Project Requests**: Solicit or offer student freelance work, lab assistance, and peer study help.
- **Collaborator Workflows**: Accept or reject incoming applications with linked chat threads and notifications.

### 🔔 5. Notifications & Support Desk
- **In-App Notification Feed**: Real-time alerts for incoming bids, deal approvals, project requests, and dispute updates.
- **Dedicated Help Center**: One-click WhatsApp & email escalation channels, FAQ accordion, and direct ticket submission.
- **Report Issue Center**: Submit bug reports and marketplace violations with screenshot proof uploads.

### 👑 6. Administrator Command Center
- **User Moderation**: View all registered students, verify UPI details, inspect reputation scores, and enforce account bans.
- **Dispute Resolution Suite**: Review reporter/defendant chat logs, evaluate evidence, and resolve or dismiss disputes.
- **Financial Oversight**: Audit gross transaction volume, collected platform margins, and pending UPI payouts.

---

## 🏗 System Architecture

MUJMart utilizes a clean **Decoupled Architecture** separating modern Next.js client experiences from a scalable Node.js/Express service layer.

```mermaid
graph TB
    subgraph Client ["Client Layer (Next.js 16 + React 19)"]
        UI[Tailwind CSS 4 Responsive UI]
        ChatClient[Socket.io Real-time Client]
        AuthContext[Auth & Session Context]
    end

    subgraph Gateway ["API Gateway (Express + TypeScript)"]
        Router[REST Route Handlers]
        SocketServer[Socket.io Realtime Engine]
        Security[Helmet + CORS + Rate Limiting]
        AuthGuard[JWT Auth Middleware]
    end

    subgraph Services ["External & Auxiliary Services"]
        Cloudinary[Cloudinary CDN: Media & Screenshots]
        Firebase[Firebase Client Services]
        Vercel[Vercel Speed & Web Analytics]
    end

    subgraph Data ["Persistence Layer"]
        Prisma[Prisma ORM 5]
        PostgreSQL[(PostgreSQL Relational DB)]
    end

    UI <-->|HTTP / JSON| Security
    Security --> AuthGuard --> Router
    ChatClient <-->|WebSockets (ws://)| SocketServer
    Router <--> Prisma
    SocketServer <--> Prisma
    Prisma <--> PostgreSQL
    Router <--> Cloudinary
```

---

## 🔄 Transaction & Escrow Protocol

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as 🎓 Buyer
    actor Seller as 🎒 Seller
    participant API as ⚡ MUJMart Server
    participant DB as 🗄️ PostgreSQL / Escrow

    Buyer->>Seller: Negotiate offer via Socket.io Chat
    Seller->>Buyer: Accept Offer (Thread: accepted)
    Buyer->>API: Initiate Transaction (status: pending_payment)
    Buyer->>API: Submit UPI UTR + Payment Screenshot
    API->>DB: Lock Funds in Escrow (status: escrow)
    API-->>Seller: Notify: Payment verified in Escrow. Handoff item!
    Note over Buyer,Seller: Physical item handoff on MUJ Campus
    Buyer->>API: Confirm Handover & Item Condition
    API->>DB: Status: ready_for_payout
    API->>Seller: Release payment to Seller's UPI ID / QR (minus 5% margin)
    API->>DB: Mark Transaction Completed
```

---

## 🧰 Tech Stack

### Frontend Application
| Layer | Technology | Details |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Components & Static Optimization |
| **Library** | [React 19](https://react.dev/) | Concurrent UI rendering |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across components |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Modern CSS variables & lightning-fast utility engine |
| **Realtime** | [Socket.io Client](https://socket.io/) | Bi-directional WebSocket communication |
| **QR Engine** | [qrcode.react](https://www.npmjs.com/package/qrcode.react) | Dynamic UPI QR code generation |
| **Analytics** | [@vercel/analytics](https://vercel.com/analytics) | Real user monitoring |

### Backend API & Database
| Layer | Technology | Details |
|---|---|---|
| **Runtime** | [Node.js 18+](https://nodejs.org/) | Fast V8 JavaScript runtime |
| **Framework** | [Express 4](https://expressjs.com/) | RESTful routing and API orchestration |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Typed controllers, models & services |
| **ORM** | [Prisma 5.22](https://www.prisma.io/) | Type-safe queries, migrations, and schema modeling |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | ACID-compliant relational data store |
| **WebSockets** | [Socket.io 4.8](https://socket.io/) | Room-based real-time chat & deal events |
| **Authentication** | [JWT](https://jwt.io/) & [bcrypt](https://www.npmjs.com/package/bcrypt) | Secure stateless tokens and salt-hashed passwords |
| **Cloud Storage** | [Cloudinary](https://cloudinary.com/) | Image optimization and secure document storage |
| **Security** | [Helmet](https://helmetjs.github.io/), CORS, Rate-Limit | Defense against brute-force & common vulnerabilities |
| **Testing** | [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest) | Automated API integration and unit testing |

---

## 🗃️ Database Schema & Data Models

The Prisma relational model (`backend/prisma/schema.prisma`) powers MUJMart:

```mermaid
erDiagram
    User ||--o{ Listing : "creates (seller)"
    User ||--o{ Thread : "participates (buyer/seller)"
    User ||--o{ Message : "sends"
    User ||--o{ Transaction : "engages in (buyer/seller)"
    User ||--o{ Dispute : "files"
    User ||--o{ Notification : "receives"
    User ||--o{ ProjectRequest : "requests / owns"

    Listing ||--o{ Thread : "has"
    Listing ||--o{ Transaction : "generates"
    Listing ||--o{ ProjectRequest : "receives"

    Thread ||--o{ Message : "contains"
    Thread ||--o{ Dispute : "can have"
```

### Key Models Overview

| Model | Primary Purpose | Key Fields |
|---|---|---|
| `User` | Student & Admin Accounts | `id`, `name`, `email`, `role`, `alias`, `upiId`, `upiQrUrl`, `repScore`, `dealCount`, `isBanned` |
| `Listing` | Marketplace Item Catalogue | `id`, `title`, `description`, `price`, `type`, `category`, `condition`, `images`, `status`, `expiresAt` |
| `Thread` | Negotiation Chat Room | `id`, `status` (*open/accepted/closed/rejected*), `listingId`, `buyerId`, `sellerId` |
| `Message` | Chat Messages | `id`, `threadId`, `senderId`, `content`, `isFiltered`, `createdAt` |
| `Transaction` | Escrow Financial Record | `id`, `amount`, `platformMargin` (5%), `status`, `utrNumber`, `paymentScreenshotUrl` |
| `Dispute` | Dispute Cases | `id`, `threadId`, `reporterId`, `reason`, `status` (*open/resolved/dismissed*) |
| `Notification` | System & Deal Alerts | `id`, `userId`, `type`, `content`, `isRead`, `relatedId` |
| `ProjectRequest`| Student Tasks & Collabs | `id`, `listingId`, `requesterId`, `ownerId`, `status` |

---

## 🔌 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register student with name, email, password, and alias |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile, stats, and UPI data |
| `PUT` | `/api/auth/profile` | Authenticated | Update user contact info, address, and UPI payout ID |
| `POST` | `/api/auth/upload-qr` | Authenticated | Upload UPI QR image to Cloudinary |

### 📦 Marketplace Listings (`/api/listings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/listings` | Public | List active listings with search, category, and type filters |
| `GET` | `/api/listings/:id` | Public | Retrieve single listing detail with seller info |
| `POST` | `/api/listings` | Authenticated | Create a new listing (supports multi-image upload) |
| `PUT` | `/api/listings/:id` | Owner / Admin | Update listing information or price |
| `DELETE` | `/api/listings/:id` | Owner / Admin | Remove listing or soft-delete |
| `GET` | `/api/listings/user/my` | Authenticated | Get current user's active, sold, and expired listings |

### 💬 Negotiations & Chat (`/api/threads`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/threads` | Authenticated | Get all active negotiation threads for logged-in user |
| `POST` | `/api/threads` | Authenticated | Initiate or open negotiation thread for a listing |
| `GET` | `/api/threads/:id` | Participant | Fetch full message history of a thread |
| `PATCH` | `/api/threads/:id/status` | Participant | Update negotiation status (`accepted`, `rejected`, `closed`) |
| `POST` | `/api/threads/:id/dispute` | Participant | File formal dispute for moderator review |

### 💳 Escrow & Transactions (`/api/transactions`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/transactions` | Authenticated | Fetch buyer and seller transaction history |
| `POST` | `/api/transactions` | Authenticated | Create transaction record upon accepted offer |
| `POST` | `/api/transactions/:id/pay` | Buyer | Submit UTR reference number & payment receipt |
| `PATCH` | `/api/transactions/:id/status` | Buyer/Seller/Admin | Progress escrow status (confirm handoff, release payout) |

### 🤝 Project Requests (`/api/requests`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/requests` | Authenticated | Fetch incoming & outgoing task applications |
| `POST` | `/api/requests` | Authenticated | Submit collaboration request for project listing |
| `PATCH` | `/api/requests/:id` | Owner | Accept or reject application |

### 👑 Admin Management (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/metrics` | Admin Only | Get system stats (users, volume, margins, disputes) |
| `GET` | `/api/admin/users` | Admin Only | Manage all student users and toggle ban status |
| `PATCH` | `/api/admin/users/:id/ban` | Admin Only | Ban or unban user from marketplace |
| `GET` | `/api/admin/disputes` | Admin Only | View open dispute claims |
| `PATCH` | `/api/admin/disputes/:id` | Admin Only | Adjudicate dispute (*resolved* or *dismissed*) |
| `GET` | `/api/admin/transactions` | Admin Only | Audit all platform transactions and payout states |

---

## ⚡ Quickstart Guide

### Prerequisites
Make sure you have installed on your local machine:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL** (running locally or cloud instance e.g., Supabase / Neon / Render)
- *(Optional)* [Cloudinary Account](https://cloudinary.com/) for media image uploads

---

### 1. Clone the Repository
```bash
git clone https://github.com/CSrajput-ux/MujMart.git
cd MujMart
```

---

### 2. One-Command Setup
Install all dependencies across root, frontend, and backend with a single command:
```bash
npm run install-all
```

---

### 3. Environment Variables Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Navigate to backend
cd backend
cp .env.example .env # or create manually
```

Populate `backend/.env` with your credentials:

```env
# Application Port
PORT=4000
NODE_ENV=development

# Frontend Client URL (for CORS whitelist)
FRONTEND_URL=http://localhost:3000

# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres:password@localhost:5432/mujmart?schema=public"

# Security Secrets (Generate a secure random string)
JWT_SECRET=super_secret_jwt_key_mujmart_2026_change_in_prod

# Cloudinary Storage (Optional for local mockup, required for live media upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 4. Database Setup & Seeding

From the repository root, run the database setup script to generate Prisma Client, apply migrations, and populate mock data:

```bash
# From repository root:
npm run db:setup
```

*(Or run manually step-by-step)*
```bash
npm run db:generate   # Generate Prisma Client
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed campus mock users, listings & transactions
```

> 💡 **Tip**: Launch the Prisma visual GUI anytime to inspect database records:
> ```bash
> npm run db:studio
> ```

---

### 5. Launch Development Servers

Start both Frontend and Backend concurrently with one command from the project root:

```bash
npm run dev
```

| Application | Address |
|---|---|
| 🌐 **Next.js Frontend UI** | [http://localhost:3000](http://localhost:3000) |
| ⚡ **Express REST API** | [http://localhost:4000](http://localhost:4000) |
| 🔌 **Socket.io Endpoint** | `ws://localhost:4000` |
| 📊 **Prisma Studio (Optional)** | [http://localhost:5555](http://localhost:5555) |

---

## 📂 Project Structure

```
MujMart/
├── frontend/                     # Next.js 16 Application
│   ├── public/                   # Static assets (logo, banners, icons)
│   ├── src/
│   │   ├── app/                  # App Router Pages
│   │   │   ├── admin/            # Admin moderation & metrics dashboard
│   │   │   ├── cart/             # Saved items & checkout
│   │   │   ├── chat/             # Realtime Socket.io negotiation room
│   │   │   ├── help/             # Help Center, FAQ & WhatsApp support
│   │   │   ├── listing/          # Listing view & offer modal
│   │   │   ├── login/            # Campus student login & registration
│   │   │   ├── my-listings/      # User inventory management
│   │   │   ├── notifications/    # Real-time alert center
│   │   │   ├── post/             # Create listing wizard (sell/rent/share)
│   │   │   ├── profile/          # User profile, UPI details & rep score
│   │   │   ├── report-issue/     # Dispute & ticket filing with uploads
│   │   │   ├── search/           # Category search & faceted filters
│   │   │   ├── settings/         # Account preferences & security
│   │   │   ├── task/             # Campus task / project collaboration
│   │   │   ├── layout.tsx        # Global layout with persistent Navbar & Footer
│   │   │   └── page.tsx          # Hero homepage with featured items
│   │   ├── components/           # Reusable UI components & cards
│   │   └── lib/                  # Utilities, auth helpers & API clients
│   └── package.json
│
├── backend/                      # Express + TypeScript Server
│   ├── prisma/
│   │   ├── schema.prisma         # Database models & relationships
│   │   └── seed.ts               # Seed data for campus categories & demo users
│   ├── src/
│   │   ├── middleware/           # authMiddleware, adminGuard, rateLimiter
│   │   ├── routes/               # API route handlers
│   │   │   ├── admin.ts          # Metrics, user bans, dispute resolution
│   │   │   ├── auth.ts           # Registration, login, profile, UPI QR
│   │   │   ├── listings.ts       # Listing CRUD, search & filters
│   │   │   ├── notifications.ts  # Notification tracking
│   │   │   ├── requests.ts       # Collaboration requests
│   │   │   ├── threads.ts        # Chat threads & content filter
│   │   │   └── transactions.ts   # Escrow logic & UTR verification
│   │   ├── socket/               # Realtime Socket.io handler
│   │   ├── tests/                # Jest & Supertest integration tests
│   │   └── index.ts              # Server bootstrap & socket attachment
│   └── package.json
│
├── package.json                  # Root monorepo command scripts
└── README.md                     # Project documentation
```

---

## 📜 All Available Scripts

Run these scripts from the repository root:

| Command | Action |
|---|---|
| `npm run dev` | Starts **both** Frontend and Backend concurrently |
| `npm run dev:frontend` | Starts only the Next.js frontend on port 3000 |
| `npm run dev:backend` | Starts only the Express API server on port 4000 |
| `npm run setup` | Full initial setup (Install all packages + DB setup) |
| `npm run install-all` | Installs dependencies in root, frontend, and backend |
| `npm run build` | Compiles frontend for production |
| `npm run build:backend` | Compiles backend TypeScript to JavaScript (`dist/`) |
| `npm run lint` | Runs ESLint over frontend code |
| `npm run db:setup` | Generates Prisma client, applies migrations & seeds database |
| `npm run db:generate` | Regenerates Prisma Client |
| `npm run db:migrate` | Runs pending Prisma migrations |
| `npm run db:seed` | Populates sample campus data into PostgreSQL |
| `npm run db:reset` | Wipes database, applies all migrations & reseeds clean state |
| `npm run db:studio` | Opens visual database explorer in browser |

---

## 🧪 Testing

The backend includes automated integration tests configured with **Jest** and **Supertest**:

```bash
# Run backend test suite
cd backend
npm test
```

---

## 🛡️ Security & Campus Integrity

MUJMart implements multi-layered security controls:

1. **Authentication**: Stateless HMAC-SHA256 JWT tokens with automatic expiry.
2. **Password Safety**: Salt-hashed passwords using `bcrypt` (10 rounds).
3. **Data Protection**: `helmet` headers configured to protect against XSS, clickjacking, and MIME-sniffing.
4. **Abuse Mitigation**: `express-rate-limit` prevents brute-force login attempts and spam listing creations.
5. **Content Filtering**: Masking algorithm automatically redacts contact numbers and external links in chat until formal deal acceptance.
6. **Dispute Redressal**: Any user can report a transaction or chat thread directly into the Admin Tribunal for arbitration.

---

## 🗺️ Roadmap & Upcoming Enhancements

- [ ] **Campus SSO Integration**: Direct Manipal University Jaipur Microsoft/Google OAuth login.
- [ ] **AI-Powered Fair Price Estimator**: Suggests fair prices based on historical campus deals.
- [ ] **Hostel Room Delivery Network**: Peer-to-peer student couriers for intra-campus delivery.
- [ ] **Direct UPI Deep-Linking**: One-tap intent payments via GPay, PhonePe, and Paytm mobile apps.
- [ ] **Progressive Web App (PWA)**: Offline browsing and native push notifications on mobile devices.

---

## 🤝 Contributing

We welcome contributions from the MUJ student and developer community!

1. **Fork** the repository.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "feat: add amazing campus feature"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** with a detailed explanation of your improvements.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

  ### 👨‍💻 Created with ❤️ by **[CSrajput-ux](https://github.com/CSrajput-ux)**
  *Empowering students at Manipal University Jaipur through modern open technology.*

  <br />

  [![GitHub Stars](https://img.shields.io/github/stars/CSrajput-ux/MujMart?style=social)](https://github.com/CSrajput-ux/MujMart)
  &nbsp;&nbsp;&nbsp;&nbsp;
  [![GitHub Follow](https://img.shields.io/github/followers/CSrajput-ux?label=Follow%20CSrajput-ux&style=social)](https://github.com/CSrajput-ux)

</div>
