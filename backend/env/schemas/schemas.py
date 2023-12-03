
from models.touchscreencms import Attribute, MapURL
from typing import List, Optional
from pydantic import BaseModel

class AttributeCreate(BaseModel):
    name: str
    

class AttributeUpdate(BaseModel):
    name: Optional[str] = None
    

class AttributeResponse(Attribute):
    id: Optional[str] = None  

