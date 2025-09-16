export interface FhirResource {
  resourceType: string;
  id?: string;
}

export interface ValueSetExpansion extends FhirResource {
  resourceType: "ValueSet";
  url?: string;
  expansion: {
    total: number;
    offset: number;
    contains: ValueSetContains[];
  };
}

export interface ValueSetContains {
  system: string;
  code: string;
  display: string;
  designation?: Array<{
    language: string;
    value: string;
  }>;
}

export interface CodeSystemLookup extends FhirResource {
  resourceType: "Parameters";
  parameter: FhirParameter[];
}

export interface FhirParameter {
  name: string;
  valueString?: string;
  valueCoding?: FhirCoding;
  part?: FhirParameter[];
}

export interface FhirCoding {
  system: string;
  code: string;
  display?: string;
  version?: string;
}

export interface ConceptMapTranslate extends FhirResource {
  resourceType: "Parameters";
  parameter: Array<{
    name: "result" | "match";
    valueString?: string;
    part?: Array<{
      name: "equivalence" | "concept" | "comment";
      valueString?: string;
      valueCoding?: FhirCoding;
    }>;
  }>;
}

export interface TranslationMatch {
  equivalence: "equivalent" | "equal" | "wider" | "subsumes" | "narrower" | "specializes" | "inexact" | "unmatched" | "disjoint" | "relatedto";
  concept: FhirCoding;
  comment?: string;
  provenance?: {
    author?: string;
    version?: string;
    lastReviewed?: string;
    reviewRequired?: boolean;
  };
}

export interface FhirCondition extends FhirResource {
  resourceType: "Condition";
  subject: {
    reference: string;
    display?: string;
  };
  code: FhirCodeableConcept;
  clinicalStatus?: FhirCodeableConcept;
  verificationStatus?: FhirCodeableConcept;
  recordedDate?: string;
}

export interface FhirCodeableConcept {
  coding: FhirCoding[];
  text?: string;
}

export interface SystemInfo {
  service: string;
  version: string;
  namaste: {
    version: string;
    systemUri: string;
  };
  icd: {
    icdBaseUrl: string;
    apiVersion: string;
    lastSync: number;
  };
  timestamp: number;
}

// API Request/Response Types
export interface SearchRequest {
  filter?: string;
  count?: number;
  offset?: number;
  url?: string;
}

export interface LookupRequest {
  system: string;
  code: string;
  version?: string;
}

export interface TranslateRequest {
  system: string;
  code: string;
  targetSystem?: string;
  version?: string;
}

export interface ConditionListRequest {
  patient?: string;
  _count?: number;
  _offset?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

// Component Props
export interface SearchBoxProps {
  onSelect: (item: ValueSetContains) => void;
  placeholder?: string;
  debounceMs?: number;
  maxResults?: number;
  autoFocus?: boolean;
}

export interface TermDetailsProps {
  system: string;
  code: string;
  onTranslate?: () => void;
  onSave?: () => void;
}

export interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceCoding: FhirCoding;
  onSave: (primary: FhirCoding, secondary?: FhirCoding) => void;
}

export interface ConditionListProps {
  patientId?: string;
  onEdit?: (condition: FhirCondition) => void;
  onDelete?: (id: string) => void;
}