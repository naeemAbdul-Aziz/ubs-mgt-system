package com.drakalabs.schoolmngsys.progression.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProgressionResultDto(
    UUID id,
    UUID studentId,
    BigDecimal finalAverage,
    String outcome,
    UUID previousClassId,
    UUID newEnrollmentId
) {}
