'use client';
/* eslint-disable @next/next/no-img-element -- same pre-sized photos as the thumbnail */

import { useRef } from 'react';

/**
 * A `.photo` box whose image opens full-screen when clicked (Esc, a click, or × closes it).
 * `children` are overlays drawn on the thumbnail, like the "Community photo" tag.
 */
export function ZoomPhoto({ src, alt, className = 'photo', loading, children }: {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  children?: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <div className={className}>
      <button type="button" className="zoom-btn" aria-label={`Enlarge: ${alt}`} onClick={() => dialog.current?.showModal()}>
        <img src={src} alt={alt} loading={loading} />
      </button>
      {children}
      <dialog ref={dialog} className="lightbox" onClick={() => dialog.current?.close()}>
        <img src={src} alt={alt} />
        <button type="button" className="lightbox-close" aria-label="Close">×</button>
      </dialog>
    </div>
  );
}
