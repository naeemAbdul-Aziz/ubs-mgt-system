package com.drakalabs.schoolmngsys.progression.domain;

import com.drakalabs.schoolmngsys.academics.domain.SchoolClass;
import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.people.domain.Student;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "progression_results")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProgressionResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "run_id", nullable = false)
    private ProgressionRun run;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "final_average", precision = 5, scale = 2)
    private BigDecimal finalAverage;

    @Column(nullable = false)
    private String outcome;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "previous_class_id", nullable = false)
    private SchoolClass previousClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_enrollment_id")
    private Enrollment newEnrollment;

    public static ProgressionResult create(Student student, SchoolClass previousClass, BigDecimal finalAverage, String outcome) {
        ProgressionResult result = new ProgressionResult();
        result.setStudent(student);
        result.setPreviousClass(previousClass);
        result.setFinalAverage(finalAverage);
        result.setOutcome(outcome);
        return result;
    }

    public void setNewEnrollment(Enrollment newEnrollment) {
        this.newEnrollment = newEnrollment;
    }
    
    // Package-private setter for bidirectional sync
    void setRun(ProgressionRun run) {
        this.run = run;
    }
}
