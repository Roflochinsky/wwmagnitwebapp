from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    return {
        "status": "ok",
        "service": "WorkWatch API",
        "version": "1.0.0",
    }


@router.get("/ready")
async def readiness_check():
    return {"ready": True}
