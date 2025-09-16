
// ConceptMapEntry.java
package com.healthcare.fhir.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.envers.Audited;
import java.time.LocalDateTime;

@Entity
@Table(name = "concept_map_entries")
@Audited
public class ConceptMapEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String sourceSystem;

    @NotBlank
    @Column(nullable = false)
    private String sourceCode;

    @NotBlank
    @Column(nullable = false)
    private String targetSystem;

    @NotBlank
    @Column(nullable = false)
    private String targetCodeOrUri;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Equivalence equivalence;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(columnDefinition = "TEXT")
    private String provenance;

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

    public String getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(String sourceSystem) { this.sourceSystem = sourceSystem; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getTargetSystem() { return targetSystem; }
    public void setTargetSystem(String targetSystem) { this.targetSystem = targetSystem; }

    public String getTargetCodeOrUri() { return targetCodeOrUri; }
    public void setTargetCodeOrUri(String targetCodeOrUri) { this.targetCodeOrUri = targetCodeOrUri; }

    public Equivalence getEquivalence() { return equivalence; }
    public void setEquivalence(Equivalence equivalence) { this.equivalence = equivalence; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getProvenance() { return provenance; }
    public void setProvenance(String provenance) { this.provenance = provenance; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
