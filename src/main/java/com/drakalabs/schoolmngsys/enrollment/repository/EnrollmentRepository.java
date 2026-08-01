package com.drakalabs.schoolmngsys.enrollment.repository;

import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.enrollment.domain.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    Optional<Enrollment> findByStudentIdAndAcademicYearIdAndStatus(UUID studentId, UUID academicYearId, EnrollmentStatus status);

    List<Enrollment> findAllBySchoolClassIdAndStatus(UUID classId, EnrollmentStatus status);

    List<Enrollment> findAllByStudentId(UUID studentId);
    
    List<Enrollment> findAllBySchoolClassClassLevelIdAndAcademicYearIdAndStatus(UUID classLevelId, UUID academicYearId, EnrollmentStatus status);
    
    List<Enrollment> findAllByAcademicYearIdAndStatus(UUID academicYearId, EnrollmentStatus status);
    
    long countBySchoolClassIdAndStatus(UUID classId, EnrollmentStatus status);
}
