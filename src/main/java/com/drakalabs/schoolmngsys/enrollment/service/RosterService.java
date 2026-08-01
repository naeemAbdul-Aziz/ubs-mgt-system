package com.drakalabs.schoolmngsys.enrollment.service;

import com.drakalabs.schoolmngsys.academics.service.AcademicStructureService;
import com.drakalabs.schoolmngsys.enrollment.api.dto.RosterEntryDto;
import com.drakalabs.schoolmngsys.enrollment.domain.EnrollmentStatus;
import com.drakalabs.schoolmngsys.enrollment.repository.EnrollmentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RosterService {

    private final EnrollmentRepository enrollmentRepository;
    private final AcademicStructureService academicStructureService;

    @Transactional(readOnly = true)
    public List<RosterEntryDto> getClassRoster(UUID classId) {
        // Validate class exists
        academicStructureService.getSchoolClassEntity(classId);

        // Get ACTIVE enrollments for the class
        return enrollmentRepository.findAllBySchoolClassIdAndStatus(classId, EnrollmentStatus.ACTIVE)
                .stream()
                .map(RosterEntryDto::from)
                .collect(Collectors.toList());
    }
}
