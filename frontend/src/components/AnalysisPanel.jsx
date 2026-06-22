import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function AnalysisPanel({ analysis, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400">Analyzing content...</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="space-y-4">
        <div>
          <p className="text-slate-400 text-sm">Threat Score</p>
          <p className="text-4xl font-bold text-blue-400 mt-2">
            {Math.round(analysis.threat_score)}%
          </p>
        </div>
        
        {analysis.explanation && (
          <div>
            <p className="text-slate-400 text-sm mb-2">Analysis</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              {analysis.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
