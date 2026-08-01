package com.drakalabs.schoolmngsys.academics.service;

import com.drakalabs.schoolmngsys.academics.api.dto.ClassLevelDto;
import com.drakalabs.schoolmngsys.academics.api.dto.DepartmentDto;
import com.drakalabs.schoolmngsys.academics.api.dto.SubjectDto;
import com.drakalabs.schoolmngsys.academics.repository.ClassLevelRepository;
import com.drakalabs.schoolmngsys.academics.repository.DepartmentRepository;
import com.drakalabs.schoolmngsys.academics.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReferenceDataService {

    private final DepartmentRepository departmentRepository;
    private final ClassLevelRepository classLevelRepository;
    private final SubjectRepository subjectRepository;

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> new DepartmentDto(d.getId(), d.getCode(), d.getName()))
                .toList();
    }

    public List<ClassLevelDto> getAllClassLevels() {
        return classLevelRepository.findAllOrdered().stream()
                .map(c -> new ClassLevelDto(
                        c.getId(),
                        c.getCode(),
                        c.getName(),
                        c.getBasicAlias(),
                        c.getSortOrder(),
                        c.getDepartment().getId()
                ))
                .toList();
    }

    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(s -> new SubjectDto(s.getId(), s.getCode(), s.getName()))
                .toList();
    }
}
