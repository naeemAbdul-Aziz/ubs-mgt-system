package com.drakalabs.schoolmngsys.people.api.dto;

import com.drakalabs.schoolmngsys.people.domain.Student;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentDto {
    private UUID id;
    private String studentNumber;
    private String firstName;
    private String lastName;
    private String otherNames;
    private LocalDate dateOfBirth;
    private String gender;
    private LocalDate admissionDate;
    private String status;
    private String currentClassName;

    public static StudentDto from(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setStudentNumber(student.getStudentNumber());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setOtherNames(student.getOtherNames());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setAdmissionDate(student.getAdmissionDate());
        dto.setStatus(student.getStatus());
        dto.setCurrentClassName(student.getCurrentClassName());
        return dto;
    }
}
