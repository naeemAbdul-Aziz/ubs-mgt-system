package com.drakalabs.schoolmngsys.people.service;

import com.drakalabs.schoolmngsys.people.domain.Guardian;
import com.drakalabs.schoolmngsys.people.domain.Student;
import com.drakalabs.schoolmngsys.people.domain.StudentGuardian;
import com.drakalabs.schoolmngsys.people.repository.GuardianRepository;
import com.drakalabs.schoolmngsys.people.repository.StudentGuardianRepository;
import com.drakalabs.schoolmngsys.people.repository.StudentRepository;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GuardianService {

    private final GuardianRepository guardianRepository;
    private final StudentRepository studentRepository;
    private final StudentGuardianRepository studentGuardianRepository;

    @Transactional
    public Guardian createGuardian(String firstName, String lastName, String otherNames, String phone, String email, String occupation, String address) {
        Guardian guardian = Guardian.create(firstName, lastName, otherNames, phone, email, occupation, address);
        return guardianRepository.save(guardian);
    }

    @Transactional(readOnly = true)
    public Page<Guardian> searchGuardians(String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return guardianRepository.findAll(pageable);
        }
        return guardianRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query, pageable);
    }

    @Transactional(readOnly = true)
    public Guardian getGuardian(UUID id) {
        return guardianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guardian", id.toString()));
    }

    @Transactional
    public StudentGuardian linkGuardianToStudent(UUID guardianId, UUID studentId, String relationshipType, boolean isPrimaryContact, boolean hasCustody, boolean receivesBilling, boolean receivesAcademicReports) {
        Guardian guardian = getGuardian(guardianId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId.toString()));

        studentGuardianRepository.findByStudentIdAndGuardianId(studentId, guardianId)
                .ifPresent(sg -> { throw new BusinessRuleException("BR-EN-004", "Guardian is already linked to this student."); });

        if (isPrimaryContact) {
            long existingPrimaries = studentGuardianRepository.countPrimaryContactsByStudentId(studentId);
            if (existingPrimaries > 0) {
                // If setting this one to primary, we should demote others, or reject.
                // Let's reject for now to force explicit demotion first for safety.
                throw new BusinessRuleException("BR-EN-004", "Student already has a primary contact. Demote the existing primary contact first.");
            }
        }

        StudentGuardian sg = StudentGuardian.create(student, guardian, relationshipType, isPrimaryContact, hasCustody, receivesBilling, receivesAcademicReports);
        return studentGuardianRepository.save(sg);
    }
    
    @Transactional(readOnly = true)
    public List<StudentGuardian> getStudentGuardians(UUID studentId) {
        return studentGuardianRepository.findByStudentId(studentId);
    }
}
