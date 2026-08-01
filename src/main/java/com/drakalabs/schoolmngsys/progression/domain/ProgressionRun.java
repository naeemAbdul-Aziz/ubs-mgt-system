package com.drakalabs.schoolmngsys.progression.domain;

import com.drakalabs.schoolmngsys.academics.domain.AcademicYear;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "progression_runs")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProgressionRun extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_academic_year_id", nullable = false)
    private AcademicYear sourceAcademicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_academic_year_id")
    private AcademicYear targetAcademicYear;

    @Column(nullable = false)
    private String status;

    @Column(name = "executed_at", nullable = false)
    private ZonedDateTime executedAt;

    @OneToMany(mappedBy = "run", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProgressionResult> results = new ArrayList<>();

    public static ProgressionRun start(AcademicYear sourceYear, AcademicYear targetYear) {
        ProgressionRun run = new ProgressionRun();
        run.setSourceAcademicYear(sourceYear);
        run.setTargetAcademicYear(targetYear);
        run.setStatus("IN_PROGRESS");
        run.setExecutedAt(ZonedDateTime.now());
        return run;
    }

    public void complete() {
        this.setStatus("COMPLETED");
    }

    public void fail() {
        this.setStatus("FAILED");
    }
    
    public void addResult(ProgressionResult result) {
        results.add(result);
        result.setRun(this);
    }
}
