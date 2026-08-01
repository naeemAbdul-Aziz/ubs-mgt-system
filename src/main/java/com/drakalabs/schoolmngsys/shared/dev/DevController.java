package com.drakalabs.schoolmngsys.shared.dev;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dev")
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "app.dev.seeder.enabled", havingValue = "true")
public class DevController {

    private final DatabaseSeederService databaseSeederService;

    @PostMapping("/seed")
    public ResponseEntity<Map<String, String>> seedDatabase() {
        log.info("Triggering database seeder...");
        try {
            databaseSeederService.seedDatabase();
            return ResponseEntity.ok(Map.of("message", "Database successfully seeded."));
        } catch (Exception e) {
            log.error("Failed to seed database", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
