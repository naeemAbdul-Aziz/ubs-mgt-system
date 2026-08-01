package com.drakalabs.schoolmngsys;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

public class HashGeneratorTest {
    @Test
    public void generateHash() {
        Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        String hash = encoder.encode("Password123");
        System.out.println("GENERATED_HASH=" + hash);
    }
}
