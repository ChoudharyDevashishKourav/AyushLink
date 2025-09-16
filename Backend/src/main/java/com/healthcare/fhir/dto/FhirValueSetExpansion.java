package com.healthcare.fhir.dto;

import java.util.List;

public class FhirValueSetExpansion {
    private int total;
    private int offset;
    private List<FhirValueSetContains> contains;

    // Getters and setters
    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public List<FhirValueSetContains> getContains() {
        return contains;
    }

    public void setContains(List<FhirValueSetContains> contains) {
        this.contains = contains;
    }
}
