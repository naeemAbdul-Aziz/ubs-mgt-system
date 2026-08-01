package com.drakalabs.schoolmngsys.assessment.domain;

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
@Table(name = "scores")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Score extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_component_id", nullable = false)
    private AssessmentComponent assessmentComponent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @Column(name = "raw_score", precision = 5, scale = 2)
    private BigDecimal rawScore;

    @Column(name = "is_exempt", nullable = false)
    private boolean isExempt;

    @Column(name = "is_na", nullable = false)
    private boolean isNa;

    public static Score create(AssessmentComponent component, Enrollment enrollment, BigDecimal rawScore, boolean isExempt, boolean isNa) {
        Score score = new Score();
        score.setAssessmentComponent(component);
        score.setEnrollment(enrollment);
        score.setRawScore(rawScore);
        score.setExempt(isExempt);
        score.setNa(isNa);
        return score;
    }

    public void updateScore(BigDecimal rawScore, boolean isExempt, boolean isNa) {
        this.setRawScore(rawScore);
        this.setExempt(isExempt);
        this.setNa(isNa);
    }
}
