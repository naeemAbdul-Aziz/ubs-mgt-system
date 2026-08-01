package com.drakalabs.schoolmngsys.people.service;

import com.drakalabs.schoolmngsys.people.repository.StudentGuardianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service specifically dedicated to answering authorization queries for Guardian scope filters.
 */
@Service
@RequiredArgsConstructor
public class GuardianWardResolutionService {

    private final StudentGuardianRepository studentGuardianRepository;

    /**
     * Checks if a guardian is linked to a specific student.
     * This is used by the authorization/scope filtering logic.
     */
    @Transactional(readOnly = true)
    public boolean isGuardianOf(UUID guardianId, UUID studentId) {
        return studentGuardianRepository.findByStudentIdAndGuardianId(studentId, guardianId).isPresent();
    }
}
