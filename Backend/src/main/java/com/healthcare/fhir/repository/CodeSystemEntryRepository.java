
// CodeSystemEntryRepository.java - FIXED IMPORTS
package com.healthcare.fhir.repository;

import com.healthcare.fhir.entity.CodeSystemEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeSystemEntryRepository extends JpaRepository<CodeSystemEntry, Long> {
    Optional<CodeSystemEntry> findBySystemUriAndCode(String systemUri, String code);

    List<CodeSystemEntry> findBySystemUri(String systemUri);

    @Query("SELECT c FROM CodeSystemEntry c WHERE c.systemUri = :systemUri AND " +
            "(LOWER(c.code) LIKE LOWER(CONCAT('%', :filter, '%')) OR " +
            "LOWER(c.display) LIKE LOWER(CONCAT('%', :filter, '%')))")
    Page<CodeSystemEntry> findBySystemUriAndFilter(@Param("systemUri") String systemUri,
                                                   @Param("filter") String filter,
                                                   Pageable pageable);

    @Query("SELECT c FROM CodeSystemEntry c WHERE " +
            "LOWER(c.code) LIKE LOWER(CONCAT('%', :filter, '%')) OR " +
            "LOWER(c.display) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<CodeSystemEntry> findByFilter(@Param("filter") String filter, Pageable pageable);
}
