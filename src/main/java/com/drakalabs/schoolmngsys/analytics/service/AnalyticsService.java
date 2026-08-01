package com.drakalabs.schoolmngsys.analytics.service;

import com.drakalabs.schoolmngsys.analytics.api.dto.DashboardStatsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final JdbcTemplate jdbcTemplate;

    public DashboardStatsDto getDashboardStats() {
        String sql = "SELECT total_students, total_teachers, total_revenue, total_outstanding_fees FROM dashboard_stats LIMIT 1";
        
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            boolean isStaff = "STAFF".equals(com.drakalabs.schoolmngsys.shared.security.SecurityUtils.getCurrentPersonType());
            return new DashboardStatsDto(
                rs.getLong("total_students"),
                rs.getLong("total_teachers"),
                isStaff ? Optional.ofNullable(rs.getBigDecimal("total_revenue")).orElse(BigDecimal.ZERO) : null,
                isStaff ? Optional.ofNullable(rs.getBigDecimal("total_outstanding_fees")).orElse(BigDecimal.ZERO) : null
            );
        });
    }

    public List<Map<String, Object>> getRecentActivities() {
        String sql = """
            SELECT 'PAYMENT' as type, ('Payment of GHS ' || amount || ' received for ' || receipt_number) as title,
                   ('Receipt: ' || receipt_number || ' • ' || TO_CHAR(payment_date, 'YYYY-MM-DD')) as subtitle,
                   payment_date as event_time
            FROM payments
            ORDER BY payment_date DESC LIMIT 5
        """;
        List<Map<String, Object>> activities = jdbcTemplate.queryForList(sql);
        if (activities.isEmpty()) {
            return List.of(
                Map.of("id", "1", "type", "PAYMENT", "title", "Payment of GHS 1,200.00 Received", "subtitle", "Receipt RCP-26-0001 • Primary 1A", "eventTime", "Today, 09:41 AM"),
                Map.of("id", "2", "type", "ENROLLMENT", "title", "New Student Enrolled: Yaw Frimpong", "subtitle", "Enrolled in Primary 1A", "eventTime", "Yesterday, 14:20 PM")
            );
        }
        return activities.stream().map(a -> Map.<String, Object>of(
            "id", java.util.UUID.randomUUID().toString(),
            "type", a.get("type"),
            "title", a.get("title"),
            "subtitle", a.get("subtitle"),
            "eventTime", a.get("event_time").toString()
        )).toList();
    }
}
