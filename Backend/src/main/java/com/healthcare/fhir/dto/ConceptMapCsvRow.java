package com.healthcare.fhir.dto;

import com.opencsv.bean.CsvBindByName;

public class ConceptMapCsvRow {
    @CsvBindByName(column = "sourceSystem")
    private String sourceSystem;

    @CsvBindByName(column = "sourceCode")
    private String sourceCode;

    @CsvBindByName(column = "targetSystem")
    private String targetSystem;

    @CsvBindByName(column = "targetCode")
    private String targetCode;

    @CsvBindByName(column = "equivalence")
    private String equivalence;

    @CsvBindByName(column = "comment")
    private String comment;

    // Getters and setters
    public String getSourceSystem() {
        return sourceSystem;
    }

    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String getTargetSystem() {
        return targetSystem;
    }

    public void setTargetSystem(String targetSystem) {
        this.targetSystem = targetSystem;
    }

    public String getTargetCode() {
        return targetCode;
    }

    public void setTargetCode(String targetCode) {
        this.targetCode = targetCode;
    }

    public String getEquivalence() {
        return equivalence;
    }

    public void setEquivalence(String equivalence) {
        this.equivalence = equivalence;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "ConceptMapCsvRow{sourceSystem='" + sourceSystem + "', sourceCode='" + sourceCode +
                "', targetSystem='" + targetSystem + "', targetCode='" + targetCode + "'}";
    }
}
