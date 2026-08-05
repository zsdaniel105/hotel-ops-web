export type RoomStatus = "Clear" | "Open item";

export type Room = {
  number: number;
  floor: number;
  status: RoomStatus;
  note: string;
};

const OPEN_ITEM_NOTES: Record<number, string> = {
  204: "Guest requested extra towels and a follow-up courtesy check.",
  317: "Maintenance is reviewing a slow-draining sink reported during turnover.",
  508: "Housekeeping flagged a missing robe for supervisor review.",
};

export const OPEN_ITEM_ROOMS = [204, 317, 508] as const;

export function buildRooms(): Room[] {
  return Array.from({ length: 180 }, (_, index) => {
    const floor = Math.floor(index / 30) + 1;
    const roomNumber = floor * 100 + (index % 30) + 1;
    const hasOpenItem = roomNumber in OPEN_ITEM_NOTES;

    return {
      number: roomNumber,
      floor,
      status: hasOpenItem ? "Open item" : "Clear",
      note: hasOpenItem
        ? OPEN_ITEM_NOTES[roomNumber]
        : "No active room item is assigned in this demo dashboard.",
    };
  });
}

export function groupRoomsByFloor(rooms: Room[]) {
  return rooms.reduce<Record<number, Room[]>>((groupedRooms, room) => {
    groupedRooms[room.floor] = groupedRooms[room.floor] ?? [];
    groupedRooms[room.floor].push(room);
    return groupedRooms;
  }, {});
}
