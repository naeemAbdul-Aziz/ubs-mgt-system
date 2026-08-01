package com.drakalabs.schoolmngsys.shared.config;

import com.drakalabs.schoolmngsys.shared.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA configuration.
 *
 * <p>Provides the {@link AuditorAware} bean that feeds {@code createdBy}/{@code updatedBy}
 * on {@link com.drakalabs.schoolmngsys.shared.domain.BaseEntity} from the Spring Security context.
 *
 * <p>{@code @EnableJpaAuditing} lives on the application class pointing to this bean
 * by name {@code "springSecurityAuditorAware"}.
 */
@Configuration
@RequiredArgsConstructor
public class JpaConfig {

    private final CurrentUser currentUser;

    /**
     * Resolves the currently authenticated user's account ID for JPA auditing.
     * Returns {@link Optional#empty()} for unauthenticated (system/migration) operations.
     */
    @Bean("springSecurityAuditorAware")
    public AuditorAware<UUID> auditorAware() {
        return () -> currentUser.accountId();
    }
}
