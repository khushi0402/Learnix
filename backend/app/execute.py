from fastapi import APIRouter
from pydantic import BaseModel
import subprocess
import tempfile
import os

router = APIRouter()

class CodeRequest(BaseModel):
    code: str
    language: str


@router.post("/run")
async def run_code(request: CodeRequest):
    if request.language != "python":
        return {"output": "⚠️ Only Python supported for now"}

    try:
        # create temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp:
            temp.write(request.code.encode())
            temp_path = temp.name

        # run code
        result = subprocess.run(
            ["python", temp_path],
            capture_output=True,
            text=True,
            timeout=5
            
        )

        os.remove(temp_path)

        output = result.stdout if result.stdout else result.stderr

        return {"output": output}

    except Exception as e:
        return {"output": str(e)}