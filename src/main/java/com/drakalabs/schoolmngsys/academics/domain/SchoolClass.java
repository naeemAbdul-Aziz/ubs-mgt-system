package com.drakalabs.schoolmngsys.academics.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A physical class instantiated for a specific academic year.
 * E.g., Primary 3A in 2026/2027.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "classes")
public class SchoolClass extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_level_id", nullable = false)
    private ClassLevel classLevel;

    /** Stream identifier, e.g., 'A', 'B', 'Gold'. */
    @Column(name = "stream", nullable = false, length = 50)
    private String stream;

    /** Maximum capacity of this class. */
    @Column(name = "capacity", nullable = false)
    private int capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_teacher_id")
    private com.drakalabs.schoolmngsys.people.domain.Staff classTeacher;

    public static SchoolClass create(AcademicYear academicYear, ClassLevel classLevel, String stream, int capacity, com.drakalabs.schoolmngsys.people.domain.Staff classTeacher) {
        SchoolClass schoolClass = new SchoolClass();
        schoolClass.academicYear = academicYear;
        schoolClass.classLevel = classLevel;
        schoolClass.stream = stream;
        schoolClass.capacity = capacity;
        schoolClass.classTeacher = classTeacher;
        return schoolClass;
    }
}
