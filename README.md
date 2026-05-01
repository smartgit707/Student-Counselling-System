# 🏥 Healthcare Appointment Scheduling System (Hospital DTM)

## 📖 Overview
A comprehensive full-stack healthcare appointment scheduling system designed to optimize clinic workflows, reduce patient no-shows, and provide a premium booking experience. The platform features an intelligent scheduling engine, real-time updates, and a comprehensive admin dashboard. It is built with a lightweight Node.js/Express backend utilizing a local JSON datastore and a highly responsive React/Vite frontend.

## ✨ Advanced Features
- **Real-time Notifications:** Instant status updates and alerts via WebSockets (`Socket.io`) for both patients and medical staff.
- **Automated Reminders:** Scheduled cron jobs (`node-cron`) automatically send email reminders (`nodemailer`) to drastically reduce no-show rates.
- **Dynamic PDF Generation:** Automatically generate, download, and share professional PDF medical reports and appointment summaries (`pdfkit`).
- **Smart Waitlist System:** Intelligent queue management that automatically notifies waitlisted patients when a new slot opens up.
- **Advanced Analytics:** Comprehensive visual dashboards for hospital administrators showcasing appointment trends, system usage, and operational efficiency (`Chart.js`).
- **Automated Backups:** Scheduled background routines to automatically backup the local JSON data store, ensuring complete data integrity.
- **Global Search:** Fast and efficient system-wide search functionality across patients, doctors, departments, and appointments.
- **Role-Based Access Control:** Secure authentication system (`JWT` & `bcryptjs`) with specialized dashboards for Patients, Doctors, and Administrators.

## 🛠️ Technology Stack

**Frontend Layer:**
- **Core:** React 18 (Vite), React Router v6
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Data Visualization:** Chart.js & React-Chartjs-2
- **Icons:** Lucide React
- **Integration:** Axios, Socket.io-Client

**Backend Layer:**
- **Core:** Node.js, Express.js
- **Database:** Local JSON File Storage Architecture
- **Real-time Engine:** Socket.io
- **Background Tasks:** Node-cron
- **Email Service:** Nodemailer
- **Document Generation:** PDFKit
- **Security:** JSONWebToken (JWT), Bcrypt.js, CORS, Dotenv

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Hospital_DTM.git
   cd Hospital_DTM
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory and configure your environment variables (e.g., `PORT`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`).*
   ```bash
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # Open a new terminal instance
   cd frontend
   npm install
   
   # Start the React development server
   npm run dev
   ```

## 📁 Project Architecture
```text
Hospital_DTM/
├── backend/
│   ├── config/          # Configuration and environment setup
│   ├── controllers/     # API route logic and handlers
│   ├── data/            # Local JSON database storage
│   ├── middleware/      # JWT Authentication & Error handling
│   ├── routes/          # Express API route definitions
│   ├── services/        # PDF generators, Email handlers, Cron jobs
│   ├── package.json     # Backend dependencies
│   └── server.js        # Backend entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable Tailwind UI components
    │   ├── context/     # React state management (Auth, Theme)
    │   ├── pages/       # Application views (Dashboard, Booking)
    │   ├── services/    # API interaction services (Axios)
    │   ├── App.jsx      # Main application routing
    │   └── main.jsx     # Frontend entry point
    ├── index.html
    ├── tailwind.config.js
    └── package.json     # Frontend dependencies
```

## 🔐 Security
- Passwords are cryptographically hashed using `bcryptjs`.
- Stateless authentication using `JSON Web Tokens (JWT)`.
- Environment variables are protected via `dotenv`.
- CORS configured for secure cross-origin resource sharing.

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
