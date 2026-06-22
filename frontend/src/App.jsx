import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, ClipboardList, Link2, Image } from 'lucide-react';
import AnalysisPanel from './components/AnalysisPanel';
import InputTabs from './components/InputTabs';
import ResultsDisplay from './components/ResultsDisplay';
import CommunityDatabase from './components/CommunityDatabase';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCommunity, setShowCommunity] = useState(false);

  const handleAnalysis = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      const result = await response.json();
      setAnalysis(result.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold text-white">ShieldSense</h1>
                <p className="text-slate-400 text-sm">AI-powered scam detection</p>
              </div>
            </div>
            <button
              onClick={() => setShowCommunity(!showCommunity)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Community Reports
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCommunity ? (
          <CommunityDatabase onBack={() => setShowCommunity(false)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                <InputTabs 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onAnalyze={handleAnalysis}
                  loading={loading}
                />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-400">Error</h3>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            <div className="lg:col-span-1">
              {loading && (
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-slate-400">Analyzing content...</p>
                </div>
              )}
              
              {analysis && !loading && (
                <ResultsDisplay analysis={analysis} />
              )}
              
              {!loading && !analysis && (
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 h-96 flex flex-col items-center justify-center">
                  <Shield className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400 text-center">
                    Submit content for analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>🛡️ Protecting users from online scams with AI-powered threat detection</p>
          <p className="mt-2">Install the browser extension for real-time protection</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
