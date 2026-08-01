package com.drakalabs.schoolmngsys.academics.api;

import com.drakalabs.schoolmngsys.academics.api.dto.ClassLevelDto;
import com.drakalabs.schoolmngsys.academics.api.dto.DepartmentDto;
import com.drakalabs.schoolmngsys.academics.api.dto.SubjectDto;
import com.drakalabs.schoolmngsys.academics.service.ReferenceDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    @GetMapping("/departments")
    public List<DepartmentDto> getDepartments() {
        return referenceDataService.getAllDepartments();
    }

    @GetMapping("/levels")
    public List<ClassLevelDto> getLevels() {
        return referenceDataService.getAllClassLevels();
    }

    @GetMapping("/subjects")
    @PreAuthorize("hasAuthority('SUBJECT_VIEW')")
    public List<SubjectDto> getSubjects() {
        return referenceDataService.getAllSubjects();
    }
}
