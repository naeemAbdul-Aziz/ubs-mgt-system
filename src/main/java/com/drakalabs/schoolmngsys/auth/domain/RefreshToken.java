package com.drakalabs.schoolmngsys.auth.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * A server-persisted refresh token (hashed) enabling immediate revocation.
 *
 * <p>Refresh tokens are the deliberate piece of server-side state in an otherwise
 * stateless JWT scheme. Storing them (hashed) allows:
 * <ul>
 *   <li>Immediate revocation on account deactivation (FR-AUTH-04)</li>
 *   <li>Rotation (each use issues a new token, old one is revoked)</li>
 *   <li>Detection of theft via reuse of a revoked token</li>
 * </ul>
 *
 * @see <a href="docs/11-security-and-privacy.md#2-authentication">Security §2</a>
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken extends BaseEntity {

    @Column(name = "account_id", nullable = false, columnDefinition = "uuid")
    private java.util.UUID accountId;

    /** SHA-256 hash of the token value. Raw token is never stored. */
    @Column(name = "token_hash", nullable = false, unique = true, length = 255)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    /** When this token was revoked. Null if still valid. */
    @Column(name = "revoked_at")
    private Instant revokedAt;

    /** IP address from which the token was issued. */
    @Column(name = "issued_from_ip", length = 45)
    private String issuedFromIp;

    public static RefreshToken issue(java.util.UUID accountId, String tokenHash,
                                     Instant expiresAt, String issuedFromIp) {
        var rt = new RefreshToken();
        rt.accountId = accountId;
        rt.tokenHash = tokenHash;
        rt.expiresAt = expiresAt;
        rt.issuedFromIp = issuedFromIp;
        return rt;
    }

    public void revoke() {
        this.revokedAt = Instant.now();
    }

    public boolean isValid() {
        return revokedAt == null && Instant.now().isBefore(expiresAt);
    }
}
