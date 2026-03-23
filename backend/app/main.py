from fastapi import FastAPI
from app.routes import router
from app.socket import sio
import socketio
from app.execute import router as execute_router
from fastapi.middleware.cors import CORSMiddleware  # ✅ ADD THIS

# Create FastAPI app
fastapi_app = FastAPI()

# ✅ ADD CORS (VERY IMPORTANT)
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
fastapi_app.include_router(router)
fastapi_app.include_router(execute_router, prefix="/execute")

# Root route
@fastapi_app.get("/")
async def root():
    return {"message": "Backend running 🚀"}

# Attach Socket.IO
app = socketio.ASGIApp(
    sio,
    other_asgi_app=fastapi_app,
    socketio_path="ws/socket.io"
)