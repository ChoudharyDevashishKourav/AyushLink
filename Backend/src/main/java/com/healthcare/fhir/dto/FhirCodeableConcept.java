package com.healthcare.fhir.dto;

import com.healthcare.fhir.dto.FhirConcept;

import java.util.List;

public class FhirCodeableConcept {
    private List<FhirConcept> coding;
    private String text;

    // Getters and setters
    public List<FhirConcept> getCoding() {
        return coding;
    }

    public void setCoding(List<FhirConcept> coding) {
        this.coding = coding;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
