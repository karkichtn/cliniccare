# PS5 — Clinic Appointment & Patient Visit System

A full-stack healthcare web application for clinic appointment scheduling, patient visit records, and operational management built with Node.js, Express, MongoDB Atlas, Mongoose, and React (Vite).

---

## 1. Problem Statement
Manual appointment scheduling in clinics leads to scheduling collisions, double-booking, inefficient doctor utilization, and scattered diagnostic notes. This application provides a centralized, role-based platform that enforces slot availability, prevents concurrent double-bookings, manages appointment lifecycles (`Booked` ➔ `Checked-In` ➔ `Completed`), digitally archives clinical diagnoses and prescription notes, and aggregates real-time clinic revenue and performance metrics.

---

## 2. Project Overview & Features

### Patient Capabilities
- Register and authenticate securely with bcrypt password hashing and JWT sessions.
- Browse and search physicians by name and medical specialization.
- Inspect doctor profiles, consultation fees, active working days, and slot duration.
- View real-time available time slots for any valid date.
- Book appointments with built-in validation preventing past-date and occupied-slot reservations.
- View personal appointment history with color-coded status badges.
- Cancel upcoming booked appointments.
- Review clinical visit summaries, diagnoses, and doctor prescriptions for completed sessions.

### Clinic Staff & Admin Capabilities
- Role-based authorization for `admin` and `receptionist` accounts.
- Doctor CRUD: Add new doctors, update consultation fees, adjust working hours, and toggle active status.
- Appointment Master: Track today's schedule, filter appointments by status, doctor, or date.
- Patient check-in workflow: Transition status from `Booked` to `Checked-In`.
- Clinical Record Entry: Record diagnosis observations and prescription instructions to complete appointments.
- Executive Dashboard: Real-time aggregated statistics from MongoDB (today's appointment count, completed consultation revenue, cancellations count, and doctor-wise volume).

---

## 3. Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (CommonJS: `require` / `module.exports`)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Security**: Password hashing with `bcryptjs`, CORS middleware
- **Configuration**: `dotenv`

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6 (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `useNavigate`, `useParams`)
- **Styling**: Vanilla CSS design system with custom properties and responsive layout utilities

---

## 4. Directory Structure

```text
assignment-6/
├── backend/
│   ├── config/
│   │   └── db.js                        # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── appointmentController.js     # Slot calculation, booking, status, and visit notes
│   │   ├── authController.js            # Registration, login, and profile
│   │   ├── dashboardController.js       # Executive statistics and revenue aggregation
│   │   └── doctorController.js          # Physician CRUD and availability
│   ├── middleware/
│   │   ├── authHandler.js               # JWT verification & role-based authorization
│   │   ├── authMiddleware.js            # Re-export of authHandler
│   │   ├── errorHandler.js              # 404 handler and centralized error middleware
│   │   ├── errorMiddleware.js           # Re-export of errorHandler
│   │   └── validationMiddleware.js      # Input validation helpers
│   ├── models/
│   │   ├── Appointment.js               # Appointment schema with partial unique index
│   │   ├── Doctor.js                    # Doctor schedule, fees, and slot profile schema
│   │   └── User.js                      # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── appointmentRoutes.js         # /api/appointments routes
│   │   ├── authRoutes.js                # /api/auth routes
│   │   ├── dashboardRoutes.js           # /api/dashboard routes
│   │   └── doctorRoutes.js              # /api/doctors routes
│   ├── .env.example                     # Backend environment template
│   ├── app.js                           # Express application and middleware mounting
│   ├── package.json                     # Backend dependencies and scripts
│   ├── seed.js                          # Database seeder (10+ doctors, staff, patients)
│   └── server.js                        # Server entry point
├── frontend/
│   ├── public/
│   │   └── _redirects                   # Netlify SPA routing rewrite rule
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js                   # Shared fetch helper with JWT bearer auth
│   │   │   ├── apiClient.js             # Re-export of apiFetch
│   │   │   ├── appointmentApi.js        # Appointment and visit API requests
│   │   │   ├── authApi.js               # Authentication API requests
│   │   │   ├── dashboardApi.js          # Analytics API requests
│   │   │   └── doctorApi.js             # Physician API requests
│   │   ├── components/
│   │   │   ├── AppointmentCard.jsx      # Appointment item card
│   │   │   ├── DoctorCard.jsx           # Doctor profile card with booking link
│   │   │   ├── Footer.jsx               # Page footer
│   │   │   ├── Navbar.jsx               # Navigation bar with role-based links
│   │   │   ├── ProtectedRoute.jsx       # Auth and role route guard
│   │   │   ├── StatusBadge.jsx          # Color-coded workflow status badge
│   │   │   └── VisitModal.jsx           # Modal for recording diagnosis and prescriptions
│   │   ├── pages/
│   │   │   ├── AdminAppointmentManagementPage.jsx # Master appointments table
│   │   │   ├── AdminDashboardPage.jsx   # Executive operational metrics
│   │   │   ├── AdminDoctorFormPage.jsx  # Add/edit doctor form
│   │   │   ├── AdminDoctorManagementPage.jsx # Doctor CRUD management table
│   │   │   ├── DoctorDetailPage.jsx     # Doctor schedule and interactive slot booking
│   │   │   ├── DoctorDetailsPage.jsx    # Re-export of DoctorDetailPage
│   │   │   ├── DoctorListPage.jsx       # Doctor directory with specialty filter
│   │   │   ├── DoctorListingPage.jsx    # Re-export of DoctorListPage
│   │   │   ├── HomePage.jsx             # Landing page
│   │   │   ├── LoginPage.jsx            # User and staff login
│   │   │   ├── NotFoundPage.jsx         # 404 page
│   │   │   ├── PatientAppointmentDetailPage.jsx # Consultation detail and clinical notes
│   │   │   ├── PatientAppointmentsPage.jsx # Patient appointment history
│   │   │   ├── RegisterPage.jsx         # Patient self-registration
│   │   │   └── VisitHistoryPage.jsx     # Re-export of PatientAppointmentsPage
│   │   ├── App.css                      # UI component styling classes
│   │   ├── App.jsx                      # App root with client-side routes
│   │   ├── index.css                    # Design tokens and base styles
│   │   └── main.jsx                     # Vite React root with BrowserRouter
│   ├── .env.example                     # Frontend environment template
│   ├── index.html                       # HTML entry point
│   ├── package.json                     # Frontend dependencies and scripts
│   ├── vercel.json                      # Vercel SPA routing rewrite rule
│   └── vite.config.js                   # Vite configuration
├── .gitignore                           # Git ignore rules
└── README.md                            # Project documentation
```

---

## 5. Local Installation & Startup Commands

### Step 1: Clone and Setup Environment Variables

```bash
# Backend environment setup
cd backend
cp .env.example .env
# Open backend/.env and supply your MongoDB Atlas connection URI and JWT secret
```

```bash
# Frontend environment setup
cd ../frontend
cp .env.example .env
# Default points to http://localhost:5000/api
```

### Step 2: Install Dependencies

```bash
# Backend dependencies
cd ../backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Step 3: Seed Database (Once MongoDB URI is Configured)

```bash
cd ../backend
npm run seed
```

### Step 4: Run Application in Development Mode

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 6. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/clinic_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 7. API Endpoints

### Authentication
- `POST /api/auth/register` — Public patient registration.
- `POST /api/auth/login` — Public login returning JWT and user profile.
- `GET /api/auth/me` — Authenticated profile verification.

### Doctors
- `GET /api/doctors` — Public list of physicians (supports `search` and `specialization`).
- `GET /api/doctors/:id` — Public physician detail view.
- `POST /api/doctors` — Admin/Receptionist create physician.
- `PUT /api/doctors/:id` — Admin/Receptionist update physician.
- `DELETE /api/doctors/:id` — Admin/Receptionist delete physician (prevented if active appointments exist).

### Appointments
- `GET /api/appointments/available-slots?doctorId=...&date=...` — Real-time slot calculator.
- `POST /api/appointments` — Patient booking with conflict and past-date validation.
- `GET /api/appointments/my` — Patient consultation list.
- `GET /api/appointments/:id` — Appointment details and clinical record view.
- `PATCH /api/appointments/:id/cancel` — Patient or staff appointment cancellation.
- `GET /api/appointments/admin` — Staff appointment master list with filters.
- `PATCH /api/appointments/:id/status` — Staff status transition (`Booked` ➔ `Checked-In` ➔ `Completed` / `Cancelled`).
- `PATCH /api/appointments/:id/visit` — Staff clinical diagnosis and prescription notes entry.

### Dashboard
- `GET /api/dashboard` — Staff real-time aggregated metrics (today's count, cancellations, revenue, doctor distribution).

---

## 8. Test Accounts (Available After Running Seed)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@clinic.com` | `AdminPassword123!` |
| **Receptionist** | `reception@clinic.com` | `StaffPassword123!` |
| **Patient 1** | `jane@example.com` | `Password123!` |
| **Patient 2** | `robert@example.com` | `Password123!` |

---

## 9. Deployment Checklist

### A. MongoDB Atlas
1. Create a MongoDB Atlas cluster.
2. Under **Database Access**, create a user with read and write permissions.
3. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so Render/cloud servers can connect.
4. Copy the connection string into your environment variables.

### B. Backend Deployment (Render)
1. Push repository to GitHub.
2. In Render, select **New +** ➔ **Web Service** and connect your repository.
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variables:
   - `PORT=5000`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-jwt-secret>`
   - `CLIENT_URL=<your-deployed-frontend-url>`

### C. Frontend Deployment (Vercel or Netlify)
1. Connect repository to Vercel or Netlify.
2. Set **Root Directory**: `frontend`
3. Set **Framework Preset**: `Vite`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_URL=<your-deployed-render-backend-url>/api`
7. SPA client-side rewrites are already handled via `frontend/vercel.json` and `frontend/public/_redirects`.
8. Once frontend is deployed, update `CLIENT_URL` in the backend service on Render to match the production domain.
