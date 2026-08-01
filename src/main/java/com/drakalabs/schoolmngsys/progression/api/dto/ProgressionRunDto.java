package com.drakalabs.schoolmngsys.progression.api.dto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record ProgressionRunDto(
    UUID id,
    UUID sourceAcademicYearId,
    UUID targetAcademicYearId,
    String status,
    ZonedDateTime executedAt,
    List<ProgressionResultDto> results
) {}
