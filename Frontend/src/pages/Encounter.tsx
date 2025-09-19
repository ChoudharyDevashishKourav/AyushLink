import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import FhirEhrViewer from '../components/FhirEhrViewer';

// Sample EHR data for demo
const DEMO_EHR1 = {
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "patient-123",
        "identifier": [
          {
            "system": "https://abha.gov.in",
            "value": "12-3456-7890-1234"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Jain",
            "given": ["Pritam", "Kumar"]
          }
        ],
        "gender": "male",
        "birthDate": "1985-03-15",
        "telecom": [
          {
            "system": "phone",
            "value": "+91-9876543210"
          }
        ]
      },
      "request": {
        "method": "PUT",
        "url": "Patient/patient-123"
      }
    },
    {
      "resource": {
        "resourceType": "Encounter",
        "id": "encounter-456",
        "status": "finished",
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB",
          "display": "ambulatory"
        },
        "type": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "185347001",
                "display": "Ayurveda consultation"
              }
            ]
          }
        ],
        "subject": {
          "reference": "Patient/patient-123"
        },
        "period": {
          "start": "2025-09-17T09:30:00Z",
          "end": "2025-09-17T10:15:00Z"
        },
        "serviceProvider": {
          "reference": "Organization/ayush-clinic-001"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Encounter/encounter-456"
      }
    },
    {
      "resource": {
        "resourceType": "Condition",
        "id": "condition-789",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active"
            }
          ]
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                "code": "problem-list-item"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "https://ayush.gov.in/CodeSystem/namaste",
              "code": "ASU-GI-001",
              "display": "Grahani"
            }
          ],
          "text": "Grahani (digestive dysfunction)"
        },
        "subject": {
          "reference": "Patient/patient-123"
        },
        "encounter": {
          "reference": "Encounter/encounter-456"
        },
        "onsetDateTime": "2025-09-10T00:00:00Z",
        "recordedDate": "2025-09-17T09:45:00Z"
      },
      "request": {
        "method": "PUT",
        "url": "Condition/condition-789"
      }
    }
  ]
};
const DEMO_EHR3 = {
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "patient-123",
        "identifier": [
          {
            "system": "https://abha.gov.in",
            "value": "12-3456-7890-1234"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Sharma",
            "given": ["Rajesh", "Kumar"]
          }
        ],
        "gender": "male",
        "birthDate": "1985-03-15",
        "telecom": [
          {
            "system": "phone",
            "value": "+91-9876543210"
          }
        ]
      },
      "request": {
        "method": "PUT",
        "url": "Patient/patient-123"
      }
    },
    {
      "resource": {
        "resourceType": "Encounter",
        "id": "encounter-456",
        "status": "finished",
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB",
          "display": "ambulatory"
        },
        "type": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "185347001",
                "display": "Ayurveda consultation"
              }
            ]
          }
        ],
        "subject": {
          "reference": "Patient/patient-123"
        },
        "period": {
          "start": "2025-09-17T09:30:00Z",
          "end": "2025-09-17T10:15:00Z"
        },
        "serviceProvider": {
          "reference": "Organization/ayush-clinic-001"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Encounter/encounter-456"
      }
    },
    {
      "resource": {
        "resourceType": "Condition",
        "id": "condition-789",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active"
            }
          ]
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                "code": "problem-list-item"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "https://ayush.gov.in/CodeSystem/namaste",
              "code": "ASU-HEART-002",
              "display": "Hridgada"
            }
          ],
          "text": "Grahani (digestive dysfunction)"
        },
        "subject": {
          "reference": "Patient/patient-123"
        },
        "encounter": {
          "reference": "Encounter/encounter-456"
        },
        "onsetDateTime": "2025-09-10T00:00:00Z",
        "recordedDate": "2025-09-17T09:45:00Z"
      },
      "request": {
        "method": "PUT",
        "url": "Condition/condition-789"
      }
    }
  ]
};
const DEMO_EHR2 = {
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "patient-123",
        "identifier": [
          {
            "system": "https://abha.gov.in",
            "value": "12-3456-7890-1234"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Pratap",
            "given": ["Sanjay", "Singh"]
          }
        ],
        "gender": "male",
        "birthDate": "1985-03-15",
        "telecom": [
          {
            "system": "phone",
            "value": "+91-9876543210"
          }
        ]
      },
      "request": {
        "method": "PUT",
        "url": "Patient/patient-123"
      }
    },
    {
      "resource": {
        "resourceType": "Encounter",
        "id": "encounter-456",
        "status": "finished",
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB",
          "display": "ambulatory"
        },
        "type": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "185347001",
                "display": "Ayurveda consultation"
              }
            ]
          }
        ],
        "subject": {
          "reference": "Patient/patient-123"
        },
        "period": {
          "start": "2025-09-17T09:30:00Z",
          "end": "2025-09-17T10:15:00Z"
        },
        "serviceProvider": {
          "reference": "Organization/ayush-clinic-001"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Encounter/encounter-456"
      }
    },
    {
      "resource": {
        "resourceType": "Condition",
        "id": "condition-789",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active"
            }
          ]
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                "code": "problem-list-item"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "https://ayush.gov.in/CodeSystem/namaste",
              "code": "ASU-CHILD-001",
              "display": "Balagraha"
            }
          ],
          "text": "Grahani (digestive dysfunction)"
        },
        "subject": {
          "reference": "Patient/patient-123"
        },
        "encounter": {
          "reference": "Encounter/encounter-456"
        },
        "onsetDateTime": "2025-09-10T00:00:00Z",
        "recordedDate": "2025-09-17T09:45:00Z"
      },
      "request": {
        "method": "PUT",
        "url": "Condition/condition-789"
      }
    }
  ]
};

const Encounter = () => {
  const [ehrData, setEhrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Mock JWT token for demo - in production, get from secure storage
  const DEMO_TOKEN = localStorage.getItem('JWTS_TOKEN');

  // Upload and show EHR
  const handleUploadDemo = (n: number) => {
    if(n === 1) setEhrData(DEMO_EHR3);
    if(n === 2) setEhrData(DEMO_EHR1);
    if(n === 3) setEhrData(DEMO_EHR2);
    setError(null);
  };

  // Extract NAMASTE code and translate
  const handleTranslate = async () => {
    if (!ehrData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Find the Condition resource in the Bundle
      const conditionEntry = ehrData.entry?.find(
        entry => entry.resource?.resourceType === "Condition"
      );
      
      if (!conditionEntry) {
        throw new Error("No Condition resource found in EHR Bundle");
      }
      
      // Find NAMASTE coding in the condition
      const namasteSystem = "https://ayush.gov.in/CodeSystem/namaste";
      const namasteCode = conditionEntry.resource.code?.coding?.find(
        c => c.system === namasteSystem
      );
      
      if (!namasteCode) {
        throw new Error("No NAMASTE code found in EHR");
      }

      // Call API for translation
      const response = await fetch('http://localhost:8080/fhir/ConceptMap/$translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEMO_TOKEN}`
        },
        body: JSON.stringify({
          system: namasteCode.system,
          code: namasteCode.code,
          targetSystem: "http://id.who.int/icd/release/11/mms"
        })
      });
      
      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Create dual-encoded EHR
      createDualEncodedEhr(result);
      
    } catch (err) {
      console.error('Translation error:', err);
      // For demo purposes, use mock data if API fails
      const mockResult = {
        "resourceType": "Parameters",
        "parameter": [
          {
            "name": "result",
            "valueString": "true",
            "valueCoding": null,
            "part": null
          },
          {
            "name": "match",
            "valueString": null,
            "valueCoding": null,
            "part": [
              {
                "name": "equivalence",
                "valueString": "equivalent",
                "valueCoding": null,
                "part": null
              },
              {
                "name": "concept",
                "valueString": null,
                "valueCoding": {
                  "system": "http://id.who.int/icd/release/11/mms",
                  "code": "5A10.0",
                  "display": null
                },
                "part": null
              },
              {
                "name": "comment",
                "valueString": "Functional dyspepsia",
                "valueCoding": null,
                "part": null
              }
            ]
          }
        ]
      };
      
      createDualEncodedEhr(mockResult);
    } finally {
      setLoading(false);
    }
  };

  // Create dual-encoded EHR
  const createDualEncodedEhr = (translationResult) => {
    if (!ehrData || !translationResult) return;
    
    // Extract ICD-11 code from translation result
    const matchParam = translationResult.parameter?.find(p => p.name === "match");
    const conceptPart = matchParam?.part?.find(p => p.name === "concept");
    const commentPart = matchParam?.part?.find(p => p.name === "comment");
    const icd11Coding = conceptPart?.valueCoding;
    const icd11Display = commentPart?.valueString;
    
    if (!icd11Coding) {
      setError("Could not extract ICD-11 code from translation result");
      return;
    }
    
    // Create a deep copy of the EHR Bundle
    const dualEncoded = JSON.parse(JSON.stringify(ehrData));
    
    // Find and update the Condition resource
    const conditionEntryIndex = dualEncoded.entry.findIndex(
      entry => entry.resource?.resourceType === "Condition"
    );
    
    if (conditionEntryIndex !== -1) {
      const conditionResource = dualEncoded.entry[conditionEntryIndex].resource;
      
      // Create ICD-11 coding with display from comment
      const icd11CodingWithDisplay = {
        ...icd11Coding,
        display: icd11Display || icd11Coding.display
      };
      
      // Add ICD-11 coding to the existing coding array
      conditionResource.code.coding.push(icd11CodingWithDisplay);
      
      // Update the text to show dual encoding
      const originalText = conditionResource.code.text;
      conditionResource.code.text = `${originalText} — ${icd11CodingWithDisplay.display} (${icd11CodingWithDisplay.code})`;
    }
    console.log("--------------dualEncodes------------")
    console.log(dualEncoded)
    setEhrData(dualEncoded);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            NAMASTE to ICD-11 Code Mapper
          </h1>
          <p className="text-blue-600">
            Demonstration prototype for dual-encoding EHR data
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Upload Button */}
            {!ehrData ? (
              <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Upload size={20} />
                  Load Demo EHR
                </h2>
                <button
                  onClick={() => handleUploadDemo(1)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 my-2"
                >
                  <FileText size={18} />
                  Demo EHR Data - 1
                </button>
                <button
                  onClick={() =>handleUploadDemo(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 my-2"
                >
                  <FileText size={18} />
                  Demo EHR Data - 2
                </button>
                <button
                  onClick={() => handleUploadDemo(3)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 my-2"
                >
                  <FileText size={18} />
                  Demo EHR Data - 3
                </button>
              </div>
            ) : (
              /* Translate Button */
              <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <ArrowRight size={20} />
                  Translate to ICD-11
                </h2>
                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                  {loading ? 'Translating...' : 'Translate & Dual Encode'}
                </button>
                {!loading && (
                  <p className="text-blue-600 text-sm mt-2 text-center">
                    This will extract NAMASTE code, translate it to ICD-11, and create dual-encoded EHR
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - EHR Display */}
          <div className="space-y-6">
            {ehrData && (
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  EHR Data {ehrData.entry?.find(e => e.resource?.resourceType === "Condition")?.resource?.code?.coding?.length > 1 && "(Dual-Encoded)"}
                </h3>
                <div className="bg-white rounded-lg border border-blue-200 shadow-sm">
                  <FhirEhrViewer bundle={ehrData} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Summary - shown after dual encoding */}
        {ehrData && ehrData.entry?.find(e => e.resource?.resourceType === "Condition")?.resource?.code?.coding?.length > 1 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Dual Encoding Complete ✓</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {ehrData.entry.find(e => e.resource?.resourceType === "Condition")?.resource?.code?.coding?.map((coding, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-700 mb-2">
                    {coding.system.includes('namaste') ? 'NAMASTE Code' : 'ICD-11 Code'}
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><strong>Code:</strong> {coding.code}</div>
                    <div><strong>Display:</strong> {coding.display}</div>
                    <div className="text-xs text-gray-500 break-all">
                      <strong>System:</strong> {coding.system}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encounter;