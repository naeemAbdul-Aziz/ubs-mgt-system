package com.drakalabs.schoolmngsys.people.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateGuardianRequest {
    
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String otherNames;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String email;
    private String occupation;
    private String address;
}
