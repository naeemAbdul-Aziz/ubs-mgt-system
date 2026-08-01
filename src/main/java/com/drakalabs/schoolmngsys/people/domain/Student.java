package com.drakalabs.schoolmngsys.people.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "students")
public class Student extends BaseEntity {

    @Column(name = "student_number", nullable = false, unique = true, length = 50)
    private String studentNumber;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "other_names", length = 100)
    private String otherNames;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "gender", nullable = false, length = 20)
    private String gender;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    /** E.g. APPLICANT, ACTIVE, TRANSFERRED_OUT, WITHDRAWN, GRADUATED, DECEASED */
    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";

    @org.hibernate.annotations.Formula("(SELECT cl.name || ' ' || c.stream FROM enrollments e JOIN classes c ON e.class_id = c.id JOIN class_levels cl ON c.class_level_id = cl.id WHERE e.student_id = id AND e.status = 'ACTIVE' LIMIT 1)")
    private String currentClassName;

    @Column(name = "photo")
    private byte[] photo;

    public static Student create(String studentNumber, String firstName, String lastName, String otherNames, LocalDate dateOfBirth, String gender, LocalDate admissionDate) {
        Student student = new Student();
        student.studentNumber = studentNumber;
        student.firstName = firstName;
        student.lastName = lastName;
        student.otherNames = otherNames;
        student.dateOfBirth = dateOfBirth;
        student.gender = gender;
        student.admissionDate = admissionDate;
        return student;
    }
}
