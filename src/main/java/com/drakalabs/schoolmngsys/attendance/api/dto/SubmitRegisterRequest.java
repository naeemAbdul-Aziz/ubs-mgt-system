package com.drakalabs.schoolmngsys.attendance.api.dto;

import com.drakalabs.schoolmngsys.attendance.domain.AttendanceStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SubmitRegisterRequest(
        @NotNull(message = "Class ID is required")
        UUID classId,

        @NotNull(message = "Attendance date is required")
        LocalDate attendanceDate,

        @NotEmpty(message = "Records cannot be empty")
        List<RegisterEntry> records
) {
    public record RegisterEntry(
            @NotNull(message = "Enrollment ID is required")
            UUID enrollmentId,

            @NotNull(message = "Status is required")
            AttendanceStatus status
    ) {}
}
