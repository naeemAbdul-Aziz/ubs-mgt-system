package com.drakalabs.schoolmngsys.attendance.repository;

import com.drakalabs.schoolmngsys.attendance.domain.AttendanceRecord;
import com.drakalabs.schoolmngsys.attendance.domain.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, UUID> {

    Optional<AttendanceRecord> findByEnrollmentIdAndAttendanceDate(UUID enrollmentId, LocalDate attendanceDate);

    List<AttendanceRecord> findByEnrollmentIdInAndAttendanceDate(List<UUID> enrollmentIds, LocalDate attendanceDate);

    long countByEnrollmentIdAndStatus(UUID enrollmentId, AttendanceStatus status);
}
