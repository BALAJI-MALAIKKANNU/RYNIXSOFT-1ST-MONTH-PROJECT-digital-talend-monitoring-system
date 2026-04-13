def validate_status(status):
    allowed = ["pending", "in progress", "completed"]
    return status in allowed