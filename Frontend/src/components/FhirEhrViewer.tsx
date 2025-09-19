import React from "react";
import { User, Calendar, Activity, FileText } from "lucide-react";

interface FhirBundle {
  resourceType: string;
  type: string;
  entry: Array<{
    resource: any;
    request: {
      method: string;
      url: string;
    };
  }>;
}

interface Props {
  bundle: FhirBundle;
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const PatientDetails: React.FC<{ patient: any }> = ({ patient }) => {
  if (!patient) return null;
  const name = patient.name?.[0];
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200 mb-6 hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-blue-800">Patient Details</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Name</span>
            <span className="text-lg font-semibold text-blue-900">{name ? `${name.given?.join(" ")} ${name.family}` : "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Gender</span>
            <span className="text-blue-800 capitalize">{patient.gender || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Birth Date</span>
            <span className="text-blue-800">{formatDate(patient.birthDate)}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Identifier</span>
            <span className="text-blue-800 font-mono text-sm">{patient.identifier?.[0]?.value || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Phone</span>
            <span className="text-blue-800">{patient.telecom?.find((t: any) => t.system === "phone")?.value || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EncounterDetails: React.FC<{ encounter: any }> = ({ encounter }) => {
  if (!encounter) return null;
  const typeDisplay = encounter.type?.[0]?.coding?.[0]?.display || "-";
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-200 mb-4 hover:shadow-md hover:border-blue-300 hover:scale-[1.005] transition-all duration-300 ease-in-out group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-blue-800 group-hover:text-blue-900 transition-colors duration-300">Encounter</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-600">Status:</span>
            <span className="text-blue-800 font-medium capitalize">{encounter.status || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-600">Class:</span>
            <span className="text-blue-800">{encounter.class?.display || encounter.class?.code || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-600">Type:</span>
            <span className="text-blue-800">{typeDisplay}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600">Period:</span>
            <span className="text-blue-800 text-sm">{formatDate(encounter.period?.start)} to {formatDate(encounter.period?.end)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600">Service Provider:</span>
            <span className="text-blue-800 text-sm">{encounter.serviceProvider?.reference || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConditionDetails: React.FC<{ condition: any }> = ({ condition }) => {
  if (!condition) return null;
  const clinicalStatus = condition.clinicalStatus?.coding?.[0]?.code || "-";
  const category = condition.category?.[0]?.coding?.[0]?.code || "-";
  const system = condition.code?.coding?.[0]?.system || "-";
  const codeDisplay = condition.code?.coding?.[0]?.display || "-";
  const codeDisplay_n = condition.code?.coding?.[0]?.code || "-";
  const system1 = condition.code?.coding?.[1]?.system || null;
  const codeDisplay1 = condition.code?.coding?.[1]?.display || null;
  const codeDisplay_n1 = condition.code?.coding?.[1]?.code || null;
  
  const isDualCoded = system1 !== null;
  
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border mb-4 hover:shadow-lg hover:scale-[1.005] transition-all duration-300 ease-in-out group ${
      isDualCoded ? 'border-green-300 bg-gradient-to-br from-white to-green-50' : 'border-blue-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
          isDualCoded ? 'bg-green-600' : 'bg-blue-400'
        }`}>
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className={`text-xl font-semibold transition-colors duration-300 ${
            isDualCoded ? 'text-green-800' : 'text-blue-800'
          }`}>Condition</h3>
          {isDualCoded && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full animate-pulse">
              Dual Coded
            </span>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-600">Clinical Status:</span>
            <span className="text-blue-800 font-medium capitalize">{clinicalStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-600">Category:</span>
            <span className="text-blue-800 capitalize">{category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-600">Onset:</span>
            <span className="text-blue-800 text-sm">{formatDate(condition.onsetDateTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-blue-600">Recorded:</span>
            <span className="text-blue-800 text-sm">{formatDate(condition.recordedDate)}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Primary Coding System */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-300">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {system.includes('namaste') ? 'NAMASTE Code' : 'Primary Code'}
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">Code:</span>
                <span className="text-blue-800 font-mono font-medium">{codeDisplay_n}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Display:</span>
                <span className="text-blue-800 font-medium">{codeDisplay}</span>
              </div>
              <div className="text-xs text-blue-500 break-all mt-2">
                <span className="font-medium">System:</span> {system}
              </div>
            </div>
          </div>
          
          {/* Secondary Coding System (ICD-11) */}
          {system1 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover:bg-green-100 transition-colors duration-300 animate-fadeIn">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {system1.includes('icd') ? 'ICD-11 Code' : 'Secondary Code'}
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Code:</span>
                  <span className="text-green-800 font-mono font-medium">{codeDisplay_n1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Display:</span>
                  <span className="text-green-800 font-medium">{codeDisplay1}</span>
                </div>
                <div className="text-xs text-green-500 break-all mt-2">
                  <span className="font-medium">System:</span> {system1}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const FhirEhrViewer: React.FC<Props> = ({ bundle }) => {
  if (!bundle || bundle.resourceType !== "Bundle") {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Invalid FHIR Bundle
        </div>
      </div>
    );
  }

  const patient = bundle.entry?.find((e) => e.resource?.resourceType === "Patient")?.resource;
  const encounters = bundle.entry?.filter((e) => e.resource?.resourceType === "Encounter").map((e) => e.resource) || [];
  const conditions = bundle.entry?.filter((e) => e.resource?.resourceType === "Condition").map((e) => e.resource) || [];

  return (
    <div className="bg-blue-25 p-6 font-sans text-blue-900 min-h-full">
      <PatientDetails patient={patient} />
      
      {encounters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Encounters
          </h2>
          <div className="space-y-4">
            {encounters.map((enc) => (
              <EncounterDetails key={enc.id} encounter={enc} />
            ))}
          </div>
        </div>
      )}
      
      {conditions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            Conditions
          </h2>
          <div className="space-y-4">
            {conditions.map((cond) => (
              <ConditionDetails key={cond.id} condition={cond} />
            ))}
          </div>
        </div>
      )}
      
      {encounters.length === 0 && conditions.length === 0 && (
        <div className="text-center py-12 text-blue-600">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No medical data found in this bundle.</p>
        </div>
      )}
    </div>
  );
};

export default FhirEhrViewer;