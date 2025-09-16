import React from 'react';
import { FileText, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useConditions } from '../hooks/api/useConditions';
import type { ConditionListProps, FhirCondition, FhirCoding } from '../types/fhir';

export const ConditionList: React.FC<ConditionListProps> = ({
  patientId,
  onEdit,
  onDelete
}) => {
  const { data, isLoading, error, refetch } = useConditions(patientId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load conditions</h3>
        <p className="text-gray-600 mb-6">Please check your connection and try again</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const conditions = data?.content || [];

  if (conditions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conditions recorded</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {patientId 
            ? 'No medical conditions have been recorded for this patient yet.' 
            : 'Start by searching for medical terms and saving conditions for patients.'}
        </p>
      </div>
    );
  }

  const getPrimaryCoding = (condition: FhirCondition): FhirCoding => {
    return condition.code.coding.find(c => c.system.includes('namaste')) || condition.code.coding[0];
  };

  const getSecondaryCoding = (condition: FhirCondition): FhirCoding | undefined => {
    return condition.code.coding.find(c => c.system.includes('icd'));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Medical Conditions
            {patientId && <span className="text-gray-500 font-normal"> for Patient {patientId}</span>}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {data?.totalElements || 0} condition{(data?.totalElements || 0) !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {conditions.map((condition) => {
          const primary = getPrimaryCoding(condition);
          const secondary = getSecondaryCoding(condition);
          const patientRef = condition.subject.reference.replace('Patient/', '');

          return (
            <div key={condition.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-namaste-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-namaste-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {primary.display}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Code: {primary.code}</span>
                        <span className="px-2 py-1 bg-namaste-100 text-namaste-800 text-xs rounded-full font-medium">
                          NAMASTE
                        </span>
                      </div>
                    </div>
                  </div>

                  {secondary && (
                    <div className="mt-4 p-3 bg-icd-50 border border-icd-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-icd-800">ICD-11 Translation</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                          Equivalent
                        </span>
                      </div>
                      <div className="text-sm text-icd-700">
                        <span className="font-medium">{secondary.display}</span> ({secondary.code})
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Patient: {patientRef}</span>
                    <span>Recorded: {formatDate(condition.recordedDate)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(condition)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit condition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(condition.id!)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete condition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Page {(data.number || 0) + 1} of {data.totalPages}
            </span>
            {/* Add pagination controls here if needed */}
          </div>
        </div>
      )}
    </div>
  )}