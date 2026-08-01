package com.drakalabs.schoolmngsys.people.api;

import com.drakalabs.schoolmngsys.people.api.dto.CreateStaffRequest;
import com.drakalabs.schoolmngsys.people.api.dto.StaffDto;
import com.drakalabs.schoolmngsys.people.domain.Staff;
import com.drakalabs.schoolmngsys.people.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.drakalabs.schoolmngsys.shared.api.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('STAFF_CREATE')")
    public StaffDto createStaff(@Valid @RequestBody CreateStaffRequest request) {
        Staff staff = staffService.createStaff(
                request.getStaffNumber(),
                request.getFirstName(),
                request.getLastName(),
                request.getOtherNames(),
                request.getStaffType(),
                request.getGesRegistrationNo(),
                request.getEmploymentStart(),
                request.getEmail(),
                request.getPhone()
        );
        return StaffDto.from(staff);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STAFF_VIEW')")
    public PageResponse<StaffDto> searchStaff(
            @RequestParam(required = false) String query,
            Pageable pageable) {
        return PageResponse.from(staffService.searchStaff(query, pageable).map(StaffDto::from));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('STAFF_VIEW')")
    public StaffDto getStaff(@PathVariable UUID id) {
        return StaffDto.from(staffService.getStaff(id));
    }
}
