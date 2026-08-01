package com.drakalabs.schoolmngsys.assessment.api;

import com.drakalabs.schoolmngsys.assessment.api.dto.BulkScoreEntryRequest;
import com.drakalabs.schoolmngsys.assessment.service.AssessmentService;
import com.drakalabs.schoolmngsys.shared.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessment")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('STAFF') or @securityService.isStaff()")
    @PostMapping("/scores/bulk")
    public ResponseEntity<Void> bulkEnterScores(@Valid @RequestBody BulkScoreEntryRequest request) {
        assessmentService.bulkEnterScores(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/scores")
    public ResponseEntity<List<Map<String, Object>>> getClassScores(
            @RequestParam(required = false) UUID classId,
            @RequestParam(required = false) UUID subjectId,
            @RequestParam(required = false) UUID termId) {
        return ResponseEntity.ok(assessmentService.getClassScores(classId, subjectId, termId));
    }

    @GetMapping("/report-card")
    public ResponseEntity<Map<String, Object>> getReportCard(
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String termId) {
        // If caller is a STUDENT and no studentId is supplied, resolve from JWT
        String resolvedStudentId = studentId;
        if (resolvedStudentId == null) {
            resolvedStudentId = SecurityUtils.getCurrentUser()
                    .filter(u -> "STUDENT".equals(u.personType()))
                    .map(u -> u.personId().toString())
                    .orElse(null);
        }
        return ResponseEntity.ok(assessmentService.getReportCard(resolvedStudentId, termId));
    }
}
