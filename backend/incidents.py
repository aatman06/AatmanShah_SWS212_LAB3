from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from models import IncidentCreate, IncidentUpdate
from auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()

def incident_serializer(incident) -> dict:
    return {
        "id": str(incident["_id"]),
        "device_name": incident["device_name"],
        "location": incident["location"],
        "incident_type": incident["incident_type"],
        "severity": incident["severity"],
        "description": incident["description"],
        "status": incident["status"],
        "created_at": incident["created_at"],
        "updated_at": incident["updated_at"],
    }

@router.get("/incidents")
async def get_incidents():
    db = get_db()
    incidents = await db["incidents"].find().to_list(100)
    return [incident_serializer(i) for i in incidents]

@router.get("/incidents/{id}")
async def get_incident(id: str):
    db = get_db()
    incident = await db["incidents"].find_one({"_id": ObjectId(id)})
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident_serializer(incident)

@router.post("/incidents", status_code=201)
async def create_incident(incident: IncidentCreate, current_user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    new_incident = incident.dict()
    new_incident["created_at"] = now
    new_incident["updated_at"] = now
    result = await db["incidents"].insert_one(new_incident)
    created = await db["incidents"].find_one({"_id": result.inserted_id})
    return incident_serializer(created)

@router.put("/incidents/{id}")
async def update_incident(id: str, incident: IncidentUpdate, current_user=Depends(get_current_user)):
    db = get_db()
    update_data = {k: v for k, v in incident.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    result = await db["incidents"].update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Incident not found")
    updated = await db["incidents"].find_one({"_id": ObjectId(id)})
    return incident_serializer(updated)

@router.delete("/incidents/{id}")
async def delete_incident(id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db["incidents"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"message": "Incident deleted successfully"}