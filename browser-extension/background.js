// Background service worker for ShieldSense extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({url: 'https://localhost:5173'});
    }
});

// Add context menu for analyzing selected text
chrome.contextMenus.create({
    id: 'analyzeSelection',
    title: 'Analyze with ShieldSense',
    contexts: ['selection', 'link']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'analyzeSelection') {
        const text = info.selectionText || info.linkUrl;
        // Send to popup or open analysis tab
        chrome.tabs.create({
            url: `https://localhost:5173?text=${encodeURIComponent(text)}`
        });
    }
});

// Monitor URLs and check for known phishing patterns
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        checkUrlReputation(tab.url, tabId);
    }
});

async function checkUrlReputation(url, tabId) {
    try {
        const domain = new URL(url).hostname;
        const response = await fetch('http://localhost:8000/api/analyze', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                url: url,
                source_type: 'url'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.data.threat_score > 70) {
                // Set badge to warn user
                chrome.action.setBadgeText({text: '⚠️', tabId: tabId});
                chrome.action.setBadgeBackgroundColor({color: '#dc2626', tabId: tabId});
            }
        }
    } catch (error) {
        console.error('Error checking URL reputation:', error);
    }
}

// Clear badge when tab is closed or changed
chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.action.setBadgeText({text: '', tabId: tabId});
});
