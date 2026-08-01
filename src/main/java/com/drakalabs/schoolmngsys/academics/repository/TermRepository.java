package com.drakalabs.schoolmngsys.academics.repository;

import com.drakalabs.schoolmngsys.academics.domain.Term;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TermRepository extends JpaRepository<Term, UUID> {

    List<Term> findByAcademicYearIdOrderByTermNumberAsc(UUID academicYearId);

    Optional<Term> findByAcademicYearIdAndTermNumber(UUID academicYearId, int termNumber);

    long countByAcademicYearId(UUID academicYearId);
}
