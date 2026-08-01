package com.drakalabs.schoolmngsys.shared.error;

/**
 * Thrown when a requested resource cannot be found.
 * Maps to HTTP 404 with the RFC 7807 {@code not-found} type.
 *
 * <p>Usage:
 * <pre>
 * throw new ResourceNotFoundException("Student", studentId);
 * </pre>
 */
public class ResourceNotFoundException extends RuntimeException {

    private final String resourceType;
    private final Object resourceId;

    public ResourceNotFoundException(String resourceType, Object resourceId) {
        super(resourceType + " not found with id: " + resourceId);
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public Object getResourceId() {
        return resourceId;
    }
}
