"use client";

import { type ReactNode } from "react";
import { Modal } from "@/components/dashboard/ui/Modal";

export function Drawer({ title, description, children, footer, onClose }: { title: string; description?: string; children: ReactNode; footer?: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-950/35 sm:items-stretch" onMouseDown={onClose}>
    <div onMouseDown={(event) => event.stopPropagation()} className="h-[min(94dvh,100%)] w-full sm:h-full sm:max-w-[560px]">
      <Modal title={title} description={description} footer={footer} onClose={onClose}>{children}</Modal>
    </div>
  </div>;
}
