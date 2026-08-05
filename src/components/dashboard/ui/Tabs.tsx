"use client";

import { useId } from "react";

type TabItem<T extends string> = { value: T; label: string; count?: number };

export function Tabs<T extends string>({ label, value, tabs, onChange, children }: { label: string; value: T; tabs: readonly TabItem<T>[]; onChange: (value: T) => void; children?: React.ReactNode }) {
  const baseId = useId();
  function move(nextIndex: number) {
    const next = tabs[(nextIndex + tabs.length) % tabs.length];
    onChange(next.value);
    window.requestAnimationFrame(() => document.getElementById(`${baseId}-${next.value}-tab`)?.focus());
  }
  return <>
    <div role="tablist" aria-label={label} className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
      {tabs.map((tab, index) => <button key={tab.value} id={`${baseId}-${tab.value}-tab`} type="button" role="tab" aria-selected={value === tab.value} aria-controls={`${baseId}-${tab.value}-panel`} tabIndex={value === tab.value ? 0 : -1} onClick={() => onChange(tab.value)} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); move(index + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(index - 1); } if (event.key === "Home") { event.preventDefault(); move(0); } if (event.key === "End") { event.preventDefault(); move(tabs.length - 1); } }} className={`min-h-11 whitespace-nowrap rounded-md px-3 text-xs font-bold outline-none ring-offset-2 focus:ring-2 focus:ring-teal-500 sm:min-h-9 ${value === tab.value ? "bg-white text-teal-900 shadow-sm underline decoration-2 underline-offset-4" : "text-slate-600 hover:text-slate-950"}`}>{tab.label} {typeof tab.count === "number" ? <span className="text-slate-500">{tab.count}</span> : null}</button>)}
    </div>
    <div id={`${baseId}-${value}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${value}-tab`} className="outline-none">{children}</div>
  </>;
}
