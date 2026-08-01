package com.drakalabs.schoolmngsys.people.api.dto;

import com.drakalabs.schoolmngsys.people.domain.Staff;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StaffDto {
    private UUID id;
    private String staffNumber;
    private String firstName;
    private String lastName;
    private String otherNames;
    private String staffType;
    private String gesRegistrationNo;
    private LocalDate employmentStart;
    private LocalDate employmentEnd;
    private String status;
    private String email;
    private String phone;

    public static StaffDto from(Staff staff) {
        StaffDto dto = new StaffDto();
        dto.setId(staff.getId());
        dto.setStaffNumber(staff.getStaffNumber());
        dto.setFirstName(staff.getFirstName());
        dto.setLastName(staff.getLastName());
        dto.setOtherNames(staff.getOtherNames());
        dto.setStaffType(staff.getStaffType());
        dto.setGesRegistrationNo(staff.getGesRegistrationNo());
        dto.setEmploymentStart(staff.getEmploymentStart());
        dto.setEmploymentEnd(staff.getEmploymentEnd());
        dto.setStatus(staff.getStatus());
        dto.setEmail(staff.getEmail());
        dto.setPhone(staff.getPhone());
        return dto;
    }
}
