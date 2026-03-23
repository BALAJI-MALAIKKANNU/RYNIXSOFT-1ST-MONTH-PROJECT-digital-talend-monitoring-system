from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import jwt
import datetime

from db import users_collection

app = Flask(__name__)
CORS(app)

SECRET_KEY = "your_secret_key"


@app.route("/")
def home():
    return {"message": "Server Running"}


# ✅ REGISTER
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    # Check if user exists
    existing_user = users_collection.find_one({"email": data["email"]})
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())

    users_collection.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "role": "user"   # default role
    })

    return jsonify({"message": "User registered successfully"})


# ✅ LOGIN
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"message": "User not found"}), 404

    if bcrypt.checkpw(data["password"].encode("utf-8"), user["password"]):

        token = jwt.encode({
            "user_id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "message": "Login successful",
            "token": token
        })

    return jsonify({"message": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True)