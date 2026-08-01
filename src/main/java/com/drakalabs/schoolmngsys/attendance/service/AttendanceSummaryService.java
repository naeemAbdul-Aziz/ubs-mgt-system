package com.drakalabs.schoolmngsys.attendance.service;

import com.drakalabs.schoolmngsys.attendance.api.dto.AttendanceSummaryDto;
import com.drakalabs.schoolmngsys.attendance.domain.AttendanceStatus;
import com.drakalabs.schoolmngsys.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceSummaryService {

    private final AttendanceRepository attendanceRepository;

    @Transactional(readOnly = true)
    public AttendanceSummaryDto getForEnrollment(UUID enrollmentId) {
        long present = attendanceRepository.countByEnrollmentIdAndStatus(enrollmentId, AttendanceStatus.PRESENT);
        long absent = attendanceRepository.countByEnrollmentIdAndStatus(enrollmentId, AttendanceStatus.ABSENT);
        long late = attendanceRepository.countByEnrollmentIdAndStatus(enrollmentId, AttendanceStatus.LATE);
        long excused = attendanceRepository.countByEnrollmentIdAndStatus(enrollmentId, AttendanceStatus.EXCUSED);

        return new AttendanceSummaryDto(enrollmentId, present, absent, late, excused);
    }
}
