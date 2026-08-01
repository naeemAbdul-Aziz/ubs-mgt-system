package com.drakalabs.schoolmngsys.people.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "guardians")
public class Guardian extends BaseEntity {

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "other_names", length = 100)
    private String otherNames;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "address", length = 255)
    private String address;

    public static Guardian create(String firstName, String lastName, String otherNames, String phone, String email, String occupation, String address) {
        Guardian guardian = new Guardian();
        guardian.firstName = firstName;
        guardian.lastName = lastName;
        guardian.otherNames = otherNames;
        guardian.phone = phone;
        guardian.email = email;
        guardian.occupation = occupation;
        guardian.address = address;
        return guardian;
    }
}
