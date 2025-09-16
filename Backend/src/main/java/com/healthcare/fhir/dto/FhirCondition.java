package com.healthcare.fhir.dto;


public class FhirCondition {
    private String id;
    private String resourceType = "Condition";
    private FhirCodeableConcept code;
    private FhirReference subject;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    
    public FhirCodeableConcept getCode() { return code; }
    public void setCode(FhirCodeableConcept code) { this.code = code; }
    
    public FhirReference getSubject() { return subject; }
    public void setSubject(FhirReference subject) { this.subject = subject; }
}

