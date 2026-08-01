package com.drakalabs.schoolmngsys.progression.api;

import com.drakalabs.schoolmngsys.progression.api.dto.ProgressionResultDto;
import com.drakalabs.schoolmngsys.progression.api.dto.ProgressionRunDto;
import com.drakalabs.schoolmngsys.progression.domain.ProgressionResult;
import com.drakalabs.schoolmngsys.progression.domain.ProgressionRun;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProgressionMapper {

    @Mapping(source = "sourceAcademicYear.id", target = "sourceAcademicYearId")
    @Mapping(source = "targetAcademicYear.id", target = "targetAcademicYearId")
    ProgressionRunDto toDto(ProgressionRun run);

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "previousClass.id", target = "previousClassId")
    @Mapping(source = "newEnrollment.id", target = "newEnrollmentId")
    ProgressionResultDto toDto(ProgressionResult result);
}
