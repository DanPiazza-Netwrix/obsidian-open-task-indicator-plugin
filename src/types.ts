/**
 * Type definitions for Open Task Indicator plugin
 */

export interface TaskIndicatorSettings {
  ignorePatterns: string[];
  indicatorStyle: 'emoji' | 'simple';
  severityThresholds: {
    high: number;
    medium: number;
    low: number;
  };
  autoRefreshInterval: number;
  enableDebugLogging: boolean;
}

export interface TaskCount {
  filePath: string;
  count: number;
  severity: 'high' | 'medium' | 'low' | 'none';
}

export interface ScanResult {
  [filePath: string]: number;
}
