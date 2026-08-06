"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { isTopDialogLayer, registerDialogLayer, unregisterDialogLayer } from "@/components/dashboard/ui/dialog-layer";

const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export function Modal({ title, description, children, footer, onClose, labelledBy }: { title: string; description?: string; children: ReactNode; footer?: ReactNode; onClose: () => void; labelledBy?: string }) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const layerIdRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    layerIdRef.current = registerDialogLayer();
    const panel = panelRef.current;
    window.requestAnimationFrame(() => {
      const first = panel?.querySelector<HTMLElement>(focusableSelector);
      (first ?? panel)?.focus();
    });
    function onKeyDown(event: KeyboardEvent) {
      const layerId = layerIdRef.current;
      if (!layerId || !isTopDialogLayer(layerId)) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); onCloseRef.current(); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter((el) => !el.hasAttribute("disabled"));
      if (!focusables.length) { event.preventDefault(); panelRef.current.focus(); return; }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (layerIdRef.current) unregisterDialogLayer(layerIdRef.current);
      openerRef.current?.focus();
    };
  }, []);
  const headingId = labelledBy ?? titleId;
  return <div className="fixed inset-0 z-[60] grid place-items-end bg-slate-950/45 p-3 sm:place-items-center" onMouseDown={onClose}>
    <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={headingId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1} className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl outline-none" onMouseDown={(event) => event.stopPropagation()}>
      <header className="border-b border-slate-200 p-4"><h2 id={headingId} className="text-lg font-bold text-slate-950">{title}</h2>{description ? <p id={descriptionId} className="mt-1 text-sm text-slate-600">{description}</p> : null}</header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      {footer ? <footer className="sticky bottom-0 border-t border-slate-200 bg-white p-4">{footer}</footer> : null}
    </div>
  </div>;
}
