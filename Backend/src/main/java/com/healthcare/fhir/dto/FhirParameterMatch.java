package com.healthcare.fhir.dto;

public class FhirParameterMatch {
    private String equivalence;
    private FhirConcept concept;
    private String comment;

    // Getters and setters
    public String getEquivalence() {
        return equivalence;
    }

    public void setEquivalence(String equivalence) {
        this.equivalence = equivalence;
    }

    public FhirConcept getConcept() {
        return concept;
    }

    public void setConcept(FhirConcept concept) {
        this.concept = concept;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
