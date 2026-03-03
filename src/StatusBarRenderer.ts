import { TaskIndicatorSettings } from './types';

export interface StatusBarData {
  totalFiles: number;
  totalTasks: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
}

export class StatusBarRenderer {
  private statusBarElement: HTMLElement | null = null;
  private settings: TaskIndicatorSettings;
  private onClickHandler: (() => void) | null = null;

  constructor(settings: TaskIndicatorSettings) {
    this.settings = settings;
  }

  updateSettings(settings: TaskIndicatorSettings) {
    this.settings = settings;
  }

  /**
   * Set the click handler for the status bar
   */
  setClickHandler(handler: () => void) {
    this.onClickHandler = handler;
  }

  /**
   * Create or update the status bar element
   */
  createStatusBarElement(): HTMLElement {
    if (!this.statusBarElement) {
      this.statusBarElement = document.createElement('div');
      this.statusBarElement.id = 'open-task-indicator-status';
      this.statusBarElement.className = 'status-bar-item';
      this.statusBarElement.style.cursor = 'pointer';
      this.statusBarElement.style.paddingRight = '10px';
      this.statusBarElement.style.userSelect = 'none';

      // Add click handler
      this.statusBarElement.addEventListener('click', () => {
        if (this.onClickHandler) {
          this.onClickHandler();
        }
      });
    }
    return this.statusBarElement;
  }

  /**
   * Update the status bar with task data
   */
  updateStatusBar(data: StatusBarData) {
    const element = this.createStatusBarElement();

    if (data.totalFiles === 0) {
      element.textContent = '✅ No open tasks';
      element.style.color = '#4CAF50';
      return;
    }

    // Create display text based on settings
    let displayText = '';

    if (this.settings.indicatorStyle === 'emoji') {
      // Emoji style with severity breakdown
      displayText = `📋 ${data.totalTasks} tasks in ${data.totalFiles} files`;
      
      if (data.highSeverity > 0) {
        displayText += ` | 🔴 ${data.highSeverity}`;
      }
      if (data.mediumSeverity > 0) {
        displayText += ` | 🟠 ${data.mediumSeverity}`;
      }
      if (data.lowSeverity > 0) {
        displayText += ` | 🟡 ${data.lowSeverity}`;
      }
    } else {
      // Simple style: show summary
      displayText = `📋 ${data.totalTasks} tasks (${data.totalFiles} files)`;
    }

    element.textContent = displayText;

    // Always use white text for status bar
    element.style.color = '#ffffff';
  }

  /**
   * Clear the status bar
   */
  clearStatusBar() {
    if (this.statusBarElement) {
      this.statusBarElement.textContent = '';
    }
  }

  /**
   * Get the status bar element
   */
  getStatusBarElement(): HTMLElement | null {
    return this.statusBarElement;
  }
}
