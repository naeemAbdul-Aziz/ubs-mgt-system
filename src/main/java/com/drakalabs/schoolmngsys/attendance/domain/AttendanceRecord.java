package com.drakalabs.schoolmngsys.attendance.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "attendance_records",
        uniqueConstraints = @UniqueConstraint(name = "uq_attendance_records_enrollment_date", columnNames = {"enrollment_id", "attendance_date"})
)
@Getter
@Setter
@NoArgsConstructor
public class AttendanceRecord extends BaseEntity {

    @Column(name = "enrollment_id", nullable = false)
    private UUID enrollmentId;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AttendanceStatus status;

    @Column(name = "marked_by", nullable = false)
    private UUID markedBy;

    @Column(name = "correction_reason")
    private String correctionReason;

    public static AttendanceRecord create(UUID enrollmentId, LocalDate attendanceDate, AttendanceStatus status, UUID markedBy) {
        AttendanceRecord record = new AttendanceRecord();
        record.setEnrollmentId(enrollmentId);
        record.setAttendanceDate(attendanceDate);
        record.setStatus(status);
        record.setMarkedBy(markedBy);
        return record;
    }

    public void correct(AttendanceStatus newStatus, String reason, UUID correctedBy) {
        this.status = newStatus;
        this.correctionReason = reason;
        // Note: BaseEntity auto-updates updated_by if using JPA auditing with AuditorAware.
    }
}
