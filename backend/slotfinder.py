from typing import List, Dict, Tuple
from collections import defaultdict

# --- Types ---

SlotClassification = Dict[str, List[str] | Dict[str, str]]

# --- Time helpers ---

def hhmm_to_minutes(hhmm: str) -> int:
    h, m = map(int, hhmm.split(":"))
    return h * 60 + m

def minutes_to_hhmm(minutes: int) -> str:
    return f"{minutes // 60:02}:{minutes % 60:02}"

# --- Core logic ---

def classify_slot(slot_start: int, slot_end: int, free_start: int, free_end: int, min_gap: int) -> Tuple[str, str | None]:
    gap_before = slot_start - free_start
    gap_after = free_end - slot_end
    fills_from_start = slot_start == free_start
    fills_to_end = slot_end == free_end

    aligned_before = gap_before % 60 == 0 or gap_before % 90 == 0
    aligned_after = gap_after % 60 == 0 or gap_after % 90 == 0

    if fills_from_start or fills_to_end or aligned_before or aligned_after:
        return "strict", None

    if (
        (aligned_before or aligned_after) and
        ((gap_before < min_gap and fills_from_start) or (gap_after < min_gap and fills_to_end))
    ):
        return "soft", None

    reason = f"Leaves unusable gaps: {gap_before} min before, {gap_after} min after."
    return "bad", reason

def bookings_to_intervals(bookings: List[Dict]) -> List[Tuple[int, int]]:
    return sorted([
        (hhmm_to_minutes(b["start"]), hhmm_to_minutes(b["end"]))
        for b in bookings
    ])

def get_free_intervals(intervals: List[Tuple[int, int]], day_start: int, day_end: int) -> List[Tuple[int, int]]:
    if not intervals:
        return [(day_start, day_end)]

    free = []
    if intervals[0][0] > day_start:
        free.append((day_start, intervals[0][0]))

    for i in range(len(intervals) - 1):
        cur_end = intervals[i][1]
        next_start = intervals[i + 1][0]
        if next_start > cur_end:
            free.append((cur_end, next_start))

    if intervals[-1][1] < day_end:
        free.append((intervals[-1][1], day_end))

    return free

def generate_candidates(free: List[Tuple[int, int]], duration: int, step: int) -> List[Tuple[int, int, int, int]]:
    slots = []
    for free_start, free_end in free:
        s = free_start
        while s + duration <= free_end:
            slots.append((s, s + duration, free_start, free_end))
            s += step
    return slots

def classify_slots(duration: int, bookings: List[Dict], min_gap: int = 60, day_start="08:00", day_end="18:00") -> SlotClassification:
    day_start_min = hhmm_to_minutes(day_start)
    day_end_min = hhmm_to_minutes(day_end)

    intervals = bookings_to_intervals(bookings)
    free = get_free_intervals(intervals, day_start_min, day_end_min)
    candidates = generate_candidates(free, duration, step=15)

    result = {"strict": [], "soft": [], "bad": [], "badReasons": {}}

    for s_start, s_end, f_start, f_end in candidates:
        kind, reason = classify_slot(s_start, s_end, f_start, f_end, min_gap)
        slot_hhmm = minutes_to_hhmm(s_start)
        result[kind].append(slot_hhmm)
        if kind == "bad" and reason:
            result["badReasons"][slot_hhmm] = reason

    return result
