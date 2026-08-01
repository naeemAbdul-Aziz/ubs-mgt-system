package com.drakalabs.schoolmngsys.academics.api.dto;

import com.drakalabs.schoolmngsys.academics.domain.AcademicYear.AcademicYearStatus;
import java.time.LocalDate;
import java.util.UUID;

public record AcademicYearDto(
        UUID id,
        String name,
        LocalDate startDate,
        LocalDate endDate,
        AcademicYearStatus status
) {}
