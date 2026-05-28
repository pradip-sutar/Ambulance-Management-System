const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL 

export async function uploadGalleryImage(file) {
  const formData = new FormData()

  formData.append("file", file)

  const res = await fetch(
    `${API_BASE_URL}/gallery/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  return res.json()
}

export async function getGalleryImages() {
  const res = await fetch(`${API_BASE_URL}/gallery/`)

  return res.json()
}

export async function deleteGalleryImage(id) {
  const res = await fetch(
    `${API_BASE_URL}/gallery/${id}`,
    {
      method: "DELETE",
    }
  )

  return res.json()
}