export function calculateDistance(from, to): number {
  const a = to.x - from.x;
  const b = to.y - from.y;
  return Math.hypot(a, b);
}

export function isNearby(from, to, range): boolean {
  return calculateDistance(from, to) < range;
}
