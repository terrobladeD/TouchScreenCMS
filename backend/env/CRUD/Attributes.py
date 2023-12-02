# 这个文件包含用于与数据库交互的CRUD操作。
from bson import ObjectId
from pymongo import MongoClient


class Attibutes_crud:
    
    def __init__(self):
            self.client = MongoClient('mongodb+srv://TouchScreenCMS:fQWyb9RIxHSgAXIq@touchscreencms.qry45tc.mongodb.net/?retryWrites=true&w=majority')
            self.db = self.client['General']

    def create(self, collection_name: str, data: dict):
        collection = self.db[collection_name]
        return str(collection.insert_one(data).inserted_id)

    def read(self, collection_name: str, item_id: str):
        collection = self.db[collection_name]
        return collection.find_one({'_id': ObjectId(item_id)})

    def update(self, collection_name: str, item_id: str, data: dict):
        collection = self.db[collection_name]
        return collection.update_one({'_id': ObjectId(item_id)}, {'$set': data})

    def delete(self, collection_name: str, item_id: str):
        collection = self.db[collection_name]
        return collection.delete_one({'_id': ObjectId(item_id)})

# 实例化数据库操作类
Attibutes_crud_instance= Attibutes_crud()
