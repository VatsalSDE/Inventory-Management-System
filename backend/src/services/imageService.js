import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (fileBuffer, options = {}) => {
  try {
    // Convert buffer to base64 string
    const base64String = `data:${options.mimetype || 'image/jpeg'};base64,${fileBuffer.toString('base64')}`;
    
    // Upload to Cloudinary with optimization
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'inventory-system',
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Resize for web
        { quality: 'auto:good' }, // Optimize quality
        { fetch_format: 'auto' } // Auto-format (WebP if supported)
      ],
      ...options
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (publicId) => {
  try {
    if (!publicId) return;
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Don't throw error for deletion failures
  }
};

export const optimizeImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Add transformation parameters to URL
  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const imagePath = url.split('/upload/')[1];
  
  let transformations = '';
  if (options.width || options.height) {
    transformations += `w_${options.width || 'auto'},h_${options.height || 'auto'},c_scale/`;
  }
  if (options.quality) {
    transformations += `q_${options.quality}/`;
  }
  if (options.format) {
    transformations += `f_${options.format}/`;
  }
  
  return baseUrl + transformations + imagePath;
};
