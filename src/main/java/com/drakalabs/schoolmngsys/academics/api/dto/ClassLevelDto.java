package com.drakalabs.schoolmngsys.academics.api.dto;

import java.util.UUID;

public record ClassLevelDto(
        UUID id,
        String code,
        String name,
        String basicAlias,
        int sortOrder,
        UUID departmentId
) {}
