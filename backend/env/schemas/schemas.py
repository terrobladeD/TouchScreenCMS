
from models.touchscreencms import Attribute, MapURL
from typing import List, Optional
from pydantic import BaseModel

class AttributeCreate(BaseModel):
    name: str
    

class AttributeUpdate(BaseModel):
    name: Optional[str] = None
    

class AttributeResponse(Attribute):
    id: str  

# 如果有更多的层级，可以根据需要添加更多的schemas。
