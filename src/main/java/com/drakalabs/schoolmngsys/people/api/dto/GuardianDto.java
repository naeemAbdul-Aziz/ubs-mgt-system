package com.drakalabs.schoolmngsys.people.api.dto;

import com.drakalabs.schoolmngsys.people.domain.Guardian;
import lombok.Data;

import java.util.UUID;

@Data
public class GuardianDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String otherNames;
    private String phone;
    private String email;
    private String occupation;
    private String address;

    public static GuardianDto from(Guardian guardian) {
        GuardianDto dto = new GuardianDto();
        dto.setId(guardian.getId());
        dto.setFirstName(guardian.getFirstName());
        dto.setLastName(guardian.getLastName());
        dto.setOtherNames(guardian.getOtherNames());
        dto.setPhone(guardian.getPhone());
        dto.setEmail(guardian.getEmail());
        dto.setOccupation(guardian.getOccupation());
        dto.setAddress(guardian.getAddress());
        return dto;
    }
}
