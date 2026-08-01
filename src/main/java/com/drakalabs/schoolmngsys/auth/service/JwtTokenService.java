package com.drakalabs.schoolmngsys.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

/**
 * JWT access token issuance and validation.
 *
 * <p>Uses HS256 (symmetric) initially; asymmetric keys become worthwhile when a second
 * token consumer appears (future frontend SSR/other services) per doc 11 §2.
 *
 * <p>Access tokens carry:
 * <ul>
 *   <li>{@code sub} — account ID (UUID)</li>
 *   <li>{@code jti} — unique token ID (for future revocation list if needed)</li>
 *   <li>{@code iat}, {@code exp} — issued-at and expiry</li>
 * </ul>
 *
 * <p>Permissions and roles are NOT embedded in the JWT — they are loaded fresh from the DB
 * on each request via {@link UbsUserDetailsService}. This avoids stale permission caches
 * when roles change during a token's lifetime.
 */
@Slf4j
@Service
public class JwtTokenService {

    private final SecretKey signingKey;
    private final long accessTokenExpiryMinutes;

    public JwtTokenService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-expiry-minutes:15}") long accessTokenExpiryMinutes) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiryMinutes = accessTokenExpiryMinutes;
    }

    /**
     * Issues a new access token for the given account.
     *
     * @param accountId the authenticated account's UUID
     * @return signed JWT string
     */
    public String issueAccessToken(UUID accountId) {
        Instant now = Instant.now();
        Instant expiry = now.plus(accessTokenExpiryMinutes, ChronoUnit.MINUTES);

        return Jwts.builder()
                .subject(accountId.toString())
                .id(UUID.randomUUID().toString())   // jti
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Validates a JWT and extracts the account ID from the {@code sub} claim.
     *
     * @param token the raw JWT string (without "Bearer " prefix)
     * @return the account UUID if valid
     * @throws JwtException if the token is invalid, expired, or tampered
     */
    public UUID extractAccountId(String token) throws JwtException {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return UUID.fromString(claims.getSubject());
    }

    /**
     * Returns {@code true} if the token is structurally valid and not expired.
     * Does not check revocation (handled by refresh token layer).
     */
    public boolean isValid(String token) {
        try {
            extractAccountId(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }
}
