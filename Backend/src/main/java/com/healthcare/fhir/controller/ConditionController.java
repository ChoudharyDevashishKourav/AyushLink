// ConditionController.java
package com.healthcare.fhir.controller;

import com.healthcare.fhir.dto.FhirCondition;
import com.healthcare.fhir.service.ConditionService;
import com.healthcare.fhir.security.UserPrincipal;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.healthcare.fhir.dto.FhirCondition;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fhir")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ConditionController {

    private static final Logger logger = LoggerFactory.getLogger(ConditionController.class);

    @Autowired
    private ConditionService conditionService;

    @PostMapping("/Condition")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FhirCondition> createCondition(
            @Valid @RequestBody FhirCondition condition,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        logger.info("Creating condition for patient: {}", condition.getSubject().getReference());

        FhirCondition savedCondition = conditionService.saveCondition(condition, currentUser.getUsername());
        return ResponseEntity.ok(savedCondition);
    }

    @GetMapping("/Condition")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FhirCondition>> getConditions(
            @RequestParam(required = false) String patient,
            Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Page<FhirCondition> conditions = conditionService.getConditions(patient, pageable);
        return ResponseEntity.ok(conditions);
    }

    @GetMapping("/Condition/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FhirCondition> getCondition(@PathVariable Long id) {
        FhirCondition condition = conditionService.getConditionById(id);
        if (condition != null) {
            return ResponseEntity.ok(condition);
        }
        return ResponseEntity.notFound().build();
    }
}
