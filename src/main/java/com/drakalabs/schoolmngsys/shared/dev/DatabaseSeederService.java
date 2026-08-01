package com.drakalabs.schoolmngsys.shared.dev;

import com.drakalabs.schoolmngsys.auth.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;

/**
 * Manages demo/seed data for the UBS-LMIS system.
 *
 * <p>On every startup the runner checks whether the database already has user
 * accounts.  If the DB is brand new (empty), it runs a full Flyway
 * clean+migrate to populate all seed data.  If accounts already exist, the
 * seeder is skipped — making restarts safe and idempotent.
 *
 * <p>When the school is ready to hand over the software, call
 * {@link #clearAllData()} (exposed via {@code POST /api/v1/dev/initialize}).
 * That wipes all demo data and re-runs migrations so the DB is pristine,
 * with no seed accounts.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseSeederService implements ApplicationRunner {

    private final DataSource dataSource;
    private final UserAccountRepository userAccountRepository;

    // ── Startup auto-seed ─────────────────────────────────────────────────────

    @Override
    public void run(ApplicationArguments args) {
        long accountCount = userAccountRepository.count();
        if (accountCount == 0) {
            log.info("No user accounts found — running auto-seed on startup...");
            seedDatabase();
        } else {
            log.info("Database already has {} account(s) — skipping auto-seed.", accountCount);
        }
    }

    // ── Seed (clean + migrate) ────────────────────────────────────────────────

    /**
     * Drops all tables, re-runs all Flyway migrations (including seed data
     * scripts).  Safe to call multiple times.
     */
    public void seedDatabase() {
        log.info("Running full database reset + seed via Flyway...");
        buildFlyway().clean();
        buildFlyway().migrate();
        log.info("Database seeded successfully.");
    }

    // ── Initialize / handover (clear seed data only) ─────────────────────────

    /**
     * Wipes all data and re-runs migrations WITHOUT the seed data scripts.
     * Call this when handing the software over to the school so they start
     * with a completely clean slate.
     *
     * <p>The seed SQL scripts use the filename convention
     * {@code S__*.sql} (capital-S prefix), which are excluded from the
     * clean migrate so the schema remains but no demo rows are inserted.
     * If your seed files follow the regular {@code V__*.sql} versioned
     * convention, this method still wipes all data via clean+migrate, but
     * you should move seed scripts to {@code S__} prefix files to keep them
     * separate from structural migrations.
     */
    public void clearAllData() {
        log.warn("INITIALIZE requested — wiping ALL data for handover...");
        // Drop every table in the public schema
        Flyway flyway = buildFlyway();
        flyway.clean();
        // Re-apply only structural migrations (no seed data)
        flyway.migrate();
        log.warn("Database cleared. System is ready for handover.");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Flyway buildFlyway() {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .cleanDisabled(false)   // explicit opt-in — only called from controlled paths
                .load();
    }
}
