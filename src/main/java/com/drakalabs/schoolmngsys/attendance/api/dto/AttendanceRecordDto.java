package com.drakalabs.schoolmngsys.attendance.api.dto;

import com.drakalabs.schoolmngsys.attendance.domain.AttendanceRecord;
import com.drakalabs.schoolmngsys.attendance.domain.AttendanceStatus;

import java.time.LocalDate;
import java.util.UUID;

public record AttendanceRecordDto(
        UUID id,
        UUID enrollmentId,
        LocalDate attendanceDate,
        AttendanceStatus status,
        UUID markedBy,
        String correctionReason
) {
    public static AttendanceRecordDto from(AttendanceRecord record) {
        return new AttendanceRecordDto(
                record.getId(),
                record.getEnrollmentId(),
                record.getAttendanceDate(),
                record.getStatus(),
                record.getMarkedBy(),
                record.getCorrectionReason()
        );
    }
}
