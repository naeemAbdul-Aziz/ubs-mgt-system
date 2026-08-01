package com.drakalabs.schoolmngsys.shared.error;

/**
 * Thrown when a domain service detects a business rule violation.
 *
 * <p>Maps to HTTP 422 Unprocessable Entity with RFC 7807 {@code rule-violation} type.
 * The {@code ruleId} field is included in the response body to enable clients and
 * operators to trace the error back to the documented rule in
 * <a href="docs/04-business-rules.md">04 — Business Rules</a>.
 *
 * <p>Usage:
 * <pre>
 * throw new BusinessRuleException("BR-EN-001",
 *     "Student already has an active enrollment for this academic year");
 * </pre>
 */
public class BusinessRuleException extends RuntimeException {

    private final String ruleId;

    public BusinessRuleException(String ruleId, String message) {
        super(message);
        this.ruleId = ruleId;
    }

    public String getRuleId() {
        return ruleId;
    }
}
