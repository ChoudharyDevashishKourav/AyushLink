import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { SearchBox } from '../components/SearchBox';
import { TermDetails } from '../components/TermDetails';
import { TranslateModal } from '../components/TranslateModal';
import { useCreateCondition } from '../hooks/api/useConditions';
import type { ValueSetContains, FhirCoding } from '../types/fhir';

export const SearchPage: React.FC = () => {

  const [selectedTerm, setSelectedTerm] = useState<ValueSetContains | null>(null);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [patientId, setPatientId] = useState('demo-patient-001');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const createConditionMutation = useCreateCondition();

  const handleTermSelect = (term: ValueSetContains) => {
    setSelectedTerm(term);
  };

  const handleTranslate = () => {
    if (selectedTerm) {
      setShowTranslateModal(true);
    }
  };

  const handleSaveTranslation = (primary: FhirCoding, secondary?: FhirCoding) => {
    const condition = {
      resourceType: 'Condition' as const,
      subject: {
        reference: `Patient/${patientId}`,
        display: `Patient ${patientId}`
      },
      code: {
        coding: secondary ? [primary, secondary] : [primary],
        text: primary.display
      },
      recordedDate: new Date().toISOString()
    };

    createConditionMutation.mutate(condition, {
      onSuccess: () => {
        setShowSuccessMessage(true);
        setShowTranslateModal(false);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      },
      onError: (error) => {
        console.error('Failed to save condition:', error);
        // You could add a toast notification here
      }
    });
  };

  const handleQuickSave = () => {
    if (!selectedTerm) return;

    const coding: FhirCoding = {
      system: selectedTerm.system,
      code: selectedTerm.code,
      display: selectedTerm.display
    };

    handleSaveTranslation(coding);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Terminology Search
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search NAMASTE and ICD-11 medical terminology, translate between systems, 
            and save dual-coded conditions for patients.
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Save className="w-5 h-5" />
              <span className="font-medium">Condition saved successfully!</span>
            </div>
          </div>
        )}

        {/* Patient ID Input */}
        {/* <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-gray-400" />
            <h2 className="font-medium text-gray-900">Patient Information</h2>
          </div>
          <div className="max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID
            </label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter patient ID"
            />
            <div className="mt-2 flex items-center space-x-2">
              {['demo-patient-001', 'demo-patient-002', 'demo-patient-003'].map(id => (
                <button
                  key={id}
                  onClick={() => setPatientId(id)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div> */}

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <SearchBox
            onSelect={handleTermSelect}
            placeholder="Search for medical conditions, symptoms, or procedures..."
            autoFocus
          />
        </div>

        {/* Term Details */}
        {selectedTerm && (
          <div className="mb-6">
            <TermDetails
              system={selectedTerm.system}
              code={selectedTerm.code}
              onTranslate={handleTranslate}
              onSave={handleQuickSave}
            />
          </div>
        )}

        {/* Translation Modal */}
        <TranslateModal
          isOpen={showTranslateModal}
          onClose={() => setShowTranslateModal(false)}
          sourceCoding={{
            system: selectedTerm?.system || '',
            code: selectedTerm?.code || '',
            display: selectedTerm?.display || ''
          }}
          onSave={handleSaveTranslation}
        />

        {/* Loading State for Save */}
        {createConditionMutation.isPending && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Saving condition...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
