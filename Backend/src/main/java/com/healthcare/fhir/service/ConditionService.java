package com.healthcare.fhir.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.fhir.dto.FhirCodeableConcept;
import com.healthcare.fhir.dto.FhirCondition;
import com.healthcare.fhir.dto.FhirReference;
import com.healthcare.fhir.entity.ConditionRecord;
import com.healthcare.fhir.repository.ConditionRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConditionService {

    private static final Logger logger = LoggerFactory.getLogger(ConditionService.class);

    @Autowired
    private ConditionRecordRepository conditionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public FhirCondition saveCondition(FhirCondition condition, String createdBy) {
        try {
            ConditionRecord record = new ConditionRecord();
            record.setPatientId(condition.getSubject().getReference());
            record.setCodings(objectMapper.writeValueAsString(condition.getCode()));
            record.setCreatedBy(createdBy);

            ConditionRecord saved = conditionRepository.save(record);
            condition.setId(saved.getId().toString());

            logger.info("Condition saved with ID: {} for patient: {}", saved.getId(), record.getPatientId());
            return condition;
        } catch (JsonProcessingException e) {
            logger.error("Error serializing condition codings", e);
            throw new RuntimeException("Failed to save condition", e);
        }
    }

    public Page<FhirCondition> getConditions(String patientId, Pageable pageable) {
        Page<ConditionRecord> records;

        if (patientId != null && !patientId.trim().isEmpty()) {
            List<ConditionRecord> patientRecords = conditionRepository.findByPatientId(patientId);
            records = new PageImpl<>(patientRecords, pageable, patientRecords.size());
        } else {
            records = conditionRepository.findAll(pageable);
        }

        List<FhirCondition> conditions = records.getContent().stream()
                .map(this::convertToFhirCondition)
                .collect(Collectors.toList());

        return new PageImpl<>(conditions, pageable, records.getTotalElements());
    }

    public FhirCondition getConditionById(Long id) {
        Optional<ConditionRecord> recordOpt = conditionRepository.findById(id);
        return recordOpt.map(this::convertToFhirCondition).orElse(null);
    }

    private FhirCondition convertToFhirCondition(ConditionRecord record) {
        try {
            FhirCondition condition = new FhirCondition();
            condition.setId(record.getId().toString());
            condition.setResourceType("Condition");

            // Deserialize codings
            condition.setCode(objectMapper.readValue(record.getCodings(), FhirCodeableConcept.class));

            // Set subject reference
            FhirReference subject = new FhirReference();
            subject.setReference(record.getPatientId());
            condition.setSubject(subject);

            return condition;
        } catch (JsonProcessingException e) {
            logger.error("Error deserializing condition codings for record ID: {}", record.getId(), e);
            return null;
        }
    }
}
