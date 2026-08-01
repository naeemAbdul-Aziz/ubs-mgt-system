
package com.drakalabs.schoolmngsys.assessment.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record BulkScoreEntryRequest(
        @NotNull UUID assessmentComponentId,
        @NotEmpty @Valid List<ScoreEntryDto> scores
) {}
