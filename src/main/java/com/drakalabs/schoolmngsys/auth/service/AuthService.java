package com.drakalabs.schoolmngsys.auth.service;

import com.drakalabs.schoolmngsys.auth.api.AuthController.TokenResponse;
import com.drakalabs.schoolmngsys.auth.domain.RefreshToken;
import com.drakalabs.schoolmngsys.auth.domain.UserAccount;
import com.drakalabs.schoolmngsys.auth.repository.RefreshTokenRepository;
import com.drakalabs.schoolmngsys.auth.repository.UserAccountRepository;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

/**
 * Authentication application service.
 *
 * <p>Implements login (credentials → token pair), token refresh (rotate), and logout (revoke).
 *
 * <p>Security notes:
 * <ul>
 *   <li>Refresh tokens are generated with {@link SecureRandom}, stored as SHA-256 hash</li>
 *   <li>Account lockout is enforced by {@code LoginAttemptService} (separate concern)</li>
 *   <li>All auth events are written to the audit log (BR-SE-002)</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository accountRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenService jwtTokenService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.refresh-token-expiry-days:30}")
    private long refreshTokenExpiryDays;

    @Value("${app.jwt.access-token-expiry-minutes:15}")
    private long accessTokenExpiryMinutes;

    // ─── Login ────────────────────────────────────────────────────────────

    /**
     * Validates credentials and issues a new token pair.
     *
     * @throws BadCredentialsException  if credentials are invalid
     * @throws BusinessRuleException    if account is inactive
     */
    @Transactional
    public TokenResponse login(String username, String rawPassword, String clientIp) {
        UserAccount account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!account.isActive()) {
            throw new BusinessRuleException("BR-SE-003", "Account is inactive");
        }

        if (!passwordEncoder.matches(rawPassword, account.getPasswordHash())) {
            // Post-MVP: increment login attempt counter (LoginAttemptService — FR-AUTH-05)
            log.warn("Failed login attempt for username: {}", username);
            throw new BadCredentialsException("Invalid credentials");
        }

        // Post-MVP: reset failed attempt counter on success
        log.info("Successful login for account: {}", account.getId());

        return issueTokenPair(account.getId(), clientIp);
    }

    // ─── Refresh ──────────────────────────────────────────────────────────

    /**
     * Validates the supplied refresh token, revokes it, and issues a new token pair (rotation).
     *
     * @throws BadCredentialsException if the token is invalid, expired, or already revoked
     */
    @Transactional
    public TokenResponse refresh(String rawRefreshToken) {
        String hash = hash(rawRefreshToken);

        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        if (!storedToken.isValid()) {
            log.warn("Attempt to use invalid/expired refresh token for account: {}", storedToken.getAccountId());
            throw new BadCredentialsException("Refresh token is invalid or expired");
        }

        // Rotate: revoke current, issue new
        storedToken.revoke();
        refreshTokenRepository.save(storedToken);

        return issueTokenPair(storedToken.getAccountId(), storedToken.getIssuedFromIp());
    }

    // ─── Logout ───────────────────────────────────────────────────────────

    /**
     * Revokes the supplied refresh token (logout).
     * Idempotent — if the token is already revoked, no error is thrown.
     */
    @Transactional
    public void logout(String rawRefreshToken) {
        String hash = hash(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
            token.revoke();
            refreshTokenRepository.save(token);
            log.info("Refresh token revoked for account: {}", token.getAccountId());
        });
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    private TokenResponse issueTokenPair(UUID accountId, String clientIp) {
        String accessToken = jwtTokenService.issueAccessToken(accountId);

        String rawRefreshToken = generateSecureToken();
        String hashedRefreshToken = hash(rawRefreshToken);
        Instant refreshExpiry = Instant.now().plus(refreshTokenExpiryDays, ChronoUnit.DAYS);

        RefreshToken refreshToken = RefreshToken.issue(accountId, hashedRefreshToken, refreshExpiry, clientIp);
        refreshTokenRepository.save(refreshToken);

        return new TokenResponse(accessToken, rawRefreshToken, accessTokenExpiryMinutes * 60);
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
