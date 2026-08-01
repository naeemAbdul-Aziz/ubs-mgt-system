package com.drakalabs.schoolmngsys.finance.api.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record BillingRunRequest(
    @NotNull UUID classLevelId,
    @NotNull UUID termId,
    @NotNull UUID academicYearId,
    @NotNull LocalDate issueDate,
    @NotNull LocalDate dueDate
) {}
