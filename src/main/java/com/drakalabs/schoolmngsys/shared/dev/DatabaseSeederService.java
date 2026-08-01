package com.drakalabs.schoolmngsys.shared.dev;

import com.drakalabs.schoolmngsys.academics.domain.*;
import com.drakalabs.schoolmngsys.academics.repository.*;
import com.drakalabs.schoolmngsys.assessment.domain.*;
import com.drakalabs.schoolmngsys.assessment.repository.*;
import com.drakalabs.schoolmngsys.attendance.domain.*;
import com.drakalabs.schoolmngsys.attendance.repository.*;
import com.drakalabs.schoolmngsys.auth.domain.*;
import com.drakalabs.schoolmngsys.auth.repository.*;
import com.drakalabs.schoolmngsys.communication.domain.*;
import com.drakalabs.schoolmngsys.communication.repository.*;
import com.drakalabs.schoolmngsys.enrollment.domain.*;
import com.drakalabs.schoolmngsys.enrollment.repository.*;
import com.drakalabs.schoolmngsys.finance.domain.*;
import com.drakalabs.schoolmngsys.finance.repository.*;
import com.drakalabs.schoolmngsys.people.domain.*;
import com.drakalabs.schoolmngsys.people.repository.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseSeederService {

    private final EntityManager entityManager;
    private final PasswordEncoder passwordEncoder;
    
    private final UserAccountRepository userAccountRepository;
    private final AcademicYearRepository academicYearRepository;
    private final TermRepository termRepository;
    private final ClassLevelRepository classLevelRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentRepository studentRepository;
    private final GuardianRepository guardianRepository;
    private final StudentGuardianRepository studentGuardianRepository;
    private final StaffRepository staffRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final FeeScheduleRepository feeScheduleRepository;
    private final FeeItemRepository feeItemRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceLineRepository invoiceLineRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentAllocationRepository paymentAllocationRepository;
    private final AnnouncementRepository announcementRepository;
    private final AttendanceRepository attendanceRepository;
    private final ScoreRepository scoreRepository;
    private final AssessmentComponentRepository assessmentComponentRepository;
    private final TermResultRepository termResultRepository;

    @Transactional
    public void seedDatabase() {
        log.info("Starting database truncation...");
        truncateAllTables();
        log.info("Database truncated. Starting seeding...");

        Random random = new Random();
        
        // 1. Auth & Roles
        Role adminRole = Role.create("ADMIN", "Administrator");
        Role teacherRole = Role.create("TEACHER", "Teacher");
        Role guardianRole = Role.create("GUARDIAN", "Guardian");
        Role studentRole = Role.create("STUDENT", "Student");
        Role accountantRole = Role.create("ACCOUNTANT", "Accountant");
        entityManager.persist(adminRole);
        entityManager.persist(teacherRole);
        entityManager.persist(guardianRole);
        entityManager.persist(studentRole);
        entityManager.persist(accountantRole);

        String defaultPass = passwordEncoder.encode("password123");

        // 2. Academics
        AcademicYear ay = academicYearRepository.save(AcademicYear.create("2026/2027", LocalDate.of(2026, 9, 1), LocalDate.of(2027, 7, 31)));
        Term term = termRepository.save(Term.create(ay, "Term 1", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 12, 15)));
        
        ClassLevel level = classLevelRepository.save(ClassLevel.create("JHS 1", "Junior High School 1", 1));
        SchoolClass sClass = schoolClassRepository.save(SchoolClass.create(level, "JHS 1A", 40));
        Department dept = departmentRepository.save(Department.create("Science", "Science Department"));
        Subject subMath = subjectRepository.save(Subject.create(dept, "Math", "Mathematics", "MAT101", true));
        Subject subSci = subjectRepository.save(Subject.create(dept, "Science", "Integrated Science", "SCI101", true));

        // 3. People
        Staff adminStaff = staffRepository.save(Staff.create("STF-001", "Kwame", "Osei", "", "ADMINISTRATOR", "GES-001", LocalDate.of(2020, 1, 1), "kwame@draka.edu", "0200000000"));
        Staff teacherStaff = staffRepository.save(Staff.create("STF-002", "Ama", "Mensah", "", "TEACHING", "GES-002", LocalDate.of(2021, 1, 1), "ama@draka.edu", "0200000001"));
        Staff accountantStaff = staffRepository.save(Staff.create("STF-003", "Yaa", "Asantewaa", "", "ACCOUNTANT", "GES-003", LocalDate.of(2022, 1, 1), "yaa@draka.edu", "0200000005"));
        
        userAccountRepository.save(UserAccount.create("kwame.osei", defaultPass, adminStaff.getId(), "STAFF", List.of(adminRole)));
        userAccountRepository.save(UserAccount.create("ama.mensah", defaultPass, teacherStaff.getId(), "STAFF", List.of(teacherRole)));
        userAccountRepository.save(UserAccount.create("yaa.asantewaa", defaultPass, accountantStaff.getId(), "STAFF", List.of(accountantRole)));

        Guardian guardian = guardianRepository.save(Guardian.create("John", "Doe", "", "0200000002", "john.doe@example.com", "Engineer", "123 Main St"));
        userAccountRepository.save(UserAccount.create("john.doe", defaultPass, guardian.getId(), "GUARDIAN", List.of(guardianRole)));

        String[] firstNames = {"Aiden", "Emma", "Liam", "Olivia", "Noah", "Ava", "Elijah", "Isabella", "James", "Sophia", "Benjamin", "Mia", "Lucas", "Amelia", "Henry", "Harper", "Alexander", "Evelyn", "Michael", "Abigail"};
        String[] lastNames = {"Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"};

        // Assessments Base
        AssessmentComponent examComp = assessmentComponentRepository.save(AssessmentComponent.create("Exam", "End of Term Exam", BigDecimal.valueOf(70), term));
        AssessmentComponent sbaComp = assessmentComponentRepository.save(AssessmentComponent.create("SBA", "Class Work", BigDecimal.valueOf(30), term));

        for (int i = 0; i < 20; i++) {
            Student student = studentRepository.save(Student.create(
                "STD-26-" + String.format("%03d", i+1), 
                firstNames[i], 
                lastNames[i], 
                "", 
                LocalDate.of(2010, 1, 1).plusDays(random.nextInt(365)), 
                i % 2 == 0 ? "M" : "F", 
                LocalDate.of(2026, 9, 1)
            ));
            
            if (i <= 5) {
                studentGuardianRepository.save(StudentGuardian.create(student, guardian, "FATHER", true, true, true, true));
            }
            
            userAccountRepository.save(UserAccount.create(student.getStudentNumber(), defaultPass, student.getId(), "STUDENT", List.of(studentRole)));
            
            Enrollment enr = enrollmentRepository.save(Enrollment.create(student, sClass, ay));
            enr.setStatus("ACTIVE");
            enrollmentRepository.save(enr);

            // Attendance
            for (int d = 0; d < 10; d++) {
                attendanceRepository.save(AttendanceRecord.create(enr.getId(), LocalDate.now().minusDays(d), random.nextInt(10) > 1 ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT, teacherStaff.getId()));
            }

            // Assessments
            BigDecimal mathExam = BigDecimal.valueOf(random.nextInt(60) + 10);
            BigDecimal mathSba = BigDecimal.valueOf(random.nextInt(20) + 10);
            scoreRepository.save(Score.create(enr, examComp, subMath, mathExam, teacherStaff.getId()));
            scoreRepository.save(Score.create(enr, sbaComp, subMath, mathSba, teacherStaff.getId()));
            termResultRepository.save(TermResult.create(enr, term, subMath, mathSba, mathExam, mathSba.add(mathExam), "B", BigDecimal.valueOf(3.0)));
        }

        // 4. Finance
        FeeSchedule schedule = feeScheduleRepository.save(FeeSchedule.create(level, term, ay));
        FeeItem tuition = feeItemRepository.save(FeeItem.create("Tuition Fee", BigDecimal.valueOf(1500), true));
        FeeItem pta = feeItemRepository.save(FeeItem.create("PTA Dues", BigDecimal.valueOf(200), true));
        
        for (Enrollment enr : enrollmentRepository.findAll()) {
            Invoice inv = invoiceRepository.save(Invoice.create(enr, schedule, LocalDate.now(), LocalDate.now().plusDays(30)));
            InvoiceLine l1 = invoiceLineRepository.save(InvoiceLine.create(tuition, BigDecimal.valueOf(1500)));
            l1.setInvoice(inv);
            InvoiceLine l2 = invoiceLineRepository.save(InvoiceLine.create(pta, BigDecimal.valueOf(200)));
            l2.setInvoice(inv);
            invoiceLineRepository.saveAll(List.of(l1, l2));
            inv.setTotalAmount(BigDecimal.valueOf(1700));
            
            // Randomly pay some
            if (random.nextBoolean()) {
                Payment payment = paymentRepository.save(Payment.create(enr.getStudent(), BigDecimal.valueOf(1700), "CASH", "RCP-" + String.format("%06d", random.nextInt(999999)), LocalDate.now(), adminStaff.getId()));
                paymentAllocationRepository.save(PaymentAllocation.create(payment, inv, BigDecimal.valueOf(1700)));
                inv.setPaidAmount(BigDecimal.valueOf(1700));
                inv.setStatus("PAID");
            } else {
                inv.setStatus("UNPAID");
            }
            invoiceRepository.save(inv);
        }

        // 5. Communication
        announcementRepository.save(Announcement.create("Welcome to Term 1", "Classes resume tomorrow. Ensure all fees are paid.", "SYSTEM", "ALL", null, LocalDateTime.now().plusDays(7)));

        log.info("Database successfully seeded.");
    }

    private void truncateAllTables() {
        entityManager.createNativeQuery(
            "DO $$ DECLARE " +
            "    r RECORD; " +
            "BEGIN " +
            "    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND tablename != 'flyway_schema_history') LOOP " +
            "        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; " +
            "    END LOOP; " +
            "END $$;"
        ).executeUpdate();
    }
}
