package com.drakalabs.schoolmngsys.assessment.api;

import com.drakalabs.schoolmngsys.assessment.api.dto.AssessmentComponentDto;
import com.drakalabs.schoolmngsys.assessment.domain.AssessmentComponent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AssessmentMapper {
    @Mapping(source = "classSubjectOffering.id", target = "classSubjectOfferingId")
    @Mapping(source = "term.id", target = "termId")
    AssessmentComponentDto toDto(AssessmentComponent component);
}