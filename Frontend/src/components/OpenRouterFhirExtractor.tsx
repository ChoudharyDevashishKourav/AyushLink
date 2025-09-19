// src/components/OpenRouterFhirExtractor.tsx
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  transcript: string;
  model?: string;
  onResult?: (data: Record<string, unknown>) => void; // receive parsed JSON
  autoRun?: boolean; // default true: call on mount & when transcript changes
};

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'; // change as needed

// Build the long system+user prompt with the transcript injected
const buildPrompt = (transcript: string) => {
  return `You are an AI medical coding assistant integrated with an **Electronic Health Record (EHR)** system. Your job is to listen to a doctor’s transcript, extract structured patient details, and fill a **FHIR R4 Bundle JSON**.

### Context
- The FHIR Bundle represents a **transaction** of medical data in an EHR.
- Each Bundle here will always contain **Patient, Encounter, and Condition**.
- All fields must follow the given JSON schema strictly.
- Only fill values that are **explicitly stated** in the transcript or NAMASTE code list.
- Do not invent or assume information. Leave unknown fields blank ("").

### Extraction Goals
From the transcript, extract:
- **Patient demographics** → age, gender, birthdate (if calculable).
- **Contact details** → phone if mentioned.
- **Encounter** → visit timing, if present.
- **Condition** → choose the correct **NAMASTE code** and **ICD-11 code** from the provided list.
- **Timing** → onset date, recorded date, encounter period.

### NAMASTE Code Mapping
- Use "system": "https://ayush.gov.in/CodeSystem/namaste" for NAMASTE coding.
- Also include ICD-11 mapping: "system": "http://id.who.int/icd11/mms".
- Both must appear under "code.coding".

### Output Rules
- Return **only JSON**. No explanations.
- Follow the schema exactly as given below.
- If a field is unknown, leave it as an empty string ("").

---
### Transcript
"${transcript}"

### NAMASTE Code List
NAMASTE_name,NAMASTE_code,ICD11_name,ICD11_code
Grahani,ASU-GI-001,Indigestion disorder,SM3B
Atisara,ASU-GI-002,Diarrhoea disorder,SM37
Ajirna,ASU-GI-003,Dyspepsia disorder,SM39
Amlapitta,ASU-GI-004,Hyperacidity disorder,SM3A
Gulma,ASU-GI-005,Abdominal lumps disorder,SM3K
Udara,ASU-GI-006,Abdominal distension disorder,SM31
Vibandha,ASU-GI-007,Constipation disorder,SM34
Vamana,ASU-GI-008,Vomiting disorder,SM3L
Sula,ASU-GI-009,Abdominal pain disorder,SM33
Hridvikara,ASU-GI-010,Haematemesis disorder,SM30
Swasa,ASU-RESP-001,Breathing difficulty disorder,SL40
Kasa,ASU-RESP-002,Cough disorder,SL41
Hikka,ASU-RESP-003,Hiccup disorder,SL42
Ksavathu,ASU-RESP-004,Sneezing disorder,SL43
Kanthya,ASU-RESP-005,Throat disorder,SL44
Bhrama,ASU-NEU-001,Vertigo disorder,SK00
Shiroruk,ASU-NEU-002,Headache disorder,SK01
Vatavyadhi,ASU-NEU-003,Nervous system disorder,SK02
Unmada,ASU-NEU-004,Mental disorder,SQ00
Apasmara,ASU-NEU-005,Epilepsy disorder,SQ01
Murccha,ASU-NEU-006,Fainting disorder,SK03
Timira,ASU-NEU-007,Vision disorder,SK60
Karnanada,ASU-NEU-008,Tinnitus disorder,SK70
Jwara,ASU-SYS-001,Fever disorder,SP50
Kamala,ASU-SYS-002,Jaundice disorder,SP51
Prameha,ASU-SYS-003,Diabetes disorder,SP52
Meha,ASU-SYS-004,Urinary disorder,SM80
Raktapitta,ASU-SYS-005,Bleeding disorder,SP53
Panduroga,ASU-SYS-006,Anemia disorder,SP54
Sthaulya,ASU-SYS-007,Obesity disorder,SP55
Karshya,ASU-SYS-008,Emaciation disorder,SP56
Kustha,ASU-SKIN-001,Skin disorder,SN40
Dadru,ASU-SKIN-002,Ringworm disorder,SN41
Kandu,ASU-SKIN-003,Itching disorder,SN42
Kotha,ASU-SKIN-004,Urticaria disorder,SN43
Vrana,ASU-SKIN-005,Ulcer disorder,SN44
Visphota,ASU-SKIN-006,Pustule disorder,SN45
Sandhigata Vata,ASU-JOINT-001,Joint disorder,SP00
Gridhrasi,ASU-JOINT-002,Sciatica disorder,SP01
Vatarakta,ASU-JOINT-003,Gout disorder,SP02
Amavata,ASU-JOINT-004,Rheumatism disorder,SP03
Katigraha,ASU-JOINT-005,Back pain disorder,SP04
Hridroga,ASU-HEART-001,Heart disorder,SL60
Hridgada,ASU-HEART-002,Heart blockage disorder,SL61
Hridrava,ASU-HEART-003,Heart fluid disorder,SL62
Yonivyapat,ASU-GYNE-001,Female reproductive disorder,SM90
Rajahkshaya,ASU-GYNE-002,Menstrual disorder,SM91
Vandhyatva,ASU-GYNE-003,Infertility disorder,SM92
Garbhasrava,ASU-GYNE-004,Abortion disorder,SM93
Klaibya,ASU-MALE-001,Impotence disorder,SM85
Shukrameha,ASU-MALE-002,Spermatorrhea disorder,SM86
Netraroga,ASU-EYE-001,Eye disorder,SK60
Adhimantha,ASU-EYE-002,Glaucoma disorder,SK61
Abhishyanda,ASU-EYE-003,Conjunctivitis disorder,SK62
Linganasa,ASU-EYE-004,Cataract disorder,SK63
Agnimandya,ASU-DIGEST-001,Digestive impairment disorder,SM39
Amagrahani,ASU-DIGEST-002,Indigestion with ama disorder,SM3B
Amajvara,ASU-DIGEST-003,Indigestion fever disorder,SP50
Balagraha,ASU-CHILD-001,Childhood disorder,SR00
Balakshaya,ASU-CHILD-002,Child wasting disorder,SR01
Balatisara,ASU-CHILD-003,Child diarrhea disorder,SR02
Balajvara,ASU-CHILD-004,Child fever disorder,SR03
Krimi,ASU-MISC-001,Parasitic disorder,SQ50
Visa,ASU-MISC-002,Poisoning disorder,SQ51
Madatyaya,ASU-MISC-003,Alcoholism disorder,SQ02
Swapnabhava,ASU-MISC-004,Sleep disorder,SQ03
Shirahsula,ASU-PAIN-001,Headache disorder,SK01
Vaksthahsula,ASU-PAIN-002,Chest pain disorder,SL63
Ajal Kirkrippu,SSU-NEU-001,Vertigo disorder,SK00
Gunmam,SSU-GI-001,Abdominal lumps disorder,SM3K
Eraippu,SSU-RESP-001,Cough disorder,SL41
Suram,SSU-SYS-001,Fever disorder,SP50
Kaamaalai,SSU-SYS-002,Jaundice disorder,SP51
Sori,SSU-SKIN-001,Skin disorder,SN40
Moolam,SSU-GI-002,Piles disorder,SM35
Kaasam,SSU-RESP-002,Cough disorder,SL41
Kirani,SSU-GI-003,Diarrhoea disorder,SM37
Thimir Noi,SSU-EYE-001,Vision disorder,SK63
Keel Noi,SSU-JOINT-001,Joint disorder,SP00
Peeli Noi,SSU-GI-004,Liver disorder,SP51
Moorchchai,SSU-NEU-002,Fainting disorder,SK03
Isivu,SSU-SKIN-002,Itching disorder,SN42
Sobai,SSU-GI-005,Abdominal distension disorder,SM31
Iraippu,SSU-RESP-003,Breathing difficulty disorder,SL40
Neerkodum,SSU-SYS-003,Diabetes disorder,SP52
Thamaraga Noi,SSU-HEART-001,Heart disorder,SL60
Nasal blockage,SSU-GI-006,Nasal disorder,SK70
Kuruthi Azhal,SSU-SYS-004,Hypertension disorder,SL60
Ulai Maanthai,SSU-GI-007,Dyspepsia disorder,SM39
Suvai Inmai,SSU-GI-008,Taste loss disorder,SM39
Mukkuttam,SSU-SYS-005,Humoral disorder,SP55
Ammai,SSU-CHILD-001,Childhood disorder,SR00
Elippu,SSU-RESP-004,Tuberculosis disorder,SL42
Sadra-o-Dwar,UNU-NEU-001,Vertigo disorder,SK00
Humma,UNU-SYS-001,Fever disorder,SP50
Ziabetus Shakri,UNU-SYS-002,Diabetes disorder,SP52
Ishaal,UNU-GI-001,Diarrhoea disorder,SM37
Qabz,UNU-GI-002,Constipation disorder,SM34
Hazma,UNU-GI-003,Dyspepsia disorder,SM39
Waja-ul-Mafasil,UNU-JOINT-001,Joint disorder,SP00
Sual,UNU-RESP-001,Cough disorder,SL41
Zeeq-un-Nafas,UNU-RESP-002,Breathing difficulty disorder,SL40
Amraz-e-Qalb,UNU-HEART-001,Heart disorder,SL60
Suda,UNU-NEU-002,Headache disorder,SK01
Amraz-e-Jild,UNU-SKIN-001,Skin disorder,SN40
Amraz-e-Niswan,UNU-GYNE-001,Female reproductive disorder,SM90
Zaaf-e-Baah,UNU-MALE-001,Impotence disorder,SM85
Yarqan,UNU-SYS-003,Jaundice disorder,SP51

---
### Strict JSON Schema (do not add/remove fields)
{ "resourceType": "Bundle", "type": "transaction", "entry": [ { "resource": { "resourceType": "Patient", "id": "patient-123", "name": [{"use": "official","family": "","given": [""]}], "gender": "", "birthDate": "", "telecom": [{"system": "phone","value": ""}] } }, { "resource": { "resourceType": "Encounter", "id": "encounter-456", "status": "finished", "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "AMB"}, "subject": {"reference": "Patient/patient-123"}, "period": {"start": "","end": ""} } }, { "resource": { "resourceType": "Condition", "id": "condition-789", "clinicalStatus": {"coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical","code": "active"}]}, "code": { "coding": [ { "system": "https://ayush.gov.in/CodeSystem/namaste", "code": "", "display": "" }, { "system": "http://id.who.int/icd11/mms", "code": "", "display": "" } ], "text": "" }, "subject": {"reference": "Patient/patient-123"}, "encounter": {"reference": "Encounter/encounter-456"}, "onsetDateTime": "", "recordedDate": "" } } ] }`;
};

const OpenRouterFhirExtractor: React.FC<Props> = ({
  transcript,
  model = DEFAULT_MODEL,
  onResult,
  autoRun = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;

  const body = useMemo(() => {
    const prompt = buildPrompt(transcript);
    // simple progress phases: 0 -> 30 (build), 30 -> 80 (fetch), 80 -> 100 (parse)
    return {
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Respond ONLY with valid JSON. No code fences. No explanations.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.0,
    };
  }, [transcript, model]);

  const run = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      if (!apiKey) throw new Error('Missing OpenRouter API key');
      setProgress(20);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          // OpenRouter attribution headers (recommended)
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FHIR Extractor',
        },
        body: JSON.stringify(body),
      });

      setProgress(60);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`OpenRouter error ${res.status}: ${text || res.statusText}`);
      }

      const json = await res.json();
      // OpenRouter OpenAI-compatible shape
      const content = json?.choices?.[0]?.message?.content;
      if (typeof content !== 'string') {
        throw new Error('Model did not return string content');
      }
      setProgress(85);

      // Attempt strict JSON parse
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        // If model wrapped JSON in code fences or text, try to extract the first {...} block
        const match = content.match(/\{[\s\S]*\}$/);
        if (!match) throw new Error('Failed to parse JSON from model output');
        parsed = JSON.parse(match[0]);
      }

      setResult(parsed);
      setProgress(100);
      onResult?.(parsed);
    } catch (e: any) {
      setError(e?.message || 'Request failed');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRun && transcript?.trim()) {
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, transcript, model]);

  // Minimal UI: only a tiny progress bar and error text; no visualization of data
  return (
    <div className="w-full">
      {loading && (
        <div className="mt-2 h-1 w-full bg-slate-200 rounded">
          <h2 className="mt-3 inline-flex items-center gap-2 text-lg font-medium text-slate-700 tracking-tight"> Extracting patient details... <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" /> </h2>
          <div
            className="h-1 bg-blue-600 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          />
        </div>
      )}
      {error && (
        <div className="mt-2 text-xs text-red-600">{error}</div>
      )}
    </div>
  );
};

export default OpenRouterFhirExtractor;
