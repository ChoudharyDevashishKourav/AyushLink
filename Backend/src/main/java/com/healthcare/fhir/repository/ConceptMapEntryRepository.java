package com.healthcare.fhir.repository;

import com.healthcare.fhir.entity.ConceptMapEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConceptMapEntryRepository extends JpaRepository<ConceptMapEntry, Long> {
    List<ConceptMapEntry> findBySourceSystemAndSourceCode(String sourceSystem, String sourceCode);

    Optional<ConceptMapEntry> findBySourceSystemAndSourceCodeAndTargetSystem(
            String sourceSystem, String sourceCode, String targetSystem);

    List<ConceptMapEntry> findBySourceSystem(String sourceSystem);

    List<ConceptMapEntry> findByTargetSystem(String targetSystem);
}
