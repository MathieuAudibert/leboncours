# le-bon-cours
Leboncours is a Single Page Application (SPA) where users can sign up as either "Mentors" (who offer skills) or "Students" (who book sessions). It bridges the gap between casual learning and professional tutoring by allowing quick, one-off booking of video call sessions for specific skills (e.g., "Code Review", "Guitar Tuning", "French Basics").

Project Name: "Leboncours"

Tagline: A decentralized marketplace for micro-tutoring sessions.

Core Value: Speed, Simplicity, and Professional Management.
1. Full Tech Stack Specification
Backend (The Engine)

    Language: Rust (Stable)

    Framework: Axum (Chosen for high performance, modularity, and excellent integration with the Tokio async runtime).

    ORM: SeaORM.

    API Documentation: Utoipa (Generates OpenAPI/Swagger JSON directly from Rust structs/enums).

    Authentication: Argon2 + JWT (JSON Web Tokens).

Database

    System: PostgreSQL 15+

    Management: SeaORM CLI (for migrations and entity generation).

Frontend

    Framework: React 18+ (using Vite).

    Language: TypeScript (Strict mode).

    Data Grid: Ag Grid React.

    State Management: TanStack Query (React Query).

    Styling: Tailwind CSS.

    HTTP Client: Axios.

1. User Stories & Functional Requirements

Role A: The Mentor

    Create Profile: Set display name, bio, and hourly rate.

    List Skills: Create "Skill Cards" (e.g., "Rust Async Programming").

    Manage Bookings (Ag Grid): View a sortable, filterable table of incoming requests. Use grid controls to bulk-accept or reject sessions.

Role B: The Student

    Search & Browse: View a grid of available skills/mentors.

    Book Session: Select a skill and submit a request.

    My Bookings (Ag Grid): A personal dashboard table showing past and upcoming sessions, filterable by date or status.

3. Database Schema & SeaORM Integration

Table 1: users

    id: UUID (Primary Key)

    username: String (Unique)

    email: String (Unique)

    password: String

    role: Enum ('mentor', 'student')

    SeaORM Relation: HasMany skills, HasMany bookings.

Table 2: skills

    id: UUID (Primary Key)

    mentor_id: UUID (Foreign Key -> users.id)

    title: String

    description: Text

    price: Decimal

    SeaORM Relation: BelongsTo users.

Table 3: bookings

    id: UUID (Primary Key)

    student_id: UUID (Foreign Key -> users.id)

    skill_id: UUID (Foreign Key -> skills.id)

    scheduled_time: DateTimeUtc

    status: Enum ('pending', 'confirmed', 'rejected')

    SeaORM Relation: BelongsTo users (Student), BelongsTo skills.

4. API Design & Swagger Integration

Key Endpoints:
Group	Method	Path	Description
Auth	POST	/api/auth/login	Returns JWT.
Skills	GET	/api/skills	Returns list of skills (supports pagination).
Bookings	GET	/api/bookings	Optimized for Ag Grid: Accepts sorting/filtering params.
Bookings	POST	/api/bookings	Create a new booking.
Docs	GET	/swagger-ui	Interactive API docs.

5. UI/UX Concept
Public Pages (Landing & Search)

    Layout: Clean, card-based layout using Tailwind CSS.

    Visuals: Hero banner, search bar, and a grid of "Skill Cards".

Private Dashboard (The "Ag Grid" Power View)

    Mentor Dashboard:

        Instead of a simple list, a full-width Ag Grid table.

        Columns: Student Name, Skill Requested, Date, Price, Status, Actions.

        Features:

            Quick Filter: A text box to instantly search for a specific student name.

            Status Renderer: Custom cell renderer showing colorful badges for "Pending" vs "Confirmed".

            Action Cell: Buttons inside the grid row to "Approve" or "Deny".

    Student Dashboard:

        Ag Grid table showing Skill Name, Mentor, Date, Status.

        Features: Sort by "Date" to see upcoming sessions first.