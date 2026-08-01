package com.drakalabs.schoolmngsys.people.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Join table linking a Student and a Guardian, carrying relationship context and flags.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "student_guardians")
public class StudentGuardian extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guardian_id", nullable = false)
    private Guardian guardian;

    /** e.g. MOTHER, FATHER, GRANDPARENT, AUNT_UNCLE, SIBLING, OTHER */
    @Column(name = "relationship_type", nullable = false, length = 50)
    private String relationshipType;

    @Column(name = "is_primary_contact", nullable = false)
    private boolean isPrimaryContact = false;

    @Column(name = "has_custody", nullable = false)
    private boolean hasCustody = false;

    @Column(name = "receives_billing", nullable = false)
    private boolean receivesBilling = false;

    @Column(name = "receives_academic_reports", nullable = false)
    private boolean receivesAcademicReports = false;

    public static StudentGuardian create(Student student, Guardian guardian, String relationshipType, boolean isPrimaryContact, boolean hasCustody, boolean receivesBilling, boolean receivesAcademicReports) {
        StudentGuardian sg = new StudentGuardian();
        sg.student = student;
        sg.guardian = guardian;
        sg.relationshipType = relationshipType;
        sg.isPrimaryContact = isPrimaryContact;
        sg.hasCustody = hasCustody;
        sg.receivesBilling = receivesBilling;
        sg.receivesAcademicReports = receivesAcademicReports;
        return sg;
    }
}
