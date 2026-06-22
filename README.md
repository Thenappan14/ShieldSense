# 🛡️ ShieldSense - AI-Powered Scam Detection

**Protecting users from online scams with explainable AI threat analysis**

## Problem

Online scams are increasing rapidly. Most people don't know if:
- ✗ A message is phishing
- ✗ A website is fake
- ✗ An email is suspicious

## Solution

ShieldSense is a browser extension + web platform that acts as an **AI scam investigator**.

### Key Features

🔍 **Multi-Modal Analysis**
- Paste emails and WhatsApp messages
- Upload screenshots
- Submit URLs for verification
- Real-time threat assessment

⚡ **Explainable AI Threat Scoring**
Instead of just showing:
> Scam Score = 85%

We explain:
> "This message uses urgency language, requests payment through crypto, and impersonates a bank. Similar patterns appear in known phishing attacks."

🤝 **Community Intelligence Database**
- User-powered scam reporting
- Crowdsourced threat intelligence
- Vote on report accuracy
- Learn from community findings

## Tech Stack

### Backend
- **FastAPI** - High-performance Python API framework
- **Gemini Vision** - Multimodal AI analysis
- **OpenAI Vision** - Alternative AI provider support
- **MongoDB** - Scam database and community reports
- **Python 3.11+** - Core language

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Icon library

### Browser Extension
- **Manifest V3** - Latest extension standard
- **Chrome/Edge** - Primary support

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development
- **MongoDB** - Database service

## Project Structure

```
ShieldSense/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration management
│   ├── models.py               # Data models
│   ├── analyzer.py             # AI analysis engine
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── components/         # React components
│   │   ├── App.css            # Styling
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind config
│   └── Dockerfile
├── browser-extension/
│   ├── manifest.json          # Extension manifest
│   ├── popup.html/js          # Popup UI
│   ├── content.js             # Content script
│   ├── background.js          # Service worker
│   └── styles.css             # Popup styling
├── docker-compose.yml         # Docker Compose setup
└── README.md                  # This file
```

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- API Keys: Gemini/OpenAI, VirusTotal (optional)

### Option 1: Docker (Recommended)

```bash
# Clone and navigate
cd ShieldSense

# Copy environment file
cp .env.example .env

# Add your API keys to .env
# GEMINI_API_KEY=your_key_here
# etc.

# Start all services
docker-compose up

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# MongoDB: localhost:27017
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env

# Run server
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

#### MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  mongo:7.0

# Or install locally: https://docs.mongodb.com/manual/installation/
```

#### Browser Extension
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. Done! Extension will appear in your toolbar

## API Documentation

### Analyze Content
```bash
POST /api/analyze
Content-Type: application/json

{
  "content": "email or message text",
  "source_type": "email|whatsapp|screenshot|url",
  "image_base64": "optional base64 image",
  "url": "optional url"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "threat_score": 85,
    "threat_level": "high",
    "indicators": [
      {
        "category": "urgency",
        "severity": "high",
        "description": "Uses time pressure language",
        "evidence": "Act now or account will be closed"
      }
    ],
    "explanation": "This message exhibits multiple scam indicators...",
    "recommendations": [
      "Do not click any links",
      "Verify the sender's email address"
    ],
    "similar_known_attacks": ["phishing", "identity_theft"]
  }
}
```

### Upload File
```bash
POST /api/analyze/file
Content-Type: multipart/form-data

file: (binary screenshot file)
source_type: "screenshot"
user_id: (optional)
```

### Report Scam
```bash
POST /api/report
Content-Type: multipart/form-data

content: "scam text"
threat_score: 85
is_confirmed_scam: true
user_id: (optional)
tags: "phishing,urgent,fake-bank"
```

### Get Statistics
```bash
GET /api/stats

Response:
{
  "total_analyses": 15234,
  "confirmed_scams": 3421,
  "threat_distribution": {
    "critical": 1200,
    "high": 2221,
    "medium": 5000,
    "low": 4500,
    "safe": 2313
  }
}
```

## AI Analysis Engine

### How Threat Scoring Works

**1. Text Analysis (Emails, Messages)**
- Detects urgency language patterns
- Identifies impersonation attempts
- Checks for common phishing phrases
- Evaluates grammar/spelling anomalies
- Analyzes sender authenticity

**2. Visual Analysis (Screenshots)**
- Identifies fake UI elements
- Detects domain name spoofing
- Recognizes common phishing designs
- Checks for unusual branding
- Scans for suspicious buttons/forms

**3. URL Analysis**
- Domain reputation checking
- Typosquatting detection
- SSL/HTTPS verification
- Known phishing database lookup
- Suspicious redirect patterns

**4. Threat Indicators**
Each analysis identifies:
- **Urgency Tactics** - Time pressure, threats
- **Impersonation** - Fake authority, brands
- **Payment Requests** - Unusual methods, crypto
- **Social Engineering** - Psychological manipulation
- **Suspicious Links** - Shortened, masked URLs
- **Grammar Issues** - Common in phishing
- **Information Requests** - PII, credentials

### Threat Levels
- 🔴 **Critical** (80-100): Almost certainly malicious
- 🟠 **High** (60-79): Very likely to be a scam
- 🟡 **Medium** (40-59): May contain scam elements
- 🔵 **Low** (20-39): Minor suspicious indicators
- 🟢 **Safe** (0-19): Appears legitimate

## Community Database

### Report Structure
```json
{
  "content": "scam text",
  "threat_score": 85,
  "threat_level": "high",
  "is_confirmed_scam": true,
  "tags": ["phishing", "banking", "urgent"],
  "upvotes": 342,
  "downvotes": 12,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Using Community Intelligence
- Vote on report accuracy
- Filter by threat type
- See attack patterns
- Learn from real scams
- Contribute your findings

## Configuration

### Environment Variables (`.env`)

```
# API Configuration
ENVIRONMENT=development|production
DEBUG=true|false

# API Keys
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Database
MONGODB_URI=mongodb://admin:admin@mongo:27017
MONGODB_DB_NAME=shieldsense

# URL Reputation
VIRUSTOTAL_API_KEY=your_virustotal_key

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

## Development

### Run Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

### Build for Production
```bash
# Backend
cd backend
docker build -t shieldsense-backend .

# Frontend
cd frontend
npm run build

# Browser Extension
# No build needed - ready to load in Chrome
```

### Code Style
```bash
# Backend - Python
pip install black flake8
black . && flake8 .

# Frontend - JavaScript
npm run lint
```

## Browser Extension Usage

### From Popup
1. **Quick Scan** - Analyzes current webpage
2. **Paste Content** - Paste email/message to analyze
3. **Check URL** - Enter URL for reputation check
4. **Community Reports** - Browse known scams

### From Context Menu
Right-click any selected text → "Analyze with ShieldSense"

### Auto-Protection
- Suspicious domains get warning banner
- Phishing links trigger notifications
- Malicious URLs blocked automatically

## API Integration Examples

### Python
```python
import requests

response = requests.post(
    'http://localhost:8000/api/analyze',
    json={
        'content': 'Your account will be closed...',
        'source_type': 'email'
    }
)
result = response.json()
print(f"Threat: {result['data']['threat_level']}")
```

### JavaScript
```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    content: 'Verify your account now...',
    source_type: 'whatsapp'
  })
});
const result = await response.json();
console.log(`Score: ${result.data.threat_score}%`);
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Machine learning model optimization
- [ ] Multi-language support
- [ ] Mobile app (iOS/Android)
- [ ] Enterprise API
- [ ] Advanced analytics dashboard
- [ ] SMS scam detection
- [ ] Voice call analysis
- [ ] Real-time threat feed
- [ ] Integration with email providers
- [ ] Browser history analysis

## Security

- No personal data collection without consent
- End-to-end encryption for analysis
- Open source for community review
- Regular security audits
- Responsible disclosure policy

## License

MIT License - see LICENSE file for details

## Support

- 📧 Email: support@shieldsense.ai
- 🐛 Report Bug: [GitHub Issues](https://github.com/yourusername/ShieldSense/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/ShieldSense/discussions)

## Acknowledgments

- Built with ❤️ to protect users from scams
- Powered by Google Gemini and OpenAI
- Community intelligence from thousands of users
- Inspired by real scam victims

---

**Remember**: If something feels too good to be true, it probably is. Always verify before clicking, sharing, or paying. 🛡️

*Last updated: 2024-01-15*
