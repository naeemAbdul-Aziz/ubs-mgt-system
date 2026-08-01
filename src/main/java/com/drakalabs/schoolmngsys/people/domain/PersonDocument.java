package com.drakalabs.schoolmngsys.people.domain;

import com.drakalabs.schoolmngsys.shared.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Generic document attachment for people (students/staff).
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "person_documents")
public class PersonDocument extends BaseEntity {

    /** Logical FK to either students or staff */
    @Column(name = "person_id", nullable = false)
    private UUID personId;

    /** 'STUDENT', 'STAFF' */
    @Column(name = "person_type", nullable = false, length = 50)
    private String personType;

    /** 'BIRTH_CERTIFICATE', 'ID', 'QUALIFICATION' */
    @Column(name = "document_type", nullable = false, length = 50)
    private String documentType;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "file_data", nullable = false)
    private byte[] fileData;
}
