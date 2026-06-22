# Quick Start Guide

Get ShieldSense running in 5 minutes!

## Prerequisites Check

```bash
# Python 3.11+
python --version

# Node.js 18+
node --version

# Docker (optional)
docker --version
```

## ⚡ Fastest Setup (Docker)

```bash
# 1. Clone and enter directory
cd ShieldSense

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker-compose up

# 4. Access
# Frontend: http://localhost:5173
# Backend: http://localhost:8000/docs
# API: http://localhost:8000
```

**Done!** Visit http://localhost:5173 in your browser.

## 🛠️ Manual Setup (No Docker)

### Step 1: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server (in new terminal)
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Step 2: Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start development server (in new terminal)
npm run dev
```

Frontend runs on `http://localhost:5173`

### Step 3: Database (MongoDB)

**Option A: Docker only for MongoDB**
```bash
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  mongo:7.0
```

**Option B: Local MongoDB**
Download from [mongodb.com](https://www.mongodb.com/try/download/community)

### Step 4: Browser Extension

1. Open `chrome://extensions`
2. Toggle "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `browser-extension` folder
5. ✅ Extension added!

## 🔑 Add API Keys

1. Get API keys:
   - [Gemini API](https://ai.google.dev/) - Free with Google account
   - [OpenAI](https://platform.openai.com/api-keys) - Free trial available

2. Edit `.env` file:
```
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

3. Restart backend: `Ctrl+C` then `uvicorn main:app --reload`

## ✅ Verify Installation

### Backend Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ShieldSense API",
  "environment": "development"
}
```

### Test Analysis
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Click here to verify your account!",
    "source_type": "email"
  }'
```

## 🎯 Test the System

### 1. Via Web Platform
- Go to http://localhost:5173
- Paste test content
- See threat analysis

### 2. Via Browser Extension
- Click extension icon
- Select "Paste" tab
- Paste test content
- View results

### 3. Via Command Line
```bash
# Analyze email
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Urgent: Your account has been compromised. Click here: http://bit.ly/verify",
    "source_type": "email"
  }'

# Check URL
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://paypal-verify.fake.com",
    "source_type": "url"
  }'
```

## 🧪 Test Data

Copy these to test the system:

### Email Scam
```
Subject: Urgent Action Required

Dear Valued Customer,

Your Amazon account has been temporarily suspended due to unusual activity. 

CLICK HERE IMMEDIATELY to verify your identity: http://bit.ly/amazon-verify

Failure to verify within 24 hours will result in permanent account closure.

Your Amazon Security Team
```

### WhatsApp Scam
```
🔴 URGENT: You've won $5000! Click to claim: http://tinyurl.com/claim-prize

Limited time offer - expires in 2 hours!
```

### Suspicious URL
```
https://paypa1.com/login
https://goog1e.com/account
https://secure-verify.bank.fake.com
```

## 🚀 Next Steps

1. ✅ System is running
2. 📖 Read [README.md](README.md) for full documentation
3. 🔧 Explore API at http://localhost:8000/docs
4. 📝 Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
5. 🎨 Customize the UI in `frontend/src/`

## 🆘 Troubleshooting

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Backend connection error
- Check MongoDB is running: `docker-compose up mongo`
- Verify API key is set in `.env`
- Restart backend server

### Extension not working
- Refresh Chrome extensions page
- Check browser console for errors
- Ensure backend is running

### Port already in use
```bash
# Find process using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>

# Same for port 5173
lsof -i :5173
```

## 📚 Learn More

- [Full README](README.md)
- [API Documentation](README.md#api-documentation)
- [Browser Extension Guide](README.md#browser-extension-usage)
- [Contributing Guide](CONTRIBUTING.md)

## 💬 Need Help?

- 📧 Email: support@shieldsense.ai
- 🐛 [GitHub Issues](https://github.com/yourusername/ShieldSense/issues)
- 💬 [GitHub Discussions](https://github.com/yourusername/ShieldSense/discussions)

---

**Happy testing!** 🛡️
