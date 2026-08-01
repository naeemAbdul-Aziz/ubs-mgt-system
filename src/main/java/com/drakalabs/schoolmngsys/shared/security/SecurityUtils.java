package com.drakalabs.schoolmngsys.shared.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

public class SecurityUtils {

    private SecurityUtils() {
    }

    public static Optional<UbsUserDetails> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UbsUserDetails) {
            return Optional.of((UbsUserDetails) authentication.getPrincipal());
        }
        return Optional.empty();
    }

    public static UUID getCurrentPersonId() {
        return getCurrentUser().map(UbsUserDetails::personId).orElse(null);
    }

    public static String getCurrentPersonType() {
        return getCurrentUser().map(UbsUserDetails::personType).orElse(null);
    }
}
