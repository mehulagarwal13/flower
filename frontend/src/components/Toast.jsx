import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const icons = { success: <CheckCircle size={18} />, error: <AlertCircle size={18} />, info: <Info size={18} /> };

export default function Toast() {
  const { toasts } = useToast();
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {icons[t.type] || icons.success}
          {t.message}
        </div>
      ))}
    </div>
  );
}
