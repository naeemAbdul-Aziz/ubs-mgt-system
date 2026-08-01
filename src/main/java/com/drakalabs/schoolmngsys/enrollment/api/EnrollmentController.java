package com.drakalabs.schoolmngsys.enrollment.api;

import com.drakalabs.schoolmngsys.enrollment.api.dto.EnrollStudentRequest;
import com.drakalabs.schoolmngsys.enrollment.api.dto.EnrollmentDto;
import com.drakalabs.schoolmngsys.enrollment.api.dto.ExitEnrollmentRequest;
import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.enrollment.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/enrollments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ENROLLMENT_CREATE')")
    public EnrollmentDto enrollStudent(@Valid @RequestBody EnrollStudentRequest request) {
        Enrollment enrollment = enrollmentService.enrollStudent(
                request.getStudentId(),
                request.getClassId(),
                request.getAcademicYearId(),
                request.isForce()
        );
        return EnrollmentDto.from(enrollment);
    }

    @PutMapping("/enrollments/{id}/exit")
    @PreAuthorize("hasAuthority('ENROLLMENT_END')")
    public EnrollmentDto exitEnrollment(@PathVariable UUID id, @Valid @RequestBody ExitEnrollmentRequest request) {
        Enrollment enrollment = enrollmentService.recordExit(
                id,
                request.getExitReason(),
                request.getExitDate(),
                request.getStatus()
        );
        return EnrollmentDto.from(enrollment);
    }

    @GetMapping("/students/{studentId}/enrollments")
    @PreAuthorize("hasAuthority('ENROLLMENT_VIEW')")
    public List<EnrollmentDto> getStudentEnrollments(@PathVariable UUID studentId) {
        // NOTE: If Guardian scoping is applied here, it should be done using GuardianWardResolutionService.
        // For MVP, relying on standard RBAC. Guardian-ward security scope applies if the user is a Guardian.
        return enrollmentService.getStudentEnrollmentHistory(studentId)
                .stream()
                .map(EnrollmentDto::from)
                .collect(Collectors.toList());
    }
}
