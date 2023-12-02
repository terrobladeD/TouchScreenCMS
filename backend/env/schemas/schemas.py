# Schemas用于请求和响应数据的结构。
from models.touchscreencms import Attribute, MapURL
from typing import List, Optional
from pydantic import BaseModel

class AttributeCreate(BaseModel):
    name: str
    # 可以添加更多的字段，根据需要创建时应提供的数据。

class AttributeUpdate(BaseModel):
    name: Optional[str] = None
    # 可以添加更多的字段，根据需要更新时可以提供的数据。

class AttributeResponse(Attribute):
    id: str  # 在MongoDB中，这将是每个文档的唯一标识符。

# 如果有更多的层级，可以根据需要添加更多的schemas。
