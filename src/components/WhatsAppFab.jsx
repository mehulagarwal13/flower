import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

export default function WhatsAppFab() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I'd%20like%20to%20order%20from%20LoveKraft%20%F0%9F%92%96`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="whatsapp-fab" aria-label="Chat on WhatsApp" id="whatsapp-fab">
      <MessageCircle size={28} />
    </a>
  );
}
