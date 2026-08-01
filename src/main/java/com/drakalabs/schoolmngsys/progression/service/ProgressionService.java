package com.drakalabs.schoolmngsys.progression.service;

import com.drakalabs.schoolmngsys.academics.domain.AcademicYear;
import com.drakalabs.schoolmngsys.academics.repository.AcademicYearRepository;
import com.drakalabs.schoolmngsys.assessment.domain.TermResult;
import com.drakalabs.schoolmngsys.assessment.repository.TermResultRepository;
import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.enrollment.domain.EnrollmentStatus;
import com.drakalabs.schoolmngsys.enrollment.repository.EnrollmentRepository;
import com.drakalabs.schoolmngsys.progression.domain.ProgressionResult;
import com.drakalabs.schoolmngsys.progression.domain.ProgressionRun;
import com.drakalabs.schoolmngsys.progression.repository.ProgressionRunRepository;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgressionService {

    private final ProgressionRunRepository runRepository;
    private final AcademicYearRepository academicYearRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TermResultRepository termResultRepository;

    private static final BigDecimal PASSING_AVERAGE = new BigDecimal("50.00"); // E.g., 50% passing mark

    @Transactional
    public ProgressionRun executeProgressionRun(UUID sourceYearId, UUID targetYearId) {
        AcademicYear sourceYear = academicYearRepository.findById(sourceYearId)
            .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", sourceYearId.toString()));
            
        AcademicYear targetYear = null;
        if (targetYearId != null) {
            targetYear = academicYearRepository.findById(targetYearId)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", targetYearId.toString()));
        }

        ProgressionRun run = ProgressionRun.start(sourceYear, targetYear);
        run = runRepository.save(run);

        List<Enrollment> activeEnrollments = enrollmentRepository.findAllByAcademicYearIdAndStatus(sourceYearId, EnrollmentStatus.ACTIVE);

        for (Enrollment enrollment : activeEnrollments) {
            List<TermResult> termResults = termResultRepository.findAllByEnrollmentId(enrollment.getId());
            
            BigDecimal sum = BigDecimal.ZERO;
            int count = 0;
            for (TermResult tr : termResults) {
                if (tr.getOverallTotal() != null) {
                    sum = sum.add(tr.getOverallTotal());
                    count++;
                }
            }
            
            BigDecimal finalAverage = count > 0 ? sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            
            String outcome;
            if (finalAverage.compareTo(PASSING_AVERAGE) >= 0) {
                // Determine if terminal
                String levelName = enrollment.getSchoolClass().getClassLevel().getName();
                if (levelName.contains("JHS 3")) {
                    outcome = "GRADUATED";
                } else {
                    outcome = "PROMOTED";
                }
            } else {
                outcome = "REPEATED";
            }

            ProgressionResult result = ProgressionResult.create(
                enrollment.getStudent(),
                enrollment.getSchoolClass(),
                finalAverage,
                outcome
            );

            if (targetYear != null && ("PROMOTED".equals(outcome) || "REPEATED".equals(outcome))) {
                // In a real scenario, map to the next class level. 
                // For MVP, we create an enrollment pending class assignment (if schema allows, but schema requires class).
                // So we just assign to the same class as a fallback, or we assume manual mapping.
                // Since class_id is NOT NULL in enrollments, we assign to the same class and let admin fix it.
                Enrollment newEnrollment = Enrollment.create(
                    enrollment.getStudent(),
                    enrollment.getSchoolClass(),
                    targetYear
                );
                newEnrollment = enrollmentRepository.save(newEnrollment);
                result.setNewEnrollment(newEnrollment);
            }

            run.addResult(result);
            // Mark old enrollment as COMPLETED
            enrollment.exit(outcome, java.time.LocalDate.now(), EnrollmentStatus.COMPLETED);
            enrollmentRepository.save(enrollment);
        }

        run.complete();
        return runRepository.save(run);
    }
}
