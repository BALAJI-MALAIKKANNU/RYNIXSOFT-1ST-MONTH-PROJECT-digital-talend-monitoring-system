from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ✅ GLOBAL CORS FIX
CORS(app)

@app.after_request
def handle_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

# 🔥 IMPORT ROUTES
from routes.auth_routes import auth_routes
from routes.task_routes import task_routes
from routes.user_routes import user_routes
from routes.analytics_routes import analytics_routes

# ✅ API PREFIX
app.register_blueprint(auth_routes, url_prefix="/api")
app.register_blueprint(task_routes, url_prefix="/api")
app.register_blueprint(user_routes, url_prefix="/api")
app.register_blueprint(analytics_routes, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "Server Running 🚀"}

if __name__ == "__main__":
    app.run(debug=True)