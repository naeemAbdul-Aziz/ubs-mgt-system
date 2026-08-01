package com.drakalabs.schoolmngsys.auth.service;

import com.drakalabs.schoolmngsys.auth.repository.UserAccountRepository;
import com.drakalabs.schoolmngsys.shared.security.UbsUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Loads {@link UbsUserDetails} from the database by account ID or username.
 *
 * <p>Permissions are loaded fresh on every request (not embedded in JWT) to ensure
 * role changes take effect without waiting for token expiry.
 *
 * <p>The {@link UserDetails#getAuthorities()} collection contains permission codes
 * (e.g. {@code STUDENT_CREATE}), not role names — endpoints check permissions, not roles.
 */
@Service
@RequiredArgsConstructor
public class UbsUserDetailsService implements UserDetailsService {

    private final UserAccountRepository accountRepository;

    /**
     * Loads user details by username (called by Spring Security during form/basic auth).
     * In UBS-LMIS, username may be a staff number, phone number, or chosen username.
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUsernameWithRolesAndPermissions(username)
                .map(this::toUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found: " + username));
    }

    /**
     * Loads user details by account ID (called by the JWT filter after token validation).
     */
    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "usersCache", key = "#accountId")
    public UbsUserDetails loadByAccountId(UUID accountId) {
        return accountRepository.findByIdWithRolesAndPermissions(accountId)
                .map(this::toUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found: " + accountId));
    }

    // ─── Mapping ──────────────────────────────────────────────────────────

    private UbsUserDetails toUserDetails(com.drakalabs.schoolmngsys.auth.domain.UserAccount account) {
        Set<GrantedAuthority> authorities = account.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> (GrantedAuthority) new SimpleGrantedAuthority(permission.getCode()))
                .collect(Collectors.toSet());

        return new UbsUserDetails(
                account.getId(),
                account.getUsername(),
                account.getPasswordHash(),
                account.getPersonType().name(),
                account.getPersonId(),
                account.isActive(),
                authorities
        );
    }
}
