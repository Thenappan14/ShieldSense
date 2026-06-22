// Content script for injecting analysis into webpages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelection') {
        const selectedText = window.getSelection().toString();
        sendResponse({selectedText: selectedText});
    }
    
    if (request.action === 'analyzeElement') {
        // Find suspicious elements on the page
        const elements = document.querySelectorAll('a, form, input[type="button"], button');
        const suspicious = [];
        
        elements.forEach(el => {
            const href = el.getAttribute('href') || '';
            const text = el.textContent.toLowerCase();
            
            // Check for common phishing indicators
            if (href.includes('bit.ly') || href.includes('tinyurl') || 
                text.includes('urgent') || text.includes('verify') ||
                text.includes('confirm') || text.includes('update')) {
                suspicious.push({
                    tag: el.tagName,
                    text: el.textContent.substring(0, 50),
                    href: href.substring(0, 100),
                    risk: 'medium'
                });
            }
        });
        
        sendResponse({suspicious: suspicious});
    }
});

// Auto-inject security warnings
function injectWarnings() {
    // Check for known phishing domains
    const hostname = window.location.hostname;
    
    // Create a subtle banner for suspicious domains
    if (isPhishingDomain(hostname)) {
        const banner = document.createElement('div');
        banner.style.cssText = `
            background: #fee2e2;
            border-left: 4px solid #dc2626;
            padding: 12px;
            margin: 10px 0;
            font-family: system-ui;
            color: #991b1b;
            font-size: 14px;
        `;
        banner.textContent = '⚠️ This domain appears suspicious. Be cautious with personal information.';
        
        if (document.body) {
            document.body.insertBefore(banner, document.body.firstChild);
        }
    }
}

function isPhishingDomain(hostname) {
    // Simple check - in production, integrate with reputation APIs
    const suspiciousPatterns = [
        'paypa1.', 'amaz0n.', 'goog1e.', 'apple-id', 'secure-verify',
        'confirm-account', 'update-payment', 'verify-identity'
    ];
    
    return suspiciousPatterns.some(pattern => hostname.includes(pattern));
}

// Run warnings when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWarnings);
} else {
    injectWarnings();
}
