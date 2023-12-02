from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from typing import List, Optional
from pydantic import BaseModel, Field

# class MapURL(BaseModel):
#     name: Optional[str] = None
#     url: str

# class Attribute(BaseModel):
#     global_id: str
#     name: str
#     image_url: Optional[str] = None
#     attributes_inner: Optional[str] = None
#     attributes_is_index: Optional[bool] = None
#     description: Optional[str] = None
#     brand_url: Optional[str] = None
#     image_urls: Optional[List[str]] = None
#     map_urls: Optional[List[MapURL]] = None
#     left_description: Optional[str] = None  # 可选字段
#     right_description: Optional[str] = None  # 可选字段
#     custom_actions: Optional[str] = None
#     # 使用字符串'Attribute'进行前向声明，允许递归定义
#     attributes: Optional[List['Attribute']] = None  

# # 必须调用此方法以解决递归模型的前向引用
# Attribute.update_forward_refs()

# class Item(BaseModel):
#     id: Optional[str] = Field(None, alias='_id')
#     global_id: str
#     name: str
#     attributes_inner: Optional[str] = None
#     attributes_is_index: Optional[bool] = None
#     attributes: List[Attribute]



#     # 这是用于Pydantic模型的文件。
# from pydantic import BaseModel, Field
# from typing import List, Optional

class MapURL(BaseModel):
    name: Optional[str] = None
    url: str

class Attribute(BaseModel):
    global_id: str
    name: str
    image_url: Optional[str] = None
    attributes_inner: Optional[str] = None
    attributes_is_index: Optional[bool] = None
    description: Optional[str] = None
    brand_url: Optional[str] = None
    image_urls: Optional[List[str]] = None
    map_urls: Optional[List[MapURL]] = None
    left_description: Optional[str] = None
    right_description: Optional[str] = None
    custom_actions: Optional[str] = None
    attributes: Optional[List['Attribute']] = None

Attribute.update_forward_refs()

class Item(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    global_id: str
    name: str
    attributes_inner: Optional[str] = None
    attributes_is_index: Optional[bool] = None
    attributes: List[Attribute]