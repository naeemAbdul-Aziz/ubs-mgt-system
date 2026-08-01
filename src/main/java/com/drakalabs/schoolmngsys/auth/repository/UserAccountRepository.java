package com.drakalabs.schoolmngsys.auth.repository;

import com.drakalabs.schoolmngsys.auth.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link UserAccount}.
 *
 * <p>All queries that need roles+permissions use explicit JOIN FETCH to avoid
 * N+1 issues in the authentication hot path.
 */
public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {

    /**
     * Finds an account by username with roles and permissions eagerly fetched.
     * Used by {@link com.drakalabs.schoolmngsys.auth.service.UbsUserDetailsService}.
     */
    @Query("""
            SELECT a FROM UserAccount a
            LEFT JOIN FETCH a.roles r
            LEFT JOIN FETCH r.permissions
            WHERE a.username = :username
              AND a.status = 'ACTIVE'
            """)
    Optional<UserAccount> findByUsernameWithRolesAndPermissions(@Param("username") String username);

    /**
     * Finds an account by ID with roles and permissions eagerly fetched.
     * Used by the JWT filter on each authenticated request.
     */
    @Query("""
            SELECT a FROM UserAccount a
            LEFT JOIN FETCH a.roles r
            LEFT JOIN FETCH r.permissions
            WHERE a.id = :id
              AND a.status = 'ACTIVE'
            """)
    Optional<UserAccount> findByIdWithRolesAndPermissions(@Param("id") UUID id);

    Optional<UserAccount> findByUsername(String username);

    boolean existsByUsername(String username);
}
