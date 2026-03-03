# Open Task Indicator - Development Notes

## Project Overview

Open Task Indicator is an Obsidian plugin that displays a real-time count of open tasks (unchecked checkboxes) in the status bar. The plugin provides a native Obsidian solution for tracking and managing open action items across your vault.

## Architecture

### Core Components

1. **TaskScanner.ts** - Scans the vault for markdown files and counts unchecked tasks
   - Uses regex pattern: `/^- \[ \]/gm` to find unchecked checkboxes
   - Implements caching to avoid redundant scans
   - Supports configurable ignore patterns
   - Debounces file change events for performance

2. **StatusBarRenderer.ts** - Renders task information in the status bar
   - Displays summary: `📋 41 tasks in 6 files`
   - Shows severity breakdown in emoji mode: `| 🔴 1 | 🟠 2 | 🟡 3`
   - Color-coded emojis for visual severity indication
   - White text for better readability

3. **TaskModal.ts** - Modal dialog showing detailed task list
   - Displays all files with tasks
   - Shows task count prominently (1.8em, bold, color-coded)
   - Clickable file items to open files directly
   - Sorted by task count (highest first)
   - Hover effects for better UX

4. **Settings.ts** - Settings UI and validation
    - Organized into sections: Indicator Style, Severity Thresholds, Ignore Patterns, Auto Refresh, Debug
    - Severity threshold validation with constraints:
      - High: minimum 3, must be > Medium
      - Medium: minimum 2, must be > Low
      - Low: minimum 1
    - Visual error feedback (color-coded highlights) when values are rejected
    - Reset buttons to restore default thresholds (High=10, Medium=5, Low=1) and ignore patterns

5. **SettingsValidator.ts** - Validation logic for settings
   - Ensures whole numbers only (no decimals)
   - Enforces minimum and maximum constraints
   - Maintains proper ordering (High > Medium > Low)
   - Auto-corrects invalid values

6. **main.ts** - Plugin entry point
   - Initializes scanner and status bar renderer
   - Registers vault event listeners (modify, create, delete, rename)
   - Implements debounced file change handling
   - Sets up auto-refresh interval
   - Provides manual refresh command

## Key Design Decisions

### Status Bar vs Sidebar
- **Initial approach**: Attempted to inject indicators into the file explorer sidebar
- **Problem**: Obsidian doesn't provide official API for sidebar DOM manipulation
- **Solution**: Used official Status Bar API instead
- **Benefit**: Stable, theme-aware, always visible

### Modal for File List
- Clicking status bar opens a modal with detailed task list
- Files are clickable to open directly
- Task counts are prominently displayed
- Sorted by task count for quick access to high-priority files

### Validation Strategy
- Real-time validation with visual feedback
- Auto-correction of invalid values
- Color-coded error highlights that fade after 2 seconds
- Prevents invalid configurations (e.g., duplicate thresholds)

### Performance Optimization
- Caching of task counts per file
- Debouncing of file change events (500ms)
- Incremental updates (only modified files re-scanned)
- Full vault scan only on startup

## Default Settings

```typescript
{
  ignorePatterns: ['.obsidian'],
  indicatorStyle: 'emoji',
  severityThresholds: {
    high: 10,
    medium: 5,
    low: 1,
  },
  autoRefreshInterval: 5000,
  enableDebugLogging: false,
}
```

## File Structure

```
.obsidian/plugins/open-task-indicator/
├── src/
│   ├── main.ts              # Plugin entry point
│   ├── TaskScanner.ts       # Task scanning logic
│   ├── StatusBarRenderer.ts # Status bar UI
│   ├── TaskModal.ts         # Modal dialog for task list
│   ├── Settings.ts          # Settings UI and defaults
│   ├── SettingsValidator.ts # Settings validation logic
│   └── types.ts             # TypeScript interfaces
├── manifest.json            # Plugin metadata
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── esbuild.config.mjs       # Build configuration
├── README.md                # User documentation
├── CLAUDE.md                # This file (development notes)
├── main.js                  # Compiled output (generated)
└── src/SidebarRenderer.ts.backup # Backup of removed sidebar code
```

## Build Process

```bash
# Install dependencies
npm install

# Build for development
npm run dev

# Build for production
npm run build

# Output: main.js (27.4 KB)
```

## Testing Checklist

- [x] Plugin loads without errors
- [x] Status bar displays task count
- [x] Task count updates in real-time as files are modified
- [x] Modal opens when status bar is clicked
- [x] Files in modal are clickable and open correctly
- [x] Settings panel displays all options
- [x] Severity threshold validation works
- [x] Reset button restores defaults
- [x] Ignore patterns work correctly
- [x] Auto-refresh interval works
- [x] Debug logging can be enabled/disabled
- [x] Plugin works with light and dark themes
- [x] TypeScript compiles without errors in strict mode
- [x] Build process completes successfully
- [x] No unnecessary console.log statements in production code

## Known Limitations

1. **Mobile**: Plugin is desktop-only (not tested on mobile)
2. **Performance**: Large vaults (10,000+ files) may experience slower scans
3. **Regex Pattern**: Only matches `- [ ]` format, not other task formats

## Future Enhancements

- [ ] Support for different task formats (e.g., `* [ ]`, `+ [ ]`)
- [ ] Task filtering by tag or folder
- [ ] Statistics and analytics
- [ ] Custom color schemes
- [ ] Export task list to file
- [ ] Integration with other plugins

## Debugging

Enable debug logging in settings to see console output:
- `[OTI]` - General plugin messages
- `[OTI-Scanner]` - Task scanning messages
- `[OTI-StatusBar]` - Status bar update messages
- `[OTI-Settings]` - Settings change messages

View console with: Ctrl+Shift+I (Developer Tools)

## Version History

### v0.1.0 (Current)
- Initial beta release
- Real-time task counter in status bar
- Configurable severity thresholds with validation
- Customizable ignore patterns
- Auto-refresh functionality
- Modal dialog for detailed task list
- Settings UI with organized sections
- Debug logging support
- Desktop-only

## Submission Checklist for Obsidian Community Plugins

- [x] Plugin has unique ID: `open-task-indicator`
- [x] manifest.json is properly formatted
- [x] README.md is comprehensive and accurate
- [x] Plugin is desktop-only (marked in manifest)
- [x] No external dependencies (only Obsidian API)
- [x] Code is TypeScript with proper types
- [x] Plugin follows Obsidian best practices
- [x] Version is semantic (0.1.0 for beta)
- [x] Author is credited
- [x] License is MIT
- [x] Plugin is tested and working
- [x] Ready for community review
- [x] .gitignore file created
- [x] LICENSE file created
- [x] CHANGELOG.md created and maintained
- [x] package.json updated with metadata
- [x] TypeScript strict mode enabled
- [x] Unnecessary console.log statements removed
- [x] GitHub repository configured

## Important: Documentation Maintenance

### Changelog Updates

**When making changes to this plugin, always update CHANGELOG.md first before committing.**

Follow this process:
1. Add your changes to the appropriate section in CHANGELOG.md
2. Update the version number if needed (follow Semantic Versioning)
3. Update manifest.json and package.json versions to match
4. Commit with a clear message referencing the changelog entry

This ensures the changelog stays current and accurate for users and contributors.

### README Updates

Update README.md when:
- **New Features**: Add to the Features section with clear descriptions
- **New Settings**: Document in the Settings section with examples
- **Breaking Changes**: Add a prominent note at the top of the Installation section
- **New Commands**: Add to the Commands section
- **Bug Fixes**: Update relevant sections if they affect user-facing behavior
- **Installation Changes**: Update both Community Plugins and Manual Installation sections

### Version Bumping

Follow Semantic Versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes to settings or API
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, no new features

Update these files together when bumping versions:
1. CHANGELOG.md (add new version section)
2. manifest.json (update "version" field)
3. package.json (update "version" field)

## Contact & Support

For questions about development or future enhancements, refer to this file and the README.md.
