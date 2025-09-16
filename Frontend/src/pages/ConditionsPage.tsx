import React, { useState } from 'react';
import { User } from 'lucide-react';
import { ConditionList } from '../components/ConditionList';

export const ConditionsPage: React.FC = () => {
  const [patientFilter, setPatientFilter] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Conditions
          </h1>
          <p className="text-gray-600">
            View and manage saved medical conditions with dual coding
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-gray-400" />
            <h2 className="font-medium text-gray-900">Filter by Patient</h2>
          </div>
          <div className="max-w-sm">
            <input
              type="text"
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter patient ID or leave empty for all"
            />
          </div>
        </div>

        {/* Conditions List */}
        <ConditionList 
          patientId={patientFilter || undefined}
          onEdit={(condition) => console.log('Edit:', condition)}
          onDelete={(id) => console.log('Delete:', id)}
        />
      </div>
    </div>
  );
};