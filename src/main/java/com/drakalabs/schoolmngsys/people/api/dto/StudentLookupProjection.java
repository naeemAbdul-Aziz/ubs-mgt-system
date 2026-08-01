package com.drakalabs.schoolmngsys.people.api.dto;

import java.util.UUID;

public interface StudentLookupProjection {
    UUID getId();
    String getFirstName();
    String getLastName();
    String getCurrentClassName();
    String getStudentNumber();
}
