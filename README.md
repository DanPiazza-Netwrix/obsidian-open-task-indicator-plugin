# Obsidian Plugin - Open Task Indicator

Obsidian plugin (https://obsidian.md/) that displays a real-time count of open action items (unchecked checkboxes) in the status bar.

## Features

- **Real-time Task Counter** - Displays total task count in the status bar at the bottom of Obsidian
- **Severity Breakdown** - Shows how many files have high, medium, and low severity task counts
- **Always Visible** - Status bar indicator is always visible while keeping your navigation sidebar untouched
- **Configurable Thresholds** - Customize what counts as high, medium, or low severity
- **Configurable Ignore Patterns** - Exclude specific files and folders from scanning
- **Auto-refresh** - Automatically update indicators at configurable intervals
- **Manual Refresh** - Command to refresh indicators on demand
- **Debug Logging** - Optional console logging for troubleshooting
<br /><br />
<img width="1112" height="722" alt="image" src="https://github.com/user-attachments/assets/2f62c1cc-f9d4-475c-b749-150286933bf3" />
<br /><br />
<img width="1112" height="722" alt="image" src="https://github.com/user-attachments/assets/b25efff4-5060-4671-9f25-12ea17c8f5b5" />

## Installation

### From Community Plugins (Recommended)

Once this plugin is approved for the Obsidian Community Plugins registry:

1. Open Obsidian Settings
2. Go to **Community plugins** → **Browse**
3. Search for "Open Task Indicator"
4. Click **Install**
5. Enable the plugin in **Community plugins** → **Installed plugins**

### Manual Installation from GitHub

If you want to install from the GitHub repository:

1. **Enable Developer Mode** in Obsidian:
   - Go to Settings → About
   - Scroll down and toggle "Enable developer mode" ON

2. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/DanPiazza-Netwrix/obsidian-open-task-indicator-plugin.git
   ```

3. **Copy Plugin Files**:
   - Copy the entire plugin folder to your vault's `.obsidian/plugins/` directory
   - The path should be: `.obsidian/plugins/open-task-indicator/`

4. **Install Dependencies**:
   ```bash
   cd .obsidian/plugins/open-task-indicator
   npm install
   ```

5. **Build the Plugin**:
   ```bash
   npm run build
   ```

6. **Enable in Obsidian**:
   - Go to Settings → Community plugins
   - Find "Open Task Indicator" and toggle it ON

## Usage

### Status Bar Display

The plugin displays task information in the status bar at the bottom of Obsidian:

**When no tasks exist:**
```
✅ No open tasks
```

**When tasks exist (emoji style):**
```
📋 60 tasks in 8 files | 🔴 2 | 🟠 2 | 🟡 4
```

**When tasks exist (simple style):**
```
📋 60 tasks (8 files)
```

### Severity Levels

The status bar color changes based on the highest severity level found:

- **🔴 Red** (High): 10+ tasks in a file (configurable)
- **🟠 Orange** (Medium): 5-9 tasks in a file (configurable)
- **🟡 Yellow** (Low): 1-4 tasks in a file (configurable)

### Task Format

The plugin scans for unchecked checkboxes in the following format:

```markdown
- [ ] This is an unchecked task
- [x] This is a completed task (ignored)
```

## Settings

Access settings via **Settings → Community plugins → Open Task Indicator**

### Indicator Style
Choose between emoji or simple display style in the status bar.

### Severity Thresholds
Configure the task count thresholds for each severity level:
- High Severity: Default 10 tasks
- Medium Severity: Default 5 tasks
- Low Severity: Default 1 task

### Ignore Patterns
Specify files and folders to exclude from scanning. One pattern per line.

Default: `.obsidian`

### Auto Refresh Interval
Set the interval (in milliseconds) for automatic indicator updates. Set to 0 to disable.

Default: 5000ms (5 seconds)

### Debug Logging
Enable console logging for troubleshooting.

## Commands

- **Refresh task indicators**: Manually refresh all indicators immediately

## How It Works

1. **Scanning**: The plugin scans all markdown files in your vault
2. **Counting**: Counts unchecked tasks (`- [ ]`) in each file
3. **Filtering**: Ignores files matching configured ignore patterns
4. **Calculating**: Determines severity levels based on task counts
5. **Displaying**: Shows summary in the status bar with color coding
6. **Updating**: Updates in real-time as files are modified

## Performance

The plugin is optimized for performance:

- **Caching**: Task counts are cached to avoid redundant scanning
- **Debouncing**: File change events are debounced to prevent excessive updates
- **Incremental Updates**: Only modified files are re-scanned
- **Lazy Loading**: Full vault scan happens on startup, then incremental updates

## Troubleshooting

### Plugin Not Appearing

1. Verify developer mode is enabled in Obsidian settings
2. Check that files are in `.obsidian/plugins/open-task-indicator/`
3. Reload Obsidian (Ctrl+R or Cmd+R)
4. Check browser console for errors (Ctrl+Shift+I)

### Status Bar Not Showing

1. Verify the plugin is enabled in Settings → Community plugins
2. Check that the status bar is visible (View → Show status bar)
3. Try manual refresh: Command palette → "Refresh task indicators"
4. Enable debug logging to see what's being scanned

### Incorrect Task Counts

1. Verify files have unchecked tasks in format: `- [ ]`
2. Check ignore patterns don't exclude your files
3. Try manual refresh: Command palette → "Refresh task indicators"
4. Enable debug logging to see scan results

### Performance Issues

1. Reduce auto-refresh interval or disable it (set to 0)
2. Add more ignore patterns to exclude large folders
3. Check console for errors

## Development

### Build for Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Project Structure
```
.obsidian/plugins/obsidian-open-task-indicator-plugin/
├── src/
│   ├── main.ts              # Plugin entry point
│   ├── TaskScanner.ts       # Task scanning logic
│   ├── StatusBarRenderer.ts # Status bar UI
│   ├── Settings.ts          # Settings UI
│   ├── SettingsValidator.ts # Settings validation logic
│   ├── TaskModal.ts         # Task modal UI component
│   └── types.ts             # TypeScript interfaces
├── main.js                  # Compiled plugin output
├── manifest.json            # Plugin metadata
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── esbuild.config.mjs       # Build config
├── CLAUDE.md                # Development notes and architecture
├── CHANGELOG.md             # Version history
├── LICENSE                  # License file
├── .gitignore               # Git ignore rules
├── data.json                # Data file
└── README.md                # This file
```

## Development

This plugin was built with [Claude Code](https://claude.ai) and includes a [`CLAUDE.md`](CLAUDE.md) file with detailed development notes, architecture documentation, and implementation details for contributors. The CLAUDE.md file is essential to understanding the plugin's design decisions and development process.

### Building from Source

```bash
# Install dependencies
npm install

# Build for development (with watch mode)
npm run dev

# Build for production
npm run build
```

The compiled output will be in `main.js`.

## License

MIT

## Changelog

### Version 1.0.0
- Initial release
- Real-time task counter in status bar
- Configurable severity thresholds
- Customizable ignore patterns
- Auto-refresh functionality
- Settings UI
- Debug logging support
