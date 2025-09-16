package com.healthcare.fhir.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.fhir.dto.FhirParameters;
import com.healthcare.fhir.entity.TranslationHistory;
import com.healthcare.fhir.repository.TranslationHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);

    @Autowired
    private TranslationHistoryRepository historyRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public void recordTranslation(String sourceSystem, String sourceCode, FhirParameters result, Long userId) {
        try {
            TranslationHistory history = new TranslationHistory();
            history.setSourceSystem(sourceSystem);
            history.setSourceCode(sourceCode);
            history.setResult(objectMapper.writeValueAsString(result));
            history.setUserId(userId);

            historyRepository.save(history);
            logger.debug("Recorded translation history for {}:{}", sourceSystem, sourceCode);
        } catch (JsonProcessingException e) {
            logger.error("Error recording translation history", e);
        }
    }

    public Page<TranslationHistory> getTranslationHistory(Pageable pageable) {
        return historyRepository.findAll(pageable);
    }

    public long getTranslationCount() {
        return historyRepository.count();
    }
}
