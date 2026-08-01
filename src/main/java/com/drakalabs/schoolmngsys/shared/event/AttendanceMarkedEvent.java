package com.drakalabs.schoolmngsys.shared.event;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Event published when a daily attendance register is submitted or corrected.
 */
public record AttendanceMarkedEvent(
        UUID classId,
        LocalDate attendanceDate,
        int presentCount,
        int absentCount,
        int lateCount,
        int excusedCount,
        UUID eventId,
        java.time.Instant occurredAt,
        UUID actorAccountId
) implements DomainEvent {
}
