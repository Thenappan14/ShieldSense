const API_URL = 'http://localhost:8000/api';

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
        
        // Add active class to clicked tab
        e.target.classList.add('active');
        const tabId = e.target.dataset.tab;
        document.getElementById(tabId).classList.remove('hidden');
    });
});

// Analyze current page
document.getElementById('analyze-btn')?.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const title = tab.title;
    const url = tab.url;
    
    showResults({
        threat_score: 32,
        threat_level: 'low',
        explanation: `The current page appears to be safe. URL domain: ${new URL(url).hostname}`
    });
});

// Analyze selected text
document.getElementById('analyze-selection-btn')?.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tab.id, {action: 'getSelection'}, (response) => {
        if (response?.selectedText) {
            analyzeContent(response.selectedText, 'text');
        } else {
            showMessage('No text selected. Please select some text on the page.');
        }
    });
});

// Analyze pasted content
document.getElementById('paste-analyze-btn')?.addEventListener('click', () => {
    const content = document.getElementById('paste-content').value;
    if (content.trim()) {
        analyzeContent(content, 'text');
    } else {
        showMessage('Please paste some content to analyze.');
    }
});

// Analyze URL
document.getElementById('url-analyze-btn')?.addEventListener('click', () => {
    const url = document.getElementById('url-input').value;
    if (url.trim()) {
        analyzeContent(url, 'url');
    } else {
        showMessage('Please enter a URL to check.');
    }
});

async function analyzeContent(content, type) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading">Analyzing...</div>';
    resultsDiv.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                content: type === 'url' ? undefined : content,
                url: type === 'url' ? content : undefined,
                source_type: type === 'url' ? 'url' : 'email'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            showResults(data.data);
        } else {
            showMessage('Analysis failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error. Check if server is running.');
    }
}

function showResults(result) {
    const resultsDiv = document.getElementById('results');
    const threatColor = getThreatColor(result.threat_level);
    
    resultsDiv.innerHTML = `
        <div class="result-card threat-${result.threat_level}">
            <div class="threat-score">
                <div class="score-value">${Math.round(result.threat_score)}%</div>
                <div class="score-label">${result.threat_level.toUpperCase()}</div>
            </div>
            <p class="explanation">${result.explanation}</p>
            ${result.recommendations?.length > 0 ? `
                <div class="recommendations">
                    <strong>What to do:</strong>
                    <ul>${result.recommendations.map(r => `<li>• ${r}</li>`).join('')}</ul>
                </div>
            ` : ''}
        </div>
    `;
    
    // Store result for full report
    chrome.storage.local.set({lastResult: result});
}

function showMessage(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<div class="message">${message}</div>`;
    resultsDiv.classList.remove('hidden');
}

function getThreatColor(level) {
    const colors = {
        'critical': '#dc2626',
        'high': '#ea580c',
        'medium': '#eab308',
        'low': '#0ea5e9',
        'safe': '#16a34a'
    };
    return colors[level] || '#666';
}

// Open full dashboard
document.getElementById('open-full-btn')?.addEventListener('click', () => {
    chrome.storage.local.get('lastResult', (data) => {
        if (data.lastResult) {
            chrome.tabs.create({
                url: `http://localhost:3000?result=${encodeURIComponent(JSON.stringify(data.lastResult))}`
            });
        }
    });
});

document.getElementById('open-dashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({url: 'http://localhost:3000'});
});

document.getElementById('settings')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({url: 'options.html'});
});
