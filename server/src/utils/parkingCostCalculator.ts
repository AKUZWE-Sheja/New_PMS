export class ParkingCostCalculator {
  static calculateCost(startTime: Date, endTime: Date): number {
    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs < 0) {
      throw new Error('End time must be after start time');
    }
    const durationMinutes = durationMs / (1000 * 60); // Convert to minutes
    const halfHourUnits = Math.ceil(durationMinutes / 30); // Round up to nearest 30-minute unit
    return halfHourUnits * 300; // 300 FRW per 30 minutes
  }
}