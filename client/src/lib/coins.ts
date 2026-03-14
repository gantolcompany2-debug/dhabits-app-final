/**
 * Format coins to display with appropriate decimal places
 * Supports whole numbers, tenths, and hundredths
 */
export function formatCoins(coins: number | undefined | null): string {
  if (!coins && coins !== 0) return "0";
  const num = typeof coins === 'number' ? coins : 0;
  if (num === Math.floor(num)) {
    // Whole number
    return num.toFixed(0);
  } else if (num === Math.floor(num * 10) / 10) {
    // One decimal place
    return num.toFixed(1);
  } else {
    // Two decimal places
    return num.toFixed(2);
  }
}

/**
 * Round coins to 2 decimal places
 */
export function roundCoins(coins: number): number {
  return Math.round(coins * 100) / 100;
}

/**
 * Add coins with proper rounding
 */
export function addCoins(current: number, toAdd: number): number {
  return roundCoins(current + toAdd);
}
