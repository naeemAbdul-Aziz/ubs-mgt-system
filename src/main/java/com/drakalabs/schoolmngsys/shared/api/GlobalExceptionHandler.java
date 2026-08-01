package com.drakalabs.schoolmngsys.shared.api;

import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import com.drakalabs.schoolmngsys.shared.error.ErrorCode;
import com.drakalabs.schoolmngsys.shared.error.ProblemDetailResponse;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Centralised exception → RFC 7807 problem mapping.
 *
 * <p>All exceptions that escape a service layer land here. The handler:
 * <ol>
 *   <li>Logs the error (without PII in the log line)</li>
 *   <li>Derives a deterministic {@code traceId} (uses MDC if set by a request filter, else generates one)</li>
 *   <li>Returns {@code application/problem+json} per the API contract</li>
 * </ol>
 *
 * @see <a href="docs/10-api-standards.md#2-error-format-rfc-7807">API Standards §2</a>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final MediaType PROBLEM_JSON = MediaType.valueOf("application/problem+json");

    // ─── Bean Validation failures ──────────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetailResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        List<ProblemDetailResponse.FieldError> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> new ProblemDetailResponse.FieldError(fe.getField(), fe.getDefaultMessage()))
                .collect(Collectors.toList());

        String detail = errors.size() + " field(s) failed validation";
        log.warn("Validation failed on {}: {}", request.getRequestURI(), detail);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(PROBLEM_JSON)
                .body(ProblemDetailResponse.validationError(detail, request.getRequestURI(), traceId(), errors));
    }

    // ─── Business rule violations ──────────────────────────────────────────

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ProblemDetailResponse> handleBusinessRule(
            BusinessRuleException ex,
            HttpServletRequest request) {

        log.warn("Business rule violation [{}] on {}: {}", ex.getRuleId(), request.getRequestURI(), ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .contentType(PROBLEM_JSON)
                .body(ProblemDetailResponse.ruleViolation(ex.getRuleId(), ex.getMessage(), request.getRequestURI(), traceId()));
    }

    // ─── Not found ────────────────────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetailResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        log.debug("Resource not found on {}: {}", request.getRequestURI(), ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .contentType(PROBLEM_JSON)
                .body(ProblemDetailResponse.of(ErrorCode.NOT_FOUND, 404, ex.getMessage(), request.getRequestURI(), traceId()));
    }

    // ─── Authentication failures ───────────────────────────────────────────

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetailResponse> handleAuthentication(
            AuthenticationException ex,
            HttpServletRequest request) {

        log.warn("Authentication failure on {}: {}", request.getRequestURI(), ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .contentType(PROBLEM_JSON)
                .body(ProblemDetailResponse.of(ErrorCode.AUTH_REQUIRED, 401, "Invalid username or password", request.getRequestURI(), traceId()));
    }

    // ─── Authorization failures ────────────────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetailResponse> handleForbidden(
            AccessDeniedException ex,
            HttpServletRequest request) {

        log.warn("Access denied on {}: {}", request.getRequestURI(), ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .contentType(PROBLEM_JSON)
                .body(ProblemDetailResponse.of(ErrorCode.FORBIDDEN, 403, "Insufficient permissions", request.getRequestURI(), traceId()));
    }

    // ─── Type mismatch (bad UUID in path, bad enum, etc.) ─────────────────

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ProblemDetailResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {

        String detail = "Invalid value for parameter '" + ex.getName() + "'";
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(PROBLEM_JSON)
                .body(ProblemDetailResponse.of(ErrorCode.VALIDATION, 400, detail, request.getRequestURI(), traceId()));
    }

    // ─── Catch-all ────────────────────────────────────────────────────────

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ProblemDetailResponse> handleUnexpected(
            Throwable ex,
            HttpServletRequest request) {

        String id = traceId();
        // Log with traceId so operations can correlate the error
        log.error("Unexpected error [traceId={}] on {}", id, request.getRequestURI(), ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(PROBLEM_JSON)
                .body(ProblemDetailResponse.of(ErrorCode.INTERNAL, 500, "An unexpected error occurred", request.getRequestURI(), id));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    private String traceId() {
        String mdc = MDC.get("traceId");
        return (mdc != null && !mdc.isBlank()) ? mdc : UUID.randomUUID().toString();
    }
}
