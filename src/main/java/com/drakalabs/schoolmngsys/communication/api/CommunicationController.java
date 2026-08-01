package com.drakalabs.schoolmngsys.communication.api;

import com.drakalabs.schoolmngsys.communication.service.CommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/communication")
@RequiredArgsConstructor
public class CommunicationController {

    private final CommunicationService communicationService;

    @GetMapping("/announcements")
    public ResponseEntity<List<Map<String, Object>>> getAnnouncements() {
        return ResponseEntity.ok(communicationService.getAnnouncements());
    }

    @PostMapping("/announcements")
    public ResponseEntity<Map<String, Object>> createAnnouncement(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(communicationService.createAnnouncement(request));
    }

    @GetMapping("/outbox-logs")
    public ResponseEntity<List<Map<String, Object>>> getOutboxLogs() {
        return ResponseEntity.ok(communicationService.getOutboxLogs());
    }

    @GetMapping("/archived-feeds")
    public ResponseEntity<List<Map<String, Object>>> getArchivedFeeds() {
        return ResponseEntity.ok(communicationService.getArchivedFeeds());
    }
}
