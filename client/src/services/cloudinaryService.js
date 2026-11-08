/**
 * cloudinaryService.js
 * Handles image uploads to Cloudinary via unsigned upload preset.
 * Falls back to local object-URL when env vars are missing (dev convenience).
 */

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const CLOUDINARY_URL = CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  : null

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn(
    '[CampusFix] Cloudinary env vars not set. ' +
    'Images will use local object-URLs. ' +
    'Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env'
  )
}

/**
 * uploadImage(file, onProgress)
 *
 * Uploads a single File to Cloudinary (or falls back to a local object-URL).
 *
 * @param {File}     file        The (possibly compressed) image file
 * @param {Function} onProgress  Called with 0-100 percentage
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadImage(file, onProgress = () => {}) {
  // ── Dev fallback when Cloudinary is not configured ──────────────────────
  if (!CLOUDINARY_URL) {
    // Simulate a small delay and progress ticks
    await new Promise((res) => setTimeout(res, 400))
    onProgress(50)
    await new Promise((res) => setTimeout(res, 300))
    onProgress(100)
    const url = URL.createObjectURL(file)
    return { url, publicId: `local_${Date.now()}` }
  }

  // ── Real Cloudinary upload via XMLHttpRequest (supports progress) ────────
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', CLOUDINARY_URL)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve({ url: data.secure_url, publicId: data.public_id })
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

    xhr.send(formData)
  })
}
