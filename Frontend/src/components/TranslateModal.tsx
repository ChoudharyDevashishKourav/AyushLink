import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/api/useTranslation';
import type { TranslateModalProps, TranslationMatch, FhirCoding } from '../types/fhir';

export const TranslateModal: React.FC<TranslateModalProps> = ({
  isOpen,
  onClose,
  sourceCoding,
  onSave
}) => {
  const [selectedMatch, setSelectedMatch] = useState<TranslationMatch | null>(null);
  const translateMutation = useTranslation();

  useEffect(() => {
    if (isOpen && sourceCoding.system && sourceCoding.code) {
      setSelectedMatch(null);
      translateMutation.mutate({
        system: sourceCoding.system,
        code: sourceCoding.code,
        targetSystem: "http://id.who.int/icd/release/11/mms"
      });
    }
  }, [isOpen, sourceCoding]);

  const parseTranslationResponse = (data: any): TranslationMatch[] => {
    const matches: TranslationMatch[] = [];
    const matchParams = data?.parameter?.filter((p: any) => p.name === 'match') || [];

    matchParams.forEach((matchParam: any) => {
      const parts = matchParam.part || [];
      const equivalence = parts.find((p: any) => p.name === 'equivalence')?.valueString;
      const concept = parts.find((p: any) => p.name === 'concept')?.valueCoding;
      const comment = parts.find((p: any) => p.name === 'comment')?.valueString;

      if (equivalence && concept) {
        matches.push({
          equivalence: equivalence as any,
          concept,
          comment,
          provenance: {
            reviewRequired: equivalence === 'relatedto' || equivalence === 'inexact'
          }
        });
      }
    });

    return matches;
  };

  const matches = translateMutation.data ? parseTranslationResponse(translateMutation.data) : [];

  const getEquivalenceBadge = (equivalence: string) => {
    const configs = {
      equivalent: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: CheckCircle,
        label: 'Equivalent' 
      },
      equal: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: CheckCircle,
        label: 'Equal' 
      },
      wider: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: AlertTriangle,
        label: 'Wider' 
      },
      narrower: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: AlertTriangle,
        label: 'Narrower' 
      },
      relatedto: { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        icon: AlertTriangle,
        label: 'Related' 
      },
      inexact: { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        icon: AlertTriangle,
        label: 'Inexact' 
      },
      unmatched: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        icon: X,
        label: 'Unmatched' 
      }
    };

    const config = configs[equivalence as keyof typeof configs] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: AlertTriangle,
      label: equivalence
    };

    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </div>
    );
  };

  const handleSaveSelected = () => {
    if (selectedMatch) {
      onSave(sourceCoding, selectedMatch.concept);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Translate Medical Code
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Find equivalent codes in other terminology systems
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Source Code */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Source Code</h3>
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-medium text-blue-900">{sourceCoding.display}</p>
                <p className="text-sm text-blue-700">
                  {sourceCoding.code} • {sourceCoding.system.split('/').pop()}
                </p>
              </div>
              <span className="px-2 py-1 bg-namaste-100 text-namaste-800 text-xs rounded-full font-medium">
                NAMASTE
              </span>
            </div>
          </div>

          {/* Loading State */}
          {translateMutation.isPending && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Translating code...</p>
                <p className="text-sm text-gray-500 mt-1">Searching ICD-11 terminology</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {translateMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-medium">Translation failed</p>
              </div>
              <p className="text-red-700 text-sm mt-1">
                Unable to translate the selected code. Please check your connection and try again.
              </p>
            </div>
          )}

          {/* Translation Results */}
          {matches.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <ArrowRight className="w-4 h-4 mr-2 text-icd-600" />
                ICD-11 Translation Results
              </h3>
              
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedMatch === match
                        ? 'border-icd-500 bg-icd-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {match.concept.display}
                          </h4>
                          {getEquivalenceBadge(match.equivalence)}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Code:</span> {match.concept.code}
                        </div>
                        
                        {match.comment && (
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Notes:</span> {match.comment}
                          </div>
                        )}
                        
                        {match.provenance?.reviewRequired && (
                          <div className="flex items-center space-x-2 text-orange-600 text-sm mt-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">Review Required</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <span className="px-2 py-1 bg-icd-100 text-icd-800 text-xs rounded-full font-medium">
                          ICD-11
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {matches.length === 0 && !translateMutation.isPending && !translateMutation.error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium mb-2">No translations found</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                The source code may not have equivalent terms in ICD-11, or the mapping may not be available in the current system.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSelected}
            disabled={!selectedMatch}
            className="px-4 py-2 bg-icd-600 text-white rounded-lg hover:bg-icd-700 focus:ring-2 focus:ring-icd-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Translation
          </button>
        </div>
      </div>
    </div>
  );
};