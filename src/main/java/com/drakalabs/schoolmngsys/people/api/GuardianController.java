package com.drakalabs.schoolmngsys.people.api;

import com.drakalabs.schoolmngsys.people.api.dto.CreateGuardianRequest;
import com.drakalabs.schoolmngsys.people.api.dto.GuardianDto;
import com.drakalabs.schoolmngsys.people.api.dto.LinkGuardianRequest;
import com.drakalabs.schoolmngsys.people.api.dto.StudentGuardianDto;
import com.drakalabs.schoolmngsys.people.domain.Guardian;
import com.drakalabs.schoolmngsys.people.domain.StudentGuardian;
import com.drakalabs.schoolmngsys.people.service.GuardianService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.drakalabs.schoolmngsys.shared.api.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/guardians")
@RequiredArgsConstructor
public class GuardianController {

    private final GuardianService guardianService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('GUARDIAN_CREATE')")
    public GuardianDto createGuardian(@Valid @RequestBody CreateGuardianRequest request) {
        Guardian guardian = guardianService.createGuardian(
                request.getFirstName(),
                request.getLastName(),
                request.getOtherNames(),
                request.getPhone(),
                request.getEmail(),
                request.getOccupation(),
                request.getAddress()
        );
        return GuardianDto.from(guardian);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('GUARDIAN_VIEW')")
    public PageResponse<GuardianDto> searchGuardians(
            @RequestParam(required = false) String query,
            Pageable pageable) {
        return PageResponse.from(guardianService.searchGuardians(query, pageable).map(GuardianDto::from));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('GUARDIAN_VIEW')")
    public GuardianDto getGuardian(@PathVariable UUID id) {
        return GuardianDto.from(guardianService.getGuardian(id));
    }

    @PostMapping("/{guardianId}/link-student/{studentId}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('GUARDIAN_LINK_MANAGE')")
    public StudentGuardianDto linkStudent(
            @PathVariable UUID guardianId,
            @PathVariable UUID studentId,
            @Valid @RequestBody LinkGuardianRequest request) {
        StudentGuardian link = guardianService.linkGuardianToStudent(
                guardianId, studentId, request.getRelationshipType(),
                request.isPrimaryContact(), request.isHasCustody(),
                request.isReceivesBilling(), request.isReceivesAcademicReports()
        );
        return StudentGuardianDto.from(link);
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAuthority('GUARDIAN_VIEW')")
    public List<StudentGuardianDto> getStudentGuardians(@PathVariable UUID studentId) {
        return guardianService.getStudentGuardians(studentId).stream()
                .map(StudentGuardianDto::from)
                .collect(Collectors.toList());
    }
}
