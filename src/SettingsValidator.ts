/**
 * Settings Validator - Validates severity threshold settings
 */

export interface SeverityThresholds {
  high: number;
  medium: number;
  low: number;
}

export class SettingsValidator {
  // Constraints
  private static readonly MIN_HIGH = 3;
  private static readonly MIN_MEDIUM = 2;
  private static readonly MIN_LOW = 1;
  private static readonly MAX_VALUE = 1000; // Safe upper limit

  /**
   * Validate and normalize a severity threshold value
   */
  static validateThreshold(value: number, fieldName: 'high' | 'medium' | 'low'): number {
    // Convert to integer
    let intValue = Math.floor(value);

    // Apply minimum constraints
    switch (fieldName) {
      case 'high':
        intValue = Math.max(intValue, this.MIN_HIGH);
        break;
      case 'medium':
        intValue = Math.max(intValue, this.MIN_MEDIUM);
        break;
      case 'low':
        intValue = Math.max(intValue, this.MIN_LOW);
        break;
    }

    // Apply maximum constraint
    intValue = Math.min(intValue, this.MAX_VALUE);

    return intValue;
  }

  /**
   * Validate all severity thresholds together
   * Ensures: high > medium > low
   */
  static validateThresholds(thresholds: SeverityThresholds): SeverityThresholds {
    let { high, medium, low } = thresholds;

    // Normalize to integers and apply individual constraints
    high = this.validateThreshold(high, 'high');
    medium = this.validateThreshold(medium, 'medium');
    low = this.validateThreshold(low, 'low');

    // Ensure proper ordering: high > medium > low
    // If they're equal or out of order, adjust them
    if (high <= medium) {
      high = medium + 1;
    }
    if (medium <= low) {
      medium = low + 1;
    }

    // Ensure high doesn't exceed max
    high = Math.min(high, this.MAX_VALUE);

    return { high, medium, low };
  }

  /**
   * Get validation constraints for UI display
   */
  static getConstraints() {
    return {
      high: { min: this.MIN_HIGH, max: this.MAX_VALUE },
      medium: { min: this.MIN_MEDIUM, max: this.MAX_VALUE },
      low: { min: this.MIN_LOW, max: this.MAX_VALUE },
    };
  }

  /**
   * Get error message for invalid threshold
   */
  static getErrorMessage(fieldName: 'high' | 'medium' | 'low'): string {
    switch (fieldName) {
      case 'high':
        return `High severity must be at least ${this.MIN_HIGH}`;
      case 'medium':
        return `Medium severity must be at least ${this.MIN_MEDIUM}`;
      case 'low':
        return `Low severity must be at least ${this.MIN_LOW}`;
    }
  }
}
