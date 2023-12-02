from fastapi import FastAPI
from fastapi import FastAPI
from Router.Attributes import router as attribute_router
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://TouchScreenCMS:fQWyb9RIxHSgAXIq@touchscreencms.qry45tc.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

app = FastAPI()

app.include_router(attribute_router, prefix="/attributes", tags=["attributes"])
