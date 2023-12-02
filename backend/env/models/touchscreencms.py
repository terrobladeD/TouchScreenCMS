from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from typing import List, Optional
from pydantic import BaseModel, Field

class MapURL(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None

class Attribute(BaseModel):
    global_id: Optional[str] = None
    name: Optional[str] = None
    image_url: Optional[str] = None
    img_url: Optional[str] = None
    link_id: Optional[str] = None
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
    global_id: Optional[str] = None
    name: Optional[str] = None
    img_url: Optional[str] = None
    link_id: Optional[str] = None
    attributes_inner: Optional[str] = None
    attributes_is_index: Optional[bool] = None
    attributes: Optional[List['Attribute']] = None
