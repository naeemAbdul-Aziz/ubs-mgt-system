package com.drakalabs.schoolmngsys.assessment.repository;

import com.drakalabs.schoolmngsys.assessment.domain.AssessmentComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssessmentComponentRepository extends JpaRepository<AssessmentComponent, UUID> {
    List<AssessmentComponent> findByTermId(UUID termId);
    List<AssessmentComponent> findByClassSubjectOfferingId(UUID csoId);
}
