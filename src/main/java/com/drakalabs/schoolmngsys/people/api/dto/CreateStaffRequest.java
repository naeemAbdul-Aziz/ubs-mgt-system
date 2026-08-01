package com.drakalabs.schoolmngsys.people.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateStaffRequest {
    
    @NotBlank(message = "Staff number is required")
    private String staffNumber;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String otherNames;

    @NotBlank(message = "Staff type is required")
    private String staffType;

    private String gesRegistrationNo;

    @NotNull(message = "Employment start date is required")
    private LocalDate employmentStart;

    private String email;
    
    private String phone;
}
