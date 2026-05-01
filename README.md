# 🧠 Student Mental Health & Counselling System

## 📖 Overview
A full-stack web application designed to manage student mental health resources and facilitate counseling sessions within educational institutions. This system streamlines the process of booking appointments, managing student profiles, and conducting assessments, providing a secure and accessible platform for both students and administrators/counselors.

## ✨ Core Features
- **Student Dashboard:** Personalized portal for students to book appointments, view upcoming sessions, and access mental health resources.
- **Admin/Counselor Dashboard:** Comprehensive interface for staff to manage student records, view appointment schedules, and track session history.
- **Appointment Scheduling:** Intuitive booking system to seamlessly schedule and manage counseling sessions.
- **Secure Authentication:** Robust login system ensuring data privacy and role-based access for students and administrators.
- **Interactive UI:** Clean, responsive, and user-friendly interface built with modern React components and Lucide icons.
- **Relational Database Management:** Efficient storage and retrieval of student, appointment, and session data using a structured MySQL database.

## 🛠️ Technology Stack

**Frontend Layer:**
- **Framework:** React 19 (Vite)
- **Routing:** React Router v7
- **Styling/UI:** Modern CSS, Lucide React (Icons)
- **API Integration:** Axios

**Backend Layer:**
- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Database:** MySQL (via `mysql2`)
- **Security & Config:** CORS, Dotenv

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MySQL](https://www.mysql.com/) Server
- npm or yarn

### Database Setup
1. Ensure your local MySQL server is running.
2. Execute the provided SQL scripts (if any) or run the `setupDb.js` script to initialize the database schema and tables.

### Installation & Execution

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Student-Counselling-System.git
   cd Student-Counselling-System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory with your database credentials (e.g., `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`).*
   ```bash
   # Start the Express server
   node index.js
   ```

3. **Frontend Setup**
   ```bash
   # Open a new terminal instance
   cd frontend
   npm install
   
   # Start the Vite development server
   npm run dev
   ```

## 📁 Project Architecture
```text
Student-Counselling-System/
├── backend/
│   ├── config/          # Database connection configuration (db.js)
│   ├── routes/          # Express API endpoints (authRoutes.js, etc.)
│   ├── index.js         # Main server entry point
│   ├── setupDb.js       # Database initialization script
│   └── package.json     # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI elements (Navbar.jsx, etc.)
    │   ├── pages/       # Core views (Login, AdminDashboard, etc.)
    │   ├── App.jsx      # Main application and routing logic
    │   ├── main.jsx     # Frontend entry point
    │   └── index.css    # Global styling
    ├── index.html
    └── package.json     # Frontend dependencies
```

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
