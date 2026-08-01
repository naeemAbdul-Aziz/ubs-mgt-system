package com.drakalabs.schoolmngsys.academics.api;

import com.drakalabs.schoolmngsys.academics.api.dto.CreateTermRequest;
import com.drakalabs.schoolmngsys.academics.api.dto.TermDto;
import com.drakalabs.schoolmngsys.academics.service.AcademicStructureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academic-years/{yearId}/terms")
@RequiredArgsConstructor
public class TermController {

    private final AcademicStructureService structureService;

    @GetMapping
    @PreAuthorize("hasAuthority('ACADEMIC_YEAR_VIEW')")
    public List<TermDto> getTerms(@PathVariable UUID yearId) {
        return structureService.getTermsForYear(yearId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ACADEMIC_YEAR_CREATE')")
    public TermDto createTerm(@PathVariable UUID yearId, @RequestBody @Valid CreateTermRequest request) {
        return structureService.createTerm(yearId, request);
    }
}
