package com.healthcare.fhir.dto;

import com.healthcare.fhir.dto.FhirValueSetExpansion;

public class FhirValueSet {
    private String resourceType;
    private String url;
    private FhirValueSetExpansion expansion;

    // Getters and setters
    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public FhirValueSetExpansion getExpansion() {
        return expansion;
    }

    public void setExpansion(FhirValueSetExpansion expansion) {
        this.expansion = expansion;
    }
}
