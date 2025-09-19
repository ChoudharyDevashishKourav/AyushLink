// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/Layout';
import { SearchPage } from './pages/SearchPage';
import { ConditionsPage } from './pages/ConditionsPage';
import { AboutPage } from './pages/AboutPage';
import AuthManager from "./components/AuthManager";
import MicRecorder from "./components/MicRecorder"
import HomePage from "./components/HomePage"
import FhirEhrViewer from './components/FhirEhrViewer';
import Speak from './pages/Speak';
import Encounter from './pages/Encounter';
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          return status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('JWTS_TOKEN');
  const ehr = {
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "patient-001",
        "identifier": [
          {
            "system": "https://abha.gov.in",
            "value": "99-8888-7777-6666"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Verma",
            "given": ["Anil", "Kumar"]
          }
        ],
        "gender": "male",
        "birthDate": "1978-06-22",
        "telecom": [
          {
            "system": "phone",
            "value": "+91-9123456789"
          }
        ]
      },
      "request": {
        "method": "PUT",
        "url": "Patient/patient-001"
      }
    },
    {
      "resource": {
        "resourceType": "Encounter",
        "id": "encounter-001",
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
          "reference": "Patient/patient-001"
        },
        "period": {
          "start": "2025-09-18T11:00:00Z",
          "end": "2025-09-18T11:45:00Z"
        },
        "serviceProvider": {
          "reference": "Organization/ayush-clinic-002"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Encounter/encounter-001"
      }
    },
    {
      "resource": {
        "resourceType": "Condition",
        "id": "condition-001",
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
          "reference": "Patient/patient-001"
        },
        "encounter": {
          "reference": "Encounter/encounter-001"
        },
        "onsetDateTime": "2025-09-11T00:00:00Z",
        "recordedDate": "2025-09-18T11:15:00Z"
      },
      "request": {
        "method": "PUT",
        "url": "Condition/condition-001"
      }
    }
  ]
}
  const transcript =
    'Patient Ramesh, male, 42 years. Complains of abdominal pain and acidity since 3 days. No fever. Phone 9876543210. Started yesterday evening, worsened at night.';

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {!isAuthenticated ? (
          // Show only auth page when not logged in
          <Routes>
            <Route path="/auth" element={<AuthManager />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        ) : (
          // Show main app with layout when logged in
          <Layout>
            <Routes>
              {/* <Route path="/home" element={<HomePage />} /> */}
              <Route path="*" element={<SearchPage />} /> {/* Default to home */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/conditions" element={<ConditionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/ehr" element={<FhirEhrViewer bundle={ehr} />} />
              <Route path="/speak" element={<Speak/>} />
              <Route path="/encounter" element={<Encounter/>} />
              
            </Routes>
          </Layout>
        )}
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
