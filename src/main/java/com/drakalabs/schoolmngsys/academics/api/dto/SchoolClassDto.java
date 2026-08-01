package com.drakalabs.schoolmngsys.academics.api.dto;

import java.util.UUID;

public record SchoolClassDto(
        UUID id,
        UUID academicYearId,
        UUID classLevelId,
        String className,
        String stream,
        int capacity,
        int enrolledCount,
        String classTeacherName
) {}
