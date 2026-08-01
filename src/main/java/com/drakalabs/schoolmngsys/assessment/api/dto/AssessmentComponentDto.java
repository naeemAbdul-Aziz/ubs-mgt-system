package com.drakalabs.schoolmngsys.assessment.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record AssessmentComponentDto(
        UUID id,
        UUID classSubjectOfferingId,
        UUID termId,
        String name,
        BigDecimal maxScore,
        BigDecimal weight
) {}
