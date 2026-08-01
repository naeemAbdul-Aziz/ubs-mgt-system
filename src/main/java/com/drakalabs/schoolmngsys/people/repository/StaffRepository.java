package com.drakalabs.schoolmngsys.people.repository;

import com.drakalabs.schoolmngsys.people.domain.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StaffRepository extends JpaRepository<Staff, UUID> {

    Optional<Staff> findByStaffNumber(String staffNumber);
    
    Page<Staff> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrStaffNumberContainingIgnoreCase(String firstName, String lastName, String staffNumber, Pageable pageable);
}
