from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, defaultdict
from slotfinder import classify_slots
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change this to your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class BookingWithTherapist(BaseModel):
    therapistId: str
    start: str
    end: str
    durationMinutes: int

class SlotsRequest(BaseModel):
    duration: int
    bookings: List[BookingWithTherapist]

@app.post("/api/find-best-slots")
def find_best_slots(req: SlotsRequest):
    # Group by therapist
    groups: Dict[str, List[Dict]] = defaultdict(list)
    for b in req.bookings:
        groups[b.therapistId].append(b.dict())

    output = []
    for therapist_id, therapist_bookings in groups.items():
        best = classify_slots(req.duration, therapist_bookings)
        output.append({
            "therapist": { "therapistId": therapist_id },
            "bestSlots": best
        })

    return output
    return { "slots": slots }

@app.get("/api/therapists")
def get_therapists():
    with open("data/therapists.json") as f:
        return json.load(f)

@app.get("/api/customers")
def get_customers():
    with open("data/customers.json") as f:
        return json.load(f)

@app.get("/api/bookings")
def get_bookings():
    with open("data/bookings.json") as f:
        return json.load(f)