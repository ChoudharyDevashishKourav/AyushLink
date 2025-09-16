
// TranslationHistoryRepository.java
package com.healthcare.fhir.repository;

import com.healthcare.fhir.entity.TranslationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TranslationHistoryRepository extends JpaRepository<TranslationHistory, Long> {
    Page<TranslationHistory> findByUserId(Long userId, Pageable pageable);

    List<TranslationHistory> findBySourceSystemAndSourceCode(String sourceSystem, String sourceCode);

    Page<TranslationHistory> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
}