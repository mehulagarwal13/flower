import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './CustomiserStyles.css';

export function HandmadeCardCustomiser({ options, onChange }) {
  const [sheetMaterial, setSheetMaterial] = useState(options.materials?.[0] || 'canvas');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [personalNote, setPersonalNote] = useState('');
  const [textColor, setTextColor] = useState('black');

  // Price based on material
  const materialPrices = {
    canvas: 299,
    chart: 249,
    a3: 199,
    a4: 149,
  };

  const basePrice = materialPrices[sheetMaterial] || 299;
  
  // Add Rs. 50 for each photo (for quality printing)
  const photoCost = uploadedPhotos.length * 50;
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
        sheetMaterial,
        photoCount: uploadedPhotos.length,
        personalNote,
        textColor,
        label: `${sheetMaterial} – ${uploadedPhotos.length} photo(s) – Custom message`,
      },
      totalPrice
    );
  };

  React.useEffect(() => {
    updatePrice();
  }, [sheetMaterial, uploadedPhotos.length, personalNote, textColor]);

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Choose Sheet Material</label>
        <div className="option-chips">
          {[
            { id: 'canvas', label: 'Canvas Sheet (₹299)', price: 299 },
            { id: 'chart', label: 'Chart Paper (₹249)', price: 249 },
            { id: 'a3', label: 'A3 Sheet (₹199)', price: 199 },
            { id: 'a4', label: 'A4 Sheet (₹149)', price: 149 },
          ].map((mat) => (
            <button
              key={mat.id}
              className={`option-chip ${sheetMaterial === mat.id ? 'option-chip--active' : ''}`}
              onClick={() => setSheetMaterial(mat.id)}
            >
              {mat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Upload Photos (Unlimited)</label>
        <label className="upload-label">
          <Upload size={20} />
          <span>Click to upload photos</span>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden multiple />
        </label>
        <p className="form-hint">
          Upload as many photos as you like! They will be beautifully arranged on your card.
          ({uploadedPhotos.length} photos uploaded)
        </p>
      </div>

      {uploadedPhotos.length > 0 && (
        <div className="photo-grid">
          {uploadedPhotos.map((photo, idx) => (
            <div key={idx} className="photo-item">
              <img src={photo.data} alt={`Photo ${idx + 1}`} />
              <button className="photo-remove" onClick={() => removePhoto(idx)}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Personal Note / Message</label>
        <textarea
          className="form-textarea"
          value={personalNote}
          onChange={(e) => setPersonalNote(e.target.value)}
          placeholder="Write a heartfelt message for your loved one... (e.g., 'Happy Birthday to my amazing friend!')"
          rows="4"
        />
        <p className="form-hint">Your message will be beautifully written on the card</p>
      </div>

      <div className="form-group">
        <label className="form-label">Text Color</label>
        <div className="color-picker">
          {['black', 'blue', 'red', 'gold', 'purple'].map((color) => (
            <button
              key={color}
              className={`color-option color-${color} ${textColor === color ? 'color-selected' : ''}`}
              onClick={() => setTextColor(color)}
              title={color}
            >
              {textColor === color && '✓'}
            </button>
          ))}
        </div>
      </div>

      <div className="price-display">
        {materialPrices[sheetMaterial]} + (₹50 × {uploadedPhotos.length} photos) = <span>₹{totalPrice}</span>
      </div>
    </div>
  );
}
