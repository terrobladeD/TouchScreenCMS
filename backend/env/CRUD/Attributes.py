
from bson import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv() 

uri = os.getenv('MONGO_URI_VERSION1')

class Attibutes_crud:
    
    def __init__(self):
            self.client = MongoClient(uri)
            self.db = self.client['General']

    def create(self, collection_name: str, data: dict):
        collection = self.db[collection_name]
        return str(collection.insert_one(data).inserted_id)
    
    def get_all_items(self, collection_name: str) ->list[dict]:
         collection = self.db[collection_name]
         return list(collection.find())

    def read(self, collection_name: str, item_id: str):
        collection = self.db[collection_name]
        return collection.find_one({'_id': ObjectId(item_id)})

    def update(self, collection_name: str, item_id: str, data: dict):
        collection = self.db[collection_name]
        return collection.update_one({'_id': ObjectId(item_id)}, {'$set': data})

    def delete(self, collection_name: str, item_id: str):
        collection = self.db[collection_name]
        return collection.delete_one({'_id': ObjectId(item_id)})


Attibutes_crud_instance= Attibutes_crud()
