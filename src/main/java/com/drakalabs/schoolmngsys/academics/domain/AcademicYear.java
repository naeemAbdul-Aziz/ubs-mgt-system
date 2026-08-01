package com.drakalabs.schoolmngsys.academics.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * An Academic Year (e.g., 2026/2027).
 *
 * <p>Only one AcademicYear can be ACTIVE at a time. The active year determines
 * current enrollments, attendance, and billing.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "academic_years")
public class AcademicYear extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AcademicYearStatus status = AcademicYearStatus.PLANNED;

    public enum AcademicYearStatus {
        PLANNED,
        ACTIVE,
        CLOSED
    }

    public static AcademicYear create(String name, LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        AcademicYear year = new AcademicYear();
        year.name = name;
        year.startDate = startDate;
        year.endDate = endDate;
        year.status = AcademicYearStatus.PLANNED;
        return year;
    }

    public void activate() {
        this.status = AcademicYearStatus.ACTIVE;
    }

    public void close() {
        this.status = AcademicYearStatus.CLOSED;
    }
}
