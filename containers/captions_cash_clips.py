# import modal
# from modal import App, Image, asgi_app
# from fastapi import FastAPI, Request, BackgroundTasks
# from fastapi.responses import JSONResponse, StreamingResponse
# from fastapi.middleware.cors import CORSMiddleware
# import aiohttp
# import json
# import logging
# import io
# import whisper
# import ffmpeg
# import os
# import numpy as np
# import asyncio
# from concurrent.futures import ThreadPoolExecutor
# import subprocess
# from scipy.io import wavfile

# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# image = (
#     Image.debian_slim(python_version="3.10")
#     .pip_install(
#         "requests", "fastapi", "ffmpeg-python", "openai-whisper", "aiohttp", "torch", "transformers",
#         "huggingface_hub", "scipy", "numpy<2.0", "pandas", "Pillow", "pydub", "tqdm", "pybind11>=2.12"
#     )
#     .apt_install("ffmpeg")  # Include ffmpeg system dependency
# )

# app = App(name="captions-cash-clips", image=image)
# web_app = FastAPI()

# # Configure CORS middleware
# web_app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def split_text_with_times(text, start_time, end_time):
#     """Splits text with timestamps for word-level synchronization."""
#     words = text.split()
#     duration = end_time - start_time
#     word_durations = duration / len(words)
#     word_start_times = [start_time + i * word_durations for i in range(len(words))]
#     return [{"word": word, "start": round(start_time, 3), "end": round(start_time + word_durations, 3)}
#             for word, start_time in zip(words, word_start_times)]

# async def fetch_video_data(url: str) -> bytes:
#     """Asynchronously fetch video data from a URL."""
#     logging.info(f"Fetching video data from URL: {url}")
#     async with aiohttp.ClientSession() as session:
#         async with session.get(url) as response:
#             if response.status != 200:
#                 raise ValueError(f"Failed to fetch video from URL: {url} with status code {response.status}")
#             return await response.read()

# def extract_audio_ffmpeg(video_data: bytes) -> np.ndarray:
#     """Extract audio from video using ffmpeg in a separate thread to avoid blocking."""
#     logging.info("Extracting audio using ffmpeg.")
#     process = subprocess.Popen(
#         ['ffmpeg', '-i', 'pipe:0', '-f', 'wav', '-acodec', 'pcm_s16le', '-ac', '1', '-ar', '16000', 'pipe:1'],
#         stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
#     )
#     audio_data, _ = process.communicate(input=video_data)
    
#     # Load audio data into numpy array
#     audio_array = np.frombuffer(audio_data, dtype=np.int16)
#     return audio_array

# async def transcribe_audio(audio_data: np.ndarray) -> dict:
#     """Transcribe audio using Whisper."""
#     logging.info("Loading Whisper model and starting transcription.")
#     model = whisper.load_model("medium.en")
#     # Convert audio data to correct format for Whisper
#     audio = whisper.pad_or_trim(audio_data.astype(np.float32) / np.iinfo(np.int16).max)
    
#     result = model.transcribe(audio, fp16=True)  # Enable FP16 for speed and efficiency.
#     transcription = {
#         "task": "transcribe",
#         "language": "english",
#         "text": result["text"],
#         "words": []
#     }
#     for segment in result["segments"]:
#         transcription["words"].extend(split_text_with_times(segment["text"], segment["start"], segment["end"]))
#     return transcription

# async def stream_transcription(url: str):
#     """Stream transcription results to the client."""
#     request_id = os.urandom(8).hex()  # Generate a unique ID for logging
#     logging.info(f"Processing transcription request: {request_id} for URL: {url}")
#     try:
#         # Fetch video data asynchronously
#         video_data = await fetch_video_data(url)

#         # Extract audio and transcribe concurrently
#         with ThreadPoolExecutor() as executor:
#             audio_future = asyncio.get_event_loop().run_in_executor(executor, extract_audio_ffmpeg, video_data)
#             audio_data = await audio_future

#         # Transcribe the extracted audio
#         transcription = await transcribe_audio(audio_data)

#         # Stream transcription result
#         yield json.dumps({"status": "success", "request_id": request_id, "transcription": transcription}, indent=2) + "\n"

#     except Exception as e:
#         logging.error(f"Error processing video (Request ID: {request_id}): {e}")
#         yield json.dumps({"status": "error", "request_id": request_id, "message": str(e)}, indent=2) + "\n"

# @web_app.post("/transcribe")
# async def transcribe(request: Request, background_tasks: BackgroundTasks):
#     """Endpoint for transcription."""
#     logging.info("Received transcribe request.")
#     try:
#         data = await request.json()
#         video_url = data.get("url")
#         if not video_url:
#             raise ValueError("URL is missing")

#         return StreamingResponse(stream_transcription(video_url), media_type="application/json")

#     except ValueError as e:
#         logging.error(f"Validation error in transcribe endpoint: {e}")
#         return JSONResponse(status_code=400, content={"status": "error", "message": str(e)})

#     except Exception as e:
#         logging.error(f"Error in transcribe endpoint: {e}")
#         return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# @app.function(image=image, gpu="any")
# @asgi_app()
# def fastapi_app():
#     """Entrypoint for FastAPI app."""
#     return web_app
import modal
from modal import App, Image, asgi_app
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import aiohttp
import json
import logging
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
import subprocess
import ffmpeg
import numpy as np

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set your AssemblyAI API key here
ASSEMBLY_AI_API_KEY = "3e3b498af123407c9d584625d7b53170"

# Image definition for container
image = (
    Image.debian_slim(python_version="3.10")
    .pip_install(
        "requests", "fastapi", "aiohttp", "torch", "scipy", "numpy<2.0", "pandas",
        "Pillow", "pydub", "tqdm", "pybind11>=2.12", "ffmpeg-python"
    )
    .apt_install("ffmpeg")  # Install ffmpeg binary
)

app = App(name="captions-cash-clips", image=image)
web_app = FastAPI()

# Configure CORS middleware
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def fetch_video_data(url: str) -> bytes:
    """Asynchronously fetch video data from a URL."""
    logging.info(f"Fetching video data from URL: {url}")
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status != 200:
                raise ValueError(f"Failed to fetch video from URL: {url} with status code {response.status}")
            return await response.read()

def extract_audio_and_sync_with_video(video_data: bytes) -> tuple:
    """Extract audio from video and ensure audio is synced with video timestamps."""
    try:
        process = subprocess.Popen(
            ['ffmpeg', '-i', 'pipe:0', '-f', 'wav', '-acodec', 'pcm_s16le', '-ac', '1', '-ar', '16000', 'pipe:1'],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        audio_data, _ = process.communicate(input=video_data)
        return audio_data
    except Exception as e:
        logging.error(f"Error extracting audio from video: {e}")
        raise

async def upload_audio_to_assemblyai(audio_data: bytes) -> str:
    """Upload the audio data to AssemblyAI and return the URL."""
    headers = {
        "authorization": ASSEMBLY_AI_API_KEY,
        "content-type": "application/octet-stream",
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post('https://api.assemblyai.com/v2/upload', data=audio_data, headers=headers) as response:
            if response.status != 200:
                raise ValueError(f"Failed to upload audio to AssemblyAI: {response.status}")
            result = await response.json()
            return result['upload_url']

async def transcribe_audio_with_assemblyai(audio_url: str) -> dict:
    """Submit the audio URL to AssemblyAI for transcription and return the transcription result."""
    headers = {
        "authorization": ASSEMBLY_AI_API_KEY,
        "content-type": "application/json",
    }
    transcription_request = {
        "audio_url": audio_url,
        "speaker_labels": True,
        "punctuate": True,
        "format_text": True
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post('https://api.assemblyai.com/v2/transcript', json=transcription_request, headers=headers) as response:
            if response.status != 200:
                raise ValueError(f"Failed to submit transcription request: {response.status}")
            transcription_data = await response.json()
            transcription_id = transcription_data['id']
    
    # Polling for the transcription result
    while True:
        async with aiohttp.ClientSession() as session:
            async with session.get(f'https://api.assemblyai.com/v2/transcript/{transcription_id}', headers=headers) as response:
                if response.status != 200:
                    raise ValueError(f"Error fetching transcription status: {response.status}")
                result = await response.json()
                if result["status"] == "completed":
                    return result
                elif result["status"] == "failed":
                    raise ValueError(f"Transcription failed: {result['error']}")

                await asyncio.sleep(2)

def format_transcription_result(assembly_result, video_duration: float):
    """Formats the AssemblyAI result to match video-based timings."""
    words_list = []
    assembly_audio_duration = assembly_result['audio_duration']  # Audio duration in AssemblyAI response
    for word in assembly_result['words']:
        start_time = word['start'] / 1000  # Convert ms to seconds
        end_time = word['end'] / 1000  # Convert ms to seconds

        # Adjust word timings based on actual video duration to match exact playback time
        start_time_adjusted = (start_time / assembly_audio_duration) * video_duration
        end_time_adjusted = (end_time / assembly_audio_duration) * video_duration

        words_list.append({
            "word": word['text'],
            "start": start_time_adjusted,
            "end": end_time_adjusted
        })
    
    transcription = {
        "task": "transcribe",
        "language": "english",
        "text": assembly_result["text"],
        "words": words_list
    }
    
    return transcription

def extract_audio_duration(video_data: bytes) -> float:
    """Extract the video duration using ffprobe."""
    try:
        process = subprocess.Popen(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', '-i', 'pipe:0'],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        
        stdout, _ = process.communicate(input=video_data)
        if process.returncode != 0:
            raise ValueError("Failed to extract duration using ffprobe")

        # Parse the ffprobe output and extract the duration
        probe_data = json.loads(stdout)
        duration = float(probe_data['format']['duration'])
        return duration
    except Exception as e:
        logging.error(f"Error extracting audio duration: {e}")
        raise

async def stream_transcription(url: str):
    """Stream transcription results to the client."""
    request_id = os.urandom(8).hex()  # Generate a unique ID for logging
    logging.info(f"Processing transcription request: {request_id} for URL: {url}")
    
    try:
        # Fetch video data asynchronously
        video_data = await fetch_video_data(url)

        # Extract audio while keeping the video timeline in sync
        audio_data = extract_audio_and_sync_with_video(video_data)

        # Upload audio to AssemblyAI
        audio_url = await upload_audio_to_assemblyai(audio_data)

        # Transcribe audio with AssemblyAI
        transcription_result = await transcribe_audio_with_assemblyai(audio_url)

        # Get video duration from ffprobe
        video_duration = extract_audio_duration(video_data)

        # Format the transcription to match the video format and correct timing
        formatted_transcription = format_transcription_result(transcription_result, video_duration)

        # Stream transcription result
        yield json.dumps({"status": "success", "request_id": request_id, "transcription": formatted_transcription}, indent=2) + "\n"
    
    except Exception as e:
        logging.error(f"Error processing video (Request ID: {request_id}): {e}")
        yield json.dumps({"status": "error", "request_id": request_id, "message": str(e)}, indent=2) + "\n"

@web_app.post("/transcribe")
async def transcribe(request: Request, background_tasks: BackgroundTasks):
    """Endpoint for transcription."""
    logging.info("Received transcribe request.")
    try:
        data = await request.json()
        video_url = data.get("url")
        if not video_url:
            raise ValueError("URL is missing")

        return StreamingResponse(stream_transcription(video_url), media_type="application/json")

    except ValueError as e:
        logging.error(f"Validation error in transcribe endpoint: {e}")
        return JSONResponse(status_code=400, content={"status": "error", "message": str(e)})

    except Exception as e:
        logging.error(f"Error in transcribe endpoint: {e}")
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.function(image=image)
@asgi_app()
def fastapi_app():
    """Entrypoint for FastAPI app."""
    return web_app
