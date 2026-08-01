package com.drakalabs.schoolmngsys.enrollment.domain;

import com.drakalabs.schoolmngsys.academics.domain.AcademicYear;
import com.drakalabs.schoolmngsys.academics.domain.SchoolClass;
import com.drakalabs.schoolmngsys.people.domain.Student;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "enrollments")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Enrollment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status;

    @Column(name = "roll_number")
    private Integer rollNumber;

    @Column(name = "exit_reason")
    private String exitReason;

    @Column(name = "exit_date")
    private LocalDate exitDate;

    public static Enrollment create(Student student, SchoolClass schoolClass, AcademicYear academicYear) {
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setSchoolClass(schoolClass);
        enrollment.setAcademicYear(academicYear);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        return enrollment;
    }

    public void exit(String exitReason, LocalDate exitDate, EnrollmentStatus newStatus) {
        if (this.status != EnrollmentStatus.ACTIVE) {
            throw new BusinessRuleException("BR-EN-003", "Only ACTIVE enrollments can be exited.");
        }
        if (newStatus == EnrollmentStatus.ACTIVE) {
            throw new BusinessRuleException("BR-EN-005", "Cannot exit to ACTIVE status.");
        }
        this.setStatus(newStatus);
        this.setExitReason(exitReason);
        this.setExitDate(exitDate);
    }
}
