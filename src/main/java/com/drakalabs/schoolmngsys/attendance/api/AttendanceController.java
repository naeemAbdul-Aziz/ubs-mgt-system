package com.drakalabs.schoolmngsys.attendance.api;

import com.drakalabs.schoolmngsys.attendance.api.dto.AttendanceSummaryDto;
import com.drakalabs.schoolmngsys.attendance.api.dto.CorrectAttendanceRequest;
import com.drakalabs.schoolmngsys.attendance.api.dto.SubmitRegisterRequest;
import com.drakalabs.schoolmngsys.attendance.service.AttendanceService;
import com.drakalabs.schoolmngsys.attendance.service.AttendanceSummaryService;
import com.drakalabs.schoolmngsys.shared.security.UbsUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final AttendanceSummaryService attendanceSummaryService;

    @PostMapping("/registers")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ATTENDANCE_MARK')")
    public void submitRegister(
            @Valid @RequestBody SubmitRegisterRequest request,
            @AuthenticationPrincipal UbsUserDetails user) {
        
        attendanceService.submitRegister(
                request.classId(),
                request.attendanceDate(),
                request.records(),
                user.accountId() // Marked by the authenticated user
        );
    }

    @PutMapping("/records/{id}")
    @PreAuthorize("hasAuthority('ATTENDANCE_CORRECT')")
    public void correctRecord(
            @PathVariable UUID id,
            @Valid @RequestBody CorrectAttendanceRequest request,
            @AuthenticationPrincipal UbsUserDetails user) {
        
        attendanceService.correctRecord(
                id,
                request.newStatus(),
                request.reason(),
                user.accountId() // Corrected by the authenticated user
        );
    }

    @GetMapping("/summaries")
    @PreAuthorize("hasAuthority('ATTENDANCE_VIEW')")
    public AttendanceSummaryDto getSummary(@RequestParam UUID enrollmentId) {
        return attendanceSummaryService.getForEnrollment(enrollmentId);
    }
}
