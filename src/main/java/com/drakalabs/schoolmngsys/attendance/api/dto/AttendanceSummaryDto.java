package com.drakalabs.schoolmngsys.attendance.api.dto;

import java.util.UUID;

public record AttendanceSummaryDto(
        UUID enrollmentId,
        long daysPresent,
        long daysAbsent,
        long daysLate,
        long daysExcused
) {
}
