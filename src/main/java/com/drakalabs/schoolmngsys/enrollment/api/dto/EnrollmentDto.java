package com.drakalabs.schoolmngsys.enrollment.api.dto;

import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.enrollment.domain.EnrollmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class EnrollmentDto {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private String studentNumber;
    private UUID classId;
    private String classStream;
    private UUID academicYearId;
    private String academicYearName;
    private EnrollmentStatus status;
    private Integer rollNumber;
    private String exitReason;
    private LocalDate exitDate;

    public static EnrollmentDto from(Enrollment enrollment) {
        return EnrollmentDto.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getFirstName() + " " + enrollment.getStudent().getLastName())
                .studentNumber(enrollment.getStudent().getStudentNumber())
                .classId(enrollment.getSchoolClass().getId())
                .classStream(enrollment.getSchoolClass().getStream())
                .academicYearId(enrollment.getAcademicYear().getId())
                .academicYearName(enrollment.getAcademicYear().getName())
                .status(enrollment.getStatus())
                .rollNumber(enrollment.getRollNumber())
                .exitReason(enrollment.getExitReason())
                .exitDate(enrollment.getExitDate())
                .build();
    }
}
