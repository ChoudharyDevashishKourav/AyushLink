import React from "react";

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
  return date.toLocaleString();
}

const PatientDetails: React.FC<{ patient: any }> = ({ patient }) => {
  if (!patient) return null;
  const name = patient.name?.[0];
  return (
    <div className="bg-blue-900 p-4 rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-blue-300 mb-2">Patient Details</h2>
      <p><span className="font-semibold">Name:</span> {name ? `${name.given?.join(" ")} ${name.family}` : "-"}</p>
      <p><span className="font-semibold">Gender:</span> {patient.gender || "-"}</p>
      <p><span className="font-semibold">Birth Date:</span> {formatDate(patient.birthDate)}</p>
      <p><span className="font-semibold">Identifier:</span> {patient.identifier?.[0]?.value || "-"}</p>
      <p><span className="font-semibold">Phone:</span> {patient.telecom?.find((t: any) => t.system === "phone")?.value || "-"}</p>
    </div>
  );
};

const EncounterDetails: React.FC<{ encounter: any }> = ({ encounter }) => {
  if (!encounter) return null;
  const typeDisplay = encounter.type?.[0]?.coding?.[0]?.display || "-";
  return (
    <div className="bg-blue-800 p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-xl font-semibold text-blue-200 mb-1">Encounter</h3>
      <p><span className="font-semibold">Status:</span> {encounter.status || "-"}</p>
      <p><span className="font-semibold">Class:</span> {encounter.class?.display || encounter.class?.code || "-"}</p>
      <p><span className="font-semibold">Type:</span> {typeDisplay}</p>
      <p><span className="font-semibold">Period:</span> {formatDate(encounter.period?.start)} to {formatDate(encounter.period?.end)}</p>
      <p><span className="font-semibold">Service Provider:</span> {encounter.serviceProvider?.reference || "-"}</p>
    </div>
  );
};

const ConditionDetails: React.FC<{ condition: any }> = ({ condition }) => {
  if (!condition) return null;
  const clinicalStatus = condition.clinicalStatus?.coding?.[0]?.code || "-";
  const category = condition.category?.[0]?.coding?.[0]?.code || "-";
  const codeDisplay = condition.code?.coding?.[0]?.display || "-";
  const codeDisplay_n = condition.code?.coding?.[0]?.code || "-";
  return (
    <div className="bg-blue-700 p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-xl font-semibold text-blue-100 mb-1">Condition</h3>
      <p><span className="font-semibold">Clinical Status:</span> {clinicalStatus}</p>
      <p><span className="font-semibold">Category:</span> {category}</p>
      <p><span className="font-semibold">Code-Name:</span> {codeDisplay}</p>
      <p><span className="font-semibold">Code:</span> {codeDisplay_n}</p>
      <p><span className="font-semibold">Onset:</span> {formatDate(condition.onsetDateTime)}</p>
      <p><span className="font-semibold">Recorded Date:</span> {formatDate(condition.recordedDate)}</p>
    </div>
  );
};

export const FhirEhrViewer: React.FC<Props> = ({ bundle }) => {
  if (!bundle || bundle.resourceType !== "Bundle") {
    return <div className="text-red-500">Invalid FHIR Bundle</div>;
  }

  const patient = bundle.entry?.find((e) => e.resource?.resourceType === "Patient")?.resource;
  const encounters = bundle.entry?.filter((e) => e.resource?.resourceType === "Encounter").map((e) => e.resource) || [];
  const conditions = bundle.entry?.filter((e) => e.resource?.resourceType === "Condition").map((e) => e.resource) || [];

  return (
    <div className="bg-blue-950 min-h-screen p-8 font-sans text-blue-100">
      <PatientDetails patient={patient} />
      <div>
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Encounters</h2>
        {encounters.length === 0 ? <p>No encounters found.</p> : encounters.map((enc) => <EncounterDetails key={enc.id} encounter={enc} />)}
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Conditions</h2>
        {conditions.length === 0 ? <p>No conditions found.</p> : conditions.map((cond) => <ConditionDetails key={cond.id} condition={cond} />)}
      </div>
    </div>
  );
};

export default FhirEhrViewer;
