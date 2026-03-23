from fastapi import APIRouter

router = APIRouter(prefix="/api")  # ✅ add prefix

@router.get("/")
def home():
    return {"message": "Learnix Backend Running 🚀"}

@router.get("/health")
def health():
    return {"status": "OK"}