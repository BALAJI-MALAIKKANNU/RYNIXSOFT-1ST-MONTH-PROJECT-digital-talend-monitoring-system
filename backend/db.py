from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["talent_system"]

users_collection = db["users"]