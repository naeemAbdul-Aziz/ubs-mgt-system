package com.drakalabs.schoolmngsys.academics.repository;

import com.drakalabs.schoolmngsys.academics.domain.ClassLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassLevelRepository extends JpaRepository<ClassLevel, UUID> {

    Optional<ClassLevel> findByCode(String code);

    @Query("SELECT c FROM ClassLevel c ORDER BY c.sortOrder ASC")
    List<ClassLevel> findAllOrdered();
}
