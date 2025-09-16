
// UploadService.java
package com.healthcare.fhir.service;

import com.healthcare.fhir.dto.CodeCsvRow;
import com.healthcare.fhir.dto.ConceptMapCsvRow;
import com.healthcare.fhir.entity.CodeSystemEntry;
import com.healthcare.fhir.entity.ConceptMapEntry;
import com.healthcare.fhir.entity.Equivalence;
import com.healthcare.fhir.repository.CodeSystemEntryRepository;
import com.healthcare.fhir.repository.ConceptMapEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UploadService {

    private static final Logger logger = LoggerFactory.getLogger(UploadService.class);

    @Value("${namaste.version}")
    private String namasteVersion;

    @Autowired
    private CodeSystemEntryRepository codeSystemRepository;

    @Autowired
    private ConceptMapEntryRepository conceptMapRepository;

    public int upsertCodes(List<CodeCsvRow> rows) {
        int processed = 0;

        for (CodeCsvRow row : rows) {
            try {
                Optional<CodeSystemEntry> existingOpt = codeSystemRepository.findBySystemUriAndCode(
                    row.getSystem(), row.getCode());

                CodeSystemEntry entry;
                if (existingOpt.isPresent()) {
                    entry = existingOpt.get();
                } else {
                    entry = new CodeSystemEntry();
                    entry.setSystemUri(row.getSystem());
                    entry.setCode(row.getCode());
                }

                entry.setDisplay(row.getDisplay());
                entry.setDefinition(row.getDefinition());
                entry.setVersion(namasteVersion);

                codeSystemRepository.save(entry);
                processed++;

            } catch (Exception e) {
                logger.error("Error processing code row: {}", row, e);
            }
        }

        logger.info("Processed {} out of {} code entries", processed, rows.size());
        return processed;
    }

    public int upsertConceptMaps(List<ConceptMapCsvRow> rows) {
        int processed = 0;

        for (ConceptMapCsvRow row : rows) {
            try {
                Optional<ConceptMapEntry> existingOpt = conceptMapRepository.findBySourceSystemAndSourceCodeAndTargetSystem(
                    row.getSourceSystem(), row.getSourceCode(), row.getTargetSystem());

                ConceptMapEntry entry;
                if (existingOpt.isPresent()) {
                    entry = existingOpt.get();
                } else {
                    entry = new ConceptMapEntry();
                    entry.setSourceSystem(row.getSourceSystem());
                    entry.setSourceCode(row.getSourceCode());
                    entry.setTargetSystem(row.getTargetSystem());
                }

                entry.setTargetCodeOrUri(row.getTargetCode());
                entry.setEquivalence(Equivalence.valueOf(row.getEquivalence().toUpperCase()));
                entry.setComment(row.getComment());
                entry.setProvenance("CSV Upload");
                entry.setVersion(namasteVersion);

                conceptMapRepository.save(entry);
                processed++;

            } catch (Exception e) {
                logger.error("Error processing concept map row: {}", row, e);
            }
        }

        logger.info("Processed {} out of {} concept map entries", processed, rows.size());
        return processed;
    }

    public long getCodeCount() {
        return codeSystemRepository.count();
    }

    public long getConceptMapCount() {
        return conceptMapRepository.count();
    }
}