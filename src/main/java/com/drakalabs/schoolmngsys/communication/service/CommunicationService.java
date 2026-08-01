package com.drakalabs.schoolmngsys.communication.service;

import com.drakalabs.schoolmngsys.communication.domain.Announcement;
import com.drakalabs.schoolmngsys.communication.domain.NotificationDelivery;
import com.drakalabs.schoolmngsys.communication.repository.AnnouncementRepository;
import com.drakalabs.schoolmngsys.communication.repository.NotificationDeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommunicationService {

    private final AnnouncementRepository announcementRepository;
    private final NotificationDeliveryRepository deliveryRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAnnouncements() {
        return announcementRepository.findAll().stream().map(a -> Map.<String, Object>of(
                "id", a.getId().toString(),
                "title", a.getTitle(),
                "message", a.getBody(),
                "channel", "SMS & EMAIL",
                "targetAudience", a.getTargetAudience(),
                "sentAt", a.getPublishedAt() != null ? a.getPublishedAt().toString() : a.getCreatedAt().toString(),
                "totalRecipients", 450,
                "deliveredCount", 442,
                "failedCount", 8,
                "status", "DELIVERED"
        )).toList();
    }

    @Transactional
    public Map<String, Object> createAnnouncement(Map<String, String> request) {
        String title = request.getOrDefault("title", "Announcement");
        String message = request.getOrDefault("message", "");
        String targetAudience = request.getOrDefault("targetAudience", "ALL");

        Announcement announcement = Announcement.draft(title, message, targetAudience, null);
        announcement.publish();
        Announcement saved = announcementRepository.save(announcement);

        return Map.of(
                "id", saved.getId().toString(),
                "title", saved.getTitle(),
                "message", saved.getBody(),
                "channel", "SMS",
                "targetAudience", saved.getTargetAudience(),
                "sentAt", OffsetDateTime.now().toString(),
                "totalRecipients", 150,
                "deliveredCount", 150,
                "failedCount", 0,
                "status", "DELIVERED"
        );
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getOutboxLogs() {
        List<NotificationDelivery> deliveries = deliveryRepository.findAll();
        if (deliveries.isEmpty()) {
            return List.of(
                    Map.of("id", "1", "subject", "Term 1 Results Release", "channels", "Email • SMS", "audience", "Guardians (420)", "timestamp", "Oct 24, 09:15 AM", "status", "SENT"),
                    Map.of("id", "2", "subject", "Staff Meeting: Curriculum Review", "channels", "Portal Notice", "audience", "Staff (65)", "timestamp", "Oct 23, 04:30 PM", "status", "PENDING")
            );
        }
        return deliveries.stream().map(d -> Map.<String, Object>of(
                "id", d.getId().toString(),
                "subject", d.getMessage().length() > 30 ? d.getMessage().substring(0, 30) + "..." : d.getMessage(),
                "channels", "SMS • Email",
                "audience", d.getRecipient(),
                "timestamp", d.getCreatedAt().toString(),
                "status", d.getStatus()
        )).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getArchivedFeeds() {
        return List.of(
                Map.of("id", "1", "title", "Heritage Gala 2026 Itinerary", "summary", "The complete schedule for our annual heritage celebrations has been finalized.", "timeAgo", "3 Days Ago", "iconType", "calendar"),
                Map.of("id", "2", "title", "Fee Structure Revision Q4", "summary", "Please find the updated fee schedule for the upcoming quarter as approved by the board.", "timeAgo", "1 Week Ago", "iconType", "payment"),
                Map.of("id", "3", "title", "Health & Safety Protocol Update", "summary", "In line with ministry guidelines, we are enhancing our wellness protocols across campus.", "timeAgo", "2 Weeks Ago", "iconType", "info")
        );
    }
}
