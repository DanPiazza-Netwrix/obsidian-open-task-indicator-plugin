import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import { TaskIndicatorSettings } from './types';
import { SettingsValidator } from './SettingsValidator';

export const DEFAULT_SETTINGS: TaskIndicatorSettings = {
  ignorePatterns: ['.obsidian'],
  indicatorStyle: 'emoji',
  severityThresholds: {
    high: 10,
    medium: 5,
    low: 1,
  },
  autoRefreshInterval: 5000,
  enableDebugLogging: false,
};

export class TaskIndicatorSettingTab extends PluginSettingTab {
  plugin: any;

  constructor(app: App, plugin: any) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Open Task Indicator Settings' });

    // Indicator Style Setting
    new Setting(containerEl)
      .setName('Indicator Style')
      .setDesc('Choose how task indicators are displayed in the status bar')
      .addDropdown((dropdown) =>
        dropdown
          .addOption('emoji', 'Emoji (📋 60 tasks in 8 files | 🔴 2 | 🟠 3 | 🟡 3)')
          .addOption('simple', 'Simple (📋 60 tasks (8 files))')
          .setValue(this.plugin.settings.indicatorStyle)
          .onChange(async (value) => {
            this.plugin.settings.indicatorStyle = value as 'emoji' | 'simple';
            await this.plugin.saveSettings();
          })
      );

    // Severity Thresholds
    containerEl.createEl('h3', { text: 'Severity Thresholds' });
    
    const thresholdDesc = containerEl.createEl('p');
    thresholdDesc.style.fontSize = '0.9em';
    thresholdDesc.style.color = '#888';
    thresholdDesc.textContent = 'Must be whole numbers with High > Medium > Low. Min values: High=3, Medium=2, Low=1';

    new Setting(containerEl)
      .setName('High Severity Threshold')
      .setDesc('Task count for high severity (🔴 red)')
      .addText((text) => {
        const textEl = text
          .setPlaceholder('10')
          .setValue(this.plugin.settings.severityThresholds.high.toString());
        
        textEl.onChange(async (value) => {
          // Allow empty field during typing
          if (value === '') {
            return;
          }
          
          let num = parseInt(value);
          let wasModified = false;
          
          // Validate: must be a number
          if (isNaN(num)) {
            num = this.plugin.settings.severityThresholds.high;
            wasModified = true;
          } else {
            const originalNum = num;
            
            // Validate and normalize
            num = SettingsValidator.validateThreshold(num, 'high');
            
            // Ensure high > medium
            if (num <= this.plugin.settings.severityThresholds.medium) {
              num = this.plugin.settings.severityThresholds.medium + 1;
            }
            
            if (num !== originalNum) {
              wasModified = true;
            }
          }
          
          this.plugin.settings.severityThresholds.high = num;
          textEl.setValue(num.toString());
          
          // Show visual error if modified
          if (wasModified) {
            textEl.inputEl.style.borderColor = '#cc5555';
            textEl.inputEl.style.backgroundColor = 'rgba(204, 85, 85, 0.1)';
            setTimeout(() => {
              textEl.inputEl.style.borderColor = '';
              textEl.inputEl.style.backgroundColor = '';
            }, 2000);
          }
          
          await this.plugin.saveSettings();
        });
        
        // Handle blur event to set default if field is empty
        textEl.inputEl.addEventListener('blur', () => {
          if (textEl.inputEl.value === '') {
            this.plugin.settings.severityThresholds.high = DEFAULT_SETTINGS.severityThresholds.high;
            textEl.setValue(DEFAULT_SETTINGS.severityThresholds.high.toString());
            this.plugin.saveSettings();
          }
        });
        
        return textEl;
      });

    new Setting(containerEl)
      .setName('Medium Severity Threshold')
      .setDesc('Task count for medium severity (🟠 orange)')
      .addText((text) => {
        const textEl = text
          .setPlaceholder('5')
          .setValue(this.plugin.settings.severityThresholds.medium.toString());
        
        textEl.onChange(async (value) => {
          // Allow empty field during typing
          if (value === '') {
            return;
          }
          
          let num = parseInt(value);
          let wasModified = false;
          
          // Validate: must be a number
          if (isNaN(num)) {
            num = this.plugin.settings.severityThresholds.medium;
            wasModified = true;
          } else {
            const originalNum = num;
            
            // Validate and normalize
            num = SettingsValidator.validateThreshold(num, 'medium');
            
            // Ensure medium > low
            if (num <= this.plugin.settings.severityThresholds.low) {
              num = this.plugin.settings.severityThresholds.low + 1;
            }
            
            // Ensure medium < high
            if (num >= this.plugin.settings.severityThresholds.high) {
              num = this.plugin.settings.severityThresholds.high - 1;
            }
            
            if (num !== originalNum) {
              wasModified = true;
            }
          }
          
          this.plugin.settings.severityThresholds.medium = num;
          textEl.setValue(num.toString());
          
          // Show visual error if modified
          if (wasModified) {
            textEl.inputEl.style.borderColor = '#cc5555';
            textEl.inputEl.style.backgroundColor = 'rgba(204, 85, 85, 0.1)';
            setTimeout(() => {
              textEl.inputEl.style.borderColor = '';
              textEl.inputEl.style.backgroundColor = '';
            }, 2000);
          }
          
          await this.plugin.saveSettings();
        });
        
        // Handle blur event to set default if field is empty
        textEl.inputEl.addEventListener('blur', () => {
          if (textEl.inputEl.value === '') {
            this.plugin.settings.severityThresholds.medium = DEFAULT_SETTINGS.severityThresholds.medium;
            textEl.setValue(DEFAULT_SETTINGS.severityThresholds.medium.toString());
            this.plugin.saveSettings();
          }
        });
        
        return textEl;
      });

    new Setting(containerEl)
      .setName('Low Severity Threshold')
      .setDesc('Task count for low severity (🟡 yellow)')
      .addText((text) => {
        const textEl = text
          .setPlaceholder('1')
          .setValue(this.plugin.settings.severityThresholds.low.toString());
        
        textEl.onChange(async (value) => {
          // Allow empty field during typing
          if (value === '') {
            return;
          }
          
          let num = parseInt(value);
          let wasModified = false;
          
          // Validate: must be a number
          if (isNaN(num)) {
            num = this.plugin.settings.severityThresholds.low;
            wasModified = true;
          } else {
            const originalNum = num;
            
            // Validate and normalize
            num = SettingsValidator.validateThreshold(num, 'low');
            
            // Ensure low < medium
            if (num >= this.plugin.settings.severityThresholds.medium) {
              num = this.plugin.settings.severityThresholds.medium - 1;
            }
            
            if (num !== originalNum) {
              wasModified = true;
            }
          }
          
          this.plugin.settings.severityThresholds.low = num;
          textEl.setValue(num.toString());
          
          // Show visual error if modified
          if (wasModified) {
            textEl.inputEl.style.borderColor = '#cc5555';
            textEl.inputEl.style.backgroundColor = 'rgba(204, 85, 85, 0.1)';
            setTimeout(() => {
              textEl.inputEl.style.borderColor = '';
              textEl.inputEl.style.backgroundColor = '';
            }, 2000);
          }
          
          await this.plugin.saveSettings();
        });
        
        // Handle blur event to set default if field is empty
        textEl.inputEl.addEventListener('blur', () => {
          if (textEl.inputEl.value === '') {
            this.plugin.settings.severityThresholds.low = DEFAULT_SETTINGS.severityThresholds.low;
            textEl.setValue(DEFAULT_SETTINGS.severityThresholds.low.toString());
            this.plugin.saveSettings();
          }
        });
        
        return textEl;
      });

    // Reset Thresholds Button (positioned right after Low Severity Threshold, before Ignore Patterns)
    new Setting(containerEl).addButton((button) => {
      button
        .setButtonText('Reset Thresholds to Default')
        .setCta()
        .onClick(async () => {
          this.plugin.settings.severityThresholds = {
            high: DEFAULT_SETTINGS.severityThresholds.high,
            medium: DEFAULT_SETTINGS.severityThresholds.medium,
            low: DEFAULT_SETTINGS.severityThresholds.low,
          };
          await this.plugin.saveSettings();
          // Update values without refreshing the entire display to preserve scroll position
          const inputs = containerEl.querySelectorAll('input[type="text"]');
          if (inputs.length >= 3) {
            (inputs[0] as HTMLInputElement).value = DEFAULT_SETTINGS.severityThresholds.high.toString();
            (inputs[1] as HTMLInputElement).value = DEFAULT_SETTINGS.severityThresholds.medium.toString();
            (inputs[2] as HTMLInputElement).value = DEFAULT_SETTINGS.severityThresholds.low.toString();
          }
          new Notice('Severity thresholds reset to default');
        });
      
      return button;
    });

    // Ignore Patterns
    containerEl.createEl('h3', { text: 'Ignore Patterns' });

    new Setting(containerEl)
      .setName('Ignore Patterns')
      .setDesc(
        'Files and folders matching these patterns will be ignored. One pattern per line.'
      )
      .addTextArea((text) => {
        text
          .setPlaceholder('.obsidian\nCLAUDE.md\nREADME.md')
          .setValue(this.plugin.settings.ignorePatterns.join('\n'))
          .onChange(async (value) => {
            this.plugin.settings.ignorePatterns = value
              .split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0);

            await this.plugin.saveSettings();
          });
        
        // Set the text area to be taller
        text.inputEl.style.height = '120px';
        return text;
      });

    // Reset Ignore Patterns Button
    new Setting(containerEl).addButton((button) => {
      button
        .setButtonText('Reset Ignore Patterns to Default')
        .setCta()
        .onClick(async () => {
          this.plugin.settings.ignorePatterns = DEFAULT_SETTINGS.ignorePatterns;
          await this.plugin.saveSettings();
          // Update the textarea without refreshing the entire display to preserve scroll position
          const textareas = containerEl.querySelectorAll('textarea');
          if (textareas.length > 0) {
            (textareas[0] as HTMLTextAreaElement).value = DEFAULT_SETTINGS.ignorePatterns.join('\n');
          }
          new Notice('Ignore patterns reset to default');
        });
      
      return button;
    });

    // Auto Refresh Interval Section
    containerEl.createEl('h3', { text: 'Auto Refresh Interval' });

    new Setting(containerEl)
      .setName('Auto Refresh Interval')
      .setDesc('Milliseconds between automatic refreshes. Min: 0 (disabled), Max: 3600000 (1 hour)')
      .addText((text) => {
        const textEl = text
          .setPlaceholder('5000')
          .setValue(this.plugin.settings.autoRefreshInterval.toString());
        
        textEl.onChange(async (value) => {
          // Allow empty field during typing
          if (value === '') {
            return;
          }
          
          let num = parseInt(value);
          let wasModified = false;
          
          // Validate: must be a number
          if (isNaN(num)) {
            num = this.plugin.settings.autoRefreshInterval;
            wasModified = true;
          } else {
            const originalNum = num;
            
            // Validate: must be whole number
            if (!Number.isInteger(num)) {
              num = Math.floor(num);
              wasModified = true;
            }
            
            // Validate: minimum 0 (no lower bound)
            if (num < 0) {
              num = 0;
              wasModified = true;
            }
            
            // Validate: maximum 3600000 (1 hour)
            if (num > 3600000) {
              num = 3600000;
              wasModified = true;
            }
            
            if (num !== originalNum) {
              wasModified = true;
            }
          }
          
          this.plugin.settings.autoRefreshInterval = num;
          textEl.setValue(num.toString());
          
          // Show visual error if modified
          if (wasModified) {
            textEl.inputEl.style.borderColor = '#cc5555';
            textEl.inputEl.style.backgroundColor = 'rgba(204, 85, 85, 0.1)';
            setTimeout(() => {
              textEl.inputEl.style.borderColor = '';
              textEl.inputEl.style.backgroundColor = '';
            }, 2000);
          }
          
          await this.plugin.saveSettings();
        });
        
        // Handle blur event to set default if field is empty
        textEl.inputEl.addEventListener('blur', () => {
          if (textEl.inputEl.value === '') {
            this.plugin.settings.autoRefreshInterval = DEFAULT_SETTINGS.autoRefreshInterval;
            textEl.setValue(DEFAULT_SETTINGS.autoRefreshInterval.toString());
            this.plugin.saveSettings();
          }
        });
        
        return textEl;
      });

    // Reset Auto Refresh Interval Button
    new Setting(containerEl).addButton((button) => {
      button
        .setButtonText('Reset Auto Refresh Interval to Default')
        .setCta()
        .onClick(async () => {
          this.plugin.settings.autoRefreshInterval = DEFAULT_SETTINGS.autoRefreshInterval;
          await this.plugin.saveSettings();
          // Update the input without refreshing the entire display to preserve scroll position
          const inputs = containerEl.querySelectorAll('input[type="text"]');
          if (inputs.length > 0) {
            // The auto refresh interval input is the last text input
            (inputs[inputs.length - 1] as HTMLInputElement).value = DEFAULT_SETTINGS.autoRefreshInterval.toString();
          }
          new Notice('Auto refresh interval reset to default');
        });
      
      return button;
    });

    // Debug Section
    containerEl.createEl('h3', { text: 'Debug' });

    // Debug Logging
    new Setting(containerEl)
      .setName('Enable Debug Logging')
      .setDesc('Log debug information to console (Ctrl+Shift+I)')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableDebugLogging)
          .onChange(async (value) => {
            this.plugin.settings.enableDebugLogging = value;
            await this.plugin.saveSettings();
          })
      );

    // Manual Refresh Button
    new Setting(containerEl).addButton((button) =>
      button
        .setButtonText('Refresh Indicators Now')
        .setCta()
        .onClick(async () => {
          await this.plugin.refreshIndicators();
          new Notice('Task indicators refreshed');
        })
    );
  }
}
