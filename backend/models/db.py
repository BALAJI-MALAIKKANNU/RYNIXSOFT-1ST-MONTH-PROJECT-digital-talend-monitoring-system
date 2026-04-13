from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))

db = client.get_default_database()

users_collection = db["users"]
tasks_collection = db["tasks"]