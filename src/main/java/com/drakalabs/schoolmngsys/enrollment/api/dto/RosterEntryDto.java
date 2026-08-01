package com.drakalabs.schoolmngsys.enrollment.api.dto;

import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RosterEntryDto {
    private UUID enrollmentId;
    private UUID studentId;
    private String studentNumber;
    private String firstName;
    private String lastName;
    private String gender;
    private Integer rollNumber;

    public static RosterEntryDto from(Enrollment enrollment) {
        return RosterEntryDto.builder()
                .enrollmentId(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentNumber(enrollment.getStudent().getStudentNumber())
                .firstName(enrollment.getStudent().getFirstName())
                .lastName(enrollment.getStudent().getLastName())
                .gender(enrollment.getStudent().getGender())
                .rollNumber(enrollment.getRollNumber())
                .build();
    }
}
