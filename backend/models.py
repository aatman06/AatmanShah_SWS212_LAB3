from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    username: str
    password_hash: str
    role: str = "engineer"

class IncidentCreate(BaseModel):
    device_name: str
    location: str
    incident_type: str
    severity: str  # low, medium, high, critical
    description: str
    status: str = "open"  # open, investigating, resolved

class IncidentUpdate(BaseModel):
    device_name: Optional[str] = None
    location: Optional[str] = None
    incident_type: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class IncidentResponse(BaseModel):
    id: str
    device_name: str
    location: str
    incident_type: str
    severity: str
    description: str
    status: str