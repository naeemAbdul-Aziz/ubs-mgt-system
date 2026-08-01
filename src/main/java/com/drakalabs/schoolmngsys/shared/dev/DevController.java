package com.drakalabs.schoolmngsys.shared.dev;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Developer / handover endpoints.
 *
 * <p>{@code POST /api/v1/dev/seed}        — reset + re-seed the database (demo reset)
 * <p>{@code POST /api/v1/dev/initialize}  — wipe all data for clean handover to client
 *
 * <p>Both endpoints are public (no JWT) so they can be called from the login
 * page or a handover script.  Security-in-depth: these destructive ops are
 * only meaningful before any real data exists, and the school can disable
 * them by removing the app.dev.seeder.enabled env var after go-live.
 */
@RestController
@RequestMapping("/api/v1/dev")
@RequiredArgsConstructor
@Slf4j
public class DevController {

    private final DatabaseSeederService databaseSeederService;

    /**
     * Full reset: wipes all tables and re-seeds with demo data.
     * Useful to reset a demo or staging environment.
     */
    @PostMapping("/seed")
    public ResponseEntity<Map<String, String>> seedDatabase() {
        log.info("POST /api/v1/dev/seed — full reset + seed requested");
        try {
            databaseSeederService.seedDatabase();
            return ResponseEntity.ok(Map.of("message", "Database successfully reset and seeded."));
        } catch (Exception e) {
            log.error("Failed to seed database", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Handover initialize: wipes all demo/seed data so the school starts fresh.
     * Call this ONCE when you are ready to hand the software over to the client.
     */
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, String>> initializeForHandover() {
        log.warn("POST /api/v1/dev/initialize — handover initialize requested");
        try {
            databaseSeederService.clearAllData();
            return ResponseEntity.ok(Map.of("message", "Database cleared. System is ready for the school to use."));
        } catch (Exception e) {
            log.error("Failed to initialize database", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
