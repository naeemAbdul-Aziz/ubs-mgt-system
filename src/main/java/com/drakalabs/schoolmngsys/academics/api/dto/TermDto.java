package com.drakalabs.schoolmngsys.academics.api.dto;

import java.time.LocalDate;
import java.util.UUID;

public record TermDto(
        UUID id,
        UUID academicYearId,
        int termNumber,
        LocalDate startDate,
        LocalDate endDate
) {}
