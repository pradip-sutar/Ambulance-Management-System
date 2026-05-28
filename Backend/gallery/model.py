from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)