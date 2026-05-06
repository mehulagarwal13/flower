import { useState } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_upload';

export default function CloudinaryUpload({ onUploadSuccess, currentImage = '' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setPreview(data.secure_url);
        onUploadSuccess(data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      setError('Upload failed. Please check your Cloudinary settings.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="cloudinary-upload">
      <div className="upload-container" style={{
        border: '2px dashed #ddd',
        borderRadius: '12px',
        padding: '1rem',
        textAlign: 'center',
        position: 'relative',
        background: '#f9f9f9'
      }}>
        {preview ? (
          <div className="preview-wrap" style={{ position: 'relative' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} 
            />
            <button 
              type="button"
              onClick={() => { setPreview(''); onUploadSuccess(''); }}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: '#ff4d4d',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label style={{ cursor: 'pointer', display: 'block', padding: '2rem' }}>
            <Upload size={32} style={{ color: '#8b5cf6', marginBottom: '0.5rem' }} />
            <p style={{ margin: 0, fontWeight: 500 }}>Click to upload image</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>PNG, JPG up to 5MB</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              style={{ display: 'none' }} 
              disabled={uploading}
            />
          </label>
        )}

        {uploading && (
          <div className="upload-overlay" style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px'
          }}>
            <Loader2 className="animate-spin" size={24} style={{ color: '#8b5cf6' }} />
          </div>
        )}
      </div>
      {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}
