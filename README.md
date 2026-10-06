# 🛒 MUJMart

<p align="center">
  <strong>A campus-focused marketplace for Manipal University Jaipur students.</strong><br/>
  Buy • Sell • Rent • Negotiate • Connect
</p>

<p align="center">
  <a href="https://github.com/CSrajput-ux/MujMart">GitHub</a>
</p>

---

## 📌 Overview

**MUJMart** is a full-stack campus marketplace designed around the needs of students at Manipal University Jaipur (MUJ).

The platform brings common student-to-student marketplace workflows into one place: creating listings, discovering items, negotiating with sellers, handling transactions, raising disputes, receiving notifications, and managing the marketplace through an admin layer.

The project is implemented as a **decoupled frontend + backend application**:

```
Next.js Frontend  ⇄  Express/TypeScript API  ⇄  Prisma  ⇄  PostgreSQL
                          │
                          ├── Socket.io
                          ├── JWT + bcrypt
                          └── Cloudinary
```

---

## ✨ Key Features

### 🛍️ Marketplace
- Create and manage product listings.
- Support multiple listing types such as:
  - Sell
  - Resale
  - Rent
  - Free
  - Share
- Add product descriptions, prices, categories, conditions, images and attachments.
- Listing lifecycle support such as **active, sold, expired and removed**.
- Optional listing deadlines and automatic expiry timestamps.

### 💬 Real-time Negotiation
- Buyer and seller communication through **Socket.io**.
- Thread-based conversations linked to individual listings.
- Conversation states such as open, accepted, closed and rejected.
- Message persistence in the database.
- Support for filtered messages through the backend message model.

### 💳 Transaction & Payment Workflow
- Transaction records linked to buyers, sellers and listings.
- Payment lifecycle tracking:
  - Pending payment
  - Payment verification
  - Escrow
  - Ready for payout
  - Completed
  - Refunded
- UTR/payment reference support.
- Payment screenshot upload support.
- Platform margin tracking.
- Cloudinary-backed image/document storage.

### ⚡ Notifications
- Persistent notification records.
- Read/unread notification state.
- Support for marketplace/request-related notifications.

### 📑 Requests & Disputes
- Project/request workflow connected to listings.
- Request states:
  - Pending
  - Accepted
  - Rejected
- Buyer/seller dispute creation and resolution workflow.
- Admin-side oversight for marketplace operations.

### 🛡️ Authentication & Security
- JWT-based authentication.
- Password hashing with bcrypt.
- Role support for **student** and **admin**.
- Account ban support.
- Express security middleware including:
  - Helmet
  - CORS
  - Rate limiting
  - Authentication middleware

### 👨‍💼 Admin
- Dedicated admin routes.
- Administrative management of users, listings, transactions and disputes.
- Role-based access control at the backend layer.

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework / application routing |
| **React 19** | UI |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Styling |
| **Firebase** | Frontend Firebase integration |
| **Vercel Analytics** | Analytics |
| **qrcode.react** | QR rendering |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express** | REST API |
| **TypeScript** | Type-safe backend |
| **Prisma** | ORM / database access |
| **PostgreSQL** | Relational database |
| **Socket.io** | Real-time communication |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Cloudinary** | Media storage |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | Rate limiting |
| **Multer** | Multipart file uploads |
| **Jest + Supertest** | Backend testing |

---

## 📂 Project Structure

```
MujMart/
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js application routes/pages
│   │   ├── components/      # Reusable UI components
│   │   └── lib/             # Frontend utilities / integrations
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── src/
│   │   ├── middleware/      # Auth/security middleware
│   │   ├── routes/          # API route modules
│   │   ├── socket/          # Socket.io logic
│   │   ├── tests/           # Backend tests
│   │   └── index.ts         # Backend entry point
│   ├── package.json
│   └── ...
│
├── package.json             # Root workspace scripts
└── README.md
```

### Backend Route Modules

The backend currently separates major API responsibilities into modules for:

- Authentication
- Listings
- Threads / negotiations
- Transactions
- Notifications
- Requests
- Administration

---

## 🗃️ Data Model

The Prisma schema currently defines the main domain entities:

```
User
 ├── Listings
 ├── Threads
 │    └── Messages
 ├── Transactions
 ├── Disputes
 ├── Notifications
 └── Project Requests

Listing
 ├── Threads
 ├── Transactions
 └── Project Requests
```

Important database models include:

- `User`
- `Listing`
- `Thread`
- `Message`
- `Transaction`
- `Dispute`
- `Notification`
- `ProjectRequest`

---

## 🚀 Getting Started

### Prerequisites

Install:

- **Node.js 18+**
- **npm**
- **PostgreSQL**
- A Cloudinary account for media uploads if using the upload flow

### 1. Clone the repository

```bash
git clone https://github.com/CSrajput-ux/MujMart.git
cd MujMart
```

### 2. Install dependencies

Install everything from the repository root:

```bash
npm run install-all
```

Or install manually:

```bash
npm install

cd frontend
npm install

cd ../backend
npm install
```

### 3. Configure environment variables

Create your environment file inside `backend/`.

Example:

```env
PORT=4000
JWT_SECRET=your_long_random_secret
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Add the Cloudinary credentials required by your deployment if media upload is enabled.

> Never commit real secrets or production credentials to GitHub.

### 4. Generate Prisma client and migrate

From the repository root:

```bash
npm run db:generate
npm run db:migrate
```

For local seed data:

```bash
npm run db:seed
```

### 5. Start the application

Run frontend and backend together:

```bash
npm run dev
```

Or start them individually:

```bash
npm run dev:frontend
npm run dev:backend
```

Typical local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

---

## 🧪 Testing

Backend tests are configured with **Jest** and **Supertest**.

Run:

```bash
cd backend
npm test
```

---

## 🏗️ Build for Production

### Frontend

```bash
npm run build
```

### Backend

```bash
npm run build:backend
```

Then start the compiled backend:

```bash
cd backend
npm start
```

---

## 📜 Available Root Commands

| Command | Description |
|---|---|
| `npm run dev` | Run frontend + backend together |
| `npm run dev:frontend` | Run only the frontend |
| `npm run dev:backend` | Run only the backend |
| `npm run build` | Build frontend |
| `npm run build:backend` | Build backend |
| `npm run lint` | Lint frontend |
| `npm run install-all` | Install root, frontend and backend dependencies |
| `npm run setup` | Install dependencies + database setup |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run db:reset` | Reset database and seed |
| `npm run db:studio` | Open Prisma Studio |

---

## 🔐 Security Notes

MUJMart includes several backend security mechanisms:

- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Account ban support
- HTTP security headers with Helmet
- Rate limiting
- CORS configuration
- Server-side request handling
- Environment-based secret configuration

For production, use a strong random JWT secret, production PostgreSQL credentials, restrictive CORS origins, and secure deployment secrets.

---

## 🎯 Project Goals

MUJMart is built to solve a simple campus problem:

> **Students frequently buy, sell, rent and exchange useful items, but campus-specific transactions are often scattered across chats and informal groups.**

MUJMart provides a structured marketplace experience with:

- Campus-focused discovery
- Student-to-student listings
- Negotiation threads
- Transaction tracking
- Dispute handling
- Notifications
- Administrative oversight

---

## 🔮 Future Scope

Potential future improvements include:

- Advanced marketplace search and ranking
- Better recommendation systems
- Improved moderation and fraud detection
- More automated payment verification
- Progressive Web App / mobile experience
- Analytics dashboards for marketplace activity
- Stronger campus verification and identity controls

---

## 🤝 Contributing

Contributions are welcome.

A typical workflow:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

Then open a Pull Request with a clear description of the change.

---

## 📄 License

This repository currently uses the license declared in the project configuration. Check the repository before redistributing the code or deploying it as a commercial product.

---

## 👨‍💻 Author

**CSrajput-ux**

Built as a student-focused full-stack marketplace project for the MUJ ecosystem.

⭐ If you find MUJMart useful, consider starring the repository.

**Repository:** https://github.com/CSrajput-ux/MujMart
