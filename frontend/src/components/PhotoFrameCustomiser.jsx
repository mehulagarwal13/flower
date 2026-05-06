import { useState } from 'react';
import { Plus, Minus, Upload, X, ChevronDown } from 'lucide-react';
import './CustomiserStyles.css';

export function PhotoFrameCustomiser({ options, onChange }) {
  const [size, setSize] = useState('A3');
  const [numPhotos, setNumPhotos] = useState(6);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [matColor, setMatColor] = useState(options.matColors?.[0] || 'black');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Price calculation: 6 photos = Rs. 50 base + labour
  const basePrice = 50;
  const photoCost = numPhotos > 6 ? (numPhotos - 6) * 10 : 0; // Rs. 10 per extra photo
  const totalPrice = basePrice + photoCost;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhotos([...uploadedPhotos, { name: file.name, data: event.target.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const updatePrice = () => {
    onChange(
      {
        size,
        numPhotos,
        matColor,
        uploadedPhotos: uploadedPhotos.length,
        label: `${size} Frame – ${numPhotos} photos – ${matColor} mat`,
      },
      totalPrice
    );
  };

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(6, numPhotos + delta);
    setNumPhotos(newQty);
  };

  // Update onChange whenever dependencies change
  React.useEffect(() => {
    updatePrice();
  }, [size, numPhotos, matColor]);

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Frame Size</label>
        <div className="option-chips">
          {['A3', 'A4', 'A5', 'Custom'].map((s) => (
            <button
              key={s}
              className={`option-chip ${size === s ? 'option-chip--active' : ''}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Number of Photos (1 sheet = 6 photos)</label>
        <div className="qty-selector">
          <button onClick={() => handleQuantityChange(-1)} className="qty-btn">
            <Minus size={18} />
          </button>
          <input
            type="number"
            min="6"
            value={numPhotos}
            onChange={(e) => setNumPhotos(Math.max(6, parseInt(e.target.value) || 6))}
            className="qty-input"
          />
          <button onClick={() => handleQuantityChange(1)} className="qty-btn">
            <Plus size={18} />
          </button>
        </div>
        <p className="form-hint">
          You need <strong>{Math.ceil(numPhotos / 6)}</strong> sheet(s). ({numPhotos} ÷ 6 = {Math.ceil(numPhotos / 6)} sheets)
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Mat/Moulding Color</label>
        <div className="option-chips">
          {(options.matColors || ['Black', 'Brown', 'White', 'Gold']).map((color) => (
            <button
              key={color}
              className={`option-chip ${matColor === color ? 'option-chip--active' : ''}`}
              onClick={() => setMatColor(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Upload Photos ({uploadedPhotos.length} uploaded)</label>
        <label className="upload-label">
          <Upload size={20} />
          <span>Click to upload photos</span>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
        </label>
        <p className="form-hint">Upload as many photos as you need. They will be arranged in your frame.</p>
      </div>

      {uploadedPhotos.length > 0 && (
        <div className="photo-grid">
          {uploadedPhotos.map((photo, idx) => (
            <div key={idx} className="photo-item">
              <img src={photo.data} alt={`Photo ${idx + 1}`} />
              <button className="photo-remove" onClick={() => removePhoto(idx)}>
                <X size={16} />
              </button>
              <p className="photo-name">{photo.name}</p>
            </div>
          ))}
        </div>
      )}

      <div className="price-display">
        ₹{basePrice} base + ₹{photoCost} extra = <span>₹{totalPrice}</span>
      </div>
    </div>
  );
}
