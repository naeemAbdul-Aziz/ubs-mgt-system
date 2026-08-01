package com.drakalabs.schoolmngsys.shared.error;

/**
 * Canonical error codes for the RFC 7807 problem catalog.
 *
 * <p>Each entry maps to a stable {@code type} URI slug. The slug must never change
 * once a client has integrated against it. Add new codes freely; never rename existing ones.
 *
 * @see <a href="docs/10-api-standards.md#2-error-format-rfc-7807">API Standards §2</a>
 */
public enum ErrorCode {

    /** Bean Validation / request shape failure */
    VALIDATION("validation", "Validation failed"),

    /** Resource not found */
    NOT_FOUND("not-found", "Resource not found"),

    /** State conflict or optimistic-lock version mismatch */
    CONFLICT("conflict", "Conflict"),

    /** Business rule violation — response includes {@code ruleId} */
    RULE_VIOLATION("rule-violation", "Business rule violation"),

    /** Authentication required */
    AUTH_REQUIRED("auth-required", "Authentication required"),

    /** Caller lacks the required permission */
    FORBIDDEN("forbidden", "Forbidden"),

    /** Too many requests */
    RATE_LIMITED("rate-limited", "Too many requests"),

    /** Unexpected server error */
    INTERNAL("internal", "Internal server error");

    private final String slug;
    private final String title;

    ErrorCode(String slug, String title) {
        this.slug = slug;
        this.title = title;
    }

    public String slug() {
        return slug;
    }

    public String title() {
        return title;
    }
}
