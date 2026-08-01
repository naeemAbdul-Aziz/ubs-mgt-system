# 16 — Seed Test Accounts

> **Living document.** Last updated: 2026-07-31
> All accounts use password: **`Password123`**
> All accounts have `must_change_password = true` by default (except `sys.admin` and named staff which have it set to `false` for demo convenience).

---

## Actor Matrix

| # | Role | Person Type | Username | Full Name | Seeded In |
|---|---|---|---|---|---|
| 1 | `SYSTEM_ADMIN` | STAFF | `sys.admin` | Kwame Osei (shared) | V24 |
| 2 | `HEAD_OF_SCHOOL` | STAFF | `kwame.osei` | Kwame Osei | V15 |
| 3 | `SCHOOL_ADMIN` | STAFF | `admin.sekyi` | Akua Sekyi | V24 |
| 4 | `HOD` + `TEACHER` | STAFF | `kofi.owusu` | Kofi Owusu (STF-003) | V15 role + V24 HOD |
| 5 | `TEACHER` | STAFF | `ama.mensah` | Ama Mensah (STF-002) | V15 |
| 6 | `ACCOUNTANT` | STAFF | `kojo.appiah` | Kojo Appiah (STF-004) | V15 |
| 7 | `LIBRARIAN` | STAFF | `adwoa.librarian` | Adwoa Boateng (STF-006) | V24 |
| 8 | `NURSE` | STAFF | `abena.nurse` | Abena Asante (STF-007) | V24 |
| 9 | `GUARDIAN` | GUARDIAN | `samuel.frimpong` | Samuel Frimpong | V15 |
| 10 | `GUARDIAN` | GUARDIAN | `mary.agyeman` | Mary Agyeman | V24 |
| 11 | `STUDENT` | STUDENT | `STD-26-001` | Yaw Frimpong | V15 |
| 12 | `STUDENT` | STUDENT | `STD-26-002` | Akosua Frimpong | V15 |
| 13 | `STUDENT` | STUDENT | `STD-26-003` | Daniel Agyeman | V23 |
| 14 | `STUDENT` | STUDENT | `STD-26-004` | Grace Addo | V23 |

---

## Actor-by-Actor Access Scope

### 1. `sys.admin` — SYSTEM_ADMIN
- **Access:** Full technical admin. Read access to all modules. No academic write permissions.
- **Dashboard:** Admin bento grid (shared with HEAD_OF_SCHOOL)
- **Typical test flows:** Account management, audit log review, export execution

---

### 2. `kwame.osei` — HEAD_OF_SCHOOL
- **Access:** Full school-wide authority including final approvals (results, promotions, fee adjustments).
- **Dashboard:** Admin bento stats grid + quick actions
- **Test flows:**
  - Approve published results for STD-26-001
  - View finance dashboard + execute billing run
  - Publish/create announcements for all audiences
  - Close academic year

---

### 3. `admin.sekyi` — SCHOOL_ADMIN
- **Access:** Front-office operations — enrolment, student records, class setup, announcements.
- **Dashboard:** Admin bento grid
- **Test flows:**
  - Create a new student record
  - Enrol a student into a class
  - Create and publish an announcement
  - View class rosters and attendance

---

### 4. `kofi.owusu` — HOD + TEACHER
- **Access:** Department-scoped oversight AND teacher duties. Can approve results (HoD step) and also enter scores/attendance.
- **Dashboard:** Teacher dashboard panel (with HOD's additional result-approve capability)
- **Test flows:**
  - Mark attendance for P3A
  - Enter scores for Daniel Agyeman (STD-26-003)
  - Submit results for HOD approval
  - View department-level analytics

---

### 5. `ama.mensah` — TEACHER
- **Access:** Own classes/subjects only. Attendance, score entry, result submission.
- **Dashboard:** Teacher dashboard panel (My Classes, My Students, Assessment Grid)
- **Test flows:**
  - Submit attendance register for P1A
  - Enter SBA and exam scores for Yaw Frimpong (STD-26-001)
  - View class roster

---

### 6. `kojo.appiah` — ACCOUNTANT
- **Access:** Full finance module — fee schedules, invoices, payments, financial reports.
- **Dashboard:** Finance ledger with auto-allocation engine
- **Test flows:**
  - View all outstanding invoices
  - Record a cash payment for STD-26-004 (Grace Addo — currently UNPAID)
  - Execute term billing run
  - View finance report

---

### 7. `adwoa.librarian` — LIBRARIAN
- **Access:** Library catalog and loans. *(Module is Phase 2 — stub only)*
- **Dashboard:** "Module Coming Soon" placeholder
- **Test flows:** Login → see placeholder UI (library module not yet built)

---

### 8. `abena.nurse` — NURSE
- **Access:** Student health profiles and medical visits. *(Module is Phase 2 — stub only)*
- **Dashboard:** "Module Coming Soon" placeholder
- **Test flows:** Login → see placeholder UI (health module not yet built)

---

### 9. `samuel.frimpong` — GUARDIAN
- **Wards:** Yaw Frimpong (STD-26-001 · P1A) and Akosua Frimpong (STD-26-002 · P1A)
- **Dashboard:** Guardian panel — ward cards, fee balances, announcement sidebar
- **Test flows:**
  - View Yaw's report card (Grade B — English, Grade A — Math)
  - Check fee balance: Yaw is PAID (GHS 1,200), Akosua is PARTIAL (GHS 500 of 1,200)
  - Read school announcements
  - Navigate to ward's attendance record

---

### 10. `mary.agyeman` — GUARDIAN
- **Wards:** Grace Addo (STD-26-004 · JHS1A) and Daniel Agyeman (STD-26-003 · P3A)
- **Dashboard:** Guardian panel
- **Test flows:**
  - View Grace's excellent report card (Grade A — English & Math)
  - Note Grace's fee is **UNPAID** — GHS 1,500 outstanding
  - View Daniel's partial results (Grade C)

---

### 11–14. Students — `STD-26-001` through `STD-26-004`

| Student | Class | Fee Status | Grades |
|---|---|---|---|
| Yaw Frimpong (`STD-26-001`) | P1A | ✅ PAID (GHS 1,200) | Eng: B (78%), Math: A (88.6%) |
| Akosua Frimpong (`STD-26-002`) | P1A | ⚠️ PARTIAL (GHS 500 paid) | Eng: partial only |
| Daniel Agyeman (`STD-26-003`) | P3A | ⚠️ PARTIAL (GHS 900 paid) | Eng: C (69.2%), Math: C (60.1%) |
| Grace Addo (`STD-26-004`) | JHS1A | ❌ UNPAID (GHS 0 paid) | Eng: A (83.8%), Math: A (88.2%) |

**Student access:** Personal dashboard, own report card (auto-loaded), own fees, enrolled subjects, read-only announcements, own attendance record.

---

## Data Coverage by Module

| Module | Data Seeded |
|---|---|
| Academic Years | 2025/2026 (CLOSED), 2026/2027 (ACTIVE) |
| Terms | Term 1, 2, 3 for 2026/2027 |
| Classes | P1A, P3A, JHS1A |
| Subjects | English, Mathematics, Science (in all 3 classes) |
| Students | 4 students across 3 class levels |
| Guardians | 2 guardians (each linked to wards) |
| Staff | 7 staff (Head, Teacher x2, Accountant, School Admin, Librarian, Nurse) |
| Attendance | 10+ records per enrolled student (week 1 and 2) |
| Assessment Components | SBA + Exam for Eng & Math in all 3 classes |
| Scores | STD-26-001 (4), STD-26-002 (2), STD-26-003 (4), STD-26-004 (4) |
| Term Results | Published for STD-26-001, STD-26-003, STD-26-004 |
| Report Cards | STD-26-001, STD-26-002, STD-26-003, STD-26-004 |
| Fee Schedules | P1A, P3A, JHS1A (Term 1 — PUBLISHED) |
| Invoices | All 4 students — PAID / PARTIAL / PARTIAL / UNPAID |
| Payments | STD-26-001 (GHS 1,200 via Mobile Money), STD-26-002 (GHS 500 cash), STD-26-003 (GHS 900 bank) |
| Announcements | 7 announcements (ALL + STAFF audiences, varied dates) |
| Notification Outbox | 6 events — PROCESSED / PENDING statuses |
| Grade Scales | Standard GES Scale 26/27 |
| Timetable | Stub — seeded in Phase 2 |
| Library | Stub — seeded in Phase 2 |
| Health | Stub — seeded in Phase 2 |
