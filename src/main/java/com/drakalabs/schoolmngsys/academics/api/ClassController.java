package com.drakalabs.schoolmngsys.academics.api;

import com.drakalabs.schoolmngsys.academics.api.dto.CreateSchoolClassRequest;
import com.drakalabs.schoolmngsys.academics.api.dto.SchoolClassDto;
import com.drakalabs.schoolmngsys.academics.service.AcademicStructureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academic-years/{yearId}/classes")
@RequiredArgsConstructor
public class ClassController {

    private final AcademicStructureService structureService;

    @GetMapping
    @PreAuthorize("hasAuthority('CLASS_VIEW')")
    public List<SchoolClassDto> getClasses(@PathVariable UUID yearId) {
        return structureService.getClassesForYear(yearId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CLASS_CREATE')")
    public SchoolClassDto createClass(@PathVariable UUID yearId, @RequestBody @Valid CreateSchoolClassRequest request) {
        return structureService.createClass(yearId, request);
    }

    @PostMapping("/{classId}/subjects/{subjectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('SUBJECT_OFFERING_MANAGE')")
    public void addSubjectOffering(
            @PathVariable UUID classId,
            @PathVariable UUID subjectId) {
        structureService.addSubjectOffering(classId, subjectId);
    }

    @PutMapping("/{classId}/teacher/{teacherId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('CLASS_MANAGE')")
    public void assignClassTeacher(
            @PathVariable UUID classId,
            @PathVariable UUID teacherId) {
        structureService.assignClassTeacher(classId, teacherId);
    }

    @PutMapping("/{classId}/subjects/{subjectId}/teacher/{teacherId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('SUBJECT_OFFERING_MANAGE')")
    public void assignSubjectTeacher(
            @PathVariable UUID classId,
            @PathVariable UUID subjectId,
            @PathVariable UUID teacherId) {
        structureService.assignSubjectTeacher(classId, subjectId, teacherId);
    }
}
