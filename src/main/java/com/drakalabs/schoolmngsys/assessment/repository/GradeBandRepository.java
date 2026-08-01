package com.drakalabs.schoolmngsys.assessment.repository;

import com.drakalabs.schoolmngsys.assessment.domain.GradeBand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GradeBandRepository extends JpaRepository<GradeBand, UUID> {
    List<GradeBand> findByGradeScaleId(UUID gradeScaleId);
}
