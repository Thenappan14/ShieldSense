import React, { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function CommunityDatabase({ onBack }) {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: 'phishing',
      threat_score: 95,
      upvotes: 342,
      downvotes: 12,
      tags: ['phishing', 'banking', 'urgent'],
      preview: 'Urgent: Your bank account has been compromised...',
      date: '2024-01-15'
    },
    {
      id: 2,
      type: 'fake_payment',
      threat_score: 88,
      upvotes: 256,
      downvotes: 8,
      tags: ['payment', 'crypto', 'scam'],
      preview: 'Click here to claim your prize - $10,000 waiting...',
      date: '2024-01-14'
    },
    {
      id: 3,
      type: 'impersonation',
      threat_score: 82,
      upvotes: 189,
      downvotes: 5,
      tags: ['impersonation', 'support', 'fake'],
      preview: 'Amazon Support: Verify your account information...',
      date: '2024-01-13'
    }
  ]);

  const getThreatColor = (score) => {
    if (score >= 80) return 'bg-red-900/30 border-red-500 text-red-400';
    if (score >= 60) return 'bg-orange-900/30 border-orange-500 text-orange-400';
    if (score >= 40) return 'bg-yellow-900/30 border-yellow-500 text-yellow-400';
    return 'bg-green-900/30 border-green-500 text-green-400';
  };

  const handleVote = (id, type) => {
    setReports(reports.map(report => 
      report.id === id 
        ? { 
            ...report, 
            upvotes: type === 'up' ? report.upvotes + 1 : report.upvotes,
            downvotes: type === 'down' ? report.downvotes + 1 : report.downvotes
          }
        : report
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Community Scam Database</h2>
          <p className="text-slate-400">Reports from our security community</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Total Reports</p>
          <p className="text-3xl font-bold text-white mt-1">{reports.length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Average Threat Score</p>
          <p className="text-3xl font-bold text-orange-400 mt-1">
            {Math.round(reports.reduce((a, b) => a + b.threat_score, 0) / reports.length)}%
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Community Votes</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">
            {reports.reduce((a, b) => a + b.upvotes, 0)}
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`border rounded-lg p-4 ${getThreatColor(report.threat_score)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-slate-900/50 rounded text-xs font-medium capitalize">
                    {report.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold">
                    {report.threat_score}% Threat
                  </span>
                  <span className="text-xs text-slate-400">{report.date}</span>
                </div>
                <p className="text-sm mb-2">{report.preview}</p>
                <div className="flex flex-wrap gap-1">
                  {report.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-900/50 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <button
                  onClick={() => handleVote(report.id, 'up')}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-900/50 hover:bg-green-900/40 rounded transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{report.upvotes}</span>
                </button>
                <button
                  onClick={() => handleVote(report.id, 'down')}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-900/50 hover:bg-red-900/40 rounded transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">{report.downvotes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Report CTA */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Help the Community</h3>
        <p className="text-slate-300 mb-4">
          Report scams you've encountered to help protect others
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
        >
          Analyze & Report
        </button>
      </div>
    </div>
  );
}
