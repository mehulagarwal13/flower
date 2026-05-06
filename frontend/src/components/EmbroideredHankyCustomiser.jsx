import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './CustomiserStyles.css';

export function EmbroideredHankyCustomiser({ options, onChange }) {
  const [gender, setGender] = useState('female');
  const [designType, setDesignType] = useState('sample');
  const [selectedSample, setSelectedSample] = useState(null);
  const [customDesignDescription, setCustomDesignDescription] = useState('');
  const [inspirationPhotos, setInspirationPhotos] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const basePrice = 299;
  const complexityAddon = designType === 'custom' ? 100 : 0;
  const totalPrice = basePrice + complexityAddon;

  // Sample designs gallery
  const sampleDesigns = {
    female: [
      { id: 'f1', name: 'Floral Pattern', image: '🌸', description: 'Delicate flowers' },
      { id: 'f2', name: 'Hearts', image: '❤️', description: 'Golden hearts' },
      { id: 'f3', name: 'Mandala', image: '🌺', description: 'Intricate mandala' },
      { id: 'f4', name: 'Peacock', image: '🦚', description: 'Elegant peacock' },
    ],
    male: [
      { id: 'm1', name: 'Geometric', image: '⬛', description: 'Modern geometric' },
      { id: 'm2', name: 'Abstract', image: '◆', description: 'Bold abstract' },
      { id: 'm3', name: 'Monogram', image: '📝', description: 'Custom initials' },
      { id: 'm4', name: 'Sports', image: '⚽', description: 'Sports themed' },
    ],
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInspirationPhotos([...inspirationPhotos, { name: file.name, data: event.target.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeInspiration = (index) => {
    setInspirationPhotos(inspirationPhotos.filter((_, i) => i !== index));
  };

  const updatePrice = () => {
    const designLabel = designType === 'sample' 
      ? (sampleDesigns[gender].find(d => d.id === selectedSample)?.name || 'Design')
      : 'Custom Design';
    
    onChange(
      {
        gender,
        designType,
        selectedSample,
        customDescription: customDesignDescription,
        inspirationCount: inspirationPhotos.length,
        specialInstructions,
        label: `${gender === 'female' ? 'For Her' : 'For Him'} – ${designLabel} Hanky`,
      },
      totalPrice
    );
  };

  React.useEffect(() => {
    updatePrice();
  }, [gender, designType, selectedSample, customDesignDescription, inspirationPhotos.length, specialInstructions]);

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Who is this for?</label>
        <div className="option-chips">
          <button
            className={`option-chip ${gender === 'female' ? 'option-chip--active' : ''}`}
            onClick={() => { setGender('female'); setSelectedSample(null); }}
          >
            👸 For Her
          </button>
          <button
            className={`option-chip ${gender === 'male' ? 'option-chip--active' : ''}`}
            onClick={() => { setGender('male'); setSelectedSample(null); }}
          >
            👨 For Him
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Choose Design Type</label>
        <div className="option-chips">
          <button
            className={`option-chip ${designType === 'sample' ? 'option-chip--active' : ''}`}
            onClick={() => setDesignType('sample')}
          >
            Browse Samples
          </button>
          <button
            className={`option-chip ${designType === 'custom' ? 'option-chip--active' : ''}`}
            onClick={() => setDesignType('custom')}
          >
            Custom Design (+₹100)
          </button>
        </div>
      </div>

      {designType === 'sample' ? (
        <div className="form-group">
          <label className="form-label">Select a Sample Design</label>
          <div className="design-gallery">
            {sampleDesigns[gender].map((design) => (
              <button
                key={design.id}
                className={`design-card ${selectedSample === design.id ? 'design-card--selected' : ''}`}
                onClick={() => setSelectedSample(design.id)}
              >
                <div className="design-emoji">{design.image}</div>
                <div className="design-name">{design.name}</div>
                <div className="design-desc">{design.description}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">Describe Your Custom Design</label>
            <textarea
              className="form-textarea"
              value={customDesignDescription}
              onChange={(e) => setCustomDesignDescription(e.target.value)}
              placeholder="Describe your dream design... (e.g., 'A phoenix with golden threads and red accents')"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Inspiration Photos (Optional)</label>
            <label className="upload-label">
              <Upload size={20} />
              <span>Upload inspiration images</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
            </label>
            <p className="form-hint">Upload images of designs you like. We'll use them as inspiration.</p>
          </div>

          {inspirationPhotos.length > 0 && (
            <div className="photo-grid">
              {inspirationPhotos.map((photo, idx) => (
                <div key={idx} className="photo-item">
                  <img src={photo.data} alt={`Inspiration ${idx + 1}`} />
                  <button className="photo-remove" onClick={() => removeInspiration(idx)}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="form-group">
        <label className="form-label">Special Instructions (Optional)</label>
        <textarea
          className="form-textarea"
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Any specific color preferences, initials to add, or other details?"
          rows="2"
        />
      </div>

      <div className="form-hint" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f1e8', borderRadius: '8px' }}>
        <strong>📍 Pure Cotton, Best Quality</strong><br/>
        Handmade with love using premium pure cotton cloth. Each hanky is unique and takes 3-5 days to embroider.
      </div>

      <div className="price-display">
        Base: ₹{basePrice} {complexityAddon > 0 && `+ Custom Design: ₹${complexityAddon}`} = <span>₹{totalPrice}</span>
      </div>
    </div>
  );
}
