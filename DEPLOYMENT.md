# Deployment Guide

Production deployment guide for ShieldSense.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] API keys obtained and set
- [ ] MongoDB database created
- [ ] SSL certificates ready
- [ ] Domain name assigned
- [ ] CORS origins updated
- [ ] Security audit completed
- [ ] Performance testing done

## Cloud Deployment Options

### Option 1: Heroku (Easiest)

#### Backend Deployment
```bash
# Install Heroku CLI
# heroku login

# Create app
heroku create shieldsense-api

# Set environment variables
heroku config:set ENVIRONMENT=production
heroku config:set GEMINI_API_KEY=your_key
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

#### Frontend Deployment
```bash
# Build
npm run build

# Deploy to Vercel
npm install -g vercel
vercel --prod
```

### Option 2: AWS

#### Backend (EC2)
```bash
# Launch EC2 instance
# SSH into instance
ssh -i key.pem ubuntu@your-instance

# Install dependencies
sudo apt update && apt install python3-pip
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY=your_key
export MONGODB_URI=your_mongodb_uri

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

#### Frontend (S3 + CloudFront)
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Database (RDS)
```bash
# Create RDS MongoDB instance via AWS Console
# Update MONGODB_URI connection string
```

### Option 3: Google Cloud Run

```bash
# Build container
docker build -t shieldsense-backend backend/

# Push to Container Registry
docker tag shieldsense-backend gcr.io/your-project/shieldsense-backend
docker push gcr.io/your-project/shieldsense-backend

# Deploy
gcloud run deploy shieldsense-backend \
  --image gcr.io/your-project/shieldsense-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars ENVIRONMENT=production,MONGODB_URI=your_uri
```

### Option 4: DigitalOcean (Recommended)

#### Create Droplet
```bash
# 1. Create Ubuntu 22.04 droplet
# 2. SSH into droplet
ssh root@your-droplet-ip

# 3. Update system
apt update && apt upgrade -y

# 4. Install Docker
curl -sSL https://get.docker.com | sh
usermod -aG docker $USER

# 5. Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 6. Clone repository
git clone https://github.com/yourusername/ShieldSense.git
cd ShieldSense

# 7. Set environment
cp .env.example .env
nano .env  # Edit with your keys

# 8. Start services
docker-compose up -d

# 9. Set up Nginx reverse proxy
# Create /etc/nginx/sites-available/shieldsense
# Add SSL certificate with Let's Encrypt

# 10. Start Nginx
systemctl restart nginx
```

## Environment Configuration for Production

### Backend (.env)
```
ENVIRONMENT=production
DEBUG=false
GEMINI_API_KEY=your_production_key
OPENAI_API_KEY=your_production_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shieldsense
MONGODB_DB_NAME=shieldsense
VIRUSTOTAL_API_KEY=your_key
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

### Security Headers (Nginx)
```nginx
server {
    # ... other config ...
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
```

## Database Setup

### MongoDB Atlas (Cloud)
```
1. Create MongoDB Atlas cluster
2. Create database user
3. Whitelist IP address
4. Get connection string
5. Set MONGODB_URI in environment
```

### Self-Hosted MongoDB
```bash
# Create persistent volume
docker volume create mongo_data

# Run with authentication
docker run -d \
  --name mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secure_password \
  -v mongo_data:/data/db \
  -p 27017:27017 \
  mongo:7.0

# Backup
mongodump --uri "mongodb://admin:pass@localhost:27017/shieldsense"

# Restore
mongorestore --uri "mongodb://admin:pass@localhost:27017" dump/
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer
```

### Manual Certificate
```bash
# If using your own certificate
cp /path/to/cert.pem /etc/nginx/ssl/
cp /path/to/key.pem /etc/nginx/ssl/

# Configure Nginx
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
```

## Performance Optimization

### Backend Optimization
```python
# Use production ASGI server
pip install gunicorn uvicorn[standard]

# Run with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Caching Strategy
```python
# Add caching headers
from fastapi import FastAPI
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend

# Configure Redis caching
```

### Database Indexing
```javascript
// MongoDB indexes for faster queries
db.analyses.createIndex({ "user_id": 1, "timestamp": -1 })
db.reports.createIndex({ "threat_score": -1 })
db.reports.createIndex({ "tags": 1 })
```

## Monitoring & Logging

### Error Tracking (Sentry)
```python
import sentry_sdk

sentry_sdk.init(
    dsn="your_sentry_dsn",
    environment="production",
    traces_sample_rate=0.1
)
```

### Application Monitoring
```bash
# Uptime monitoring
# Use services like:
# - Uptime Robot
# - Freshping
# - Datadog
# - New Relic
```

### Logs
```bash
# Docker logs
docker-compose logs -f backend

# System logs
tail -f /var/log/docker/...

# Nginx logs
tail -f /var/log/nginx/error.log
```

## Scaling for Production

### Load Balancing
```nginx
upstream backend_servers {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

### Database Scaling
- MongoDB Sharding for large datasets
- Read replicas for high traffic
- Connection pooling

### CDN for Frontend
```bash
# Upload to CDN (CloudFlare, AWS CloudFront)
# Update CORS_ORIGINS for CDN URL
# Invalidate cache on updates
```

## Backup Strategy

### Database Backups
```bash
# Daily backup to S3
0 2 * * * mongodump --archive=/backups/db-$(date +\%Y\%m\%d).archive
0 3 * * * aws s3 cp /backups/ s3://your-backup-bucket/
```

### Code Backups
```bash
# Automatic via Git
git push origin main
```

## Maintenance

### Regular Tasks
- Monitor logs daily
- Check error rates
- Review API performance
- Update dependencies monthly
- Test disaster recovery
- Review security

### Dependency Updates
```bash
# Backend
pip list --outdated
pip install --upgrade package_name

# Frontend
npm outdated
npm update
```

## Troubleshooting Production Issues

### High CPU Usage
```bash
# Check running processes
docker top shieldsense-backend

# Scale up
docker-compose up -d --scale backend=3
```

### Database Connection Issues
```bash
# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/shieldsense"

# Check connection pool
```

### API Rate Limiting
```python
# Add rate limiting
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/analyze")
@limiter.limit("100/minute")
async def analyze_content(request: AnalysisRequest):
    pass
```

## Rollback Procedure

```bash
# If new deployment has issues
git log --oneline
git revert <commit_hash>
git push origin main
docker-compose pull
docker-compose up -d
```

## Support

For production support:
- 📧 support@shieldsense.ai
- 🔧 Maintenance window: Weekly Tuesday 2-4 AM UTC
- 🆘 Emergency: ops@shieldsense.ai

---

**Happy deploying!** 🚀
