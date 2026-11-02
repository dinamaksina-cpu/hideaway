"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Picture = { src: string; alt: string };
type Props = { photos: Picture[]; onOpen?: (src: string) => void; onViewAll?: () => void };
const mod = (x: number, n: number) => ((x % n) + n) % n;

/** Smooth horizontal photo rail, adapted to The Hideaway.
 * Only nine nearby images are mounted, regardless of gallery size.
 * Pointer/wheel target follows an eased scroll offset; each card scales with its
 * position relative to the centre, with larger cards arriving from the right.
 */
export default function SmoothScrollSlider({ photos, onOpen, onViewAll }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const target = useRef(0);
  const position = useRef(0);
  const pointer = useRef<{ id: number; x: number; origin: number; dragged: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [center, setCenter] = useState(0);
  const [width, setWidth] = useState(1000);
  const [reduced, setReduced] = useState(false);
  const total = photos.length;
  const wheelLimit = Math.min(10, total);
  const slideWidth = Math.min(450, Math.max(205, width * (width < 680 ? .68 : .33)));
  const slideHeight = slideWidth * .89;
  const step = slideWidth + Math.min(28, width * .025);
  const indexes = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const resize = () => setWidth(el.clientWidth || 1000);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync(); mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const wheel = (event: WheelEvent) => {
      if (!total) return;
      const amount = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      // Wheel moves through only the first ten items. At either edge, the page scrolls normally.
      if (amount > 0 && target.current >= wheelLimit - 1) return;
      if (amount < 0 && target.current <= 0) return;
      event.preventDefault();
      target.current = Math.max(0, Math.min(wheelLimit - 1, target.current + Math.max(-250, Math.min(250, amount)) / step * .65));
    };
    host.addEventListener('wheel', wheel, { passive: false });
    return () => host.removeEventListener('wheel', wheel);
  }, [step, total, wheelLimit]);
  useEffect(() => {
    if (!total) return;
    let raf = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(.05, (now - previous)/1000);
      previous = now;
      const k = reduced ? 1 : 1 - Math.pow(.87, elapsed*60);
      position.current += (target.current - position.current) * k;
      const nearest = Math.round(position.current);
      setCenter(old => old === nearest ? old : nearest);
      cardRefs.current.forEach((node, slot) => {
        if (!node) return;
        const relative = nearest + (slot - 4) - position.current;
        const distancePx = relative * step;
        const distance = distancePx / Math.max(width, 1);
        const scale = distance > 0 ? Math.min(1.75, 1 + distance*.65) : Math.max(.55, 1 + distance*.85);
        const push = distance > 0 ? (scale - 1) * slideWidth*.65 : 0;
        const x = (width-slideWidth)/2 + distancePx + push;
        node.style.transform = `translate3d(${x}px,-50%,0) scale(${scale})`;
        node.style.opacity = String(Math.max(0, 1 - Math.max(0, Math.abs(relative)-2.5)*.38));
        node.style.zIndex = String(100 - Math.round(Math.abs(relative)*10));
        node.style.filter = distance < 0 ? `brightness(${Math.max(.75, 1 + distance*.25)})` : 'none';
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step, width, slideWidth, reduced, total]);

  const down = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointer.current = { id:event.pointerId, x:event.clientX, origin:target.current, dragged:false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== event.pointerId) return;
    const delta = event.clientX - p.x;
    if (Math.abs(delta) > 8) p.dragged = true;
    target.current = p.origin - delta / step;
  };
  const up = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    const dragged = pointer.current.dragged;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (dragged) { target.current = Math.round(target.current); suppressClick.current = true; }
  };
  if (!total) return null;
  return (
    <div>
      <div ref={hostRef} className="hideaway-smooth-host" role="region" aria-label="The Hideaway photo slider" tabIndex={0}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); target.current += 1; } if (event.key === 'ArrowLeft') { event.preventDefault(); target.current -= 1; } }}>
        {indexes.map((offset, slot) => {
          const i = mod(center + offset,total);
          const photo = photos[i];
          return <button key={slot} type="button" ref={node => {cardRefs.current[slot]=node;}}
            className="hideaway-smooth-card" aria-label="Open photo" onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } if (!pointer.current) onOpen?.(photo.src); }}
            style={{width:slideWidth,height:slideHeight}}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 680px) 75vw, 450px" quality={75} draggable={false}/>
          </button>;
        })}
        <span aria-hidden="true" className="hideaway-smooth-edge hideaway-smooth-edge--left"/>
        <span aria-hidden="true" className="hideaway-smooth-edge hideaway-smooth-edge--right"/>
      </div>
      <div className="hideaway-smooth-controls">
        <button type="button" aria-label="Previous photo" onClick={() => {target.current-=1;}}><ChevronLeft size={20}/></button>
        <button type="button" aria-label="Next photo" onClick={() => {target.current+=1;}}><ChevronRight size={20}/></button>
      </div>
      <div className="hideaway-smooth-all"><button type="button" onClick={onViewAll}>View all photos</button></div>
    </div>
  );
}
