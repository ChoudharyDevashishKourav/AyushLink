// TerminologyService.java
package com.healthcare.fhir.service;

import com.healthcare.fhir.dto.*;
import com.healthcare.fhir.entity.CodeSystemEntry;
import com.healthcare.fhir.repository.CodeSystemEntryRepository;
import com.healthcare.fhir.entity.ConceptMapEntry;
import com.healthcare.fhir.entity.Equivalence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import com.healthcare.fhir.entity.CodeSystemEntry;
@Service
public class TerminologyService {

    private static final Logger logger = LoggerFactory.getLogger(TerminologyService.class);

    @Value("${namaste.system-uri}")
    private String namasteSystemUri;

    @Autowired
    private CodeSystemEntryRepository codeSystemRepository;

    @Autowired
    private IcdSyncService icdSyncService;

    public FhirValueSet expandValueSet(String url, String filter, int count, int offset) {
        Pageable pageable = PageRequest.of(offset / count, count);
        Page<CodeSystemEntry> entries;

        if (filter != null && !filter.trim().isEmpty()) {
            if (url != null && !url.trim().isEmpty()) {
                entries = codeSystemRepository.findBySystemUriAndFilter(url, filter, pageable);
            } else {
                entries = codeSystemRepository.findByFilter(filter, pageable);
            }
        } else {
            if (url != null && !url.trim().isEmpty()) {
                entries = codeSystemRepository.findAll(pageable);
            } else {
                entries = codeSystemRepository.findAll(pageable);
            }
        }

        FhirValueSet valueSet = new FhirValueSet();
        valueSet.setResourceType("ValueSet");
        valueSet.setUrl(url != null ? url : namasteSystemUri);

        FhirValueSetExpansion expansion = new FhirValueSetExpansion();
        expansion.setTotal((int) entries.getTotalElements());
        expansion.setOffset(offset);

        List<FhirValueSetContains> contains = new ArrayList<>();
        for (CodeSystemEntry entry : entries.getContent()) {
            FhirValueSetContains contain = new FhirValueSetContains();
            contain.setSystem(entry.getSystemUri());
            contain.setCode(entry.getCode());
            contain.setDisplay(entry.getDisplay());
            contains.add(contain);
        }
        expansion.setContains(contains);
        valueSet.setExpansion(expansion);

        // Augment with ICD search results if filter is provided
        if (filter != null && !filter.trim().isEmpty() && contains.size() < count) {
            augmentWithIcdResults(expansion, filter, count - contains.size());
        }

        logger.info("Expanded ValueSet with {} entries for filter: {}", contains.size(), filter);
        return valueSet;
    }

    private void augmentWithIcdResults(FhirValueSetExpansion expansion, String filter, int remainingCount) {
        try {
            var icdResults = icdSyncService.searchEntities(filter);
            int addedCount = 0;

            for (var icdResult : icdResults) {
                if (addedCount >= remainingCount) break;

                FhirValueSetContains contain = new FhirValueSetContains();
                contain.setSystem("http://id.who.int/icd/release/11/mms");
                contain.setCode(icdResult.get("theCode") != null ? icdResult.get("theCode").asText() : "");
                contain.setDisplay(icdResult.get("title") != null ? icdResult.get("title").asText() : "");

                expansion.getContains().add(contain);
                addedCount++;
            }

            if (addedCount > 0) {
                logger.info("Added {} ICD results to ValueSet expansion", addedCount);
            }
        } catch (Exception e) {
            logger.warn("Failed to augment with ICD results", e);
        }
    }

    public FhirParameters lookupCode(String system, String code, String version) {
        Optional<CodeSystemEntry> entryOpt = codeSystemRepository.findBySystemUriAndCode(system, code);

        if (entryOpt.isPresent()) {
            CodeSystemEntry entry = entryOpt.get();
            FhirParameters parameters = new FhirParameters();
            parameters.setResourceType("Parameters");

            List<FhirParameter> paramList = new ArrayList<>();

            paramList.add(new FhirParameter("name", "display", entry.getDisplay()));
            if (entry.getDefinition() != null) {
                paramList.add(new FhirParameter("name", "definition", entry.getDefinition()));
            }
            paramList.add(new FhirParameter("name", "version", entry.getVersion()));

            parameters.setParameter(paramList);

            logger.info("Successfully looked up code: {} in system: {}", code, system);
            return parameters;
        }

        // Try ICD lookup if not found locally
        if (system.contains("who.int/icd")) {
            return lookupIcdCode(code);
        }

        logger.warn("Code not found: {} in system: {}", code, system);
        return null;
    }

    private FhirParameters lookupIcdCode(String entityId) {
        try {
            var icdEntity = icdSyncService.resolveEntity(entityId);
            if (icdEntity != null) {
                FhirParameters parameters = new FhirParameters();
                parameters.setResourceType("Parameters");

                List<FhirParameter> paramList = new ArrayList<>();

                String display = icdEntity.get("title") != null ? icdEntity.get("title").asText() : "";
                paramList.add(new FhirParameter("name", "display", display));

                String definition = icdEntity.get("definition") != null ? icdEntity.get("definition").asText() : "";
                if (!definition.isEmpty()) {
                    paramList.add(new FhirParameter("name", "definition", definition));
                }

                parameters.setParameter(paramList);

                logger.info("Successfully looked up ICD entity: {}", entityId);
                return parameters;
            }
        } catch (Exception e) {
            logger.error("Error looking up ICD entity: {}", entityId, e);
        }

        return null;
    }
}
