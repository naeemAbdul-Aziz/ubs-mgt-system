package com.drakalabs.schoolmngsys.assessment.domain;

import com.drakalabs.schoolmngsys.academics.domain.ClassSubjectOffering;
import com.drakalabs.schoolmngsys.academics.domain.Term;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "assessment_components")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AssessmentComponent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_subject_offering_id", nullable = false)
    private ClassSubjectOffering classSubjectOffering;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @Column(nullable = false)
    private String name;

    @Column(name = "max_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxScore;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    public static AssessmentComponent create(ClassSubjectOffering offering, Term term, String name, BigDecimal maxScore, BigDecimal weight) {
        AssessmentComponent component = new AssessmentComponent();
        component.setClassSubjectOffering(offering);
        component.setTerm(term);
        component.setName(name);
        component.setMaxScore(maxScore);
        component.setWeight(weight);
        return component;
    }
}
