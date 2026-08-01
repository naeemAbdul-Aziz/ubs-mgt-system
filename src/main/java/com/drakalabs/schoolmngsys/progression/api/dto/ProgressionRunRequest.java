package com.drakalabs.schoolmngsys.progression.api.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ProgressionRunRequest(
    @NotNull UUID sourceAcademicYearId,
    @NotNull UUID targetAcademicYearId
) {}
