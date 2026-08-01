package com.drakalabs.schoolmngsys.people.repository;

import com.drakalabs.schoolmngsys.people.domain.PersonDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PersonDocumentRepository extends JpaRepository<PersonDocument, UUID> {

    List<PersonDocument> findByPersonIdAndPersonType(UUID personId, String personType);
}
