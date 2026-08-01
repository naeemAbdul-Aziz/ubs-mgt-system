package com.drakalabs.schoolmngsys.people.api.dto;

import com.drakalabs.schoolmngsys.people.domain.StudentGuardian;
import lombok.Data;

@Data
public class StudentGuardianDto {
    private GuardianDto guardian;
    private String relationshipType;
    private boolean isPrimaryContact;
    private boolean hasCustody;
    private boolean receivesBilling;
    private boolean receivesAcademicReports;

    public static StudentGuardianDto from(StudentGuardian sg) {
        StudentGuardianDto dto = new StudentGuardianDto();
        dto.setGuardian(GuardianDto.from(sg.getGuardian()));
        dto.setRelationshipType(sg.getRelationshipType());
        dto.setPrimaryContact(sg.isPrimaryContact());
        dto.setHasCustody(sg.isHasCustody());
        dto.setReceivesBilling(sg.isReceivesBilling());
        dto.setReceivesAcademicReports(sg.isReceivesAcademicReports());
        return dto;
    }
}
