import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, TrendingDown, Flag } from 'lucide-react';

export default function ResultsDisplay({ analysis }) {
  const [reported, setReported] = useState(false);

  const getThreatColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-900/20 border-red-500 text-red-400';
      case 'high':
        return 'bg-orange-900/20 border-orange-500 text-orange-400';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-500 text-yellow-400';
      case 'low':
        return 'bg-blue-900/20 border-blue-500 text-blue-400';
      case 'safe':
        return 'bg-green-900/20 border-green-500 text-green-400';
      default:
        return 'bg-slate-900/20 border-slate-500 text-slate-400';
    }
  };

  const getThreatIcon = (level) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-6 h-6" />;
      case 'medium':
        return <AlertCircle className="w-6 h-6" />;
      case 'low':
        return <TrendingDown className="w-6 h-6" />;
      case 'safe':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  const scoreColor = 
    analysis.threat_score >= 80 ? 'text-red-400' :
    analysis.threat_score >= 60 ? 'text-orange-400' :
    analysis.threat_score >= 40 ? 'text-yellow-400' :
    analysis.threat_score >= 20 ? 'text-blue-400' :
    'text-green-400';

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
      {/* Threat Score Card */}
      <div className={`p-6 border-b border-slate-700 ${getThreatColor(analysis.threat_level)}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">Threat Level</p>
            <div className="flex items-center gap-2 mt-2">
              {getThreatIcon(analysis.threat_level)}
              <span className="text-2xl font-bold capitalize">{analysis.threat_level}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Threat Score</p>
            <p className={`text-4xl font-bold mt-2 ${scoreColor}`}>
              {Math.round(analysis.threat_score)}%
            </p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-6 border-b border-slate-700">
        <h3 className="font-semibold text-white mb-3">Analysis</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          {analysis.explanation}
        </p>
      </div>

      {/* Threat Indicators */}
      {analysis.indicators && analysis.indicators.length > 0 && (
        <div className="p-6 border-b border-slate-700">
          <h3 className="font-semibold text-white mb-3">Detected Indicators</h3>
          <div className="space-y-3">
            {analysis.indicators.map((indicator, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900/50 rounded border border-slate-600"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-slate-200">
                    {indicator.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    indicator.severity === 'high' ? 'bg-red-900/40 text-red-300' :
                    indicator.severity === 'medium' ? 'bg-yellow-900/40 text-yellow-300' :
                    'bg-blue-900/40 text-blue-300'
                  }`}>
                    {indicator.severity}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{indicator.description}</p>
                {indicator.evidence && (
                  <p className="text-slate-500 text-xs mt-2 italic">
                    Evidence: "{indicator.evidence.substring(0, 60)}{indicator.evidence.length > 60 ? '...' : ''}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="p-6 border-b border-slate-700">
          <h3 className="font-semibold text-white mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-blue-400 mt-1">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Similar Attacks */}
      {analysis.similar_known_attacks && analysis.similar_known_attacks.length > 0 && (
        <div className="p-6 border-b border-slate-700">
          <h3 className="font-semibold text-white mb-3">Similar Known Attacks</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.similar_known_attacks.map((attack, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-700 rounded-full text-slate-300 text-sm"
              >
                {attack}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Report Button */}
      <div className="p-4 bg-slate-900/50">
        <button
          onClick={() => setReported(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
        >
          <Flag className="w-4 h-4" />
          Report to Community
        </button>
        {reported && (
          <p className="text-center text-green-400 text-sm mt-2">
            ✓ Thanks for reporting! This helps protect the community.
          </p>
        )}
      </div>
    </div>
  );
}
