import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children in a div that animates in when scrolled into view.
 * Uses IntersectionObserver — no external library needed.
 *
 * @param {string} animation  - 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in' | 'fade-in'
 * @param {number} delay      - animation delay in ms (for stagger effects)
 * @param {number} threshold  - how much of element must be visible (0-1)
 */
export default function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.12,
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`anim-section ${animation} ${visible ? 'anim-visible' : ''} ${className}`}
      style={{ '--anim-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
