package com.healthcare.fhir.dto;

import com.opencsv.bean.CsvBindByName;

public class CodeCsvRow {
    @CsvBindByName(column = "system")
    private String system;

    @CsvBindByName(column = "code")
    private String code;

    @CsvBindByName(column = "display")
    private String display;

    @CsvBindByName(column = "definition")
    private String definition;

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

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    @Override
    public String toString() {
        return "CodeCsvRow{system='" + system + "', code='" + code + "', display='" + display + "'}";
    }
}
