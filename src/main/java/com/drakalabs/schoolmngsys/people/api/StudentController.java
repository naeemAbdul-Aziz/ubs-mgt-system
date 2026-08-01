package com.drakalabs.schoolmngsys.people.api;

import com.drakalabs.schoolmngsys.people.api.dto.CreateStudentRequest;
import com.drakalabs.schoolmngsys.people.api.dto.StudentDto;
import com.drakalabs.schoolmngsys.people.domain.Student;
import com.drakalabs.schoolmngsys.people.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.drakalabs.schoolmngsys.shared.api.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('STUDENT_CREATE')")
    public StudentDto createStudent(@Valid @RequestBody CreateStudentRequest request) {
        Student student = studentService.createStudent(
                request.getStudentNumber(),
                request.getFirstName(),
                request.getLastName(),
                request.getOtherNames(),
                request.getDateOfBirth(),
                request.getGender(),
                request.getAdmissionDate()
        );
        return StudentDto.from(student);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    public PageResponse<StudentDto> searchStudents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return PageResponse.from(studentService.searchStudents(query, grade, status, pageable).map(StudentDto::from));
    }

    @GetMapping("/lookup")
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    public java.util.List<com.drakalabs.schoolmngsys.people.api.dto.StudentLookupProjection> getStudentLookups() {
        return studentService.getStudentLookups();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    public StudentDto getStudent(@PathVariable UUID id) {
        return StudentDto.from(studentService.getStudent(id));
    }
}
