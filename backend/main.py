from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
# from starlette.responses import FileResponse
# from starlette.staticfiles import StaticFiles
from ml import run_pipeline


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
    result = run_pipeline(df, target)
    return result
