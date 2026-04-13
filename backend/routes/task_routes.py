from flask import Blueprint, request, jsonify
from models.db import tasks_collection
from middleware.auth import token_required, admin_required
from bson import ObjectId
from datetime import datetime

task_routes = Blueprint("tasks", __name__, url_prefix="/api")


# ✅ CREATE TASK
@task_routes.route("/tasks", methods=["POST"])
@token_required
@admin_required
def create_task(current_user):
    data = request.json

    new_task = {
        "title": data.get("title"),
        "description": data.get("description"),
        "assigned_to": data.get("assigned_to"),
        "status": "pending",
        "created_at": datetime.utcnow()
    }

    tasks_collection.insert_one(new_task)

    return jsonify({"message": "Task created successfully"}), 201


# ✅ GET ALL TASKS
@task_routes.route("/tasks", methods=["GET"])
@token_required
def get_tasks(current_user):
    tasks = list(tasks_collection.find())

    for task in tasks:
        task["_id"] = str(task["_id"])

    return jsonify(tasks), 200


# ✅ UPDATE STATUS (basic)
@task_routes.route("/tasks/<task_id>", methods=["PUT"])
@token_required
def update_task(current_user, task_id):
    data = request.json

    tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": data.get("status")}}
    )

    return jsonify({"message": "Task updated"}), 200


# ✅ DELETE TASK
@task_routes.route("/tasks/<task_id>", methods=["DELETE"])
@token_required
@admin_required
def delete_task(current_user, task_id):
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})

        if result.deleted_count == 0:
            return jsonify({"message": "Task not found"}), 404

        return jsonify({"message": "Task deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔥 SUBMIT TASK (USER)
@task_routes.route("/tasks/<task_id>/submit", methods=["PUT"])
@token_required
def submit_task(current_user, task_id):
    data = request.json

    tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$set": {
                "status": "in_review",
                "submission": data.get("submission"),
                "submitted_at": datetime.utcnow()
            }
        }
    )

    return jsonify({"message": "Task submitted"}), 200


# 🔥 REVIEW TASK (ADMIN)
@task_routes.route("/tasks/<task_id>/review", methods=["PUT"])
@token_required
@admin_required
def review_task(current_user, task_id):
    data = request.json
    status = data.get("status")

    if status not in ["completed", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400

    tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$set": {
                "status": status,
                "reviewed_at": datetime.utcnow()
            }
        }
    )

    return jsonify({"message": "Task reviewed"}), 200