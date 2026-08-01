package com.drakalabs.schoolmngsys.people.service;

import com.drakalabs.schoolmngsys.people.domain.Staff;
import com.drakalabs.schoolmngsys.people.repository.StaffRepository;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import com.drakalabs.schoolmngsys.finance.service.PayrollService;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final PayrollService payrollService;

    @Transactional
    public Staff createStaff(String staffNumber, String firstName, String lastName, String otherNames, String staffType, String gesRegistrationNo, LocalDate employmentStart, String email, String phone) {
        if (staffRepository.findByStaffNumber(staffNumber).isPresent()) {
            throw new BusinessRuleException("BR-ST-001", "Staff number must be unique.");
        }
        
        Staff staff = Staff.create(staffNumber, firstName, lastName, otherNames, staffType, gesRegistrationNo, employmentStart, email, phone);
        Staff savedStaff = staffRepository.save(staff);
        
        // Auto-enroll in Payroll with 0.00 base salary
        payrollService.setSalaryStructure(savedStaff.getId(), BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        
        return savedStaff;
    }

    @Transactional(readOnly = true)
    public Page<Staff> searchStaff(String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return staffRepository.findAll(pageable);
        }
        return staffRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrStaffNumberContainingIgnoreCase(query, query, query, pageable);
    }

    @Transactional(readOnly = true)
    public Staff getStaff(UUID id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", id.toString()));
    }
}
