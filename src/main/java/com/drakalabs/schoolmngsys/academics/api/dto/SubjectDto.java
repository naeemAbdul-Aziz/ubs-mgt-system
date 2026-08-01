package com.drakalabs.schoolmngsys.academics.api.dto;

import java.util.UUID;

public record SubjectDto(
        UUID id,
        String code,
        String name
) {}
