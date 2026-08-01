package com.drakalabs.schoolmngsys.assessment.domain;

import com.drakalabs.schoolmngsys.academics.domain.AcademicYear;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "grade_scales")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GradeScale extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "gradeScale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GradeBand> bands = new ArrayList<>();

    public static GradeScale create(AcademicYear academicYear, String name) {
        GradeScale scale = new GradeScale();
        scale.setAcademicYear(academicYear);
        scale.setName(name);
        return scale;
    }

    public void addBand(GradeBand band) {
        bands.add(band);
        band.setGradeScale(this);
    }
}
