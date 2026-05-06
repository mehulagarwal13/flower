import { useState } from 'react';
import { MessageCircle, MapPin, Calendar, Clock } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

export function CabBookingCustomiser({ onChange }) {
  const [bookingType, setBookingType] = useState('whatsapp'); // whatsapp or form
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const basePrice = 0; // Price varies - will be quoted by shop

  const handleWhatsAppBooking = () => {
    const message = `Hi! I'd like to book a cab. From: ${pickupLocation}, To: ${destination}, Date: ${bookingDate}, Time: ${bookingTime}, Passengers: ${passengers}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const updatePrice = () => {
    onChange(
      {
        bookingType,
        pickupLocation,
        destination,
        bookingDate,
        bookingTime,
        passengers,
        specialRequests,
        label: `Cab from ${pickupLocation || '...'} to ${destination || '...'}`,
      },
      basePrice
    );
  };

  React.useEffect(() => {
    updatePrice();
  }, [bookingType, pickupLocation, destination, bookingDate, bookingTime, passengers, specialRequests]);

  return (
    <div className="customiser">
      <div className="form-group">
        <label className="form-label">Booking Method</label>
        <div className="option-chips">
          <button
            className={`option-chip ${bookingType === 'whatsapp' ? 'option-chip--active' : ''}`}
            onClick={() => setBookingType('whatsapp')}
          >
            <MessageCircle size={18} style={{ marginRight: '0.5rem' }} />
            WhatsApp Booking (Fast)
          </button>
          <button
            className={`option-chip ${bookingType === 'form' ? 'option-chip--active' : ''}`}
            onClick={() => setBookingType('form')}
          >
            📋 Booking Form
          </button>
        </div>
      </div>

      {bookingType === 'form' ? (
        <>
          <div className="form-group">
            <label className="form-label">Pickup Location</label>
            <input
              type="text"
              className="form-input"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g., Sector 5, Hisar"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Destination</label>
            <input
              type="text"
              className="form-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Airport, Railway Station"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Travel</label>
            <input
              type="date"
              className="form-input"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Time</label>
            <input
              type="time"
              className="form-input"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Passengers</label>
            <div className="qty-selector">
              <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="qty-btn">−</button>
              <input
                type="number"
                min="1"
                max="6"
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                className="qty-input"
              />
              <button onClick={() => setPassengers(Math.min(6, passengers + 1))} className="qty-btn">+</button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Special Requests (Optional)</label>
            <textarea
              className="form-textarea"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements? (e.g., AC cab, luggage space, etc.)"
              rows="2"
            />
          </div>

          <div className="form-hint">
            <strong>ℹ️ Note:</strong> We'll contact you to confirm availability and quote the fare based on your route.
          </div>
        </>
      ) : (
        <div className="form-group">
          <div className="form-hint" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
            <MessageCircle size={32} style={{ margin: '0 auto 1rem', color: '#25d366' }} />
            <h4 style={{ margin: '0.5rem 0' }}>Quick WhatsApp Booking</h4>
            <p>Click below to chat with us on WhatsApp. Share your pickup, destination, and preferred time.</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleWhatsAppBooking}
              style={{ marginTop: '1rem', backgroundColor: '#25d366' }}
            >
              💬 Chat on WhatsApp
            </button>
          </div>
        </div>
      )}

      <div className="price-display">
        Price: <span>To be confirmed</span>
      </div>
    </div>
  );
}
