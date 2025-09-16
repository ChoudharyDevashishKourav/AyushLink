
// TranslationService.java
package com.healthcare.fhir.service;

import com.healthcare.fhir.dto.*;
import com.healthcare.fhir.entity.ConceptMapEntry;
import com.healthcare.fhir.entity.Equivalence;
import com.healthcare.fhir.repository.ConceptMapEntryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class TranslationService {

    private static final Logger logger = LoggerFactory.getLogger(TranslationService.class);

    @Autowired
    private ConceptMapEntryRepository conceptMapRepository;

    @Autowired
    private IcdSyncService icdSyncService;

    public FhirParameters translateConcept(TranslateRequest request) {
        FhirParameters parameters = new FhirParameters();
        parameters.setResourceType("Parameters");

        List<FhirParameter> paramList = new ArrayList<>();

        // First try exact match from local concept maps
        List<ConceptMapEntry> exactMatches = conceptMapRepository.findBySourceSystemAndSourceCode(
                request.getSystem(), request.getCode());

        boolean found = false;
        List<FhirParameterMatch> matches = new ArrayList<>();

        for (ConceptMapEntry entry : exactMatches) {
            if (request.getTargetSystem() == null || entry.getTargetSystem().equals(request.getTargetSystem())) {
                FhirParameterMatch match = new FhirParameterMatch();
                match.setEquivalence(entry.getEquivalence().name().toLowerCase());

                FhirConcept concept = new FhirConcept();
                concept.setSystem(entry.getTargetSystem());
                concept.setCode(entry.getTargetCodeOrUri());
                match.setConcept(concept);

                if (entry.getComment() != null) {
                    match.setComment(entry.getComment());
                }

                matches.add(match);
                found = true;
            }
        }

        // If no exact matches and target is ICD, try ICD search
        if (!found && (request.getTargetSystem() == null || request.getTargetSystem().contains("who.int/icd"))) {
            matches.addAll(findIcdCandidates(request));
        }

        paramList.add(new FhirParameter("name", "result", found ? "true" : "false"));

        if (!matches.isEmpty()) {
            FhirParameter matchParam = new FhirParameter();
            matchParam.setName("match");
            matchParam.setPart(convertMatchesToParts(matches));
            paramList.add(matchParam);
        }

        parameters.setParameter(paramList);

        logger.info("Translation request processed - system: {}, code: {}, found: {}, matches: {}",
                request.getSystem(), request.getCode(), found, matches.size());

        return parameters;
    }

    private List<FhirParameterMatch> findIcdCandidates(TranslateRequest request) {
        List<FhirParameterMatch> candidates = new ArrayList<>();

        try {
            // Search ICD for potential matches using the source code as search term
            List<JsonNode> searchResults = icdSyncService.searchEntities(request.getCode());

            for (JsonNode result : searchResults.stream().limit(5).toList()) {
                FhirParameterMatch match = new FhirParameterMatch();
                match.setEquivalence("relatedto"); // Mark as related, requiring review

                FhirConcept concept = new FhirConcept();
                concept.setSystem("http://id.who.int/icd/release/11/mms");
                concept.setCode(result.get("theCode") != null ? result.get("theCode").asText() : "");
                concept.setDisplay(result.get("title") != null ? result.get("title").asText() : "");
                match.setConcept(concept);

                match.setComment("Candidate match from ICD search - requires review");
                candidates.add(match);
            }

            logger.info("Found {} ICD candidate matches for code: {}", candidates.size(), request.getCode());
        } catch (Exception e) {
            logger.error("Error finding ICD candidates for code: {}", request.getCode(), e);
        }

        return candidates;
    }

    private List<FhirParameter> convertMatchesToParts(List<FhirParameterMatch> matches) {
        List<FhirParameter> parts = new ArrayList<>();

        for (FhirParameterMatch match : matches) {
            parts.add(new FhirParameter("name", "equivalence", match.getEquivalence()));

            FhirParameter conceptParam = new FhirParameter();
            conceptParam.setName("concept");
            conceptParam.setValueCoding(match.getConcept());
            parts.add(conceptParam);

            if (match.getComment() != null) {
                parts.add(new FhirParameter("name", "comment", match.getComment()));
            }
        }

        return parts;
    }
}
