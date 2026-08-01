package com.drakalabs.schoolmngsys.finance.repository;

import com.drakalabs.schoolmngsys.finance.domain.FeeSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;

@Repository
public interface FeeScheduleRepository extends JpaRepository<FeeSchedule, UUID> {
    Optional<FeeSchedule> findByClassLevelIdAndTermIdAndAcademicYearId(UUID classLevelId, UUID termId, UUID academicYearId);
}
