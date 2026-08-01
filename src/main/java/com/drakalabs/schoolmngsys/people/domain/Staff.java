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
@Table(name = "staff")
public class Staff extends BaseEntity {

    @Column(name = "staff_number", nullable = false, unique = true, length = 50)
    private String staffNumber;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "other_names", length = 100)
    private String otherNames;

    /** TEACHING, NON_TEACHING */
    @Column(name = "staff_type", nullable = false, length = 50)
    private String staffType;

    @Column(name = "ges_registration_no", length = 50)
    private String gesRegistrationNo;

    @Column(name = "employment_start", nullable = false)
    private LocalDate employmentStart;

    @Column(name = "employment_end")
    private LocalDate employmentEnd;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    /** ACTIVE, ON_LEAVE, SUSPENDED, TERMINATED, RESIGNED */
    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";

    public static Staff create(String staffNumber, String firstName, String lastName, String otherNames, String staffType, String gesRegistrationNo, LocalDate employmentStart, String email, String phone) {
        Staff staff = new Staff();
        staff.staffNumber = staffNumber;
        staff.firstName = firstName;
        staff.lastName = lastName;
        staff.otherNames = otherNames;
        staff.staffType = staffType;
        staff.gesRegistrationNo = gesRegistrationNo;
        staff.employmentStart = employmentStart;
        staff.email = email;
        staff.phone = phone;
        return staff;
    }
}
