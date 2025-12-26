import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from ml import run_pipeline


app = FastAPI(title="Insightify")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_path = os.path.abspath("../frontend")
app.mount("/static", StaticFiles(directory=frontend_path), name="static")


@app.get("/")
def read_index():
    return FileResponse("../index.html")


@app.post("/analyze")
async def analyze(file: UploadFile = File(...), target: str = Form(...)):
    try:
        df = pd.read_csv(file.file, encoding='utf-8-sig')
        result = run_pipeline(df, target)
        return result
    except Exception as e:
        return {"error": str(e)}
