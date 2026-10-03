'use client';
/* eslint-disable @next/next/no-img-element -- local preview via object URL */

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SpeciesSelect } from './SpeciesSelect';

const MAX_SIDE = 1600;

/**
 * Shrink large phone photos and convert them to JPEG before upload (so iPhone HEIC photos
 * work too); also strips EXIF, including GPS location.
 */
async function prepare(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // e.g. a HEIC file on a desktop browser that can't decode it.
    throw new Error("This browser can't open that image format. Try a JPEG or PNG, or upload from your phone.");
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/jpeg', 0.85),
  );
}

export function UploadForm({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [species, setSpecies] = useState('');
  const [note, setNote] = useState('');
  const [approve, setApprove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derive preview URL from the chosen file
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !species) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.set('photo', await prepare(file), 'leaf.jpg');
      body.set('species', species);
      body.set('note', note);
      if (approve) body.set('approve', '1');
      const res = await fetch('/api/submissions', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      router.push(`/community/mine?uploaded=${json.approved ? 'approved' : '1'}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form className="card stack" onSubmit={onSubmit} style={{ maxWidth: 560 }}>
      <h2 style={{ margin: 0 }}>Upload a leaf photo</h2>
      <p className="small muted" style={{ margin: 0 }}>
        Best results: one leaf (or a twig with a few leaves) filling the frame, on a plain background, in good light.
      </p>
      <div className="field">
        <label htmlFor="photo">Photo</label>
        <input
          // No `capture` attribute: on phones that would force the camera; without it iOS/Android
          // offer the photo library, the camera, or files. Any image type is accepted because
          // prepare() converts it to JPEG.
          id="photo" type="file" accept="image/*" className="input" required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <span className="small muted">Take a new photo or choose one from your photo library.</span>
      </div>
      {preview && <div className="photo"><img src={preview} alt="Preview of your upload" /></div>}
      <div className="field">
        <label htmlFor="species">What do you think it is?</label>
        <SpeciesSelect id="species" value={species} onChange={(e) => setSpecies(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="note">Note (optional)</label>
        <textarea
          id="note" className="input" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Found along a creek near Guelph, twigs were opposite"
        />
      </div>
      {isAdmin && (
        <label className="row small" style={{ gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={approve} onChange={(e) => setApprove(e.target.checked)} />
          <span><strong>Approve immediately</strong> (admin) — skip the community vote and add it to practice now</span>
        </label>
      )}
      {error && <div className="error" role="alert">{error}</div>}
      <button className="btn btn-primary" disabled={busy || !file || !species}>
        {busy ? 'Uploading…' : approve ? 'Upload and approve' : 'Submit for review'}
      </button>
    </form>
  );
}
