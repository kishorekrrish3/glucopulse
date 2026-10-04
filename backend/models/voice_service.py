import os
import logging
from typing import Dict, Any, Optional
import httpx

logger = logging.getLogger(__name__)

class ElevenLabsVoiceService:
    """
    Voice coaching synthesis using ElevenLabs API.
    Synthesizes Gemma's metabolic coaching into warm, encouraging audio for hands-free kitchen guidance.
    """

    def __init__(self):
        self.api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
        # Default voice ID (Rachel - warm, clear conversational voice)
        self.voice_id = os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
        self.api_url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"

    def synthesize(self, text: str) -> Dict[str, Any]:
        """
        Converts text into audio stream or base64.
        If no API key is available, returns instructions for client-side Web Speech synthesis.
        """
        if not self.api_key:
            return {
                "has_audio": False,
                "text": text,
                "engine": "Web Speech Synthesis (ElevenLabs API Key not configured)",
                "note": "Add ELEVENLABS_API_KEY to .env or Settings for high-definition ElevenLabs neural voice."
            }

        try:
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.api_key
            }
            payload = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75
                }
            }
            with httpx.Client(timeout=15.0) as client:
                response = client.post(self.api_url, json=payload, headers=headers)
                if response.status_code == 200:
                    import base64
                    audio_b64 = base64.b64encode(response.content).decode("utf-8")
                    return {
                        "has_audio": True,
                        "audio_base64": f"data:audio/mpeg;base64,{audio_b64}",
                        "engine": "ElevenLabs Neural Voice",
                        "voice_id": self.voice_id
                    }
                else:
                    logger.warning(f"ElevenLabs API responded with status {response.status_code}: {response.text}")
                    return {
                        "has_audio": False,
                        "text": text,
                        "engine": "Web Speech Synthesis (ElevenLabs API error fallback)",
                        "error": response.text
                    }
        except Exception as e:
            logger.error(f"ElevenLabs request failed: {e}")
            return {
                "has_audio": False,
                "text": text,
                "engine": "Web Speech Synthesis (Network fallback)",
                "error": str(e)
            }
