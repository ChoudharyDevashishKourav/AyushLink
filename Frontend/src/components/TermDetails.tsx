// src/components/TermDetails.tsx
import React from 'react';
import { ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { useCodeLookup } from '../hooks/api/useCodeLookup';
import type { TermDetailsProps } from '../types/fhir';

export const TermDetails: React.FC<TermDetailsProps> = ({
  system,
  code,
  onTranslate,
  onSave
}) => {
  const { data, isLoading, error } = useCodeLookup(system, code);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
        <div className="text-red-600">
          <h3 className="font-semibold text-lg mb-2">Failed to load details</h3>
          <p className="text-sm">Unable to retrieve information for {code}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getParameterValue = (name: string): string | undefined => {
    return data?.parameter.find(p => p.name === name)?.valueString;
  };

  const display = getParameterValue('display');
  const definition = getParameterValue('definition');
  const version = getParameterValue('version');

  const isNamaste = system.includes('namaste');
  const systemName = isNamaste ? 'NAMASTE' : system.includes('icd') ? 'ICD-11' : 'Unknown';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {display || 'Unknown Term'}
            </h3>
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
              isNamaste 
                ? 'bg-namaste-100 text-namaste-800' 
                : 'bg-icd-100 text-icd-800'
            }`}>
              {systemName}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center space-x-4">
              <span><span className="font-medium">Code:</span> {code}</span>
              {version && <span><span className="font-medium">Version:</span> {version}</span>}
            </div>
            <div className="text-xs text-gray-500 break-all">{system}</div>
          </div>
        </div>
        
        <div className="flex space-x-3 ml-6">
          {onTranslate && (
            <button
              onClick={onTranslate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Translate
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {definition && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide">Definition</h4>
          <p className="text-gray-700 leading-relaxed">
            {definition}
          </p>
        </div>
      )}

      {!definition && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            No definition available for this code. This may be normal for certain code systems.
          </p>
        </div>
      )}
    </div>
  );
};