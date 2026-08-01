package com.drakalabs.schoolmngsys.assessment.repository;

import com.drakalabs.schoolmngsys.assessment.domain.TermResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TermResultRepository extends JpaRepository<TermResult, UUID> {
    List<TermResult> findByEnrollmentIdAndTermId(UUID enrollmentId, UUID termId);
    List<TermResult> findBySubjectIdAndTermId(UUID subjectId, UUID termId);
    List<TermResult> findAllByEnrollmentId(UUID enrollmentId);
}
