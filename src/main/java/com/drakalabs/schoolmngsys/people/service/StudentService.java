package com.drakalabs.schoolmngsys.people.service;

import com.drakalabs.schoolmngsys.people.domain.Student;
import com.drakalabs.schoolmngsys.people.repository.StudentRepository;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional
    public Student createStudent(String studentNumber, String firstName, String lastName, String otherNames, LocalDate dateOfBirth, String gender, LocalDate admissionDate) {
        if (studentRepository.findByStudentNumber(studentNumber).isPresent()) {
            throw new BusinessRuleException("BR-EN-002", "Student number must be unique.");
        }
        
        Student student = Student.create(studentNumber, firstName, lastName, otherNames, dateOfBirth, gender, admissionDate);
        return studentRepository.save(student);
    }

    @Transactional(readOnly = true)
    public Page<Student> searchStudents(String query, String grade, String status, Pageable pageable) {
        String safeQuery = (query != null && !query.isBlank()) ? query : null;
        String safeGrade = (grade != null && !grade.isBlank()) ? grade : null;
        String safeStatus = (status != null && !status.isBlank()) ? status : null;
        return studentRepository.searchStudents(safeQuery, safeGrade, safeStatus, pageable);
    }

    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "studentsLookupCache", cacheManager = "studentsLookupCacheManager")
    public java.util.List<com.drakalabs.schoolmngsys.people.api.dto.StudentLookupProjection> getStudentLookups() {
        return studentRepository.findAllLookups();
    }

    @Transactional(readOnly = true)
    public Student getStudent(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id.toString()));
    }

    @Transactional
    public void updateStudentStatus(UUID id, String status) {
        Student student = getStudent(id);
        student.setStatus(status);
        studentRepository.save(student);
    }
}
