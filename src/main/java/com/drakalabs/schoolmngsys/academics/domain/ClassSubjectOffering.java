package com.drakalabs.schoolmngsys.academics.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Associates a {@link Subject} that is taught in a specific {@link SchoolClass}.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "class_subject_offerings")
public class ClassSubjectOffering extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_teacher_id")
    private com.drakalabs.schoolmngsys.people.domain.Staff subjectTeacher;

    public static ClassSubjectOffering create(SchoolClass schoolClass, Subject subject, com.drakalabs.schoolmngsys.people.domain.Staff subjectTeacher) {
        ClassSubjectOffering offering = new ClassSubjectOffering();
        offering.schoolClass = schoolClass;
        offering.subject = subject;
        offering.subjectTeacher = subjectTeacher;
        return offering;
    }
}
