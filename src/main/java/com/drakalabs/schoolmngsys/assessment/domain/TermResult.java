package com.drakalabs.schoolmngsys.assessment.domain;

import com.drakalabs.schoolmngsys.academics.domain.Subject;
import com.drakalabs.schoolmngsys.academics.domain.Term;
import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "term_results")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TermResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "sba_total", precision = 5, scale = 2)
    private BigDecimal sbaTotal;

    @Column(name = "exam_total", precision = 5, scale = 2)
    private BigDecimal examTotal;

    @Column(name = "overall_total", precision = 5, scale = 2)
    private BigDecimal overallTotal;

    @Column
    private String grade;

    @Column(precision = 3, scale = 1)
    private BigDecimal points;

    @Column(name = "class_position")
    private Integer classPosition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultStatus status = ResultStatus.DRAFT;

    @Column(nullable = false)
    private int version = 1;

    @Column(name = "superseded_by")
    private UUID supersededBy;

    public static TermResult create(Enrollment enrollment, Term term, Subject subject, BigDecimal sbaTotal, BigDecimal examTotal, BigDecimal overallTotal, String grade, BigDecimal points) {
        TermResult result = new TermResult();
        result.setEnrollment(enrollment);
        result.setTerm(term);
        result.setSubject(subject);
        result.setSbaTotal(sbaTotal);
        result.setExamTotal(examTotal);
        result.setOverallTotal(overallTotal);
        result.setGrade(grade);
        result.setPoints(points);
        return result;
    }

    public void submit() {
        this.status = ResultStatus.SUBMITTED;
    }

    public void approve() {
        this.status = ResultStatus.HOD_APPROVED;
    }

    public void publish() {
        this.status = ResultStatus.PUBLISHED;
    }

    public void supersede(UUID newVersionId) {
        this.supersededBy = newVersionId;
    }
}
