import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

type Position = { left: number; top: number };

/** Positions are local to the workspace, so dragging never changes the mission or globe camera. */
export function usePanelDrag() {
  const panelRef = useRef<HTMLElement>(null);
  const home = useRef<Position | null>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; origin: Position } | null>(null);
  const [position, setPosition] = useState<Position | null>(null);

  const measure = () => {
    const panel = panelRef.current;
    const parent = panel?.offsetParent;
    if (!panel || !(parent instanceof HTMLElement)) return null;
    const frame = parent.getBoundingClientRect();
    const rect = panel.getBoundingClientRect();
    return { panel, parent, rect, left: rect.left - frame.left - parent.clientLeft, top: rect.top - frame.top - parent.clientTop };
  };
  const clamp = (next: Position): Position => {
    const bounds = measure();
    if (!bounds) return next;
    return {
      left: Math.max(8, Math.min(next.left, Math.max(8, bounds.parent.clientWidth - bounds.rect.width - 8))),
      top: Math.max(8, Math.min(next.top, Math.max(8, bounds.parent.clientHeight - bounds.rect.height - 8))),
    };
  };

  useLayoutEffect(() => {
    const bounds = measure();
    if (!bounds) return;
    home.current = { left: bounds.left, top: bounds.top };
    const fit = () => setPosition(current => {
      const next = clamp(current ?? home.current!);
      return current?.left === next.left && current?.top === next.top ? current : next;
    });
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(bounds.panel); observer.observe(bounds.parent);
    window.addEventListener('resize', fit);
    return () => { observer.disconnect(); window.removeEventListener('resize', fit); };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const bounds = measure();
    if (!bounds) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, origin: { left: bounds.left, top: bounds.top } };
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    event.stopPropagation();
    setPosition(clamp({ left: start.origin.left + event.clientX - start.x, top: start.origin.top + event.clientY - start.y }));
  };
  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 48 : 16;
    const offsets: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (event.key !== 'Home' && !offsets[event.key]) return;
    event.preventDefault(); event.stopPropagation();
    const bounds = measure();
    if (!bounds) return;
    const [x, y] = offsets[event.key] ?? [0, 0];
    setPosition(clamp(event.key === 'Home' ? home.current! : { left: bounds.left + x, top: bounds.top + y }));
  };

  return {
    panelRef,
    style: { animation: 'none', ...(position ? { ...position, bottom: 'auto', transform: 'none' } : {}) },
    handleProps: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onLostPointerCapture: endDrag, onKeyDown },
  };
}
