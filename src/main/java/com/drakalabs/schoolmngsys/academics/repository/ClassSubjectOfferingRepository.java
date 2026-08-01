package com.drakalabs.schoolmngsys.academics.repository;

import com.drakalabs.schoolmngsys.academics.domain.ClassSubjectOffering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClassSubjectOfferingRepository extends JpaRepository<ClassSubjectOffering, UUID> {

    List<ClassSubjectOffering> findBySchoolClassId(UUID schoolClassId);
    
    java.util.Optional<ClassSubjectOffering> findBySchoolClassIdAndSubjectId(UUID schoolClassId, UUID subjectId);

    boolean existsBySchoolClassIdAndSubjectId(UUID schoolClassId, UUID subjectId);
}
