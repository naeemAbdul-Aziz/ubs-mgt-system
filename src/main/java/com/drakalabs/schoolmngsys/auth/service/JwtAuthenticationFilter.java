package com.drakalabs.schoolmngsys.auth.service;

import com.drakalabs.schoolmngsys.shared.security.UbsUserDetails;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * JWT authentication filter — runs once per request.
 *
 * <p>Extracts the {@code Authorization: Bearer <token>} header, validates the JWT,
 * loads the user's permissions from the database, and sets the authentication in the
 * {@link org.springframework.security.core.context.SecurityContext}.
 *
 * <p>If the token is missing or invalid, the filter passes the request through
 * unauthenticated — the endpoint's authorization check will then reject it with 401/403.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;
    private final UbsUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UUID accountId = jwtTokenService.extractAccountId(token);
                UbsUserDetails userDetails = userDetailsService.loadByAccountId(accountId);

                if (userDetails.isEnabled()) {
                    var auth = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (JwtException e) {
                log.debug("JWT validation failed for request to {}: {}", request.getRequestURI(), e.getMessage());
                // Do not set authentication — the downstream security check will handle 401
            }
        }

        chain.doFilter(request, response);
    }

    /**
     * Extracts the raw JWT from the {@code Authorization: Bearer <token>} header.
     * Returns {@code null} if the header is missing or malformed.
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
