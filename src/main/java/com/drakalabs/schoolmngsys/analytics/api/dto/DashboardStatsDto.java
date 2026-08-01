package com.drakalabs.schoolmngsys.analytics.api.dto;

import java.math.BigDecimal;

public record DashboardStatsDto(
    long totalStudents,
    long totalTeachers,
    BigDecimal totalRevenue,
    BigDecimal totalOutstandingFees
) {}
