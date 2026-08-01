package com.drakalabs.schoolmngsys.assessment.api.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ReportCardDto(
        UUID id,
        UUID enrollmentId,
        UUID termId,
        String remarks,
        OffsetDateTime publishedAt
) {}
