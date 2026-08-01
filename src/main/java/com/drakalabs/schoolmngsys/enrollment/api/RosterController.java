package com.drakalabs.schoolmngsys.enrollment.api;

import com.drakalabs.schoolmngsys.enrollment.api.dto.RosterEntryDto;
import com.drakalabs.schoolmngsys.enrollment.service.RosterService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class RosterController {

    private final RosterService rosterService;

    @GetMapping("/{classId}/roster")
    @PreAuthorize("hasAuthority('ROSTER_VIEW')")
    public List<RosterEntryDto> getClassRoster(@PathVariable UUID classId) {
        return rosterService.getClassRoster(classId);
    }
}
