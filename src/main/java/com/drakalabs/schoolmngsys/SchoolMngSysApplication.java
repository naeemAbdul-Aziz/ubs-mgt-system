package com.drakalabs.schoolmngsys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * UBS-LMIS — University Basic School Learning Management & Information System.
 *
 * <p>Architecture: Modular Monolith on Spring Boot 3.3 + PostgreSQL 16.
 *
 * <p>Module map:
 * <pre>
 *   shared       → Cross-cutting: base types, errors, events, audit
 *   auth         → Identity & Access Management (WP-1)
 *   academics    → Academic structure: years, terms, classes, subjects (WP-2)
 *   people       → Student, Guardian, Staff registries (WP-3)
 *   enrollment   → Enrollment lifecycle (WP-4)
 *   attendance   → Daily attendance registers (WP-5)
 *   assessment   → Scores, results, report cards (WP-6)
 *   finance      → Fee schedules, invoicing, payments (WP-7)
 *   communication→ Outbox, SMS/email, announcements (WP-8)
 *   progression  → Year-end promotion & graduation (WP-9)
 *   analytics    → Read-only dashboard projections (WP-10)
 *   audit        → Append-only audit log (built in shared, WP-0)
 * </pre>
 *
 * @see <a href="docs/08-module-architecture.md">Module Architecture</a>
 */
@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
@EnableAsync
@EnableScheduling
@ConfigurationPropertiesScan("com.drakalabs.schoolmngsys")
public class SchoolMngSysApplication {

    public static void main(String[] args) {
        SpringApplication.run(SchoolMngSysApplication.class, args);
    }
}
