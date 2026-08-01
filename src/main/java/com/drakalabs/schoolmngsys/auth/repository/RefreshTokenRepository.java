package com.drakalabs.schoolmngsys.auth.repository;

import com.drakalabs.schoolmngsys.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link RefreshToken}.
 *
 * <p>Provides lookup by token hash and bulk revocation for account deactivation.
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /**
     * Revokes all active refresh tokens for an account.
     * Called when an account is deactivated (FR-AUTH-04).
     */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revokedAt = :now WHERE rt.accountId = :accountId AND rt.revokedAt IS NULL")
    int revokeAllForAccount(UUID accountId, Instant now);

    /**
     * Deletes expired and revoked tokens older than the given cutoff.
     * Should be called periodically by a scheduled job for hygiene.
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :cutoff OR rt.revokedAt IS NOT NULL")
    int deleteExpiredAndRevoked(Instant cutoff);
}
