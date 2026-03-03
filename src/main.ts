import { Plugin, TFile } from 'obsidian';
import { TaskScanner } from './TaskScanner';
import { StatusBarRenderer, StatusBarData } from './StatusBarRenderer';
import { TaskIndicatorSettingTab, DEFAULT_SETTINGS } from './Settings';
import { TaskModal } from './TaskModal';
import { TaskIndicatorSettings } from './types';

export default class OpenTaskIndicatorPlugin extends Plugin {
  settings!: TaskIndicatorSettings;
  scanner!: TaskScanner;
  statusBarRenderer!: StatusBarRenderer;
  refreshInterval: NodeJS.Timeout | null = null;

  async onload() {
    try {
      // Load settings
      await this.loadSettings();

      // Initialize scanner and status bar renderer
      this.scanner = new TaskScanner(this.app.vault, this.settings);
      this.statusBarRenderer = new StatusBarRenderer(this.settings);

      // Add settings tab
      this.addSettingTab(new TaskIndicatorSettingTab(this.app, this));

      // Add status bar item
      const statusBarElement = this.statusBarRenderer.createStatusBarElement();
      const statusBarContainer = this.addStatusBarItem();
      statusBarContainer.appendChild(statusBarElement);
      
      // Set up click handler for status bar
      this.statusBarRenderer.setClickHandler(() => {
        this.handleStatusBarClick();
      });

      // Register event listeners
      this.registerVaultEvents();

      // Initial scan
      await this.refreshIndicators();

      // Setup auto-refresh
      this.setupAutoRefresh();

      // Add command to manually refresh
      this.addCommand({
        id: 'refresh-task-indicators',
        name: 'Refresh task indicators',
        callback: () => this.refreshIndicators(),
      });
    } catch (error) {
      console.error('[OTI] Error during plugin load:', error);
    }
  }

  onunload() {
    console.log('[OTI] Unloading Open Task Indicator plugin');
    this.statusBarRenderer.clearStatusBar();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  /**
   * Register vault event listeners
   */
  private registerVaultEvents() {
    // File modified
    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        if (file instanceof TFile && file.extension === 'md') {
          this.onFileChange(file);
        }
      })
    );

    // File created
    this.registerEvent(
      this.app.vault.on('create', (file) => {
        if (file instanceof TFile && file.extension === 'md') {
          this.onFileChange(file);
        }
      })
    );

    // File deleted
    this.registerEvent(
      this.app.vault.on('delete', (file) => {
        if (file instanceof TFile && file.extension === 'md') {
          this.scanner.invalidateCache(file.path);
          this.refreshIndicators();
        }
      })
    );

    // File renamed
    this.registerEvent(
      this.app.vault.on('rename', (file, oldPath: string) => {
        if (file instanceof TFile && file.extension === 'md') {
          this.scanner.invalidateCache(oldPath);
          this.onFileChange(file);
        }
      })
    );
  }

  /**
   * Handle file change with debouncing
   */
  private fileChangeTimeout: NodeJS.Timeout | null = null;
  private pendingFiles: Set<string> = new Set();

  private onFileChange(file: TFile) {
    this.pendingFiles.add(file.path);

    // Clear existing timeout
    if (this.fileChangeTimeout) {
      clearTimeout(this.fileChangeTimeout);
    }

    // Debounce file changes (500ms)
    this.fileChangeTimeout = setTimeout(async () => {
      for (const filePath of this.pendingFiles) {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
          await this.scanner.scanFile(file);
        }
      }
      this.pendingFiles.clear();
      this.fileChangeTimeout = null;
      
      // Refresh status bar after all files are processed
      await this.refreshIndicators();
    }, 500);
  }

  /**
    * Refresh all indicators
    */
  async refreshIndicators() {
    try {
      const results = await this.scanner.scanVault();

      // Calculate severity breakdown
      const statusBarData = this.calculateStatusBarData(results);

      // Update status bar
      this.statusBarRenderer.updateStatusBar(statusBarData);

      if (this.settings.enableDebugLogging) {
        console.log('[OTI] Refreshed all task indicators', results);
      }
    } catch (error) {
      console.error('[OTI] Error refreshing indicators:', error);
    }
  }

  /**
   * Calculate status bar data from scan results
   */
  private calculateStatusBarData(results: Record<string, number>): StatusBarData {
    let totalFiles = 0;
    let totalTasks = 0;
    let highSeverity = 0;
    let mediumSeverity = 0;
    let lowSeverity = 0;

    for (const [filePath, count] of Object.entries(results)) {
      totalFiles++;
      totalTasks += count;

      if (count >= this.settings.severityThresholds.high) {
        highSeverity++;
      } else if (count >= this.settings.severityThresholds.medium) {
        mediumSeverity++;
      } else {
        lowSeverity++;
      }
    }

    return {
      totalFiles,
      totalTasks,
      highSeverity,
      mediumSeverity,
      lowSeverity,
    };
  }

  /**
   * Setup auto-refresh interval
   */
  setupAutoRefresh() {
    // Clear existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    // Setup new interval if enabled
    if (this.settings.autoRefreshInterval > 0) {
      this.refreshInterval = setInterval(
        () => this.refreshIndicators(),
        this.settings.autoRefreshInterval
      );
    }
  }

  /**
   * Load settings from disk
   */
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  /**
   * Save settings to disk
   */
  async saveSettings() {
    await this.saveData(this.settings);
    this.scanner.updateSettings(this.settings);
    this.statusBarRenderer.updateSettings(this.settings);
    await this.refreshIndicators();
  }

  /**
   * Handle status bar click - show modal with detailed task list
   */
  private handleStatusBarClick() {
    this.showTaskModal();
  }

  /**
   * Show modal with detailed task list
   */
  private async showTaskModal() {
    const results = await this.scanner.scanVault();

    // Convert results to modal data
    const files = Object.entries(results).map(([path, count]) => ({
      path,
      count,
      severity: this.getSeverity(count),
    }));

    const totalTasks = Object.values(results).reduce((sum, count) => sum + count, 0);

    const modalData = {
      totalFiles: files.length,
      totalTasks,
      files,
    };

    const modal = new TaskModal(this.app, modalData);
    modal.open();
  }

  /**
   * Get severity level for a task count
   */
  private getSeverity(count: number): 'high' | 'medium' | 'low' {
    if (count >= this.settings.severityThresholds.high) {
      return 'high';
    } else if (count >= this.settings.severityThresholds.medium) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}
