import React, { useState } from 'react';
import { Mail, MessageSquare, Image, Link2 } from 'lucide-react';

export default function InputTabs({ activeTab, onTabChange, onAnalyze, loading }) {
  const [emailContent, setEmailContent] = useState('');
  const [whatsappContent, setWhatsappContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        setImageBase64(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeEmail = async () => {
    if (!emailContent.trim()) {
      alert('Please paste an email to analyze');
      return;
    }
    onAnalyze({
      content: emailContent,
      source_type: 'email'
    });
  };

  const handleAnalyzeWhatsapp = async () => {
    if (!whatsappContent.trim()) {
      alert('Please paste a WhatsApp message to analyze');
      return;
    }
    onAnalyze({
      content: whatsappContent,
      source_type: 'whatsapp'
    });
  };

  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) {
      alert('Please enter a URL to analyze');
      return;
    }
    onAnalyze({
      url: urlInput,
      source_type: 'url'
    });
  };

  const handleAnalyzeImage = async () => {
    if (!imageBase64) {
      alert('Please upload a screenshot to analyze');
      return;
    }
    onAnalyze({
      image_base64: imageBase64,
      source_type: 'screenshot'
    });
  };

  const tabs = [
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'screenshot', label: 'Screenshot', icon: Image },
    { id: 'url', label: 'URL', icon: Link2 }
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paste the email content or full email headers:
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste email content here..."
                className="w-full h-64 px-4 py-3 bg-slate-900 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAnalyzeEmail}
              disabled={loading || !emailContent.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Email'}
            </button>
          </div>
        )}

        {/* WhatsApp Tab */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paste the WhatsApp message:
              </label>
              <textarea
                value={whatsappContent}
                onChange={(e) => setWhatsappContent(e.target.value)}
                placeholder="Paste WhatsApp message here..."
                className="w-full h-64 px-4 py-3 bg-slate-900 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAnalyzeWhatsapp}
              disabled={loading || !whatsappContent.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Message'}
            </button>
          </div>
        )}

        {/* Screenshot Tab */}
        {activeTab === 'screenshot' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Upload a screenshot:
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  <div className="text-slate-400">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Click to upload or drag and drop</p>
                    <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded mx-auto" />
                </div>
              )}
            </div>
            <button
              onClick={handleAnalyzeImage}
              disabled={loading || !imageBase64}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Screenshot'}
            </button>
          </div>
        )}

        {/* URL Tab */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Enter the URL to check:
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAnalyzeUrl}
              disabled={loading || !urlInput.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze URL'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
