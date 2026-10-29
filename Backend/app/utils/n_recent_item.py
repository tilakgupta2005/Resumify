from datetime import datetime

def get_recent_items(items, n=2):
    if not items:
        return []
    return sorted(
        items,
        key=lambda x: (
            x.get("end_date") is None if isinstance(x, dict) else True,
            (x.get("end_date") or x.get("start_date") or "") if isinstance(x, dict) else ""
        ),
        reverse=True
    )[:n]
