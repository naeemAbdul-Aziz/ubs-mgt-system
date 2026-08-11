# Engineering Audit — school-mng-sys
> Raw technical facts extracted from codebase. No filler.

---

## 1. System Architecture

### Monorepo & Deployment Topology
- **Backend**: Spring Boot 3.3.5 (Java 17).
- **Frontend**: Turborepo workspace wrapping Next.js 14.2.4 (App Router) + React 18 for applications (`apps/portal`, `apps/staff`), alongside shared packages (`packages/ui`, `packages/api-client`, `packages/types`).
- **Containerization**: Dual-stage Dockerfile builds the Spring application via Maven (`maven:3.9.6-eclipse-temurin-17` stage) and executes it via an Alpine JRE 17 runtime (`eclipse-temurin:17-jre-alpine`).
- **Infrastructure Configuration**: Managed via `render.yaml`. Binds Spring Boot active profile to `prod`, auto-generates JWT secrets, maps Postgres variables seamlessly from a free-tier Render managed DB, and explicitly configures container memory limits (`-Xmx300m`, `-Xms150m`).

### Architectural Patterns
- **Modular Monolith (Backend)**: Heavily segmented by business domain with 16 distinct sub-packages enforcing separation of concerns: `academics`, `analytics`, `assessment`, `attendance`, `auth`, `communication`, `enrollment`, `finance`, `health`, `inventory`, `library`, `lms`, `people`, `progression`, `shared`, `timetable`.
- **Database Migrations**: Uses `Flyway` (v10.20.1) integrating tightly with PostgreSQL 16. Includes 25 ordered migration scripts defining the entire schema and seeding data incrementally. 
- **Security & Networking**: 
  - Stateless architecture relying entirely on JWT.
  - Method-level role enforcement via `@EnableMethodSecurity`.
  - CORS dynamically restricted based on `CORS_ALLOWED_ORIGINS` loaded from Render environment variables into `SecurityConfig.java`.

---

## 2. Core Engineering — Two Most Complex Problems

### Problem 1: Idempotent Database Initialization & Handover Safeguards
**Location**: `src/main/java/com/drakalabs/schoolmngsys/shared/dev/DatabaseSeederService.java`

- Handles autonomous DB seeding strictly on initial application startup. Extends `ApplicationRunner` and executes a programmatic Flyway check on boot.
- If `UserAccountRepository` returns zero accounts, triggers `buildFlyway().clean()` followed by `buildFlyway().migrate()`. Skips execution securely if any accounts exist to prevent destructive drops in live environments.
- Implements a secondary endpoint flow (`/api/v1/dev/initialize`) explicitly built for production handover. Upon execution, the seeder entirely drops the `public` schema and re-applies only structural migrations, securely preventing the injection of development dummy data prior to client possession.
- Catches configuration exceptions directly within the `run()` lifecycle wrapper to prevent catastrophic container crash-looping if seeding fails.

### Problem 2: Monorepo API Client Architecture with Transparent Token Refresh 
**Location**: `frontend/packages/api-client/src/index.ts`

- A dedicated Axios-based API client library abstracts the entire REST layer away from the UI applications. Exposes 10 domain-specific API singletons (e.g., `FinanceAPI`, `AuthAPI`, `AcademicsAPI`).
- Resolves multi-environment API routing intelligently. The client checks `window.location.hostname` to dynamically swap between `localhost:8080/api/v1` and the Render remote deployment, specifically circumventing an issue where Next.js strips external environment variables within imported Turborepo packages.
- **JWT Refresh Interceptor**: Traps HTTP 401 Unauthorized errors in an Axios response interceptor. Automatically accesses the `refreshToken` from `localStorage`, issues a silent POST request to `/auth/refresh`, overrides the active `Authorization` header with the new token, and replays the original failed request seamlessly.
- Includes a dedicated `240,000ms` extended timeout configuration explicitly for the `/auth/login` route to counteract Render free-tier platform cold starts (which spin down after 15 minutes of inactivity).

---

## 3. Tooling & Integration

### Backend Stack
- **Framework**: Spring Boot 3.3.5 (Web, Data JPA, Security, Validation, Actuator, AOP, Mail).
- **Language**: Java 17.
- **Database & Migration**: PostgreSQL 16 managed by Flyway.
- **ORM & Data Mapping**: Hibernate (via Spring Data JPA). DTO translations handled automatically via MapStruct 1.6.2 & Lombok integrations.
- **Authentication**: Custom Spring Security filter chain utilizing `io.jsonwebtoken` (JJWT 0.12.6) for stateless token verification. Password encoding utilizes a hybridized Argon2id/BCrypt adapter to handle OpenBSD legacy `$2b$` node hashes.
- **Performance & Testing**: Caffeine cache provider for high-performance localized caching. Testcontainers utilized to spin up ephemeral PostgreSQL 16 instances during testing, enforcing a strict no-H2 policy. ArchUnit (v1.3.0) implemented to assert and protect module boundaries within the monolith.

### Frontend Stack
- **Framework**: Next.js 14.2.4 with React 18.
- **State Management**: React Query (TanStack Query v5.51.1) combined with Axios 1.7.2.
- **UI & Styling**: Material UI (MUI v5) and Emotion. Includes a custom `softMaterialThemeConfig` implementing dynamic status badges and a 5-color semantic palette (Success, Warning, Error, Info, Neutral).
- **Icons & Charting**: Lucide React and Recharts.
- **Build System**: Turborepo enabling optimized, cached builds across the `portal` and `staff` Next.js directories.

---

## 4. Quantifiable Metrics

### Scale & Structure
- **Java Files**: 267 total `.java` source files traversing 16 business domains.
- **Database Migrations**: 25 Flyway `.sql` scripts mapping shared foundations, auth, academic structures, payroll, and progressive seed data.
- **API Surface Area**: 18 mapped Spring `@RestController` files, exposing ~10 distinct Axios API classes (Auth, Analytics, Dev, Students, Staff, Academics, Attendance, Assessment, Finance, Progression) via the frontend library.

### Configurations
- **Security**: 2 distinct JWTS utilized (Access and Refresh). Custom password encoder implements a 3-way evaluation: standard BCrypt, OpenBSD Node fallback (`$2b$`), and a dev-seeded fallback (`Password123`).
- **Render Deployment**: 1 Web service, 1 Managed Database instances defined inside `render.yaml`. Backend configured with max JVM heap allocation of `300MB`.
- **UI System**: Centralized Material UI configuration enforcing border radius parameters (`16px` for Cards, `10px` for Buttons) and global `boxShadow` definitions. Includes a `StatusBadge` utility equipped with 22 distinct pre-mapped string cases.
