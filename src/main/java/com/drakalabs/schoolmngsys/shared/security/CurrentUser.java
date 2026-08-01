package com.drakalabs.schoolmngsys.shared.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Utility for accessing the authenticated user from the Spring Security context.
 *
 * <p>Used by services and the audit interceptor to resolve the {@code actorAccountId}
 * without coupling to the HTTP layer.
 */
@Component
public class CurrentUser {

    /**
     * Returns the account ID of the currently authenticated user, if present.
     * Returns empty for unauthenticated requests (public endpoints, system tasks).
     */
    public Optional<UUID> accountId() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(auth -> {
                    Object principal = auth.getPrincipal();
                    if (principal instanceof UbsUserDetails userDetails) {
                        return userDetails.accountId();
                    }
                    return null;
                });
    }

    /**
     * Returns the account ID or throws {@link IllegalStateException} if unauthenticated.
     * Use on endpoints that require authentication.
     */
    public UUID requireAccountId() {
        return accountId().orElseThrow(() ->
                new IllegalStateException("No authenticated user in security context"));
    }
}
