# Leboncours

A Single Page Application (SPA) where users can sign up as **Teachers** or **Students**. Teachers offer courses with availability slots, and students can browse and book sessions. The platform also includes an admin role, a messaging system, and a dashboard with charts.

## Tech Stack

### Backend

- **Language:** Rust (Edition 2024)
- **Framework:** Axum 0.7
- **Async Runtime:** Tokio
- **ORM:** SeaORM 1.1 (PostgreSQL via sqlx)
- **API Docs:** Utoipa + Swagger UI
- **Auth:** Argon2 (password hashing) + JWT (jsonwebtoken)
- **Validation:** validator
- **CORS:** tower-http

### Database

- **System:** PostgreSQL
- **Schema management:** Raw SQL (`db/create_table.sql`)

### Frontend

- **Framework:** React 19 (Create React App)
- **Language:** JavaScript (JSX)
- **Routing:** react-router-dom 7
- **Data Grid:** AG Grid React 35
- **Charts:** Recharts
- **Icons:** Lucide React, React Icons
- **HTTP Client:** Native `fetch` (custom wrapper in `src/api.js`)
- **Auth State:** React Context (`AuthContext`) with `sessionStorage`

## Database Schema

### Enums

- `users_role`: `Teacher`, `Admin`, `Student`
- `event_state`: `Pending`, `Confirmed`, `Canceled`, `Done`

### Tables

| Table | Columns | Notes |
|-------|---------|-------|
| **Users** | `id` SERIAL PK, `name`, `firstname`, `email`, `role` (users_role), `password`, `metadata` JSONB | |
| **Courses** | `id` SERIAL PK, `subject`, `hourly_price` INT, `level`, `description` TEXT | |
| **Availabilities** | `id` SERIAL PK, `start_date` DATE, `end_date` DATE, `start_time` TIMESTAMP, `end_time` TIMESTAMP, `course_id` FK→Courses | |
| **TeacherCourses** | `id` SERIAL PK, `teacher_id` FK→Users, `course_id` FK→Courses | Join table |
| **EventCourses** | `id` SERIAL PK, `student_id` FK→Users, `course_id` FK→Courses, `dates` TIMESTAMP, `state` (event_state) | Bookings |
| **Messages** | `id` SERIAL PK, `created_at` TIMESTAMP, `content` TEXT | |
| **MessagesUsers** | `id` SERIAL PK, `sender_id` FK→Users, `receiver_id` FK→Users, `message_id` FK→Messages (CASCADE) | |

## API Endpoints

Base URL: `http://127.0.0.1:3001`

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |

### Users
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users/create` | Create user |
| GET | `/api/users/all` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/edit/:id` | Update user |
| DELETE | `/api/users/delete/:id` | Delete user |

### Courses
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/courses/create` | Create course |
| GET | `/api/courses/all` | List courses (filter: subject, level, price range, pagination) |
| GET | `/api/courses/:id` | Get course by ID |
| PUT | `/api/courses/edit/:id` | Update course |
| DELETE | `/api/courses/delete/:id` | Delete course |

### Availabilities
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/availabilities/create` | Create availability slot |
| GET | `/api/availabilities/all` | List availabilities |
| GET | `/api/availabilities/:id` | Get availability by ID |
| PUT | `/api/availabilities/edit/:id` | Update availability |
| DELETE | `/api/availabilities/delete/:id` | Delete availability |

### EventCourses (Bookings)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/event-courses/create` | Create booking |
| GET | `/api/event-courses/all` | List bookings |
| GET | `/api/event-courses/:id` | Get booking by ID |
| PUT | `/api/event-courses/edit/:id` | Update booking |
| DELETE | `/api/event-courses/delete/:id` | Delete booking |

### TeacherCourses
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/teacher-courses/create` | Assign teacher to course |
| GET | `/api/teacher-courses/all` | List assignments |
| GET | `/api/teacher-courses/:id` | Get assignment by ID |
| PUT | `/api/teacher-courses/edit/:id` | Update assignment |
| DELETE | `/api/teacher-courses/delete/:id` | Remove assignment |

### Messages
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/messages/create` | Create message |
| GET | `/api/messages/all` | List messages |
| GET | `/api/messages/:id` | Get message by ID |
| PUT | `/api/messages/edit/:id` | Update message |
| DELETE | `/api/messages/delete/:id` | Delete message |

### MessageUsers
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/message-users/create` | Create message-user link |
| GET | `/api/message-users/all` | List message-user links |
| GET | `/api/message-users/:id` | Get by ID |
| PUT | `/api/message-users/edit/:id` | Update |
| DELETE | `/api/message-users/delete/:id` | Delete |

### Docs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/swagger-ui` | Interactive Swagger UI |

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero banner, features, how-it-works sections |
| `/about` | About | Team & project info |
| `/login` | Login | Email + password authentication |
| `/signup` | Signup | Registration (name, firstname, email, role, password) |
| `/courses` | Courses | Browse & filter courses (AG Grid) |
| `/profile` | Profile | View/edit user profile |
| `/dashboard` | Dashboard | Stats & charts (Recharts) |

## Project Structure

```
Back/
├── main.rs              # Entry point, DB init, server launch
├── database.rs          # PostgreSQL connection (SeaORM)
├── server.rs            # Axum server setup, CORS, Swagger UI
├── server/
│   ├── api_routes.rs    # All route definitions
│   └── fn_path.rs       # OpenAPI doc & home handler
├── api/
│   ├── auth/            # Register, Login, JWT
│   ├── users/           # CRUD handlers + DTOs
│   ├── courses/         # CRUD handlers + DTOs
│   ├── availabilities/  # CRUD handlers + DTOs
│   ├── eventCourses/    # CRUD handlers + DTOs
│   ├── teacherCourses/  # CRUD handlers + DTOs
│   ├── messages/        # CRUD handlers + DTOs
│   ├── messageUsers/    # CRUD handlers + DTOs
│   ├── common/          # Enums, pagination, password utils
│   └── error.rs         # Unified error handling
└── entities/            # SeaORM generated entities

Front/
├── src/
│   ├── App.jsx          # Routes & layout (Navbar + Footer)
│   ├── api.js           # All API calls (fetch wrapper)
│   ├── index.jsx        # React entry point
│   ├── context/         # AuthContext (login, register, logout)
│   ├── components/      # Navbar, Footer, PageLoader, Charts, etc.
│   ├── pages/           # Landing, About, Login, Signup, Courses, Profile, Dashboard
│   ├── css/             # CSS modules (variables, components, pages)
│   └── helpers/         # Chart & dashboard helper functions
└── public/

db/
├── create_table.sql     # Schema creation
└── insert.sql           # Seed data
```

## Getting Started

### Prerequisites

- Rust (Edition 2024)
- PostgreSQL
- Node.js

### Backend

```bash
cd Back
# Set DATABASE_URL and JWT_SECRET in .env
cargo run
# Server runs on http://127.0.0.1:3001
# Swagger UI at http://127.0.0.1:3001/swagger-ui/
```

### Frontend

```bash
cd Front
npm install
npm start
# App runs on http://localhost:3000
```

### Database

```bash
psql -U <user> -d <dbname> -f db/create_table.sql
psql -U <user> -d <dbname> -f db/insert.sql
```