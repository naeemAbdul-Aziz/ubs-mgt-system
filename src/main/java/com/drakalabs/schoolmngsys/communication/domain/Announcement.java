package com.drakalabs.schoolmngsys.communication.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "announcements")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Announcement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String body;

    @Column(name = "target_audience", nullable = false)
    private String targetAudience;

    @Column(name = "target_id")
    private UUID targetId;

    @Column(nullable = false)
    private String status;

    @Column(name = "published_at")
    private ZonedDateTime publishedAt;

    public static Announcement draft(String title, String body, String targetAudience, UUID targetId) {
        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setBody(body);
        announcement.setTargetAudience(targetAudience);
        announcement.setTargetId(targetId);
        announcement.setStatus("DRAFT");
        return announcement;
    }

    public void publish() {
        this.setStatus("PUBLISHED");
        this.setPublishedAt(ZonedDateTime.now());
    }
    
    public void archive() {
        this.setStatus("ARCHIVED");
    }
}
