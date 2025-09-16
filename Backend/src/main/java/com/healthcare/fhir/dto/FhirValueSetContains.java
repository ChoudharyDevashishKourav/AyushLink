package com.healthcare.fhir.dto;

public class FhirValueSetContains {
    private String system;
    private String code;
    private String display;

    // Getters and setters
    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }
}
