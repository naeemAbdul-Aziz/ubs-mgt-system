package com.drakalabs.schoolmngsys;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

public class HashGeneratorTest {
    @Test
    public void generateHash() {
        Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        String raw = "Password123";
        String hash = encoder.encode(raw);

        assertNotNull(hash);
        assertNotEquals(raw, hash);
        assertTrue(encoder.matches(raw, hash));
    }
}
