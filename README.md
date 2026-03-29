# AatmanShah_SWS212Lab3 - Network Incident Reporting System

## Description
A production-ready Network Incident Reporting API with FastAPI backend, MongoDB Atlas database, JWT authentication, and React Vite frontend, deployed on Render.

## Live URLs
- Frontend: https://aatmanshah-frontend.onrender.com
- Backend API: https://aatmanshah-backend.onrender.com
- API Docs: https://aatmanshah-backend.onrender.com/docs

## How to Run Backend Locally
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## How to Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables Required
Create a `.env` file in the `backend/` folder:
```
MONGO_URI=your_mongodb_atlas_connection_string
DB_NAME=AatmanShah_network_incidents_db
SECRET_KEY=your_secret_key
```

## How to Deploy to Render
1. Push code to GitHub
2. Create a Render Web Service for backend
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Create a Render Static Site for frontend
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

## Example Login Request
```bash
curl -X POST https://aatmanshah-backend.onrender.com/token \
  -d "username=aatman&password=yourpassword"
```