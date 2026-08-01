package com.drakalabs.schoolmngsys.communication.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "message_templates")
@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MessageTemplate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String body;

    public static MessageTemplate create(String name, String subject, String body) {
        MessageTemplate template = new MessageTemplate();
        template.setName(name);
        template.setSubject(subject);
        template.setBody(body);
        return template;
    }

    public void update(String subject, String body) {
        this.setSubject(subject);
        this.setBody(body);
    }
}
