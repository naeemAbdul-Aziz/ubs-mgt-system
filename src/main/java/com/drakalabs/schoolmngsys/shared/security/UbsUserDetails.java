package com.drakalabs.schoolmngsys.shared.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;

/**
 * Spring Security {@link UserDetails} implementation carrying the authenticated
 * user's account ID and permission set.
 *
 * <p>Permissions (not roles) are stored as authorities — endpoints check permission strings
 * (e.g. {@code STUDENT_CREATE}), not role names. This allows new roles to be composed
 * without code changes (doc 03 §1).
 *
 * <p>Constructed by {@link UbsUserDetailsService} from the database.
 */
public record UbsUserDetails(
        UUID accountId,
        String username,
        String passwordHash,
        String personType,
        UUID personId,
        boolean enabled,
        Set<GrantedAuthority> authorities
) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return enabled; // lockout is managed separately with exponential backoff
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * Returns {@code true} if this user holds the given permission code.
     * Permission codes follow the {@code DOMAIN_ACTION} naming standard (doc 03 §4).
     */
    public boolean hasPermission(String permissionCode) {
        return authorities.stream()
                .anyMatch(a -> a.getAuthority().equals(permissionCode));
    }
}
