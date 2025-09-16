package com.healthcare.fhir.dto;

public class FhirReference {
    private String reference;
    private String display;

    // Getters and setters
    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }
}
