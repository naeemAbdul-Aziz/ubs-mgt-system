package com.drakalabs.schoolmngsys.people.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LinkGuardianRequest {
    
    @NotBlank(message = "Relationship type is required")
    private String relationshipType;

    private boolean isPrimaryContact = false;
    private boolean hasCustody = false;
    private boolean receivesBilling = false;
    private boolean receivesAcademicReports = false;
}
