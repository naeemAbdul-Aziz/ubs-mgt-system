package com.drakalabs.schoolmngsys.shared.api;

import com.drakalabs.schoolmngsys.shared.security.CurrentUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Injects contextual metadata into the SLF4J MDC (Mapped Diagnostic Context).
 * 
 * <p>This allows every log line emitted during a request to automatically include:
 * <ul>
 *   <li>traceId: For correlating logs across a single request lifecycle.</li>
 *   <li>accountId: For auditing which user triggered the logs.</li>
 * </ul>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class MdcLoggingFilter extends OncePerRequestFilter {

    private static final String TRACE_ID = "traceId";
    private static final String ACCOUNT_ID = "accountId";

    private final CurrentUser currentUser;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Generate a trace ID if the client didn't provide one
            String traceId = request.getHeader("X-Request-ID");
            if (traceId == null || traceId.isBlank()) {
                traceId = UUID.randomUUID().toString();
            }
            MDC.put(TRACE_ID, traceId);
            
            // Add the trace ID to the response header so the client can log it
            response.addHeader("X-Trace-ID", traceId);

            // Add the authenticated account ID if present
            currentUser.accountId().ifPresent(id -> MDC.put(ACCOUNT_ID, id.toString()));

            filterChain.doFilter(request, response);
            
        } finally {
            MDC.remove(TRACE_ID);
            MDC.remove(ACCOUNT_ID);
        }
    }
}
