package com.drakalabs.schoolmngsys.academics.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * A term within an {@link AcademicYear}.
 *
 * <p>Invariant: Exactly 3 terms per year (BR-AS-003).
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "terms")
public class Term extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(name = "term_number", nullable = false)
    private int termNumber;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    public static Term create(AcademicYear academicYear, int termNumber, LocalDate startDate, LocalDate endDate) {
        if (termNumber < 1 || termNumber > 3) {
            throw new IllegalArgumentException("Term number must be between 1 and 3");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        Term term = new Term();
        term.academicYear = academicYear;
        term.termNumber = termNumber;
        term.startDate = startDate;
        term.endDate = endDate;
        return term;
    }
}
