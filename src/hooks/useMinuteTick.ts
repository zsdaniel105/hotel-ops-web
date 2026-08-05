"use client";

import { useEffect, useState } from "react";

export function useMinuteTick(): number {
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return tick;
}
