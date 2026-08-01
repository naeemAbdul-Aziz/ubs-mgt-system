package com.drakalabs.schoolmngsys.progression.repository;

import com.drakalabs.schoolmngsys.progression.domain.ProgressionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProgressionResultRepository extends JpaRepository<ProgressionResult, UUID> {
    List<ProgressionResult> findAllByRunId(UUID runId);
}
