import type { Room } from "@/types/hotel-operations";

export function buildRooms(): Room[] {
  return Array.from({ length: 180 }, (_, index) => {
    const floor = Math.floor(index / 30) + 1;
    return { number: floor * 100 + (index % 30) + 1, floor };
  });
}

export function groupRoomsByFloor(rooms: Room[]) {
  return rooms.reduce<Record<number, Room[]>>((groupedRooms, room) => {
    groupedRooms[room.floor] = groupedRooms[room.floor] ?? [];
    groupedRooms[room.floor].push(room);
    return groupedRooms;
  }, {});
}

export function filterRoomsByNumber(rooms: Room[], query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return rooms;
  return rooms.filter((room) => room.number.toString().includes(trimmedQuery));
}
