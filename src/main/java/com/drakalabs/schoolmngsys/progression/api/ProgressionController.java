package com.drakalabs.schoolmngsys.progression.api;

import com.drakalabs.schoolmngsys.progression.api.dto.ProgressionRunDto;
import com.drakalabs.schoolmngsys.progression.api.dto.ProgressionRunRequest;
import com.drakalabs.schoolmngsys.progression.domain.ProgressionRun;
import com.drakalabs.schoolmngsys.progression.repository.ProgressionRunRepository;
import com.drakalabs.schoolmngsys.progression.service.ProgressionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progression/runs")
@RequiredArgsConstructor
public class ProgressionController {

    private final ProgressionService progressionService;
    private final ProgressionRunRepository runRepository;
    private final ProgressionMapper mapper;

    @PostMapping
    public ResponseEntity<ProgressionRunDto> executeRun(@Valid @RequestBody ProgressionRunRequest request) {
        ProgressionRun run = progressionService.executeProgressionRun(request.sourceAcademicYearId(), request.targetAcademicYearId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(run));
    }

    @GetMapping
    public ResponseEntity<List<ProgressionRunDto>> getAllRuns() {
        return ResponseEntity.ok(runRepository.findAll().stream().map(mapper::toDto).toList());
    }
}
