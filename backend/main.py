from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import ml

app = FastAPI(title="Insightify")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze(file: UploadFile = File(...), target: str = "target"):
    df = pd.read_csv(file.file)
    result = ml.pipeline.run_pipeline(df, target)
    return result
