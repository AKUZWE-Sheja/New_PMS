export class ParkingCostCalculator {
  static calculateCost(startTime: Date, endTime: Date, costPerHour: number): number {
    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs < 0) {
      throw new Error('End time must be after start time');
    }
    const durationHours = durationMs / (1000 * 60 * 60); // Convert to hours
    const billedHours = Math.ceil(durationHours); // Round up to next full hour
    return billedHours * costPerHour;
  }
}