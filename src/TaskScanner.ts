import { Vault, TFile, TFolder } from 'obsidian';
import { TaskIndicatorSettings, ScanResult } from './types';

/**
 * TaskScanner - Scans vault for markdown files with unchecked tasks
 */
export class TaskScanner {
  private vault: Vault;
  private settings: TaskIndicatorSettings;
  private cache: Map<string, number> = new Map();
  private uncheckedPattern = /^- \[ \]/gm;

  constructor(vault: Vault, settings: TaskIndicatorSettings) {
    this.vault = vault;
    this.settings = settings;
  }

  /**
   * Update settings (called when settings change)
   */
  updateSettings(settings: TaskIndicatorSettings) {
    this.settings = settings;
  }

  /**
   * Check if a path should be ignored
   */
  private shouldIgnore(path: string): boolean {
    // Always ignore .obsidian directory
    if (path.includes('.obsidian')) {
      return true;
    }

    // Check against configured ignore patterns
    for (const pattern of this.settings.ignorePatterns) {
      if (path.includes(pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Count unchecked tasks in file content
   */
  private countTasks(content: string): number {
    const matches = content.match(this.uncheckedPattern);
    return matches ? matches.length : 0;
  }

  /**
   * Scan a single file for tasks
   */
  async scanFile(file: TFile): Promise<number> {
    if (!file.path.endsWith('.md')) {
      return 0;
    }

    if (this.shouldIgnore(file.path)) {
      this.cache.delete(file.path);
      return 0;
    }

    try {
      const content = await this.vault.read(file);
      const count = this.countTasks(content);
      
      if (count > 0) {
        this.cache.set(file.path, count);
      } else {
        this.cache.delete(file.path);
      }

      return count;
    } catch (error) {
      console.error(`Error scanning file ${file.path}:`, error);
      return 0;
    }
  }

  /**
   * Scan entire vault for tasks
   */
  async scanVault(): Promise<ScanResult> {
    const results: ScanResult = {};
    this.cache.clear();

    const files = this.vault.getMarkdownFiles();

    for (const file of files) {
      if (this.shouldIgnore(file.path)) {
        continue;
      }

      try {
        const content = await this.vault.read(file);
        const count = this.countTasks(content);

        if (count > 0) {
          results[file.path] = count;
          this.cache.set(file.path, count);
        }
      } catch (error) {
        console.error(`Error scanning file ${file.path}:`, error);
      }
    }

    return results;
  }

  /**
   * Invalidate cache for a file
   */
  invalidateCache(filePath: string) {
    this.cache.delete(filePath);
  }

  /**
   * Get cached task count for a file
   */
  getCachedCount(filePath: string): number | undefined {
    return this.cache.get(filePath);
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get all cached results
   */
  getCachedResults(): ScanResult {
    const results: ScanResult = {};
    for (const [path, count] of this.cache.entries()) {
      results[path] = count;
    }
    return results;
  }
}
