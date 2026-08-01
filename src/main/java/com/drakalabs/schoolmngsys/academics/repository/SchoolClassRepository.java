package com.drakalabs.schoolmngsys.academics.repository;

import com.drakalabs.schoolmngsys.academics.domain.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, UUID> {

    List<SchoolClass> findByAcademicYearId(UUID academicYearId);

    Optional<SchoolClass> findByAcademicYearIdAndClassLevelIdAndStream(UUID academicYearId, UUID classLevelId, String stream);
}
