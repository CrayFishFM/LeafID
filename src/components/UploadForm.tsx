'use client';
/* eslint-disable @next/next/no-img-element -- local preview via object URL */

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { IdentifyResult } from '@/lib/plantnet';
import { speciesLabel } from '@/lib/leaf-shared';
import { useLeaf } from './LeafProvider';
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

export function UploadForm({ isAdmin, canIdentify }: { isAdmin: boolean; canIdentify: boolean }) {
  const router = useRouter();
  const leaf = useLeaf();
  const [file, setFile] = useState<File | null>(null);
  const [suggest, setSuggest] = useState<IdentifyResult | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [species, setSpecies] = useState('');
  const [note, setNote] = useState('');
  const [approve, setApprove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Identify and submit send the same bytes, so the server can reuse its Pl@ntNet result.
  const prepared = useRef<{ file: File; blob: Promise<Blob> } | null>(null);
  function preparedBlob(f: File): Promise<Blob> {
    if (prepared.current?.file !== f) {
      const blob = prepare(f);
      blob.catch(() => { prepared.current = null; });
      prepared.current = { file: f, blob };
    }
    return prepared.current.blob;
  }

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derive preview URL from the chosen file
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function identify() {
    if (!file) return;
    setIdentifying(true);
    setError(null);
    try {
      const body = new FormData();
      body.set('photo', await preparedBlob(file), 'leaf.jpg');
      const res = await fetch('/api/identify', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Identification failed');
      setSuggest(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIdentifying(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !species) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.set('photo', await preparedBlob(file), 'leaf.jpg');
      body.set('species', species);
      body.set('note', note);
      if (approve) body.set('approve', '1');
      const res = await fetch('/api/submissions', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      router.push(`/community/mine?uploaded=${json.auto ? 'auto' : json.approved ? 'approved' : '1'}`);
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
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); setSuggest(null); }}
        />
        <span className="small muted">Take a new photo or choose one from your photo library.</span>
      </div>
      {preview && <div className="photo"><img src={preview} alt="Preview of your upload" /></div>}
      <div className="field">
        <label htmlFor="species">What do you think it is?</label>
        <SpeciesSelect id="species" value={species} onChange={(e) => setSpecies(e.target.value)} required />
      </div>
      {canIdentify && file && !suggest && (
        <button type="button" className="btn btn-sm" style={{ alignSelf: 'flex-start' }} disabled={identifying} onClick={identify}>
          {identifying ? 'Identifying…' : 'Not sure? Suggest a species'}
        </button>
      )}
      {suggest && (
        <div className="notice stack small" style={{ gap: '0.5rem' }}>
          {suggest.matches.length > 0 ? (
            <>
              <strong>Possible matches — tap one to choose it:</strong>
              {suggest.matches[0].score < 0.15 && (
                <span>Low confidence: a closer, sharper photo of a single leaf usually helps.</span>
              )}
              <div className="row" style={{ gap: '0.5rem' }}>
                {suggest.matches.map((m) => (
                  <button
                    key={m.speciesId} type="button"
                    className={`btn btn-sm${species === m.speciesId ? ' btn-primary' : ''}`}
                    onClick={() => setSpecies(m.speciesId)}
                  >
                    {speciesLabel(leaf, m.speciesId)} · {m.score < 0.01 ? '<1' : Math.round(m.score * 100)}%
                    {!m.exact && <span className="muted"> (closest: <em>{m.plantnetName}</em>)</span>}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <span>None of the species we teach matched this photo.</span>
          )}
          {suggest.outside && (
            <span>
              Pl@ntNet&apos;s top guess is <em>{suggest.outside.name}</em>
              {suggest.outside.commonName && ` (${suggest.outside.commonName})`}, which isn&apos;t on our list.
            </span>
          )}
          <span className="muted">Suggestions by Pl@ntNet. Check them against the leaf before submitting.</span>
        </div>
      )}
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
