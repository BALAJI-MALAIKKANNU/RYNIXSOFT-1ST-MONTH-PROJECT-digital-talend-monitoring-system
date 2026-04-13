import jwt
from functools import wraps
from flask import request, jsonify
from config import SECRET_KEY


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token missing"}), 401

        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data
        except Exception as e:
            return jsonify({"message": "Invalid token"}), 401

        # ✅ FIX: pass current_user correctly
        return f(current_user, *args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.get("role") != "admin":
            return jsonify({"message": "Admin only"}), 403

        return f(current_user, *args, **kwargs)

    return decorated