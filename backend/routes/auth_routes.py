from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import datetime
import os
from models.db import users_collection

auth_routes = Blueprint("auth", __name__)

SECRET_KEY = os.getenv("SECRET_KEY")


@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"message": "User exists"}), 400

    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

    users_collection.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed,
        "role": "user"
    })

    return jsonify({"message": "Registered"})


@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json

    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not bcrypt.checkpw(data["password"].encode(), user["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "role": user["role"],
        "email": user["email"]
    })