// ConditionRecordRepository.java
package com.healthcare.fhir.repository;

import com.healthcare.fhir.entity.ConditionRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConditionRecordRepository extends JpaRepository<ConditionRecord, Long> {
    List<ConditionRecord> findByPatientId(String patientId);

    Page<ConditionRecord> findByCreatedBy(String createdBy, Pageable pageable);
}
