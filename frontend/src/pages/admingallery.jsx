import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ImagePlus, Trash2, ArrowLeft, Image as ImageIcon,
  Upload, X, AlertTriangle, Loader2
} from "lucide-react"

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner"

import {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
} from "../components/api/galleryapi"

const MAX_IMAGES = 20

export default function AdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const data = await getGalleryImages()
      setImages(data)
    } catch {
      toast.error("Failed to load gallery images")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Build full image URL for display
 const getImageUrl = (url) => {
  if (!url) return ""

  if (url.startsWith("http")) return url

  const base = import.meta.env.VITE_API_BASE_URL.replace("/api", "")

  return `${base}${url}`
}

  // ✅ Upload handler
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed. Delete some to add more.`)
      return
    }

    const filesToUpload = files.slice(0, remaining)

    if (files.length > remaining) {
      toast.warning(`Only ${remaining} more image(s) can be added. Uploading first ${remaining}.`)
    }

    setUploading(true)

    try {
      let uploadedCount = 0

      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          toast.error(`"${file.name}" is not an image file. Skipped.`)
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" exceeds 5MB. Skipped.`)
          continue
        }

        await uploadGalleryImage(file)
        uploadedCount++
      }

      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} image(s) uploaded successfully!`)
        fetchImages()
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload image(s)")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  // ✅ Delete handler
  const handleDelete = async (imageId) => {
    try {
      await deleteGalleryImage(imageId)
      toast.success("Image deleted successfully!")
      setDeleteConfirm(null)
      setPreview(null)
      fetchImages()
    } catch (error) {
      toast.error(error.message || "Failed to delete image")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-lg font-medium">Loading Gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ---- HEADER ---- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin")}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <ImageIcon className="h-5 w-5" />
                </div>
                Gallery Manager
              </h1>
              <p className="text-sm text-slate-500 mt-1 ml-10">
                Upload and manage service photos shown on the About page
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Badge
              variant="outline"
              className={`text-sm px-3 py-1 ${
                images.length >= MAX_IMAGES
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {images.length} / {MAX_IMAGES} Images
            </Badge>

            <label
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
                images.length >= MAX_IMAGES
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              }`}
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Add Photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading || images.length >= MAX_IMAGES}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ---- LIMIT BANNER ---- */}
        {images.length >= MAX_IMAGES && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              You have reached the maximum limit of <strong>{MAX_IMAGES} images</strong>.
              Delete existing images to upload new ones.
            </p>
          </div>
        )}

        {/* ---- UPLOADING INDICATOR ---- */}
        {uploading && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
            <p className="text-sm text-blue-800">Uploading image(s), please wait...</p>
          </div>
        )}

        {/* ---- EMPTY STATE ---- */}
        {images.length === 0 ? (
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ImageIcon className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Images Yet</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Upload photos to showcase your ambulance service in action on the About page.
              </p>
              <label className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors">
                <ImagePlus className="h-4 w-4" />
                Upload First Photo
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </CardContent>
          </Card>
        ) : (
          /* ---- GALLERY GRID ---- */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="relative h-44 sm:h-48 cursor-pointer overflow-hidden"
                  onClick={() => setPreview(img)}
                >
                  <img
                    src={getImageUrl(img.image_url)}
                    alt={`Gallery ${img.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">
                      View
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3">
                  <span className="text-xs text-slate-400 font-medium">
                    #{img.id}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 h-7 px-2 text-xs"
                    onClick={() => setDeleteConfirm(img.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- DELETE CONFIRMATION ---- */}
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
              <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-red-50">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800">Delete Image?</h3>
                <p className="text-sm text-slate-500 mt-1">
                  This action cannot be undone. The image will be permanently removed.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ---- FULL-SIZE PREVIEW ---- */}
        {preview && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full p-2 transition-colors z-50"
              onClick={() => setPreview(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <button
              className="absolute top-4 left-4 text-white/80 hover:text-red-400 bg-black/40 hover:bg-red-900/50 rounded-full p-2 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation()
                setDeleteConfirm(preview.id)
                setPreview(null)
              }}
            >
              <Trash2 className="h-6 w-6" />
            </button>

            <img
              src={getImageUrl(preview.image_url)}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  )
}