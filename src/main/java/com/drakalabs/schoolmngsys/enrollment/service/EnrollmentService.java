package com.drakalabs.schoolmngsys.enrollment.service;

import com.drakalabs.schoolmngsys.academics.domain.AcademicYear;
import com.drakalabs.schoolmngsys.academics.domain.SchoolClass;
import com.drakalabs.schoolmngsys.academics.service.AcademicStructureService;
import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.enrollment.domain.EnrollmentStatus;
import com.drakalabs.schoolmngsys.enrollment.repository.EnrollmentRepository;
import com.drakalabs.schoolmngsys.people.domain.Student;
import com.drakalabs.schoolmngsys.people.service.StudentService;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentService studentService;
    private final AcademicStructureService academicStructureService;

    @Transactional
    public Enrollment enrollStudent(UUID studentId, UUID classId, UUID academicYearId, boolean force) {
        Student student = studentService.getStudent(studentId);

        SchoolClass schoolClass = academicStructureService.getSchoolClassEntity(classId);

        AcademicYear academicYear = academicStructureService.getAcademicYearEntity(academicYearId);

        // BR-EN-001: At most one ACTIVE enrollment per academic year
        enrollmentRepository.findByStudentIdAndAcademicYearIdAndStatus(studentId, academicYearId, EnrollmentStatus.ACTIVE)
                .ifPresent(e -> {
                    throw new BusinessRuleException("BR-EN-001", "Student already has an ACTIVE enrollment for this academic year.");
                });

        // BR-AD-004: Enrollment must not exceed class capacity unless overridden by Head
        if (!force) {
            long currentActiveCount = enrollmentRepository.countBySchoolClassIdAndStatus(classId, EnrollmentStatus.ACTIVE);
            if (currentActiveCount >= schoolClass.getCapacity()) {
                throw new BusinessRuleException("BR-AD-004", "Class capacity exceeded. Use force override if approved by Head.");
            }
        }

        Enrollment enrollment = Enrollment.create(student, schoolClass, academicYear);
        
        // Also ensure Student is ACTIVE
            // Wait, we can't save using studentRepository here.
            // But we need to update student status.
            // Let's call a method on studentService.
            studentService.updateStudentStatus(studentId, "ACTIVE");

        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment recordExit(UUID enrollmentId, String exitReason, LocalDate exitDate, EnrollmentStatus exitStatus) {
        if (exitStatus != EnrollmentStatus.TRANSFERRED && exitStatus != EnrollmentStatus.WITHDRAWN) {
            throw new BusinessRuleException("BR-EN-005", "Exit status must be TRANSFERRED or WITHDRAWN.");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", enrollmentId.toString()));

        enrollment.exit(exitReason, exitDate, exitStatus);

        // Update root student status as per BR-EN-005
        Student student = enrollment.getStudent();
        if (exitStatus == EnrollmentStatus.TRANSFERRED) {
            studentService.updateStudentStatus(student.getId(), "TRANSFERRED_OUT");
        } else if (exitStatus == EnrollmentStatus.WITHDRAWN) {
            studentService.updateStudentStatus(student.getId(), "WITHDRAWN");
        }

        return enrollmentRepository.save(enrollment);
    }
    
    @Transactional(readOnly = true)
    public List<Enrollment> getStudentEnrollmentHistory(UUID studentId) {
        return enrollmentRepository.findAllByStudentId(studentId);
    }
}
