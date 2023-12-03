
from fastapi import APIRouter, HTTPException, Body
from schemas.schemas import AttributeCreate, AttributeUpdate, AttributeResponse
from CRUD.Attributes import Attibutes_crud_instance
from models import touchscreencms

router = APIRouter()

@router.post("/CreatNewAttributes", response_model=AttributeResponse)
def create_attribute(attribute: AttributeCreate = Body(...)):
    new_id = Attibutes_crud_instance.create("basic_collection", attribute.dict(by_alias=True))
    return {**attribute.dict(), "id": new_id}

@router.get("/{id}", response_model=AttributeResponse)
def read_attribute(id: str):
    db_attribute = Attibutes_crud_instance.read("basic_collection", id)
    if db_attribute:
        return {**db_attribute, "id": str(db_attribute["_id"])}
    raise HTTPException(status_code=404, detail="Attribute not found")

@router.get("/GetAllItems/", response_model=list[AttributeResponse])
def get_all_items():
    attributes = Attibutes_crud_instance.get_all_items("basic_collection")
    return attributes


@router.put("/{id}", response_model=AttributeResponse)
def update_attribute(id: str, attribute: AttributeUpdate):
    update_result = Attibutes_crud_instance.update("basic_collection", id, attribute.dict(exclude_unset=True))
    if update_result.modified_count:
        return Attibutes_crud_instance.read("basic_collection", id)
    raise HTTPException(status_code=404, detail="Attribute not found")

@router.delete("/{id}", response_model=dict)
def delete_attribute(id: str):
    if Attibutes_crud_instance.delete("basic_collection", id):
        return {"ok": True}
    raise HTTPException(status_code=404, detail="Attribute not found")


