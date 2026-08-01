package com.drakalabs.schoolmngsys.academics.service;

import com.drakalabs.schoolmngsys.academics.api.dto.*;
import com.drakalabs.schoolmngsys.academics.domain.*;
import com.drakalabs.schoolmngsys.academics.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AcademicStructureService {

    private final AcademicYearRepository academicYearRepository;
    private final TermRepository termRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final ClassLevelRepository classLevelRepository;
    private final ClassSubjectOfferingRepository classSubjectOfferingRepository;
    private final SubjectRepository subjectRepository;
    private final com.drakalabs.schoolmngsys.people.repository.StaffRepository staffRepository;

    public AcademicYearDto createAcademicYear(CreateAcademicYearRequest request) {
        if (academicYearRepository.findByName(request.name()).isPresent()) {
            throw new IllegalStateException("Academic year with name " + request.name() + " already exists");
        }
        AcademicYear year = AcademicYear.create(request.name(), request.startDate(), request.endDate());
        year = academicYearRepository.save(year);
        return mapToDto(year);
    }

    public List<AcademicYearDto> getAllAcademicYears() {
        return academicYearRepository.findAll().stream().map(this::mapToDto).toList();
    }

    public void activateAcademicYear(UUID yearId) {
        AcademicYear year = academicYearRepository.findById(yearId)
                .orElseThrow(() -> new IllegalArgumentException("Academic year not found"));

        if (academicYearRepository.existsOtherActive(yearId)) {
            throw new IllegalStateException("Another academic year is already ACTIVE");
        }
        
        long termCount = termRepository.countByAcademicYearId(yearId);
        if (termCount != 3) {
            throw new IllegalStateException("Academic year must have exactly 3 terms before it can be activated (BR-AS-003)");
        }

        year.activate();
    }

    public void closeAcademicYear(UUID yearId) {
        AcademicYear year = academicYearRepository.findById(yearId)
                .orElseThrow(() -> new IllegalArgumentException("Academic year not found"));
        year.close();
    }

    public TermDto createTerm(UUID yearId, CreateTermRequest request) {
        AcademicYear year = academicYearRepository.findById(yearId)
                .orElseThrow(() -> new IllegalArgumentException("Academic year not found"));

        if (termRepository.findByAcademicYearIdAndTermNumber(yearId, request.termNumber()).isPresent()) {
            throw new IllegalStateException("Term " + request.termNumber() + " already exists for this year");
        }
        if (termRepository.countByAcademicYearId(yearId) >= 3) {
            throw new IllegalStateException("Academic year already has 3 terms (BR-AS-003)");
        }

        Term term = Term.create(year, request.termNumber(), request.startDate(), request.endDate());
        term = termRepository.save(term);
        return mapToDto(term);
    }

    public List<TermDto> getTermsForYear(UUID yearId) {
        return termRepository.findByAcademicYearIdOrderByTermNumberAsc(yearId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public SchoolClassDto createClass(UUID yearId, CreateSchoolClassRequest request) {
        AcademicYear year = academicYearRepository.findById(yearId)
                .orElseThrow(() -> new IllegalArgumentException("Academic year not found"));
        ClassLevel level = classLevelRepository.findById(request.classLevelId())
                .orElseThrow(() -> new IllegalArgumentException("Class level not found"));

        if (schoolClassRepository.findByAcademicYearIdAndClassLevelIdAndStream(yearId, level.getId(), request.stream()).isPresent()) {
            throw new IllegalStateException("Class with stream " + request.stream() + " already exists for this level in this year");
        }

        SchoolClass schoolClass = SchoolClass.create(year, level, request.stream(), request.capacity(), null);
        schoolClass = schoolClassRepository.save(schoolClass);
        return mapToDto(schoolClass);
    }

    public List<SchoolClassDto> getClassesForYear(UUID yearId) {
        return schoolClassRepository.findByAcademicYearId(yearId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public void addSubjectOffering(UUID classId, UUID subjectId) {
        SchoolClass schoolClass = schoolClassRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));

        if (classSubjectOfferingRepository.existsBySchoolClassIdAndSubjectId(classId, subjectId)) {
            throw new IllegalStateException("Subject already offered in this class");
        }

        ClassSubjectOffering offering = ClassSubjectOffering.create(schoolClass, subject, null);
        classSubjectOfferingRepository.save(offering);
    }

    public void assignClassTeacher(UUID classId, UUID teacherId) {
        SchoolClass schoolClass = schoolClassRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        
        com.drakalabs.schoolmngsys.people.domain.Staff teacher = staffRepository.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        schoolClass.setClassTeacher(teacher);
        schoolClassRepository.save(schoolClass);
    }

    public void assignSubjectTeacher(UUID classId, UUID subjectId, UUID teacherId) {
        ClassSubjectOffering offering = classSubjectOfferingRepository.findBySchoolClassIdAndSubjectId(classId, subjectId)
                .orElseThrow(() -> new IllegalArgumentException("ClassSubjectOffering not found"));
        
        com.drakalabs.schoolmngsys.people.domain.Staff teacher = staffRepository.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        offering.setSubjectTeacher(teacher);
        classSubjectOfferingRepository.save(offering);
    }

    // --- Internal Entity Getters (for cross-module service use) ---

    public SchoolClass getSchoolClassEntity(UUID id) {
        return schoolClassRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
    }

    public AcademicYear getAcademicYearEntity(UUID id) {
        return academicYearRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Academic year not found"));
    }

    // --- Mappers ---

    private AcademicYearDto mapToDto(AcademicYear entity) {
        return new AcademicYearDto(entity.getId(), entity.getName(), entity.getStartDate(), entity.getEndDate(), entity.getStatus());
    }

    private TermDto mapToDto(Term entity) {
        return new TermDto(entity.getId(), entity.getAcademicYear().getId(), entity.getTermNumber(), entity.getStartDate(), entity.getEndDate());
    }

    private SchoolClassDto mapToDto(SchoolClass entity) {
        String teacherName = entity.getClassTeacher() != null ? entity.getClassTeacher().getFirstName() + " " + entity.getClassTeacher().getLastName() : null;
        String className = entity.getClassLevel().getName() + " " + entity.getStream();
        return new SchoolClassDto(entity.getId(), entity.getAcademicYear().getId(), entity.getClassLevel().getId(), className, entity.getStream(), entity.getCapacity(), 0, teacherName);
    }
}
