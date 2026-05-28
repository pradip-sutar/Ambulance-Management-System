import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from gallery.model import GalleryImage

router = APIRouter(prefix="/gallery", tags=["Gallery"])

# ✅ Better upload path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "../uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_IMAGES = 20


# ================= UPLOAD IMAGE =================
@router.post("/upload")
async def upload_gallery_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # ✅ Enforce max 20 images
    count = db.query(GalleryImage).count()

    if count >= MAX_IMAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {MAX_IMAGES} images allowed. Delete some to upload more.",
        )

    # ✅ Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed.",
        )

    # ✅ Validate file size (max 5MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 5MB limit.",
        )

    # ✅ Generate unique filename
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid4()}.{file_ext}"

    file_path = os.path.join(UPLOAD_DIR, filename)

    # ✅ Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ Correct image URL
    image_url = f"/api/uploads/{filename}"

    # ✅ Save in DB
    new_image = GalleryImage(image_url=image_url)

    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return {
        "message": "Image uploaded successfully",
        "image": new_image,
    }


# ================= GET ALL IMAGES =================
@router.get("/")
def get_gallery_images(db: Session = Depends(get_db)):
    images = db.query(GalleryImage).all()
    return images


# ================= DELETE IMAGE =================
@router.delete("/{image_id}")
def delete_gallery_image(image_id: int, db: Session = Depends(get_db)):
    image = db.query(GalleryImage).filter(
        GalleryImage.id == image_id
    ).first()

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found",
        )

    # ✅ Delete file from disk
    filename = image.image_url.replace("/api/uploads/", "")
    full_path = os.path.join(UPLOAD_DIR, filename)

    if os.path.exists(full_path):
        os.remove(full_path)

    db.delete(image)
    db.commit()

    return {
        "message": "Deleted successfully"
    }