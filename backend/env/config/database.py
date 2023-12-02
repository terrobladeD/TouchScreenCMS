from pymongo import MongoClient


client = MongoClient("mongodb+srv://TouchScreenCMS:fQWyb9RIxHSgAXIq@touchscreencms.qry45tc.mongodb.net/?retryWrites=true&w=majority")


db = client.touchscreenCMS

collection_name = db["touchscreenCMS_collection"]
