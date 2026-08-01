package com.drakalabs.schoolmngsys.assessment.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ScoreEntryDto(
        UUID enrollmentId,
        BigDecimal rawScore,
        boolean isExempt,
        boolean isNa
) {}
