# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-03

### Features
- **Status Bar Display**: Shows task count and severity breakdown
- **Indicator Styles**: Choose between emoji or simple display format
- **Severity Levels**: Customizable thresholds for high, medium, and low severity
- **Ignore Patterns**: Exclude files and folders from scanning
- **Auto Refresh**: Automatic updates at configurable intervals
- **Manual Refresh**: Command to refresh indicators on demand
- **Task Modal**: Detailed view of all files with open tasks
- **Performance Optimized**: Caching, debouncing, and incremental updates

### Technical Details
- Built with TypeScript and Obsidian API
- Uses esbuild for bundling
- Follows Obsidian plugin best practices
- No external dependencies beyond Obsidian
- MIT License
