from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AnalysisRequest(BaseModel):
    content: Optional[str] = None
    image_base64: Optional[str] = None
    url: Optional[str] = None
    source_type: str  # "email", "whatsapp", "screenshot", "url"
    user_id: Optional[str] = None


class ThreatIndicator(BaseModel):
    category: str  # "urgency", "impersonation", "phishing", "payment_request", "fake_domain", etc.
    severity: str  # "high", "medium", "low"
    description: str
    evidence: str


class AnalysisResult(BaseModel):
    threat_score: float  # 0-100
    threat_level: str  # "critical", "high", "medium", "low", "safe"
    indicators: List[ThreatIndicator]
    explanation: str
    recommendations: List[str]
    similar_known_attacks: List[str]
    analysis_source: str  # "gemini", "openai", "hybrid"
    timestamp: datetime
    content_hash: Optional[str] = None


class ScamReport(BaseModel):
    content: str
    analysis_result: AnalysisResult
    is_confirmed_scam: bool
    upvotes: int = 0
    downvotes: int = 0
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime
