"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";

type Picture = { src: string; alt: string };
type Props = { photos: Picture[]; onOpen?: (src: string) => void };
const MOD = (v: number, n: number) => ((v % n) + n) % n;

/** A lightweight, responsive 3D rotating photography carousel.
 * Only seven images are mounted, regardless of library size. */
export default function SmearCarousel({ photos, onOpen }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const value = useRef(0);
  const target = useRef(0);
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const pointer = useRef<{ x: number; y: number; start: number } | null>(null);
  const [position, setPosition] = useState(0);
  const [motionSpeed, setMotionSpeed] = useState(0);
  const [width, setWidth] = useState(1100);
  const [reduced, setReduced] = useState(false);
  const total = photos.length;

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(m.matches);
    change(); m.addEventListener("change", change);
    return () => m.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const measure = () => setWidth(node.clientWidth);
    measure();
    const ro = new ResizeObserver(measure); ro.observe(node);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!total) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, .05);
      last = now;
      // very gentle idle motion; stop when hovered or dragging
      if (!reduced && !isDragging.current && !hostRef.current?.matches(":hover")) target.current += dt * .095;
      const delta = target.current - value.current;
      const step = reduced ? delta : delta * Math.min(1, dt * 10);
      value.current += step;
      velocity.current = velocity.current * .84 + (dt ? step / dt : 0) * .16;
      setPosition(value.current);
      setMotionSpeed(Math.min(12, Math.abs(velocity.current) * 1.5));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total, reduced]);

  const move = useCallback((delta: number) => {
    target.current += delta;
  }, []);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDragging.current = true;
    pointer.current = { x: e.clientX, y: e.clientY, start: target.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointer.current) return;
    const distance = e.clientX - pointer.current.x;
    target.current = pointer.current.start - distance / Math.max(170, width * .28);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointer.current) return;
    const moved = Math.abs(e.clientX - pointer.current.x);
    pointer.current = null;
    isDragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (moved > 5) target.current = Math.round(target.current);
  };
  const cardWidth = Math.min(580, Math.max(225, width * (width < 600 ? .73 : .48)));
  const cardHeight = cardWidth * .64;
  if (!total) return null;
  const center = Math.round(position);
  const cards = [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const i = MOD(center + offset, total);
    const relative = center + offset - position;
    const distance = Math.abs(relative);
    const turn = Math.sign(relative) * Math.min(75, distance * 42);
    const x = relative * (cardWidth * .72 + 26);
    const z = -distance * 170;
    const scale = 1 - Math.min(.30, distance * .13);
    const photo = photos[i];
    return { key: center + offset, i, photo, relative, distance, turn, x, z, scale };
  });

  return (
    <div className="smear-host" ref={hostRef} tabIndex={0} role="region" aria-label="Interactive 3D photo gallery. Swipe or use arrow keys to browse"
      onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}
      onWheel={(e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) move((e.deltaX || e.deltaY) * .003); }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="smear-stage" style={{ height: Math.round(cardHeight * 1.50) }}>
        {cards.map(({ key, i, photo, relative, distance, turn, x, z, scale }) => (
          <button key={key} type="button" className="smear-card"
            tabIndex={distance < .55 ? 0 : -1} aria-label={`View gallery image ${i + 1}`}
            onClick={() => {
              if (distance > .55) target.current += relative;
              else onOpen?.(photo.src);
            }}
            style={{ width: cardWidth, height: cardHeight,
              transform: `translate3d(calc(-50% + ${x}px), -50%, ${z}px) rotateY(${-turn}deg) scale(${scale})`,
              zIndex: 50 - Math.round(distance * 10), opacity: distance >= 3.6 ? 0 : 1 }}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 600px) 78vw, 580px" quality={72}
              priority={distance < .6} draggable={false} className="smear-card-image"
              style={{ filter: reduced ? "none" : `blur(${Math.min(5, motionSpeed * Math.min(1, distance * .3))}px)` }}/>
          </button>
        ))}
      </div>
      <div className="smear-edge smear-edge-left" aria-hidden="true" />
      <div className="smear-edge smear-edge-right" aria-hidden="true" />
      <div className="smear-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
        <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
      </div>
    </div>
  );
}
