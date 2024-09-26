import modal
from modal import App, Image, asgi_app
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import logging
import os
import json
import asyncio
from supabase import create_client, Client
from datetime import datetime, timedelta
import pytz

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %I:%M:%S %p EST'
)

# Set your Creatomate and Supabase API keys
CREATOMATE_API_KEY = os.getenv("CREATOMATE_API_KEY", "7999f3011bf24299af9752042eb4ac944e0f6de93ea9dfc4659316f0dcb4ab110d83558d02eb41f4f2df0a942cbcf8a8")
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://nkjyzbsqwqmpadmdegjj.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ranl6YnNxd3FtcGFkbWRlZ2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNjAzMjAsImV4cCI6MjA0MjkzNjMyMH0.Hg7e_tb3cMr0cO4XSmEtGvGNGCmBiUklkpcv8KPAqgw")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

image = (
    Image.debian_slim(python_version="3.10")
    .pip_install(["requests", "fastapi", "supabase", "pytz"])
)

app = App(name="render-cash-clips", image=image)
web_app = FastAPI()

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_est_time():
    est = pytz.timezone('US/Eastern')
    return datetime.now(est).strftime('%Y-%m-%d %I:%M:%S %p EST')

async def start_render_task(data):
    headers = {
        "Authorization": f"Bearer {CREATOMATE_API_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        "https://api.creatomate.com/v1/renders", headers=headers, json=data["render-data"]
    )

    if response.status_code == 202:
        return response.json()
    else:
        logging.error(f"❌ Error starting render: {response.text}")
        return {"error": "Error starting render", "details": response.text}

async def fetch_render_status_task(render_id):
    headers = {
        "Authorization": f"Bearer {CREATOMATE_API_KEY}",
    }

    response = requests.get(
        f"https://api.creatomate.com/v1/renders/{render_id}", headers=headers
    )

    if response.status_code == 200:
        return response.json()
    else:
        logging.error(f"❌ Error fetching render status: {response.text}")
        return {"error": "Error fetching render status", "details": response.text}

@web_app.post("/api/creatomate/videos")
async def handle_render_request(request: Request, background_tasks: BackgroundTasks):
    try:
        data = await request.json()

        # If a single job is passed, convert it into a list
        if isinstance(data, dict):
            data = [data]

        job_ids = []

        for job_data in data:
            # Validate required fields
            if "modifications" not in job_data or "outputFormat" not in job_data or "user_id" not in job_data:
                logging.error("❌ Invalid payload structure.")
                return JSONResponse(status_code=400, content={"message": "Invalid payload structure. Missing modifications, outputFormat, or user_id."})

            render_data = {
                "render-data": {
                    "outputFormat": job_data["outputFormat"],
                    "modifications": job_data["modifications"],
                    "source": job_data["source"]
                }
            }

            if "frameRate" in job_data:
                render_data["render-data"]["frameRate"] = job_data["frameRate"]

            initial_render = await start_render_task(render_data)
            if "error" in initial_render:
                return JSONResponse(status_code=500, content=initial_render)

            render_id = initial_render[0]['id']
            logging.info(f"🚀 Render task started with ID: {render_id} for user: {job_data['user_id']}")
            job_ids.append(render_id)

            current_time = get_current_est_time()

            # Add task to Supabase created_clips table
            response = supabase.table("created_clips").insert({
                "render_id": render_id,
                "user_id": job_data["user_id"],
                "status": "planned",
                "response": {},
                "payload": job_data,
                "created_at": current_time,
                "updated_at": current_time
            }).execute()

            if not response.data:
                logging.error(f"❌ Error storing clip in Supabase: {response}")
                return JSONResponse(status_code=500, content={"message": "Error storing clip in Supabase"})

            # Start the background task to monitor this render job
            background_tasks.add_task(update_render_status, render_id)

        return JSONResponse(content={"job_ids": job_ids})

    except Exception as e:
        logging.error(f"❌ Exception in handle_render_request: {str(e)}")
        return JSONResponse(status_code=500, content={"message": str(e)})

async def update_render_status(render_id):
    while True:
        render_status = await fetch_render_status_task(render_id)
        if render_status["status"] in ["succeeded", "failed"]:
            current_time = get_current_est_time()
            # Update Supabase with the render status and updated_at time
            response = supabase.table("created_clips").update({
                "status": render_status["status"],
                "response": render_status, 
                "updated_at": current_time
            }).eq("render_id", render_id).execute()

            if not response.data:
                logging.error(f"❌ Failed to update clip {render_id} in Supabase: {response}")
            else:
                logging.info(f"✅ Clip {render_id} updated successfully in Supabase")
            break
        await asyncio.sleep(5)  # Poll every 5 seconds

@web_app.get("/api/creatomate/fetch-render-status")
async def handle_fetch_status_request(request: Request):
    render_id = request.query_params.get("id")
    if request.method == "GET":
        try:
            render_status = await fetch_render_status_task(render_id)
            if not render_status or "status" not in render_status:
                return JSONResponse(status_code=404, content={"error": f"No status information found for job {render_id}"})
            return JSONResponse(content=render_status)
        except Exception as e:
            logging.error(f"Error fetching render status: {str(e)}")
            return JSONResponse(status_code=500, content={"error": f"Failed to fetch render status: {str(e)}"})
    else:
        return JSONResponse(status_code=405, content={"message": f"Method {request.method} not allowed"})
    
@app.function(image=image)
@asgi_app()
def fastapi_app():
    return web_app