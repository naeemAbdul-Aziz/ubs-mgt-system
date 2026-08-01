package com.drakalabs.schoolmngsys.assessment.repository;

import com.drakalabs.schoolmngsys.assessment.domain.GradeScale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeScaleRepository extends JpaRepository<GradeScale, UUID> {
    Optional<GradeScale> findByAcademicYearIdAndName(UUID academicYearId, String name);
}
