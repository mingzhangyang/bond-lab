export interface BondPlacement {
  length: number;
  centerOffset: number;
}

export function computeBondPlacement(
  distance: number,
  sourceRadius: number,
  targetRadius: number,
  overlap: number,
  minLength: number,
): BondPlacement {
  if (distance <= minLength) {
    return {
      length: minLength,
      centerOffset: distance * 0.5,
    };
  }

  const startInset = Math.max(0, sourceRadius - overlap);
  const endInset = Math.max(0, targetRadius - overlap);
  const visibleLength = distance - startInset - endInset;

  if (visibleLength <= minLength) {
    return {
      length: distance,
      centerOffset: distance * 0.5,
    };
  }

  return {
    length: visibleLength,
    centerOffset: startInset + visibleLength * 0.5,
  };
}
