'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

/**
 * A list you put in order by dragging (mouse anywhere on a row, touch on the grip), with up / down
 * buttons for the keyboard. Rows move live while dragging.
 */
export function DragList<T extends string | number>({ items, onChange, disabled, label, render, rowClass }: {
  items: T[];
  onChange: (items: T[]) => void;
  disabled?: boolean;
  /** Names a row for the up / down buttons. */
  label: (item: T) => string;
  render: (item: T, pos: number) => ReactNode;
  rowClass?: (item: T, pos: number) => string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [dragging, setDragging] = useState<T | null>(null);
  // The window listeners need the latest list without re-subscribing mid-drag.
  const latest = useRef({ items, onChange });
  useEffect(() => { latest.current = { items, onChange }; });

  const move = (i: number, d: number) => {
    const a = [...items];
    [a[i], a[i + d]] = [a[i + d], a[i]];
    onChange(a);
  };

  useEffect(() => {
    if (dragging === null) return;
    function onMove(e: PointerEvent) {
      const rows = listRef.current ? [...listRef.current.children] as HTMLElement[] : [];
      const { items, onChange } = latest.current;
      const from = items.indexOf(dragging as T);
      // The new position is how many of the other rows sit above the pointer.
      const to = rows.filter((r, i) => {
        if (i === from) return false;
        const b = r.getBoundingClientRect();
        return e.clientY > b.top + b.height / 2;
      }).length;
      if (from < 0 || to === from) return;
      const a = [...items];
      a.splice(from, 1);
      a.splice(to, 0, dragging as T);
      onChange(a);
    }
    const stop = () => setDragging(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging]);

  function start(e: ReactPointerEvent, item: T) {
    const target = e.target as HTMLElement;
    if (disabled || e.button !== 0 || target.closest('button')) return;
    // Touch drags from the grip only, so the rest of the row still scrolls the page.
    if (e.pointerType !== 'mouse' && !target.closest('.drag-grip')) return;
    e.preventDefault();
    setDragging(item);
  }

  return (
    <ol ref={listRef} className={`sort-list rank-list drag-list${disabled ? '' : ' is-draggable'}`}>
      {items.map((it, pos) => (
        <li key={it} className={`${rowClass?.(it, pos) ?? ''}${dragging === it ? ' is-dragging' : ''}`} onPointerDown={(e) => start(e, it)}>
          {!disabled && <span className="drag-grip" aria-hidden="true">⠿</span>}
          <span className="sort-label">{render(it, pos)}</span>
          {!disabled && (
            <span className="rank-arrows">
              <button type="button" className="btn btn-sm icon-btn" aria-label={`Move ${label(it)} up`} disabled={pos === 0} onClick={() => move(pos, -1)}>↑</button>
              <button type="button" className="btn btn-sm icon-btn" aria-label={`Move ${label(it)} down`} disabled={pos === items.length - 1} onClick={() => move(pos, 1)}>↓</button>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
