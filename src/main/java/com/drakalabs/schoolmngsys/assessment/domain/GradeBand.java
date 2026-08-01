package com.drakalabs.schoolmngsys.assessment.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "grade_bands")
@Getter
@Setter(AccessLevel.PACKAGE) // Managed by GradeScale
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GradeBand extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "grade_scale_id", nullable = false)
    private GradeScale gradeScale;

    @Column(nullable = false)
    private String name;

    @Column(name = "min_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal minScore;

    @Column(name = "max_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxScore;

    @Column(name = "point_value", nullable = false, precision = 3, scale = 1)
    private BigDecimal pointValue;

    @Column
    private String remarks;

    public static GradeBand create(String name, BigDecimal minScore, BigDecimal maxScore, BigDecimal pointValue, String remarks) {
        GradeBand band = new GradeBand();
        band.setName(name);
        band.setMinScore(minScore);
        band.setMaxScore(maxScore);
        band.setPointValue(pointValue);
        band.setRemarks(remarks);
        return band;
    }
}
