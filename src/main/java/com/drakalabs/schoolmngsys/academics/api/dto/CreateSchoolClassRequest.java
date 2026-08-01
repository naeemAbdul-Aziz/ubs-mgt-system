package com.drakalabs.schoolmngsys.academics.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateSchoolClassRequest(
        @NotNull UUID classLevelId,
        @NotBlank String stream,
        @Min(1) int capacity
) {}
