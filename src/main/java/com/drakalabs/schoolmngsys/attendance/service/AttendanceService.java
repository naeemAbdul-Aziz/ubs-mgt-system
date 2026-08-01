package com.drakalabs.schoolmngsys.attendance.service;

import com.drakalabs.schoolmngsys.academics.service.CalendarService;
import com.drakalabs.schoolmngsys.attendance.api.dto.SubmitRegisterRequest;
import com.drakalabs.schoolmngsys.attendance.domain.AttendanceRecord;
import com.drakalabs.schoolmngsys.attendance.domain.AttendanceStatus;
import com.drakalabs.schoolmngsys.attendance.repository.AttendanceRepository;
import com.drakalabs.schoolmngsys.enrollment.api.dto.RosterEntryDto;
import com.drakalabs.schoolmngsys.enrollment.service.RosterService;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import com.drakalabs.schoolmngsys.shared.event.AttendanceMarkedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final RosterService rosterService;
    private final CalendarService calendarService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void submitRegister(UUID classId, LocalDate date, List<SubmitRegisterRequest.RegisterEntry> records, UUID markedBy) {
        // BR-AT-002: Attendance only on school days
        if (!calendarService.isSchoolDay(date)) {
            throw new BusinessRuleException("BR-AT-002", "Cannot mark attendance on a non-school day.");
        }

        // Fetch active roster for the class
        List<RosterEntryDto> roster = rosterService.getClassRoster(classId);
        Map<UUID, RosterEntryDto> rosterMap = roster.stream()
                .collect(Collectors.toMap(RosterEntryDto::getEnrollmentId, r -> r));

        List<AttendanceRecord> newRecords = records.stream().map(entry -> {
            if (!rosterMap.containsKey(entry.enrollmentId())) {
                throw new BusinessRuleException("BR-AT-003", "Enrollment ID " + entry.enrollmentId() + " is not in the active roster for this class.");
            }
            
            // Check if record already exists (BR-AT-001)
            attendanceRepository.findByEnrollmentIdAndAttendanceDate(entry.enrollmentId(), date)
                    .ifPresent(r -> {
                        throw new BusinessRuleException("BR-AT-001", "Attendance already marked for enrollment " + entry.enrollmentId() + " on " + date);
                    });

            return AttendanceRecord.create(entry.enrollmentId(), date, entry.status(), markedBy);
        }).toList();

        attendanceRepository.saveAll(newRecords);

        // Calculate stats for the event
        int presentCount = (int) records.stream().filter(r -> r.status() == AttendanceStatus.PRESENT).count();
        int absentCount = (int) records.stream().filter(r -> r.status() == AttendanceStatus.ABSENT).count();
        int lateCount = (int) records.stream().filter(r -> r.status() == AttendanceStatus.LATE).count();
        int excusedCount = (int) records.stream().filter(r -> r.status() == AttendanceStatus.EXCUSED).count();

        // Publish domain event
        eventPublisher.publishEvent(new AttendanceMarkedEvent(
                classId, date, presentCount, absentCount, lateCount, excusedCount,
                UUID.randomUUID(), java.time.Instant.now(), markedBy
        ));
    }

    @Transactional
    public void correctRecord(UUID recordId, AttendanceStatus newStatus, String reason, UUID correctedBy) {
        AttendanceRecord record = attendanceRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("AttendanceRecord", recordId.toString()));

        // BR-AT-005: Corrections require a reason (validated by DTO annotations, but we ensure it's not null here)
        if (reason == null || reason.isBlank()) {
            throw new BusinessRuleException("BR-AT-005", "Correction reason is mandatory.");
        }

        record.correct(newStatus, reason, correctedBy);
        attendanceRepository.save(record);
    }
}
