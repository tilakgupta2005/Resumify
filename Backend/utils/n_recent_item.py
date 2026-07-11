from datetime import datetime

def get_recent_items(items, n=2):
    return sorted(
        items,
        key=lambda x: (
            x["end_date"] is None,
            x["end_date"] or x["start_date"]
        ),
        reverse=True
    )[:n]
