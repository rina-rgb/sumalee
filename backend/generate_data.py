# generate_data.py
import json
from pyexpat import XMLParserType
from faker import Faker
from datetime import datetime, timedelta
import random
from uuid import uuid4
from pathlib import Path

faker = Faker()

AVAILABLE_SERVICES = [
    "Massage Therapy",
    "Acupuncture",
    "Chiropractic Care",
    "Physical Therapy"
]

def pad(n): return str(n).zfill(2)

def get_time_str(dt):
    return f"{pad(dt.hour)}:{pad(dt.minute)}"

def get_next_week_dates(start_date):
    return [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]

def generate():
    today = datetime.today()
    DATES = get_next_week_dates(today)

    therapists = []
    for _ in range(3):
        id = str(uuid4())
        therapists.append({
            "id": id,
            "name": faker.name(),
            "avatarUrl": faker.image_url(),
            "color": f"rgb({random.randint(0,255)}, {random.randint(0,255)}, {random.randint(0,255)})",
            "specialties": random.sample(["massage", "pt", "acupuncture", "chiropractic"], 2),
            "timeZone": "America/Los_Angeles",
            "availability": [
                {"weekday": wd, "startHour": 9, "endHour": 12} for wd in range(5)
            ] + [
                {"weekday": wd, "startHour": 13, "endHour": 17} for wd in range(5)
            ],
            "createdAt": faker.date_this_month().isoformat(),
            "updatedAt": faker.date_between(start_date="-7d", end_date="today").isoformat()

        })

    customers = []
    for _ in range(10):
        customers.append({
            "id": str(uuid4()),
            "firstName": faker.first_name(),
            "lastName": faker.last_name(),
            "email": faker.email(),
            "phone": faker.phone_number(),
            "avatarUrl": faker.image_url(),
            "createdAt": faker.date_this_month().isoformat()
        })

    bookings = []
    occupied = {}

    for date in DATES:
        for _ in range(random.randint(7, 15)):
            therapist = random.choice(therapists)
            customer = random.choice(customers)
            duration = random.choice([60, 90])
            hour = random.randint(8, 16)
            minute = random.choice([0, 30])
            start_dt = datetime.strptime(date, "%Y-%m-%d").replace(hour=hour, minute=minute)
            end_dt = start_dt + timedelta(minutes=duration)
            start = get_time_str(start_dt)
            end = get_time_str(end_dt)

            key = f"{therapist['id']}-{date}"
            if key not in occupied:
                occupied[key] = []

            overlap = any(
                not (end <= s['start'] or start >= s['end']) for s in occupied[key]
            )
            if not overlap:
                occupied[key].append({"start": start, "end": end})
                bookings.append({
                    "id": str(uuid4()),
                    "therapistId": therapist["id"],
                    "customer": {
                        "id": customer["id"],
                        "firstName": customer["firstName"],
                        "lastName": customer["lastName"],
                        "email": customer["email"],
                        "phone": customer["phone"],
                    },
                    "date": date,
                    "start": start,
                    "end": end,
                    "service": random.choice(AVAILABLE_SERVICES),
                    "durationMinutes": duration,
                    "notes": faker.sentence()
                })

    Path("data").mkdir(exist_ok=True)
    with open("data/therapists.json", "w") as f: json.dump(therapists, f, indent=2)
    with open("data/customers.json", "w") as f: json.dump(customers, f, indent=2)
    with open("data/bookings.json", "w") as f: json.dump(bookings, f, indent=2)
    print("✅ Data generated.")

if __name__ == "__main__":
    generate()