"use client";

import { useMemo, useState } from "react";
import { buildRooms, groupRoomsByFloor, type Room } from "@/lib/rooms";

const dashboardTiles = [
  { title: "Lost & Found", icon: "🧳", text: "3 tagged items awaiting owner contact." },
  { title: "Announcements", icon: "📣", text: "Pool deck closes at 9:00 PM tonight." },
  { title: "Calendar", icon: "📅", text: "VIP arrivals and linen delivery are on today." },
  { title: "Log Book", icon: "📘", text: "Night audit completed with no escalations." },
];

export function Dashboard() {
  const rooms = useMemo(() => buildRooms(), []);
  const roomsByFloor = useMemo(() => groupRoomsByFloor(rooms), [rooms]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-ink p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Hotel Operations</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-5xl">Dashboard foundation</h1>
              <p className="mt-3 max-w-2xl text-blue-100">
                Static English demo for room status visibility, shift awareness, and quick operations modules.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-80">
              <Metric label="Total rooms" value={rooms.length.toString()} />
              <Metric label="Open items" value="3" />
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Operations modules">
          {dashboardTiles.map((tile) => (
            <article key={tile.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-3xl">{tile.icon}</span>
                <h2 className="text-lg font-bold">{tile.title}</h2>
              </div>
              <p className="mt-3 text-sm text-slate-600">{tile.text}</p>
            </article>
          ))}
        </section>

        <section className="space-y-5" aria-label="Rooms grouped by floor">
          {Object.entries(roomsByFloor).map(([floor, floorRooms]) => (
            <article key={floor} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Floor {floor}</h2>
                <p className="text-sm text-slate-500">{floorRooms.length} rooms</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10">
                {floorRooms.map((room) => (
                  <button
                    key={room.number}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    aria-label={`Open details for room ${room.number}. Status: ${room.status}.`}
                  >
                    <span className="block text-lg font-extrabold">{room.number}</span>
                    <StatusBadge status={room.status} />
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>

      {selectedRoom ? <RoomDialog room={selectedRoom} onClose={() => setSelectedRoom(null)} /> : null}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs uppercase tracking-wide text-blue-100">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Room["status"] }) {
  const isClear = status === "Clear";
  return (
    <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${isClear ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
      <span aria-hidden="true">{isClear ? "✓" : "!"}</span>
      {status}
    </span>
  );
}

function RoomDialog({ room, onClose }: { room: Room; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-4 sm:items-center sm:justify-center" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-dialog-title"
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Room details</p>
            <h2 id="room-dialog-title" className="mt-1 text-3xl font-black">Room {room.number}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-3 py-2 font-bold hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-200">
            Close
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <StatusBadge status={room.status} />
          <p className="rounded-2xl bg-slate-50 p-4 text-slate-700">{room.note}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" className="rounded-xl bg-ink px-4 py-3 font-bold text-white opacity-70" aria-disabled="true">Placeholder request action</button>
            <button type="button" className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-600 opacity-70" aria-disabled="true">Placeholder follow-up</button>
          </div>
        </div>
      </section>
    </div>
  );
}
