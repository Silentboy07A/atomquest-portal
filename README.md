# AtomQuest — In-House Goal Setting & Tracking Portal

A high-fidelity, enterprise-grade Goal Setting and Performance Tracking Portal built for the **AtomQuest Hackathon 2026**.

## 🚀 Architecture & Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (v4), Zustand, Recharts, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Custom JWT-based Role-Based Access Control (Employee, Manager, Admin)

## 📦 Deliverables Covered
✅ Full structured monorepo codebase
✅ Architecture diagram (see `architecture.md` inside `C:\Users\csbal\.gemini\antigravity\brain\a7e7c1b8-af09-48e7-a2d7-a39e71348a06\`)
✅ Prisma schema modeling 7 distinct entities
✅ TDD Validation rules enforcing (100% total, max 8 goals, min 10% weightage)
✅ Export endpoint for Achievement Report (XLSX)
✅ Demo Seed Script for rapid evaluation

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL database

### 1. Database & Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Configure the Environment Variables. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/atomquest?schema=public"
   JWT_SECRET="atomquest_hackathon_super_secret_key"
   NODE_ENV="development"
   ```
4. Run Prisma DB Push to sync your schema:
   ```bash
   npx prisma db push
   ```
5. Seed the database with the Demo script (1 Admin, 1 Manager, 3 Employees):
   ```bash
   node prisma/seed.js
   ```
6. Start the API server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a separate terminal in the root directory:
   ```bash
   cd hacko
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 🌟 Seed Credentials
The seed script creates the following users (Password for all: `password123`):
- **Admin/HR**: `ananya@atomquest.io`
- **Manager (L1)**: `sneha@atomquest.io`
- **Employee**: `arjun@atomquest.io`
- **Employee**: `priya@atomquest.io`
- **Employee**: `rahul@atomquest.io`

### Key Features Implemented
- **Phase 1 (Goal Setting)**: Employees can create individual/shared goals. Enforced weightage validation using TDD strategy.
- **Phase 2 (Tracking)**: Quarterly updates logging Actual vs Planned targets.
- **RBAC**: Employees submit -> Managers approve/lock -> Admin oversees.
- **Reporting**: Full XLSX generation through `/api/reports/achievement`.

## 🧪 Testing Validations
Run the validation suite via:
```bash
node server/utils/goalValidation.test.js
```
