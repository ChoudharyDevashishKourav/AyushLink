package com.healthcare.fhir.dto;

import java.util.List;

public class FhirParameters {
    private String resourceType;
    private List<FhirParameter> parameter;

    // Getters and setters
    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public List<FhirParameter> getParameter() {
        return parameter;
    }

    public void setParameter(List<FhirParameter> parameter) {
        this.parameter = parameter;
    }
}
