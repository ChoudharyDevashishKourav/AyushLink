package com.healthcare.fhir.dto;

import java.util.List;

public class FhirParameter {
    private String name;
    private String valueString;
    private FhirConcept valueCoding;
    private List<FhirParameter> part;

    public FhirParameter() {
    }

    public FhirParameter(String nameType, String name, String value) {
        this.name = name;
        this.valueString = value;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValueString() {
        return valueString;
    }

    public void setValueString(String valueString) {
        this.valueString = valueString;
    }

    public FhirConcept getValueCoding() {
        return valueCoding;
    }

    public void setValueCoding(FhirConcept valueCoding) {
        this.valueCoding = valueCoding;
    }

    public List<FhirParameter> getPart() {
        return part;
    }

    public void setPart(List<FhirParameter> part) {
        this.part = part;
    }
}
