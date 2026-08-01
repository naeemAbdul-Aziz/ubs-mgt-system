package com.drakalabs.schoolmngsys.academics.api;

import com.drakalabs.schoolmngsys.academics.api.dto.AcademicYearDto;
import com.drakalabs.schoolmngsys.academics.api.dto.CreateAcademicYearRequest;
import com.drakalabs.schoolmngsys.academics.service.AcademicStructureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academic-years")
@RequiredArgsConstructor
public class AcademicYearController {

    private final AcademicStructureService structureService;

    @GetMapping
    @PreAuthorize("hasAuthority('ACADEMIC_YEAR_VIEW')")
    public List<AcademicYearDto> getAll() {
        return structureService.getAllAcademicYears();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ACADEMIC_YEAR_CREATE')")
    public AcademicYearDto create(@RequestBody @Valid CreateAcademicYearRequest request) {
        return structureService.createAcademicYear(request);
    }

    @PostMapping("/{id}/activate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ACADEMIC_YEAR_UPDATE')")
    public void activate(@PathVariable UUID id) {
        structureService.activateAcademicYear(id);
    }

    @PostMapping("/{id}/close")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ACADEMIC_YEAR_CLOSE')")
    public void close(@PathVariable UUID id) {
        structureService.closeAcademicYear(id);
    }
}
