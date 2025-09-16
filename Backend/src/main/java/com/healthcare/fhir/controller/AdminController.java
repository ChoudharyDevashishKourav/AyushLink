// AdminController.java
package com.healthcare.fhir.controller;

import com.healthcare.fhir.dto.ApiResponse;
import com.healthcare.fhir.dto.CodeCsvRow;
import com.healthcare.fhir.dto.ConceptMapCsvRow;
import com.healthcare.fhir.service.UploadService;
import com.healthcare.fhir.service.AuditService;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Map;

import com.healthcare.fhir.dto.ApiResponse;
import com.healthcare.fhir.dto.CodeCsvRow;
import com.healthcare.fhir.dto.ConceptMapCsvRow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UploadService uploadService;

    @Autowired
    private AuditService auditService;

    @PostMapping("/upload/codes")
    public ResponseEntity<?> uploadCodes(@RequestParam("file") MultipartFile file) {
        try {
            logger.info("Uploading codes from file: {}", file.getOriginalFilename());

            try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                CsvToBean<CodeCsvRow> csvToBean = new CsvToBeanBuilder<CodeCsvRow>(reader)
                        .withType(CodeCsvRow.class)
                        .withIgnoreLeadingWhiteSpace(true)
                        .build();

                List<CodeCsvRow> rows = csvToBean.parse();
                int imported = uploadService.upsertCodes(rows);

                logger.info("Successfully imported {} codes from {}", imported, file.getOriginalFilename());
                return ResponseEntity.ok(Map.of("imported", imported, "filename", file.getOriginalFilename()));
            }
        } catch (Exception e) {
            logger.error("Error uploading codes from file: {}", file.getOriginalFilename(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to upload codes: " + e.getMessage()));
        }
    }

    @PostMapping("/upload/conceptmaps")
    public ResponseEntity<?> uploadConceptMaps(@RequestParam("file") MultipartFile file) {
        try {
            logger.info("Uploading concept maps from file: {}", file.getOriginalFilename());

            try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                CsvToBean<ConceptMapCsvRow> csvToBean = new CsvToBeanBuilder<ConceptMapCsvRow>(reader)
                        .withType(ConceptMapCsvRow.class)
                        .withIgnoreLeadingWhiteSpace(true)
                        .build();

                List<ConceptMapCsvRow> rows = csvToBean.parse();
                int imported = uploadService.upsertConceptMaps(rows);

                logger.info("Successfully imported {} concept maps from {}", imported, file.getOriginalFilename());
                return ResponseEntity.ok(Map.of("imported", imported, "filename", file.getOriginalFilename()));
            }
        } catch (Exception e) {
            logger.error("Error uploading concept maps from file: {}", file.getOriginalFilename(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to upload concept maps: " + e.getMessage()));
        }
    }

    @GetMapping("/history/translations")
    public ResponseEntity<?> getTranslationHistory(Pageable pageable) {
        return ResponseEntity.ok(auditService.getTranslationHistory(pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        Map<String, Object> stats = Map.of(
                "totalCodes", uploadService.getCodeCount(),
                "totalConceptMaps", uploadService.getConceptMapCount(),
                "totalTranslations", auditService.getTranslationCount()
        );
        return ResponseEntity.ok(stats);
    }
}
