# 15 — Frontend Screen Catalog

> Last updated: 2026-07-31
> Based on implemented portal screens in `frontend/apps/portal`.

---

## Screen Matrix by Actor

| Screen | Route | HEAD_OF_SCHOOL | SCHOOL_ADMIN | HOD | TEACHER | ACCOUNTANT | LIBRARIAN | NURSE | GUARDIAN | STUDENT |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard | `/dashboard` | ✅ Admin Bento | ✅ Admin Bento | ✅ Teacher Panel | ✅ Teacher Panel | ✅ Finance Grid | ⚠️ Placeholder | ⚠️ Placeholder | ✅ Guardian Panel | ✅ Student Panel |
| Students | `/students` | ✅ | ✅ | 👀 read | 👀 read | 👀 read | — | — | — | — |
| Enrolment | `/enrolment` | ✅ | ✅ | 👀 | 👀 | 👀 | — | — | — | — |
| Attendance | `/attendance` | ✅ | ✅ | ✅ | ✅ | — | — | — | — | 👀 My Attendance |
| Assessment | `/assessment` | ✅ | — | ✅ | ✅ | — | — | — | — | — |
| Results / Report Cards | `/results/report-cards` | ✅ | ✅ | ✅ | ✅ | — | — | — | 👀 ward cards | ✅ Own card |
| School Fees | `/fees` | ✅ | — | — | — | ✅ Full ledger | — | — | — | ✅ Own invoices |
| Staff | `/staff` | ✅ | ✅ | 👀 | 👀 | 👀 | — | — | — | — |
| Payroll | `/payroll` | ✅ | — | — | — | ✅ | — | — | — | — |
| Academics | `/academics` | ✅ Admin setup | ✅ Admin setup | — | — | — | — | — | — | ✅ My Subjects |
| Communication | `/communication` | ✅ Composer | ✅ Composer | ✅ Composer | ✅ Composer | — | — | — | 👀 Inbox | 👀 Inbox |

**Legend:** ✅ Full write access | 👀 Read-only | ⚠️ Placeholder | — Not shown in nav

---

## Implemented Portal Screens

### `/login`
Premium two-column layout. Left: UBS branding, dark gradient, role chip grid. Right: login form + collapsible actor switcher panel listing all 14 seed accounts by role badge, with click-to-fill functionality.

### `/dashboard`
Role-branching page. Five distinct panels:
- **Admin Bento** (HEAD_OF_SCHOOL, SCHOOL_ADMIN, SYSTEM_ADMIN) — 6 stat cards, Quick Actions, Recent Activity
- **Teacher Panel** (TEACHER, HOD) — My Classes, My Students count, assessment links
- **Finance Grid** (ACCOUNTANT) — revenue KPIs, pending payments, billing shortcuts
- **Guardian Panel** (GUARDIAN) — per-ward cards (grade, attendance bar, fee badge), announcements sidebar
- **Student Panel** (STUDENT) — personal grade stats, subject bars, announcement quick-links

### `/students`
Full student registry with search, filters, enrolment status, and drawer for student profile detail.

### `/enrolment`
Enrolment workflow — class assignment, status management.

### `/attendance`
Daily register grid. For STUDENT: own attendance history.

### `/assessment`
Score entry grid by class/subject/component. Result submission workflow.

### `/results/report-cards`
- **Staff/Admin:** `ReportCardSelector` → picker → rendered card with print/email actions
- **STUDENT:** Auto-loads own card (no picker shown). Hides student-switch dropdown.
- **GUARDIAN:** Links from ward cards on dashboard.

### `/fees`
- **ACCOUNTANT:** Full school finance ledger — invoices, payments, billing runs, adjustment proposals
- **STUDENT:** Personal fee view — balance progress bar, invoice history with status chips

### `/academics`
- **Admin:** Academic year + class setup, subject offerings, teacher assignments
- **STUDENT:** Enrolled subject cards with grade, score bar, teacher name; links to report card

### `/communication`
- **STAFF (TEACHER, HOD, SCHOOL_ADMIN, HEAD_OF_SCHOOL):** Broadcast Composer + Outbox Status Log + Engagement Pulse + Archived Feeds
- **GUARDIAN / STUDENT:** Read-only Announcement Inbox, sorted newest-first with audience badges

### `/staff`
Staff directory — employment records, roles, department, status.

### `/payroll`
Payroll run management — generate, review, finalize payslips.

---

## Phase 2 Screens (Planned)

| Screen | Route | Module | Actor |
|---|---|---|---|
| Library Dashboard | `/library` | Library | LIBRARIAN |
| Book Catalog | `/library/catalog` | Library | LIBRARIAN, STUDENT |
| Loan Management | `/library/loans` | Library | LIBRARIAN |
| Health Dashboard | `/health` | Health | NURSE |
| Student Health Profile | `/health/students/:id` | Health | NURSE |
| Medical Visits Log | `/health/visits` | Health | NURSE |
| Timetable Viewer | `/timetable` | Timetable | All |
| Analytics & Reports | `/analytics` | Reporting | HEAD, SCHOOL_ADMIN, ACCOUNTANT |
| Settings | `/settings` | Auth | SYSTEM_ADMIN |
