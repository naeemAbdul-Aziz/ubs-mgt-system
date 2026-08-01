package com.drakalabs.schoolmngsys.academics.repository;

import com.drakalabs.schoolmngsys.academics.domain.TermCalendarVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TermCalendarVariantRepository extends JpaRepository<TermCalendarVariant, UUID> {

    List<TermCalendarVariant> findByTermId(UUID termId);

    Optional<TermCalendarVariant> findByTermIdAndClassLevelId(UUID termId, UUID classLevelId);
}
