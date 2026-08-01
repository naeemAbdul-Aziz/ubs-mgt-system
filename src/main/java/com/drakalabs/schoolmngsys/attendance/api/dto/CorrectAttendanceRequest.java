package com.drakalabs.schoolmngsys.attendance.api.dto;

import com.drakalabs.schoolmngsys.attendance.domain.AttendanceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CorrectAttendanceRequest(
        @NotNull(message = "New status is required")
        AttendanceStatus newStatus,

        @NotBlank(message = "Correction reason is required")
        String reason
) {
}
