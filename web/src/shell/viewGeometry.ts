export function polarPoint(lat: number, lon: number, radius = 126): { x: number; y: number } {
  const distance = Math.min(1, Math.max(0, (90 - Math.abs(lat)) / 10)) * radius;
  const angle = lon * Math.PI / 180;
  return { x: 240 + Math.sin(angle) * distance, y: 190 - Math.cos(angle) * distance };
}
