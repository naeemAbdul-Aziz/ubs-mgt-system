package com.drakalabs.schoolmngsys.enrollment.api.dto;

import com.drakalabs.schoolmngsys.enrollment.domain.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExitEnrollmentRequest {
    @NotNull
    private String exitReason;

    @NotNull
    private LocalDate exitDate;

    @NotNull
    private EnrollmentStatus status; // TRANSFERRED or WITHDRAWN
}
