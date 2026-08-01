package com.drakalabs.schoolmngsys.finance.domain;

import com.drakalabs.schoolmngsys.academics.domain.AcademicYear;
import com.drakalabs.schoolmngsys.academics.domain.ClassLevel;
import com.drakalabs.schoolmngsys.academics.domain.Term;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "fee_schedules")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FeeSchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_level_id", nullable = false)
    private ClassLevel classLevel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "feeSchedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeeItem> items = new ArrayList<>();

    public static FeeSchedule create(ClassLevel classLevel, Term term, AcademicYear academicYear) {
        FeeSchedule schedule = new FeeSchedule();
        schedule.setClassLevel(classLevel);
        schedule.setTerm(term);
        schedule.setAcademicYear(academicYear);
        schedule.setStatus("DRAFT");
        return schedule;
    }

    public void addItem(FeeItem item) {
        items.add(item);
        item.setFeeSchedule(this);
    }
    
    public void publish() {
        this.status = "PUBLISHED";
    }
}
