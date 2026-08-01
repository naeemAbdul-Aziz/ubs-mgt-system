package com.drakalabs.schoolmngsys.academics.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Calendar variant overrides for a specific term and class level.
 * Used for cases like JHS 3 ending early in Term 3 for BECE exams.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "term_calendar_variants")
public class TermCalendarVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_level_id", nullable = false)
    private ClassLevel classLevel;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    public static TermCalendarVariant create(Term term, ClassLevel classLevel, LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        TermCalendarVariant variant = new TermCalendarVariant();
        variant.term = term;
        variant.classLevel = classLevel;
        variant.startDate = startDate;
        variant.endDate = endDate;
        return variant;
    }
}
