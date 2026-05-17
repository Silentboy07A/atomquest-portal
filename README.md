# AtomQuest Enterprise Performance Portal

AtomQuest Performance Portal is a high-fidelity, enterprise-grade HR platform built for performance management, goal tracking, and organizational analytics. It serves as a single source of truth for employees, managers, and administrators to track continuous improvement, review shared organizational goals, and monitor overall team execution.

##  Tech Stack

The application is built using a modern, performant, and highly scalable frontend architecture:

- **Framework:** React 18 (via Vite)
- **Routing:** React Router v6
- **State Management:** Zustand (for lightweight, scalable global state)
- **Styling:** Custom Vanilla CSS with Tailwind-inspired utility classes (Strict 8px grid, Linear/Vercel design aesthetic)
- **Icons:** Lucide React
- **Animations:** Framer Motion (for smooth micro-interactions and transitions)
- **Data Visualization:** Recharts (for custom, responsive dashboard charts)
- **AI Integration:** Groq API (Llama 3) for real-time AI performance coaching and review generation

## 🏛️ Architecture Diagram

Below is the high-level architecture of the AtomQuest portal:

```mermaid
graph TD
    subgraph Frontend Client (React)
        UI[User Interface / React Router]
        Store[Zustand State Manager]
        Views(Views: Dashboard, Goals, Analytics, Audit)
        
        UI -->|Route Changes| Views
        Views <-->|Read/Update State| Store
    end

    subgraph External Services
        Groq[Groq AI API]
    end

    subgraph Data Layer (Simulated)
        MockDB[(Mock Data Store)]
        LocalStore[Local Storage]
    end

    Store <-->|Persist State| LocalStore
    Store <-->|Initialize| MockDB
    Views -->|Generate Reviews| Groq
```

##  Demo Credentials

The portal is equipped with role-based access control. You can use the following credentials to explore the different perspectives of the platform:

### 1. Employee
- **Email:** `employee@atomquest.com`
- **Password:** `emp123`
- *Capabilities:* Manage personal goals, view performance dashboard, interact with AI Coach.

### 2. Manager
- **Email:** `manager@atomquest.com`
- **Password:** `mgr123`
- *Capabilities:* Approve/reject team goals, view team analytics, monitor department heatmap.

### 3. Administrator
- **Email:** `admin@atomquest.com`
- **Password:** `adm123`
- *Capabilities:* Full system access, view system-wide audit trail, manage shared organizational goals, oversee all employees.

##  Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment variables (add your `.env` with `VITE_GROQ_API_KEY=your_key`)
4. Start the dev server: `npm run dev`
5. Open `http://localhost:5173` in your browser.
