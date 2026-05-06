// Cloudinary configuration for browser environment
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || 'demo_key',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'demo_secret'
};

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
export const uploadImage = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      size: data.bytes,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Generate optimized image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Image transformations
 * @returns {string} Optimized image URL
 */
export const getOptimizedUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  };
  
  const params = new URLSearchParams();
  Object.entries(defaultTransformations).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${params.toString()}/${publicId}`;
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteImage = async (publicId) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${CLOUDINARY_CONFIG.apiKey}:${CLOUDINARY_CONFIG.apiSecret}`)}`
        },
        body: JSON.stringify({ public_id: publicId })
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Upload options
 * @returns {Promise<Object[]>} Array of upload results
 */
export const uploadMultipleImages = async (files, options = {}) => {
  const uploadPromises = files.map(file => uploadImage(file, options));
  return Promise.all(uploadPromises);
};

/**
 * Create image gallery URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @param {Object} options - Additional options
 * @returns {string} Gallery image URL
 */
export const getGalleryUrl = (publicId, width = 400, height = 300, options = {}) => {
  return getOptimizedUrl(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    ...options
  });
};
