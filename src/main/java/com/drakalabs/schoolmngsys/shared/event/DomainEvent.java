package com.drakalabs.schoolmngsys.shared.event;

import java.time.Instant;
import java.util.UUID;

/**
 * Marker interface for all domain events in UBS-LMIS.
 *
 * <p>Domain events are the seam between modules. The owning module publishes an event via
 * {@link org.springframework.context.ApplicationEventPublisher}; downstream modules
 * (communication, analytics, audit) subscribe via {@link org.springframework.context.event.EventListener}
 * or {@link org.springframework.transaction.event.TransactionalEventListener}.
 *
 * <p>Naming convention: past tense, {@code <Entity><Happened>}, e.g. {@code StudentAdmitted},
 * {@code PaymentReceived}, {@code TermResultsPublished}.
 *
 * <p>Every event is also implicitly consumed by the audit interceptor per BR-SE-002.
 *
 * @see <a href="docs/02-domain-model.md#4-domain-events">Domain Events</a>
 */
public interface DomainEvent {

    /**
     * The unique ID of this event occurrence (for idempotent consumers).
     */
    UUID eventId();

    /**
     * When this event occurred (UTC).
     */
    Instant occurredAt();

    /**
     * The account ID of the actor who caused this event. May be null for system-initiated events.
     */
    UUID actorAccountId();
}
