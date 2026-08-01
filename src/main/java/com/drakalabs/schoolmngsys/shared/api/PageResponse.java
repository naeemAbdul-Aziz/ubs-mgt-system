package com.drakalabs.schoolmngsys.shared.api;

import java.util.List;

/**
 * Standard paginated response envelope for collection endpoints.
 *
 * <p>All paginated API responses use this shape:
 * <pre>
 * {
 *   "content":       [...],
 *   "page":          0,
 *   "size":          20,
 *   "totalElements": 142,
 *   "totalPages":    8
 * }
 * </pre>
 *
 * @param <T> The type of content items in this page
 * @see <a href="docs/10-api-standards.md#1-general-conventions">API Standards §1 — Pagination</a>
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {

    /**
     * Builds a {@code PageResponse} from a Spring Data {@link org.springframework.data.domain.Page}.
     */
    public static <T> PageResponse<T> from(org.springframework.data.domain.Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
