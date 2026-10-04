import os
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel, Field

from backend.models.tabpfn_engine import TabPFNMetabolicEngine
from backend.models.gemma_coach import GemmaMetabolicCoach
from backend.models.voice_service import ElevenLabsVoiceService

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("glucopulse")

app = FastAPI(
    title="GlucoPulse API",
    description="Personal Open-Source AI Metabolic Guardian powered by Prior Labs TabPFN & Google Gemma",
    version="1.0.0"
)

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core AI Models
tabpfn_engine = TabPFNMetabolicEngine()
gemma_coach = GemmaMetabolicCoach()
voice_service = ElevenLabsVoiceService()

class MealInput(BaseModel):
    meal_name: str = Field(default="Custom Meal", description="Description or name of meal")
    carbs_g: float = Field(default=45.0, ge=0, le=300)
    fiber_g: float = Field(default=5.0, ge=0, le=100)
    net_carbs_g: Optional[float] = None
    protein_g: float = Field(default=20.0, ge=0, le=250)
    fat_g: float = Field(default=15.0, ge=0, le=200)
    glycemic_index: float = Field(default=50.0, ge=10, le=100)
    pre_meal_glucose: float = Field(default=98.0, ge=60, le=250)
    sleep_hours: float = Field(default=7.0, ge=3, le=12)
    stress_level: int = Field(default=2, ge=1, le=5)
    post_meal_walk_min: int = Field(default=0, ge=0, le=120)
    meal_time_hour: int = Field(default=12, ge=0, le=23)

class TokenUpdate(BaseModel):
    tabpfn_token: str

class VoiceRequest(BaseModel):
    text: str

@app.get("/api/health")
def health_check():
    """Health status and model diagnostic endpoint for Render deployment."""
    return {
        "status": "healthy",
        "service": "GlucoPulse",
        "version": "1.0.0",
        "tabpfn": {
            "ready": True,
            "engine": tabpfn_engine.is_tabpfn_native and "Prior Labs TabPFN Native" or "TabPFN Prior Surrogate",
            "is_native": tabpfn_engine.is_tabpfn_native,
            "records_in_memory": len(tabpfn_engine.df)
        },
        "gemma": {
            "ready": True,
            "has_google_key": bool(gemma_coach.google_api_key),
            "has_hf_token": bool(gemma_coach.hf_token)
        },
        "elevenlabs": {
            "ready": True,
            "has_key": bool(voice_service.api_key)
        }
    }

@app.get("/api/history")
def get_metabolic_history():
    """Returns Alex's 60-day historical CGM and meal records plus clinical summary stats."""
    records = tabpfn_engine.df.to_dict(orient="records")
    summary = tabpfn_engine.get_summary_statistics()
    return {
        "summary": summary,
        "records": records[-30:], # Latest 30 meals for UI display
        "total_records_count": len(records)
    }

@app.post("/api/predict")
def predict_glucose_response(meal: MealInput):
    """Predicts postprandial glucose dynamics and generates 180m curve with TabPFN."""
    data = meal.model_dump()
    result = tabpfn_engine.predict_meal(data)
    return {
        "input": data,
        "prediction": result
    }

@app.post("/api/simulate")
def simulate_interventions(meal: MealInput):
    """Simulates counterfactual lifestyle interventions (walks, fiber, food sequencing)."""
    data = meal.model_dump()
    sim_results = tabpfn_engine.simulate_interventions(data)
    return {
        "input": data,
        "simulations": sim_results
    }

@app.post("/api/explain")
def explain_with_gemma(payload: Dict[str, Any] = Body(...)):
    """Generates empathetic clinical metabolic analysis and culinary swaps using Gemma."""
    meal_data = payload.get("meal", {})
    tabpfn_result = payload.get("prediction", {})
    if not meal_data or not tabpfn_result:
        raise HTTPException(status_code=400, detail="Both 'meal' and 'prediction' are required.")
    
    explanation = gemma_coach.explain_prediction(meal_data, tabpfn_result)
    return explanation

@app.post("/api/voice")
def synthesize_voice(request: VoiceRequest):
    """Synthesizes coaching explanation into voice audio via ElevenLabs."""
    res = voice_service.synthesize(request.text)
    return res

@app.get("/api/doctor-report")
def get_doctor_report():
    """Generates formatted clinical Markdown report for Alex's physician."""
    summary = tabpfn_engine.get_summary_statistics()
    report_md = gemma_coach.generate_doctor_report(summary, [])
    return {
        "report_markdown": report_md,
        "summary": summary
    }

@app.post("/api/settings/tabpfn-token")
def update_tabpfn_token(payload: TokenUpdate):
    """Updates Prior Labs TabPFN token dynamically."""
    success = tabpfn_engine.update_tabpfn_token(payload.tabpfn_token)
    return {
        "success": success,
        "is_native": tabpfn_engine.is_tabpfn_native,
        "engine": tabpfn_engine.is_tabpfn_native and "Prior Labs TabPFN Native" or "TabPFN Prior Surrogate"
    }

# Mount static frontend if built
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return HTMLResponse("""
        <!DOCTYPE html>
        <html>
        <head><title>GlucoPulse API</title></head>
        <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
            <h1>🩸 GlucoPulse API is Running</h1>
            <p>TabPFN Foundation Model & Google Gemma Metabolic Guardian Backend.</p>
            <p><a href="/docs" style="color: #38bdf8;">Explore Interactive Swagger API Docs &rarr;</a></p>
            <p style="color: #94a3b8; font-size: 14px;">Frontend build is in progress...</p>
        </body>
        </html>
        """)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
