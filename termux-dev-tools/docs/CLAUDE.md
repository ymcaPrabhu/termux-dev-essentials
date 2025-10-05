# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal Node.js project containing only dependencies without source code. The project serves as a collection of CLI tools and libraries.

## Dependencies and Available Tools

The project includes the following key dependencies:
- `codex` (^0.2.3) and `codex-cli` (^0.1.3) - Code documentation tools
- `github` (^14.0.0) - GitHub API client

## Available CLI Commands

The following CLI tools are available via `node_modules/.bin/`:
- `codex` - Code documentation generation
- `mocha` - JavaScript test framework
- `dox` - JavaScript documentation generator
- `marked` - Markdown parser
- `jade` - Template engine
- `stylus` - CSS preprocessor

## Development Commands

Since this project has no build scripts or npm scripts defined, development primarily involves:
- Installing dependencies: `npm install`
- Running available CLI tools directly from `node_modules/.bin/`

## Project Structure

The project contains only:
- `package.json` - Dependency definitions
- `package-lock.json` - Dependency lock file
- `node_modules/` - Installed dependencies

No source code, tests, or configuration files are present in the project root.