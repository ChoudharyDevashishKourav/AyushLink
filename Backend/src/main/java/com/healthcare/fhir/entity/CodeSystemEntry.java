
// CodeSystemEntry.java
package com.healthcare.fhir.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.envers.Audited;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_system_entries")
@Audited
public class CodeSystemEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String systemUri;

    @NotBlank
    @Column(nullable = false)
    private String code;

    @NotBlank
    @Column(nullable = false)
    private String display;

    @Column(columnDefinition = "TEXT")
    private String definition;

    @Column(columnDefinition = "JSONB")
    private String designations;

    @Column(nullable = false)
    private String version;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSystemUri() { return systemUri; }
    public void setSystemUri(String systemUri) { this.systemUri = systemUri; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDisplay() { return display; }
    public void setDisplay(String display) { this.display = display; }

    public String getDefinition() { return definition; }
    public void setDefinition(String definition) { this.definition = definition; }

    public String getDesignations() { return designations; }
    public void setDesignations(String designations) { this.designations = designations; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
