"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { buildRooms, groupRoomsByFloor, OPEN_ITEM_ROOMS, type Room } from "@/lib/rooms";

const logEntries = [
  { time: "10:24 AM", room: "Room 204", message: "Two towel sets requested.", category: "Guest request" },
  { time: "9:48 AM", room: "Room 317", message: "Maintenance issue remains open.", category: "Maintenance" },
  { time: "8:15 AM", room: null, message: "Night audit completed with no escalations.", category: "Shift note" },
  { time: "7:40 AM", room: "Room 508", message: "Missing robe flagged for supervisor review.", category: "Housekeeping" },
  { time: "7:05 AM", room: null, message: "Breakfast staffing confirmed for the morning rush.", category: "Operations" },
];

const announcements = [
  { title: "Pool deck closes at 9:00 PM tonight.", meta: "Guest services" },
  { title: "Quiet-hours reminder for team handoff.", meta: "Front Desk" },
  { title: "VIP arrivals require manager greeting.", meta: "Today" },
];

const calendarEvents = [
  { event: "Staff meeting", time: "Friday, 2:00 PM" },
  { event: "Linen delivery", time: "Monday, 9:00 AM" },
  { event: "Pool maintenance", time: "Tuesday, 7:00 AM" },
];

export function Dashboard() {
  const rooms = useMemo(() => buildRooms(), []);
  const roomsByFloor = useMemo(() => groupRoomsByFloor(rooms), [rooms]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const selectedRoomButtonRef = useRef<HTMLButtonElement | null>(null);

  const openItemCount = OPEN_ITEM_ROOMS.length;

  function openRoom(room: Room, button: HTMLButtonElement) {
    selectedRoomButtonRef.current = button;
    setSelectedRoom(room);
  }

  function closeRoom() {
    setSelectedRoom(null);
    window.requestAnimationFrame(() => selectedRoomButtonRef.current?.focus());
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1480px] space-y-4 px-4 py-4 lg:px-6 lg:py-5">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" aria-labelledby="dashboard-title">
          <div>
            <h1 id="dashboard-title" className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[26px]">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Front Desk operational overview</p>
          </div>
          <dl className="flex flex-wrap gap-2 text-xs font-medium text-slate-700">
            <SummaryStat label="Rooms" value={rooms.length.toString()} />
            <SummaryStat label="Open items" value={openItemCount.toString()} tone="alert" />
          </dl>
        </section>

        <RoomBoard roomsByFloor={roomsByFloor} totalRooms={rooms.length} openItemCount={openItemCount} onSelectRoom={openRoom} />
        <OperationsPanels />
      </main>

      {selectedRoom ? <RoomDialog room={selectedRoom} onClose={closeRoom} /> : null}
    </div>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-teal-800 text-sm font-black text-white" aria-hidden="true">HO</span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-950">Hotel Operations</p>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        </div>
        <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">Prototype</span>
      </div>
    </header>
  );
}

function SummaryStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "alert" }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${tone === "alert" ? "border-red-200 bg-red-50 text-red-800" : "border-slate-200 bg-white"}`}>
      <dt>{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

function RoomBoard({ roomsByFloor, totalRooms, openItemCount, onSelectRoom }: { roomsByFloor: Record<number, Room[]>; totalRooms: number; openItemCount: number; onSelectRoom: (room: Room, button: HTMLButtonElement) => void }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-labelledby="rooms-title">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id="rooms-title" className="text-base font-bold text-slate-950">Rooms</h2>
          <p className="text-xs text-slate-500">{totalRooms} rooms across {Object.keys(roomsByFloor).length} floors · {openItemCount} open items</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600" aria-label="Room status legend">
          <LegendItem status="Clear" />
          <LegendItem status="Open item" />
        </div>
      </div>

      <div className="mt-3 max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {Object.entries(roomsByFloor).map(([floor, floorRooms]) => (
          <section key={floor} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0" aria-labelledby={`floor-${floor}`}>
            <div className="mb-2 flex items-center gap-2">
              <h3 id={`floor-${floor}`} className="text-xs font-bold uppercase tracking-wide text-slate-600">Floor {floor}</h3>
              <span className="h-px flex-1 bg-slate-100" aria-hidden="true" />
              <span className="text-[11px] text-slate-500">{floorRooms.length}</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(54px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fit,minmax(58px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(62px,1fr))]">
              {floorRooms.map((room) => (
                <RoomTile key={room.number} room={room} onSelectRoom={onSelectRoom} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function RoomTile({ room, onSelectRoom }: { room: Room; onSelectRoom: (room: Room, button: HTMLButtonElement) => void }) {
  const isOpen = room.status === "Open item";
  return (
    <button
      type="button"
      onClick={(event) => onSelectRoom(room, event.currentTarget)}
      className={`flex min-h-12 flex-col justify-between rounded-lg border px-2 py-1.5 text-left text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:h-14 ${isOpen ? "border-red-300 bg-red-50 text-red-950 hover:bg-red-100" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-teal-300 hover:bg-teal-50"}`}
      aria-label={`Room ${room.number}, ${room.status.toLowerCase()}`}
    >
      <span>{room.number}</span>
      <StatusIndicator status={room.status} compact />
    </button>
  );
}

function LegendItem({ status }: { status: Room["status"] }) {
  return <span className="inline-flex items-center gap-1.5"><StatusIndicator status={status} />{status}</span>;
}

function StatusIndicator({ status, compact = false }: { status: Room["status"]; compact?: boolean }) {
  const isClear = status === "Clear";
  return (
    <span className={`inline-grid place-items-center rounded-[3px] text-[9px] font-black leading-none text-white ${compact ? "size-2.5" : "size-3"} ${isClear ? "bg-green-600" : "bg-red-600"}`} aria-label={status} title={status}>
      <span aria-hidden="true">{isClear ? "✓" : "!"}</span>
    </span>
  );
}

function OperationsPanels() {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]" aria-label="Operational panels">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-labelledby="logbook-title">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="logbook-title" className="text-base font-bold text-slate-950">Log Book</h2>
          <span className="text-xs font-medium text-slate-500">Shift activity</span>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {logEntries.map((entry) => (
            <div key={`${entry.time}-${entry.message}`} className="grid gap-2 border-t border-slate-100 py-2.5 text-sm first:border-t-0 sm:grid-cols-[78px_92px_minmax(0,1fr)_120px]">
              <time className="font-semibold text-slate-700">{entry.time}</time>
              <span className="text-xs font-medium text-slate-500">{entry.room ?? "Property"}</span>
              <p className="text-slate-700">{entry.message}</p>
              <span className="text-xs text-slate-500 sm:text-right">{entry.category}</span>
            </div>
          ))}
        </div>
      </article>

      <aside className="space-y-4">
        <CompactCard title="Lost & Found" meta="3 items" action="View items — Coming next">
          <p>Tagged items are awaiting owner contact.</p>
        </CompactCard>
        <CompactCard title="Announcements" meta="3 posts">
          <div className="divide-y divide-slate-100">
            {announcements.map((announcement) => (
              <p key={announcement.title} className="py-2 first:pt-0 last:pb-0"><span className="font-medium text-slate-800">{announcement.title}</span><span className="mt-0.5 block text-xs text-slate-500">{announcement.meta}</span></p>
            ))}
          </div>
        </CompactCard>
        <CompactCard title="Calendar" meta="Today">
          <div className="space-y-2">
            {calendarEvents.map((item) => (
              <p key={item.event} className="flex items-start justify-between gap-3 text-sm"><span className="font-medium text-slate-800">{item.event}</span><span className="text-right text-xs text-slate-500">{item.time}</span></p>
            ))}
          </div>
        </CompactCard>
      </aside>
    </section>
  );
}

function CompactCard({ title, meta, action, children }: { title: string; meta: string; action?: string; children: ReactNode }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{meta}</span>
      </div>
      {children}
      {action ? <button type="button" className="mt-3 min-h-8 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-500" aria-disabled="true">{action}</button> : null}
    </article>
  );
}

function RoomDialog({ room, onClose }: { room: Room; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-3 sm:items-stretch sm:justify-end" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-dialog-title"
        className="w-full rounded-2xl bg-white p-4 shadow-xl sm:my-3 sm:max-w-[420px] sm:rounded-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Room details</p>
            <h2 id="room-dialog-title" className="mt-1 text-2xl font-bold text-slate-950">Room {room.number}</h2>
          </div>
          <button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:min-h-9">
            Close
          </button>
        </div>
        <div className="mt-4 space-y-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><StatusIndicator status={room.status} /><span className="font-semibold">{room.status}</span></div>
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-3">{room.note}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" className="min-h-11 rounded-lg bg-teal-900 px-3 text-sm font-semibold text-white opacity-70 sm:min-h-9" aria-disabled="true">Housekeeping request — Coming next</button>
            <button type="button" className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-600 opacity-70 sm:min-h-9" aria-disabled="true">Maintenance issue — Coming next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
