import { Modal, App, TFile } from 'obsidian';

export interface TaskModalData {
  totalFiles: number;
  totalTasks: number;
  files: Array<{
    path: string;
    count: number;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export class TaskModal extends Modal {
  data: TaskModalData;
  app: App;

  constructor(app: App, data: TaskModalData) {
    super(app);
    this.app = app;
    this.data = data;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Title
    contentEl.createEl('h2', { text: '📋 Open Tasks' });

    // Summary
    const summary = contentEl.createEl('div', { cls: 'task-modal-summary' });
    summary.style.marginBottom = '20px';
    summary.style.padding = '12px';
    summary.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    summary.style.borderRadius = '4px';
    
    const summaryText = summary.createEl('p', {
      text: `Total: ${this.data.totalTasks} tasks in ${this.data.totalFiles} files`,
    });
    summaryText.style.margin = '0';
    summaryText.style.fontSize = '1.1em';

    // Task list
    const listContainer = contentEl.createEl('div', { cls: 'task-modal-list' });
    listContainer.style.maxHeight = '400px';
    listContainer.style.overflowY = 'auto';
    listContainer.style.overflowX = 'hidden';

    if (this.data.files.length === 0) {
      listContainer.createEl('p', { text: '✅ No open tasks found!' });
      return;
    }

    // Sort by task count (highest first)
    const sortedFiles = [...this.data.files].sort((a, b) => b.count - a.count);

    for (const file of sortedFiles) {
      const fileItem = listContainer.createEl('div', { cls: 'task-modal-item' });
      fileItem.style.padding = '12px';
      fileItem.style.marginBottom = '10px';
      fileItem.style.borderLeft = '4px solid';
      fileItem.style.paddingLeft = '12px';
      fileItem.style.cursor = 'pointer';
      fileItem.style.borderRadius = '2px';
      fileItem.style.transition = 'all 0.2s ease';
      fileItem.style.overflow = 'hidden';

      // Color based on severity
      switch (file.severity) {
        case 'high':
          fileItem.style.borderLeftColor = '#ff4444';
          fileItem.style.backgroundColor = 'rgba(255, 68, 68, 0.05)';
          break;
        case 'medium':
          fileItem.style.borderLeftColor = '#ff9900';
          fileItem.style.backgroundColor = 'rgba(255, 153, 0, 0.05)';
          break;
        case 'low':
          fileItem.style.borderLeftColor = '#ffcc00';
          fileItem.style.backgroundColor = 'rgba(255, 204, 0, 0.05)';
          break;
      }

      // Create a flex container for better layout
      const contentWrapper = fileItem.createEl('div');
      contentWrapper.style.display = 'flex';
      contentWrapper.style.justifyContent = 'space-between';
      contentWrapper.style.alignItems = 'center';
      contentWrapper.style.minWidth = '0';

      // Left side: file info
      const leftSide = contentWrapper.createEl('div');
      leftSide.style.flex = '1';
      leftSide.style.minWidth = '0';

      // Emoji indicator
      const emoji =
        file.severity === 'high'
          ? '🔴'
          : file.severity === 'medium'
            ? '🟠'
            : '🟡';

      // File name (clickable)
      const fileName = file.path.split('/').pop() || file.path;
      const fileLink = leftSide.createEl('span', {
        text: `${emoji} ${fileName}`,
      });
      fileLink.style.fontWeight = 'bold';
      fileLink.style.display = 'block';
      fileLink.style.marginBottom = '4px';
      fileLink.style.fontSize = '1em';

      // Full path
      const fullPath = leftSide.createEl('span', {
        text: file.path,
      });
      fullPath.style.fontSize = '0.85em';
      fullPath.style.color = '#aaa';
      fullPath.style.display = 'block';
      fullPath.style.overflow = 'hidden';
      fullPath.style.textOverflow = 'ellipsis';
      fullPath.style.whiteSpace = 'nowrap';

      // Right side: task count (prominent)
      const rightSide = contentWrapper.createEl('div');
      rightSide.style.marginLeft = '12px';
      rightSide.style.textAlign = 'center';
      rightSide.style.minWidth = '60px';

      // Task count - large and prominent
      const taskCountBadge = rightSide.createEl('div');
      taskCountBadge.style.fontSize = '1.8em';
      taskCountBadge.style.fontWeight = 'bold';
      taskCountBadge.style.lineHeight = '1';
      
      switch (file.severity) {
        case 'high':
          taskCountBadge.style.color = '#ff4444';
          break;
        case 'medium':
          taskCountBadge.style.color = '#ff9900';
          break;
        case 'low':
          taskCountBadge.style.color = '#ffcc00';
          break;
      }
      
      taskCountBadge.textContent = file.count.toString();

      // Label
      const label = rightSide.createEl('span');
      label.style.fontSize = '0.75em';
      label.style.color = '#888';
      label.style.display = 'block';
      label.style.marginTop = '4px';
      label.textContent = file.count === 1 ? 'task' : 'tasks';

      // Click handler to open file
      fileItem.addEventListener('click', async () => {
        const targetFile = this.app.vault.getAbstractFileByPath(file.path);
        if (targetFile instanceof TFile) {
          const leaf = this.app.workspace.getLeaf();
          await leaf.openFile(targetFile);
          this.close();
        }
      });

      // Hover effect
      fileItem.addEventListener('mouseenter', () => {
        fileItem.style.transform = 'translateX(4px)';
        fileItem.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      });

      fileItem.addEventListener('mouseleave', () => {
        fileItem.style.transform = 'translateX(0)';
        fileItem.style.boxShadow = 'none';
      });
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
