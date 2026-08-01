# UBS-LMIS School Management System

Welcome to the UBS-LMIS School Management System repository.

## Starting the Application

To run the application locally, you need to spin up the required backing services (PostgreSQL, MailHog, pgAdmin) and then start the Spring Boot backend.

### 1. Start Services
Run the following from the root of the project to start Docker containers:
```powershell
docker-compose up -d
```

### 2. Start Backend
Run the backend with Maven, ensuring you inject the required environment variables:
```powershell
$env:DATABASE_PORT="5433"
$env:DATABASE_PASSWORD="local_dev_password_change_in_prod"
mvn spring-boot:run
```
The backend will run on `http://localhost:8080`.

### 3. Start Frontend
The Next.js frontend is located in the `frontend` directory:
```powershell
cd frontend
npm run dev:portal
```
The frontend portal will run on `http://localhost:3001`.

---

## Test Data & Login Credentials

The database comes fully seeded with localized Ghanaian test data (via the `V15__seed_test_data.sql` migration) spanning all domains: Academic Structure, People, Enrollments, Assessments, and Finance.

The default password for **ALL** seeded accounts is `Password123`.

### Key Test Accounts

**Staff (Head of School)**
- **Username:** `kwame.osei`
- **Role:** HEAD_OF_SCHOOL

**Staff (Teacher)**
- **Username:** `ama.mensah`
- **Role:** TEACHER

**Staff (Accountant)**
- **Username:** `kojo.appiah`
- **Role:** ACCOUNTANT

**Guardian / Parent**
- **Username:** `samuel.frimpong`
- **Role:** GUARDIAN

**Student**
- **Username:** `STD-26-001`
- **Role:** STUDENT

Use these credentials at the login screen on the frontend (`http://localhost:3001/login`).
