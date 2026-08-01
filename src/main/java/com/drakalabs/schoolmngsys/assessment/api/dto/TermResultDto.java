package com.drakalabs.schoolmngsys.assessment.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record TermResultDto(
        UUID id,
        UUID enrollmentId,
        UUID termId,
        UUID subjectId,
        BigDecimal sbaTotal,
        BigDecimal examTotal,
        BigDecimal overallTotal,
        String grade,
        BigDecimal points,
        Integer classPosition,
        String status,
        int version
) {}
