package com.drakalabs.schoolmngsys.shared.error;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * RFC 7807 Problem Details response.
 *
 * <p>All API errors use this shape:
 * <pre>
 * {
 *   "type":     "https://ubs-lmis.example/problems/validation",
 *   "title":    "Validation failed",
 *   "status":   400,
 *   "detail":   "2 fields are invalid",
 *   "instance": "/api/v1/students",
 *   "traceId":  "…",
 *   "errors":   [ {"field": "dateOfBirth", "message": "must be in the past"} ]
 * }
 * </pre>
 *
 * @see <a href="https://www.rfc-editor.org/rfc/rfc7807">RFC 7807</a>
 * @see <a href="docs/10-api-standards.md#2-error-format-rfc-7807">API Standards §2</a>
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProblemDetailResponse(
        String type,
        String title,
        int status,
        String detail,
        String instance,
        String traceId,
        String ruleId,
        List<FieldError> errors
) {

    private static final String BASE_TYPE = "https://ubs-lmis.example/problems/";

    public static ProblemDetailResponse of(ErrorCode code, int status, String detail, String instance, String traceId) {
        return new ProblemDetailResponse(
                BASE_TYPE + code.slug(),
                code.title(),
                status,
                detail,
                instance,
                traceId,
                null,
                null
        );
    }

    public static ProblemDetailResponse validationError(String detail, String instance, String traceId, List<FieldError> errors) {
        return new ProblemDetailResponse(
                BASE_TYPE + ErrorCode.VALIDATION.slug(),
                ErrorCode.VALIDATION.title(),
                400,
                detail,
                instance,
                traceId,
                null,
                errors
        );
    }

    public static ProblemDetailResponse ruleViolation(String ruleId, String detail, String instance, String traceId) {
        return new ProblemDetailResponse(
                BASE_TYPE + ErrorCode.RULE_VIOLATION.slug(),
                ErrorCode.RULE_VIOLATION.title(),
                422,
                detail,
                instance,
                traceId,
                ruleId,
                null
        );
    }

    /**
     * Individual field validation error, embedded in the {@code errors} array.
     */
    public record FieldError(String field, String message) {}
}
