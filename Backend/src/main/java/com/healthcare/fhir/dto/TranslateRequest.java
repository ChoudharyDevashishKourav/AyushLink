package com.healthcare.fhir.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
// Make sure your TranslateRequest DTO exists
@JsonIgnoreProperties(ignoreUnknown = true)
public class TranslateRequest {
    private String system;
    private String code;
    private String targetSystem;
    private String version;

    // Constructors
    public TranslateRequest() {}

    public TranslateRequest(String system, String code, String targetSystem) {
        this.system = system;
        this.code = code;
        this.targetSystem = targetSystem;
    }

    // Getters and setters
    public String getSystem() { return system; }
    public void setSystem(String system) { this.system = system; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTargetSystem() { return targetSystem; }
    public void setTargetSystem(String targetSystem) { this.targetSystem = targetSystem; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    @Override
    public String toString() {
        return "TranslateRequest{" +
                "system='" + system + '\'' +
                ", code='" + code + '\'' +
                ", targetSystem='" + targetSystem + '\'' +
                ", version='" + version + '\'' +
                '}';
    }
}