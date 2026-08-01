package com.drakalabs.schoolmngsys.enrollment.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class EnrollStudentRequest {
    @NotNull
    private UUID studentId;

    @NotNull
    private UUID classId;

    @NotNull
    private UUID academicYearId;
    
    private boolean force;
}
