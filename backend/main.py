from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64
from datetime import datetime
import hashlib
from typing import Optional

from config import settings
from models import AnalysisRequest, AnalysisResult, ThreatIndicator
from analyzer import ScamAnalyzer

# Initialize FastAPI app
app = FastAPI(
    title="ShieldSense API",
    description="AI-powered scam detection and analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzer
analyzer = ScamAnalyzer()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ShieldSense API",
        "environment": settings.ENVIRONMENT
    }


@app.post("/api/analyze")
async def analyze_content(request: AnalysisRequest):
    """
    Main analysis endpoint
    Accepts: email, WhatsApp messages, screenshots, URLs
    Returns: Threat score, indicators, and explanations
    """
    try:
        if request.source_type == "email" or request.source_type == "whatsapp":
            if not request.content:
                raise HTTPException(status_code=400, detail="Content required for text analysis")
            result = await analyzer.analyze_text(request.content)
        
        elif request.source_type == "screenshot":
            if not request.image_base64:
                raise HTTPException(status_code=400, detail="Image required for screenshot analysis")
            result = await analyzer.analyze_image(request.image_base64)
        
        elif request.source_type == "url":
            if not request.url:
                raise HTTPException(status_code=400, detail="URL required for URL analysis")
            result = await analyzer.analyze_url(request.url)
        
        else:
            raise HTTPException(status_code=400, detail="Invalid source_type")
        
        # Convert indicators to ThreatIndicator objects
        indicators = [
            ThreatIndicator(**indicator) for indicator in result.get("indicators", [])
        ]
        
        # Create structured response
        analysis_result = AnalysisResult(
            threat_score=result.get("threat_score", 0),
            threat_level=result.get("threat_level", "safe"),
            indicators=indicators,
            explanation=result.get("explanation", ""),
            recommendations=result.get("recommendations", []),
            similar_known_attacks=result.get("similar_known_attacks", []),
            analysis_source="gemini",
            timestamp=datetime.utcnow()
        )
        
        return {
            "success": True,
            "data": analysis_result.model_dump(mode='json'),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
    source_type: str = Form(...),
    user_id: Optional[str] = Form(None)
):
    """
    File upload endpoint for screenshots and documents
    """
    try:
        if source_type == "screenshot":
            content = await file.read()
            image_base64 = base64.b64encode(content).decode("utf-8")
            
            request = AnalysisRequest(
                image_base64=image_base64,
                source_type="screenshot",
                user_id=user_id
            )
            return await analyze_content(request)
        else:
            raise HTTPException(status_code=400, detail="File upload only supports screenshots")
    
    except Exception as e:
        print(f"File analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"File analysis failed: {str(e)}")


@app.post("/api/report")
async def report_scam(
    content: str = Form(...),
    threat_score: float = Form(...),
    is_confirmed_scam: bool = Form(...),
    user_id: Optional[str] = Form(None),
    tags: Optional[str] = Form(None)
):
    """
    Report a scam to the community database
    """
    try:
        tag_list = tags.split(",") if tags else []
        
        report_data = {
            "content": content,
            "threat_score": threat_score,
            "is_confirmed_scam": is_confirmed_scam,
            "user_id": user_id,
            "tags": tag_list,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # TODO: Save to MongoDB
        
        return {
            "success": True,
            "message": "Scam reported successfully",
            "report_id": hashlib.md5(content.encode()).hexdigest()
        }
    
    except Exception as e:
        print(f"Report error: {e}")
        raise HTTPException(status_code=500, detail=f"Report failed: {str(e)}")


@app.get("/api/stats")
async def get_stats():
    """Get platform statistics"""
    # TODO: Fetch from MongoDB
    return {
        "total_analyses": 0,
        "confirmed_scams": 0,
        "threat_distribution": {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
            "safe": 0
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
