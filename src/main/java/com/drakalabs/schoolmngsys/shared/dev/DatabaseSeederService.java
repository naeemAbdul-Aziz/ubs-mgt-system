package com.drakalabs.schoolmngsys.shared.dev;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseSeederService {

    private final DataSource dataSource;

    public void seedDatabase() {
        log.info("Starting database reset...");
        
        // We configure a programmatic Flyway instance to bypass the application.yml 
        // clean-disabled=true safety check, as this endpoint is explicitly for 
        // development/demo resets.
        Flyway flyway = Flyway.configure()
            .dataSource(dataSource)
            .locations("classpath:db/migration")
            .cleanDisabled(false)
            .load();
        
        flyway.clean();
        flyway.migrate();
        
        log.info("Database reset and seeded successfully via Flyway.");
    }
}
