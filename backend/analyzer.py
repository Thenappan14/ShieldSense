import google.generativeai as genai
from typing import Optional, List
import base64
import json
from config import settings


class ScamAnalyzer:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
    
    async def analyze_text(self, content: str) -> dict:
        """Analyze email, WhatsApp message, or text content for scam indicators"""
        prompt = self._build_text_analysis_prompt(content)
        try:
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)
            return self._parse_analysis_response(response.text)
        except Exception as e:
            print(f"Error analyzing text: {e}")
            return self._get_fallback_analysis(content)
    
    async def analyze_image(self, image_base64: str) -> dict:
        """Analyze screenshots for scam indicators"""
        prompt = self._build_image_analysis_prompt()
        try:
            model = genai.GenerativeModel("gemini-pro-vision")
            image_data = {
                "mime_type": "image/png",
                "data": image_base64
            }
            response = model.generate_content([prompt, image_data])
            return self._parse_analysis_response(response.text)
        except Exception as e:
            print(f"Error analyzing image: {e}")
            return self._get_fallback_analysis("screenshot")
    
    async def analyze_url(self, url: str) -> dict:
        """Analyze URLs for phishing and fraud indicators"""
        prompt = self._build_url_analysis_prompt(url)
        try:
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)
            return self._parse_analysis_response(response.text)
        except Exception as e:
            print(f"Error analyzing URL: {e}")
            return self._get_fallback_analysis(f"URL: {url}")
    
    def _build_text_analysis_prompt(self, content: str) -> str:
        return f"""You are an expert scam detection AI. Analyze the following message for scam indicators.

IMPORTANT: Return ONLY valid JSON (no markdown, no extra text).

Analyze for:
1. Urgency language (threats, time pressure)
2. Impersonation (fake authority, spoofed identity)
3. Payment requests (unusual payment methods, crypto)
4. Social engineering tactics
5. Suspicious links or email addresses
6. Grammar and spelling errors common in phishing
7. Requests for sensitive information

Return JSON with this EXACT structure:
{{
  "threat_score": <0-100>,
  "threat_level": "<critical|high|medium|low|safe>",
  "indicators": [
    {{"category": "<category>", "severity": "<high|medium|low>", "description": "<description>", "evidence": "<quoted text from message>"}}
  ],
  "explanation": "<detailed explanation>",
  "recommendations": ["<recommendation1>", "<recommendation2>"],
  "similar_known_attacks": ["<attack_type1>", "<attack_type2>"]
}}

MESSAGE TO ANALYZE:
{content}"""
    
    def _build_image_analysis_prompt(self) -> str:
        return """You are an expert scam detection AI analyzing a screenshot. Identify:
1. Fake UI elements or impersonated websites
2. Urgency messages or threats
3. Suspicious buttons or forms
4. Domain name spoofing
5. Unusual branding or logos

Return ONLY valid JSON (no markdown, no extra text):
{
  "threat_score": <0-100>,
  "threat_level": "<critical|high|medium|low|safe>",
  "indicators": [
    {"category": "<category>", "severity": "<high|medium|low>", "description": "<description>", "evidence": "<description of what you see>"}
  ],
  "explanation": "<detailed explanation>",
  "recommendations": ["<recommendation1>"],
  "similar_known_attacks": ["<attack_type>"]
}"""
    
    def _build_url_analysis_prompt(self, url: str) -> str:
        return f"""Analyze this URL for phishing, malware, and fraud indicators: {url}

Check for:
1. Domain typosquatting
2. Suspicious TLD or subdomain structure
3. Known phishing patterns
4. Suspicious redirects
5. HTTPS/SSL indicators

Return ONLY valid JSON (no markdown, no extra text):
{{
  "threat_score": <0-100>,
  "threat_level": "<critical|high|medium|low|safe>",
  "indicators": [
    {{"category": "<category>", "severity": "<high|medium|low>", "description": "<description>", "evidence": "<URL pattern analysis>"}}
  ],
  "explanation": "<explanation>",
  "recommendations": ["<recommendation>"],
  "similar_known_attacks": ["<attack_type>"]
}}"""
    
    def _parse_analysis_response(self, response_text: str) -> dict:
        """Parse JSON response from Gemini"""
        try:
            # Remove markdown code blocks if present
            cleaned = response_text.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("```")[1]
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
                cleaned = cleaned.strip()
            
            result = json.loads(cleaned)
            return result
        except json.JSONDecodeError:
            print(f"Failed to parse response: {response_text}")
            return self._get_fallback_analysis(response_text)
    
    def _get_fallback_analysis(self, content: str) -> dict:
        """Fallback analysis when API fails"""
        return {
            "threat_score": 0,
            "threat_level": "safe",
            "indicators": [],
            "explanation": "Unable to analyze at this time. Please try again.",
            "recommendations": ["Contact support if issues persist"],
            "similar_known_attacks": []
        }
