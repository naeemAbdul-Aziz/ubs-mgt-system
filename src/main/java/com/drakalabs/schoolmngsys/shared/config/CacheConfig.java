package com.drakalabs.schoolmngsys.shared.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String USERS_CACHE = "usersCache";
    public static final String STUDENTS_LOOKUP_CACHE = "studentsLookupCache";

    @Bean
    @Primary
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(USERS_CACHE);
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .maximumSize(5000));
        return cacheManager;
    }

    @Bean("studentsLookupCacheManager")
    public CacheManager studentsLookupCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(STUDENTS_LOOKUP_CACHE);
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(60, TimeUnit.MINUTES)
                .maximumSize(1));
        return cacheManager;
    }
}
