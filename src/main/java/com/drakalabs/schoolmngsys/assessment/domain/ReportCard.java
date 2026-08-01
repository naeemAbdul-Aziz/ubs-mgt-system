package com.drakalabs.schoolmngsys.assessment.domain;

import com.drakalabs.schoolmngsys.academics.domain.Term;
import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "report_cards")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReportCard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @Column
    private String remarks;

    @Column(name = "published_at")
    private OffsetDateTime publishedAt;

    public static ReportCard create(Enrollment enrollment, Term term, String remarks) {
        ReportCard card = new ReportCard();
        card.setEnrollment(enrollment);
        card.setTerm(term);
        card.setRemarks(remarks);
        return card;
    }

    public void publish() {
        this.publishedAt = OffsetDateTime.now();
    }
}
