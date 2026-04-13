from flask import Blueprint, jsonify
from middleware.auth import token_required
from models.db import users_collection

user_routes = Blueprint("users", __name__, url_prefix="/api")


@user_routes.route("/users", methods=["GET"])
@token_required
def get_users(current_user):  # ✅ FIX HERE
    users = list(users_collection.find({}, {"password": 0}))

    for u in users:
        u["_id"] = str(u["_id"])

    return jsonify(users)