// FhirTerminologyController.java
package com.healthcare.fhir.controller;

import com.healthcare.fhir.dto.FhirParameter;
import com.healthcare.fhir.service.TerminologyService;
import com.healthcare.fhir.service.TranslationService;
import com.healthcare.fhir.service.*;
import com.healthcare.fhir.service.AuditService;
import com.healthcare.fhir.dto.TranslateRequest;
import com.healthcare.fhir.dto.FhirValueSet;
import com.healthcare.fhir.dto.FhirParameters;
import com.healthcare.fhir.security.UserPrincipal;
import com.healthcare.fhir.entity.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
// Fixed FhirTerminologyController.java - Translation endpoints

@RestController
@RequestMapping("/fhir")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FhirTerminologyController {

    private static final Logger logger = LoggerFactory.getLogger(FhirTerminologyController.class);

    @Autowired
    private TerminologyService terminologyService;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private AuditService auditService;

    // CORRECT: POST mapping for $translate
    @PostMapping("/ConceptMap/$translate")
    public ResponseEntity<FhirParameters> translateConcept(
            @RequestBody TranslateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        logger.info("ConceptMap $translate request - system: {}, code: {}",
                request.getSystem(), request.getCode());

        try {
            FhirParameters result = translationService.translateConcept(request);

            // Record translation attempt in audit log
            if (currentUser != null) {
//                auditService.recordTranslation(
//                        request.getSystem(),
//                        request.getCode(),
//                        result,
//                        currentUser.getId()
//                );
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Translation failed for {}:{}", request.getSystem(), request.getCode(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Translation failed: " + e.getMessage()));
        }
    }

    // OPTIONAL: GET mapping for simple translation (non-FHIR compliant but convenient)
    @GetMapping("/ConceptMap/$translate")
    public ResponseEntity<FhirParameters> translateConceptGet(
            @RequestParam String system,
            @RequestParam String code,
            @RequestParam(required = false) String targetSystem,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Convert GET parameters to POST request body
        TranslateRequest request = new TranslateRequest();
        request.setSystem(system);
        request.setCode(code);
        request.setTargetSystem(targetSystem);

        return translateConcept(request, currentUser);
    }

    // Other endpoints remain the same...
    @GetMapping("/ValueSet/$expand")
    public ResponseEntity<FhirValueSet> expandValueSet(
            @RequestParam(required = false) String url,
            @RequestParam(required = false) String filter,
            @RequestParam(defaultValue = "10") int count,
            @RequestParam(defaultValue = "0") int offset) {

        logger.info("ValueSet $expand request - filter: {}, count: {}, offset: {}", filter, count, offset);

        FhirValueSet result = terminologyService.expandValueSet(url, filter, count, offset);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/CodeSystem/$lookup")
    public ResponseEntity<FhirParameters> lookupCode(
            @RequestParam String system,
            @RequestParam String code,
            @RequestParam(required = false) String version) {

        logger.info("CodeSystem $lookup request - system: {}, code: {}, version: {}", system, code, version);

        FhirParameters result = terminologyService.lookupCode(system, code, version);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private FhirParameters createErrorResponse(String message) {
        FhirParameters errorResponse = new FhirParameters();
        errorResponse.setResourceType("Parameters");

        List<FhirParameter> params = new ArrayList<>();
        params.add(new FhirParameter("name", "result", "false"));
        params.add(new FhirParameter("name", "message", message));

        errorResponse.setParameter(params);
        return errorResponse;
    }
}