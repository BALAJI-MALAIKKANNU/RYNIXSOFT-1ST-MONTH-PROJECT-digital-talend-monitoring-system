from flask import Blueprint, jsonify
from middleware.auth import token_required, admin_required
from models.db import tasks_collection

analytics_routes = Blueprint("analytics", __name__, url_prefix="/api")


@analytics_routes.route("/analytics", methods=["GET"])
@token_required
@admin_required
def get_analytics(current_user):
    total = tasks_collection.count_documents({})
    completed = tasks_collection.count_documents({"status": "completed"})
    pending = tasks_collection.count_documents({"status": "pending"})
    in_review = tasks_collection.count_documents({"status": "in_review"})

    return jsonify({
        "total": total,
        "completed": completed,
        "pending": pending,
        "in_review": in_review
    })