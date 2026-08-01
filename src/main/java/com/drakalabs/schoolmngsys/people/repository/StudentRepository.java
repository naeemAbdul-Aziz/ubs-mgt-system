package com.drakalabs.schoolmngsys.people.repository;

import com.drakalabs.schoolmngsys.people.domain.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drakalabs.schoolmngsys.people.api.dto.StudentLookupProjection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {

    @Query("SELECT s.id as id, s.firstName as firstName, s.lastName as lastName, s.currentClassName as currentClassName, s.studentNumber as studentNumber FROM Student s WHERE s.status = 'ACTIVE'")
    List<StudentLookupProjection> findAllLookups();

    Optional<Student> findByStudentNumber(String studentNumber);

    @Query("SELECT s FROM Student s WHERE " +
            "(:query IS NULL OR (LOWER(s.firstName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR " +
            "LOWER(s.lastName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR " +
            "LOWER(s.studentNumber) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))) AND " +
            "(:grade IS NULL OR s.currentClassName LIKE CONCAT(CAST(:grade AS string), '%')) AND " +
            "(:status IS NULL OR s.status = CAST(:status AS string))")
    Page<Student> searchStudents(@Param("query") String query, @Param("grade") String grade, @Param("status") String status, Pageable pageable);
}
