package com.drakalabs.schoolmngsys.assessment.repository;

import com.drakalabs.schoolmngsys.assessment.domain.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScoreRepository extends JpaRepository<Score, UUID> {
    List<Score> findByAssessmentComponentId(UUID componentId);
    List<Score> findByEnrollmentIdAndAssessmentComponentTermId(UUID enrollmentId, UUID termId);
}
