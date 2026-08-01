package com.drakalabs.schoolmngsys.finance.api.dto;

import java.util.List;
import java.util.UUID;

public record FeeScheduleDto(
    UUID id,
    UUID classLevelId,
    UUID termId,
    UUID academicYearId,
    String status,
    List<FeeItemDto> items
) {}
