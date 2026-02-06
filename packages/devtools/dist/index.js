"use client";

'use strict';

var react = require('@xyflow/react');
var dagre = require('dagre');
var React2 = require('react');
require('@xyflow/react/dist/style.css');
var iconsMaterial = require('@mui/icons-material');
var jsxRuntime = require('react/jsx-runtime');
var store = require('@ai-sdk-tools/store');
var reactJsonViewLite = require('react-json-view-lite');
require('react-json-view-lite/dist/index.css');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dagre__default = /*#__PURE__*/_interopDefault(dagre);
var React2__default = /*#__PURE__*/_interopDefault(React2);

// Auto-inject CSS styles when module loads
(function() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ai-devtools-styles')) return;
  
  const CSS_CONTENT = `@import url("https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap");

/* Scope ALL styles to devtools only */
.ai-devtools {
  /* Reset any inherited styles from host application */
  all: initial;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  display: block;
  box-sizing: border-box;

  /* Font antialiasing for better text rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.ai-devtools *,
.ai-devtools *::before,
.ai-devtools *::after {
  box-sizing: border-box;
}

.ai-devtools button {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ai-devtools input,
.ai-devtools textarea {
  all: unset;
  display: block;
}

.ai-devtools div {
  display: block;
}

.ai-devtools span {
  display: inline;
}

/* Ensure devtools always appear on top */
.ai-devtools-panel,
.ai-devtools-button {
  z-index: 999999 !important;
  position: fixed !important;
}

/* Button styles */
.ai-devtools-button {
  bottom: 1rem !important;
  right: 1rem !important;
  width: 3rem !important;
  height: 3rem !important;
  background-color: #000000 !important; /* Pure black background */
  color: #ffffff !important; /* White text */
  border: 1px solid #333333 !important; /* Dark gray border */
  border-radius: 50% !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  font-size: 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  padding: 0 !important;
}

.ai-devtools-button-icon {
  font-size: 1.75rem !important;
  transition: all 0.3s ease !important;
}

.ai-devtools-button:hover {
  background-color: #1a1a1a !important; /* Slightly lighter black on hover */
  border-color: #555555 !important; /* Lighter border on hover */
}

/* Panel styles */
.ai-devtools-panel {
  background-color: #000000 !important; /* Pure black background */
  color: #ffffff !important; /* White text */
  box-shadow: none !important;
  font-size: 0.75rem !important;
  line-height: 1rem !important;
  overflow: visible !important;
  position: fixed !important;
  z-index: 2147483647 !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Bottom panel positioning */
.ai-devtools-panel-bottom {
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  border-top: 1px solid #333333 !important; /* Dark gray border */
}

/* Right panel positioning */
.ai-devtools-panel-right {
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  border-left: 1px solid #333333 !important; /* Dark gray border */
}

/* Resize Handle */
.ai-devtools-resize-handle {
  position: absolute !important;
  background-color: transparent !important;
  z-index: 2147483648 !important;
}

/* Bottom panel resize handle */
.ai-devtools-resize-handle-bottom {
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 4px !important;
  cursor: ns-resize !important;
}

/* Right panel resize handle */
.ai-devtools-resize-handle-right {
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 4px !important;
  cursor: ew-resize !important;
}

/* Utility classes */
.ai-devtools .flex {
  display: flex !important;
}

.ai-devtools .items-center {
  align-items: center !important;
}

.ai-devtools .justify-between {
  justify-content: space-between !important;
}

.ai-devtools .px-3 {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

.ai-devtools .py-1\.5 {
  padding-top: 0.375rem !important;
  padding-bottom: 0.375rem !important;
}

.ai-devtools .header-bg {
  background-color: rgba(0, 0, 0, 0.8) !important; /* Black with opacity */
}

.ai-devtools .border-bottom {
  border-bottom-width: 1px !important;
}

.ai-devtools .border-dark {
  border-color: #333333 !important; /* Dark gray border */
}

.ai-devtools .text-small {
  font-size: 0.75rem !important;
  line-height: 1rem !important;
}

.ai-devtools .text-primary {
  color: #ffffff !important; /* White for primary text */
}

.ai-devtools .text-secondary {
  color: #cccccc !important; /* Light gray for secondary text */
}

.ai-devtools .text-muted {
  color: #888888 !important; /* Medium gray for muted text */
}

.ai-devtools .w-1 {
  width: 0.25rem !important;
}

.ai-devtools .h-1 {
  height: 0.25rem !important;
}

.ai-devtools .animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

/* Button content styles */
.ai-devtools-button-icon {
  width: 0.75rem !important; /* w-3 */
  height: 0.75rem !important; /* h-3 */
  margin-bottom: 0.125rem !important; /* mb-0.5 */
}

.ai-devtools-button-count {
  font-size: 8px !important; /* text-[8px] */
  line-height: 1 !important; /* leading-none */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important; /* font-mono */
}

/* Header styles */
.ai-devtools-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0.375rem 0.75rem !important;
  background-color: rgba(0, 0, 0, 0.8) !important; /* Black with opacity */
  border-bottom: 1px solid #333333 !important; /* Dark gray border */
  overflow: visible !important;
}

.ai-devtools-header-left {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
}


.ai-devtools-count {
  font-size: 10px !important;
  color: #cccccc !important; /* Light gray text */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
}

.ai-devtools-rec {
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
  font-size: 10px !important;
  color: #ffffff !important; /* White text */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
}

.ai-devtools-rec-dot {
  width: 0.25rem !important;
  height: 0.25rem !important;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
  color: #cccccc !important; /* Light gray for recording dot */
}

/* Header right section */
.ai-devtools-header-right {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

/* Main Search Bar */
.ai-devtools-search-bar {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  background-color: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  flex: 1 !important;
  margin-right: 1rem !important;
  min-height: 2.5rem !important;
  overflow: visible !important;
}

.ai-devtools-search-input-container {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  width: 100% !important;
  min-height: 2.5rem !important;
  padding: 0.5rem 0.75rem !important;
  background-color: transparent !important;
  border: none !important;
  border-right: 1px solid #333333 !important;
  border-radius: 0 !important;
  position: relative !important;
}

.ai-devtools-search-input-main {
  flex: 1 !important;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  color: #ffffff !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.875rem !important;
  line-height: 1.2 !important;
}

.ai-devtools-search-input-main::placeholder {
  color: #555555 !important;
  font-size: 0.75rem !important;
}

/* Filter Chips */
.ai-devtools-filter-chip {
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
  padding: 0.25rem 0.5rem !important;
  background-color: #333333 !important;
  border: 1px solid #555555 !important;
  border-radius: 0 !important;
  color: #ffffff !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  white-space: nowrap !important;
}

.ai-devtools-filter-chip-icon {
  font-size: 0.75rem !important;
  width: 0.875rem !important;
  text-align: center !important;
}

.ai-devtools-filter-chip-label {
  font-weight: 500 !important;
}

.ai-devtools-filter-chip-remove {
  background: none !important;
  border: none !important;
  color: #cccccc !important;
  cursor: pointer !important;
  font-size: 1rem !important;
  line-height: 1 !important;
  padding: 0 !important;
  margin-left: 0.25rem !important;
  width: 1rem !important;
  height: 1rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.ai-devtools-filter-chip-remove:hover {
  color: #ffffff !important;
  background-color: #555555 !important;
}

/* Filter Indicator */
.ai-devtools-filter-indicator {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0.25rem 0.5rem !important;
  background-color: #333333 !important;
  border: 1px solid #555555 !important;
  color: #cccccc !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  flex-shrink: 0 !important;
  min-width: 1.5rem !important;
  height: 1.5rem !important;
}

.ai-devtools-filter-indicator:hover {
  background-color: #444444 !important;
  border-color: #666666 !important;
  color: #ffffff !important;
}

.ai-devtools-filter-indicator-count {
  color: #ffffff !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  text-align: center !important;
}

/* Filter Badges */
.ai-devtools-filter-badges {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  background-color: #1a1a1a !important;
  border-bottom: 1px solid #333333 !important;
}

.ai-devtools-filter-group {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  flex-wrap: wrap !important;
}

.ai-devtools-filter-group-label {
  color: #888888 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  margin-right: 0.25rem !important;
}

.ai-devtools-filter-badge {
  background-color: #2a2a2a !important;
  border: 1px solid #404040 !important;
  color: #888888 !important;
  padding: 0.25rem 0.5rem !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
  border-radius: 0 !important;
}

.ai-devtools-filter-badge:hover {
  background-color: #404040 !important;
  color: #ffffff !important;
}

.ai-devtools-filter-badge.active {
  background-color: #404040 !important;
  color: #ffffff !important;
  border-color: #666666 !important;
}

.ai-devtools-filter-badge.clear {
  background-color: #ff4444 !important;
  color: #ffffff !important;
  border-color: #ff6666 !important;
}

.ai-devtools-filter-badge.clear:hover {
  background-color: #ff6666 !important;
}

.ai-devtools-filter-remove {
  color: #ff6666 !important;
  font-weight: bold !important;
  margin-left: 0.25rem !important;
}

/* Filter Dropdown */
.ai-devtools-filter-dropdown {
  position: absolute !important;
  top: 100% !important;
  left: 1rem !important;
  right: 1rem !important;
  background-color: #1a1a1a !important;
  border: 1px solid #404040 !important;
  border-top: none !important;
  z-index: 2147483647 !important;
  max-height: 400px !important;
  overflow-y: auto !important;
}

.ai-devtools-filter-dropdown-content {
  padding: 1rem !important;
}

.ai-devtools-filter-section {
  margin-bottom: 1.5rem !important;
}

.ai-devtools-filter-section:last-child {
  margin-bottom: 0 !important;
}

.ai-devtools-filter-section-title {
  color: #ffffff !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.75rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
}

.ai-devtools-filter-options {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
  gap: 0.5rem !important;
}

.ai-devtools-filter-option {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.5rem 0.75rem !important;
  background-color: #2a2a2a !important;
  border: 1px solid #404040 !important;
  color: #888888 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  text-align: left !important;
  border-radius: 0 !important;
}

.ai-devtools-filter-option:hover {
  background-color: #404040 !important;
  color: #ffffff !important;
}

.ai-devtools-filter-option.active {
  background-color: #404040 !important;
  color: #ffffff !important;
  border-color: #666666 !important;
}

.ai-devtools-filter-option-icon {
  font-size: 0.875rem !important;
  width: 1rem !important;
  text-align: center !important;
}

.ai-devtools-filter-option-label {
  flex: 1 !important;
  font-weight: 500 !important;
}

.ai-devtools-filter-option-count {
  color: #666666 !important;
  font-size: 0.6875rem !important;
  background-color: #333333 !important;
  padding: 0.125rem 0.375rem !important;
  border-radius: 0 !important;
}

.ai-devtools-filter-actions {
  border-top: 1px solid #333333 !important;
  padding-top: 1rem !important;
  margin-top: 1rem !important;
}

.ai-devtools-filter-clear-all {
  background-color: #ff4444 !important;
  color: #ffffff !important;
  border: 1px solid #ff6666 !important;
  padding: 0.5rem 1rem !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  border-radius: 0 !important;
  width: 100% !important;
}

.ai-devtools-filter-clear-all:hover {
  background-color: #ff6666 !important;
}

/* Search Suggestions */
.ai-devtools-search-suggestions {
  position: absolute !important;
  top: calc(100% + 2px) !important;
  left: 0 !important;
  right: 0 !important;
  background-color: #000000 !important;
  border: 1px solid #333333 !important;
  z-index: 2147483647 !important;
  max-height: 300px !important;
  overflow-y: auto !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8) !important;
  display: block !important;
  visibility: visible !important;
}

.ai-devtools-search-suggestions-content {
  padding: 0 !important;
  background-color: #000000 !important;
}

.ai-devtools-suggestion-section {
  margin-bottom: 0 !important;
}

.ai-devtools-suggestion-section:last-child {
  margin-bottom: 0 !important;
}

.ai-devtools-suggestion-section-title {
  color: #666666 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.7rem !important;
  font-weight: 600 !important;
  margin: 0 !important;
  padding: 0.5rem 0.75rem 0.25rem 0.75rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  background-color: #111111 !important;
  border-bottom: 1px solid #222222 !important;
}

.ai-devtools-suggestion-options {
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
}

.ai-devtools-suggestion-option {
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
  padding: 0.5rem 0.75rem !important;
  padding-right: 2.5rem !important;
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid #222222 !important;
  color: #cccccc !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  text-align: left !important;
  border-radius: 0 !important;
  width: 100% !important;
  position: relative !important;
  overflow: hidden !important;
}

.ai-devtools-suggestion-option:hover {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
}

.ai-devtools-suggestion-option.active {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  border-left: 3px solid #666666 !important;
}

.ai-devtools-suggestion-icon {
  font-size: 0.875rem !important;
  width: 1rem !important;
  text-align: center !important;
}

.ai-devtools-suggestion-label {
  flex: 1 !important;
  font-weight: 500 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  margin-right: 1.5rem !important;
}

.ai-devtools-suggestion-count {
  position: absolute !important;
  right: 0.75rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  color: #888888 !important;
  font-size: 0.6875rem !important;
  background-color: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
  font-weight: 400 !important;
  min-width: 1.5rem !important;
  text-align: right !important;
}

.ai-devtools-suggestion-actions {
  border-top: 1px solid #333333 !important;
  padding-top: 1rem !important;
  margin-top: 1rem !important;
}

.ai-devtools-suggestion-no-results {
  color: #888888 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  text-align: center !important;
  padding: 1rem !important;
  font-style: italic !important;
}

/* Button styles */
.ai-devtools-btn {
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
  padding: 0.125rem 0.375rem !important;
  font-size: 10px !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  border: 1px solid #333333 !important; /* Dark gray border */
  background-color: transparent !important;
  color: #cccccc !important; /* Light gray text */
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}

.ai-devtools-btn:hover {
  background-color: #1a1a1a !important; /* Dark background on hover */
  border-color: #555555 !important; /* Lighter border on hover */
}

.ai-devtools-btn.active {
  background-color: #333333 !important; /* Dark gray active background */
  color: #ffffff !important; /* White active text */
  border-color: #555555 !important; /* Lighter active border */
}

.ai-devtools-btn-icon {
  width: 0.625rem !important;
  height: 0.625rem !important;
}

.ai-devtools-close-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0.125rem !important;
  color: #cccccc !important; /* Light gray text */
  cursor: pointer !important;
  transition: color 0.15s ease !important;
}

.ai-devtools-close-btn:hover {
  color: #ffffff !important; /* White on hover */
}

.ai-devtools-close-icon {
  width: 0.75rem !important;
  height: 0.75rem !important;
}

/* Position Toggle Button */
.ai-devtools-position-toggle-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 22px !important;
  height: 22px !important;
  padding: 0 !important;
  font-size: 10px !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  border: 1px solid #333333 !important; /* Dark gray border */
  background-color: transparent !important;
  color: #cccccc !important; /* Light gray text */
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}

.ai-devtools-position-toggle-btn:hover {
  background-color: #1a1a1a !important; /* Dark background on hover */
  border-color: #555555 !important; /* Lighter border on hover */
}

.ai-devtools-position-toggle-icon {
  width: 12px !important;
  height: 12px !important;
}

/* Content styles */
.ai-devtools-content {
  display: flex !important;
  height: 100% !important;
  background-color: #000000 !important; /* Pure black background */
}

.ai-devtools-filters {
  width: 20rem !important;
  border-right: 1px solid #333333 !important; /* Dark gray border */
  overflow-y: auto !important;
  background-color: rgba(0, 0, 0, 0.9) !important; /* Black with opacity */
}

.ai-devtools-events {
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 0.5rem !important;
  background-color: #000000 !important; /* Pure black background */
}

/* Event item styles */
.ai-devtools-event-item {
  border-bottom: 1px solid #222222 !important; /* Subtle border like terminal */
}

.ai-devtools-event-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0.25rem 0.75rem !important; /* More compact padding */
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
  min-height: 1.5rem !important; /* More compact height */
  border-left: 2px solid transparent !important; /* Thinner left border */
  font-size: 0.75rem !important; /* Smaller text */
}

.ai-devtools-event-header:hover {
  background-color: #1a1a1a !important; /* Dark hover background */
}

/* Color-coded left borders for different event types */
.ai-devtools-event-item[data-type="tool-call-result"]
.ai-devtools-event-header {
  border-left-color: #00ff00 !important; /* Green for success */
}

.ai-devtools-event-item[data-type="tool-call-error"] .ai-devtools-event-header {
  border-left-color: #ff0000 !important; /* Red for errors */
}

.ai-devtools-event-item[data-type="message-complete"]
  .ai-devtools-event-header {
  border-left-color: #00ff00 !important; /* Green for completion */
}

.ai-devtools-event-item[data-type="finish"] .ai-devtools-event-header {
  border-left-color: #00ff00 !important; /* Green for finish */
}

.ai-devtools-event-item[data-type="stream-done"] .ai-devtools-event-header {
  border-left-color: #00ff00 !important; /* Green for stream done */
}

.ai-devtools-event-item[data-type="text-delta"] .ai-devtools-event-header {
  border-left-color: #888888 !important; /* Gray for text deltas */
}

.ai-devtools-event-item[data-type="message-chunk"] .ai-devtools-event-header {
  border-left-color: #888888 !important; /* Gray for chunks */
}

.ai-devtools-event-item[data-type="start"] .ai-devtools-event-header {
  border-left-color: #87ceeb !important; /* Light blue for start */
}

.ai-devtools-event-item[data-type="reasoning-start"] .ai-devtools-event-header {
  border-left-color: #9c27b0 !important; /* Purple for reasoning start */
}

.ai-devtools-event-item[data-type="reasoning-end"] .ai-devtools-event-header {
  border-left-color: #9c27b0 !important; /* Purple for reasoning end */
}

.ai-devtools-event-content {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important; /* More spacing for better readability */
  flex: 1 !important;
  min-width: 0 !important;
}

.ai-devtools-event-indicator {
  width: 0.25rem !important; /* Slightly bigger indicator */
  height: 0.25rem !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
  background-color: #888888 !important; /* Medium gray */
  margin-right: 0.5rem !important; /* More spacing */
}

.ai-devtools-event-icon {
  font-size: 0.6875rem !important; /* Slightly smaller icon */
  flex-shrink: 0 !important;
  color: #cccccc !important; /* Light gray */
  margin-right: 0.5rem !important; /* More spacing */
  font-weight: bold !important; /* Make icons more visible */
}

.ai-devtools-event-description {
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
}

.ai-devtools-event-text {
  font-size: 0.75rem !important; /* Smaller text */
  color: #ffffff !important; /* White text */
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important; /* Monospace font */
  line-height: 1.2 !important; /* Tighter line height */
  font-weight: 400 !important; /* Normal weight */
  letter-spacing: 0.025em !important; /* Slight letter spacing */
}

.ai-devtools-event-duration {
  color: #888888 !important; /* Slightly dimmer for duration */
  font-size: 0.5625rem !important; /* Even smaller for duration */
}

/* Tool call session styles */
.ai-devtools-session {
  border: 1px solid #2a2a2a !important; /* Lighter border */
  margin-bottom: 0.25rem !important; /* Tighter spacing */
  background-color: #0f0f0f !important; /* Slightly lighter background */
}

.ai-devtools-session-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0.375rem 0.75rem !important; /* More compact padding */
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
  background-color: #141414 !important; /* Slightly lighter header background */
  border-bottom: 1px solid #2a2a2a !important; /* Lighter border */
  min-height: 2rem !important; /* More compact height */
}

.ai-devtools-session-header:hover {
  background-color: #1a1a1a !important; /* Hover background */
}

.ai-devtools-session-content {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  flex: 1 !important;
}

.ai-devtools-session-indicator {
  width: 0.375rem !important; /* Smaller indicator */
  height: 0.375rem !important;
  border-radius: 50% !important; /* Round indicator */
  flex-shrink: 0 !important;
  margin-right: 0.5rem !important; /* Add spacing */
}

/* Status-specific indicator colors */
.ai-devtools-session[data-status="completed"] .ai-devtools-session-indicator {
  background-color: #00ff00 !important; /* Green for completed */
}

.ai-devtools-session[data-status="running"] .ai-devtools-session-indicator {
  background-color: #ffaa00 !important; /* Orange for running */
}

.ai-devtools-session[data-status="error"] .ai-devtools-session-indicator {
  background-color: #ff0000 !important; /* Red for error */
}

.ai-devtools-session-icon {
  font-size: 0.75rem !important;
  flex-shrink: 0 !important;
  color: #cccccc !important;
  font-weight: bold !important;
}

.ai-devtools-session-info {
  flex: 1 !important;
  min-width: 0 !important;
}

.ai-devtools-session-tool-name {
  font-size: 0.8125rem !important; /* Slightly smaller */
  color: #ffffff !important;
  font-weight: 500 !important; /* Lighter weight for cleaner look */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  margin-bottom: 0.0625rem !important; /* Tighter spacing */
  letter-spacing: 0.025em !important; /* Slight letter spacing */
}

.ai-devtools-session-summary {
  font-size: 0.6875rem !important; /* Smaller text */
  color: #999999 !important; /* Lighter gray */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-weight: 400 !important; /* Normal weight */
}

.ai-devtools-session-timestamp {
  font-size: 0.6875rem !important;
  color: #888888 !important;
  flex-shrink: 0 !important;
  margin-left: 0.75rem !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
}

.ai-devtools-session-expand {
  margin-left: 0.5rem !important;
  flex-shrink: 0 !important;
}

.ai-devtools-session-arrow {
  width: 1rem !important;
  height: 1rem !important;
  color: #888888 !important;
  transition: transform 0.15s ease !important;
}

.ai-devtools-session-arrow-expanded {
  transform: rotate(180deg) !important;
}

.ai-devtools-session-events {
  background-color: #0a0a0a !important; /* Session events background */
  border-top: 1px solid #222222 !important;
}

.ai-devtools-session-event {
  border-left: 2px solid #333333 !important; /* Indent session events */
  margin-left: 1rem !important;
  border-bottom: none !important; /* Remove individual event borders */
}

.ai-devtools-session-event:last-child {
  border-bottom: 1px solid #222222 !important; /* Add border to last event */
}

.ai-devtools-event-timestamp {
  font-size: 0.6875rem !important; /* Slightly smaller timestamp */
  color: #888888 !important; /* Medium gray */
  flex-shrink: 0 !important;
  margin-left: 0.75rem !important; /* More spacing */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important; /* Monospace font */
  line-height: 1.2 !important; /* Slightly tighter line height */
}

.ai-devtools-event-expand {
  margin-left: 0.5rem !important;
  flex-shrink: 0 !important;
}

.ai-devtools-event-arrow {
  width: 0.75rem !important;
  height: 0.75rem !important;
  color: #888888 !important; /* Medium gray */
  transition: transform 0.15s ease !important;
}

.ai-devtools-event-arrow-expanded {
  transform: rotate(180deg) !important;
}

.ai-devtools-event-expanded {
  border-top: 1px solid #333333 !important; /* Dark gray border */
  background-color: rgba(0, 0, 0, 0.8) !important; /* Black with opacity */
}

.ai-devtools-event-details {
  padding: 0.75rem !important;
}

.ai-devtools-event-metadata {
  margin-bottom: 0.75rem !important;
}

.ai-devtools-event-metadata-title {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  color: #ffffff !important; /* White text */
  margin-bottom: 0.5rem !important;
}

.ai-devtools-event-metadata-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 0.5rem !important;
  font-size: 0.75rem !important;
}

.ai-devtools-event-metadata-item {
  color: #cccccc !important; /* Light gray */
}

.ai-devtools-event-metadata-label {
  font-weight: 500 !important;
  color: #ffffff !important; /* White text */
}

.ai-devtools-event-data-title {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  color: #ffffff !important; /* White text */
  margin-bottom: 0.5rem !important;
}

.ai-devtools-event-data-content {
  font-size: 0.75rem !important;
  background-color: #1a1a1a !important; /* Dark background */
  padding: 0.5rem !important;
  border: 1px solid #333333 !important; /* Dark gray border */
  overflow-x: auto !important;
  max-height: 10rem !important;
  overflow-y: auto !important;
  color: #ffffff !important; /* White text */
}

.ai-devtools-event-metadata-section {
  margin-top: 0.75rem !important;
}

.ai-devtools-event-metadata-content {
  font-size: 0.75rem !important;
  background-color: #1a1a1a !important; /* Dark background */
  padding: 0.5rem !important;
  border: 1px solid #333333 !important; /* Dark gray border */
  overflow-x: auto !important;
  max-height: 8rem !important;
  overflow-y: auto !important;
  color: #ffffff !important; /* White text */
}

/* Panel content area - scrollable */
.ai-devtools-panel-content {
  flex: 1 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Event list styles */
.ai-devtools-event-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important; /* No gap between items like terminal */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important; /* Smaller, more compact text */
  line-height: 1.2 !important; /* Tighter line height */
}

.ai-devtools-empty-state {
  margin-top: 1rem;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 8rem !important;
  color: #cccccc !important; /* Light gray */
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
}

.ai-devtools-empty-content {
  text-align: center !important;
}

.ai-devtools-empty-title {
  font-size: 0.875rem !important;
  margin-bottom: 0.5rem !important;
  color: #ffffff !important; /* White text */
}

.ai-devtools-empty-subtitle {
  font-size: 0.75rem !important;
  color: #888888 !important; /* Medium gray */
}

/* Filter styles */
.ai-devtools-filters-container {
  background-color: #000000 !important; /* Pure black background */
  border-bottom: 1px solid #333333 !important; /* Dark gray border */
}

.ai-devtools-filters-content {
  padding: 1rem !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 1rem !important;
}

.ai-devtools-filter-label {
  display: block !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: #ffffff !important; /* White text */
  margin-bottom: 0.5rem !important;
}

.ai-devtools-search-container {
  position: relative !important;
}

.ai-devtools-search-input {
  width: 100% !important;
  padding: 0.5rem 0.75rem !important;
  border: 1px solid #333333 !important; /* Dark gray border */
  font-size: 0.875rem !important;
  background-color: #1a1a1a !important; /* Dark background */
  color: #ffffff !important; /* White text */
  outline: none !important;
  transition: border-color 0.15s ease !important;
}

.ai-devtools-search-input:focus {
  border-color: #555555 !important; /* Lighter border on focus */
  box-shadow: 0 0 0 2px rgba(85, 85, 85, 0.2) !important; /* Focus ring */
}

.ai-devtools-search-clear {
  position: absolute !important;
  right: 0.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  color: #888888 !important; /* Medium gray */
  background: none !important;
  border: none !important;
  cursor: pointer !important;
  padding: 0.25rem !important;
  transition: color 0.15s ease !important;
}

.ai-devtools-search-clear:hover {
  color: #cccccc !important; /* Light gray on hover */
}

.ai-devtools-search-clear-icon {
  width: 1rem !important;
  height: 1rem !important;
}

.ai-devtools-filter-options {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.25rem !important;
  max-height: 8rem !important;
  overflow-y: auto !important;
}

.ai-devtools-filter-option {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.5rem !important;
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
}

.ai-devtools-filter-option:hover {
  background-color: #1a1a1a !important; /* Dark hover background */
}

.ai-devtools-filter-option-selected {
  background-color: #333333 !important; /* Dark selected background */
  border: 1px solid #555555 !important; /* Lighter border */
}

.ai-devtools-checkbox {
  width: 1rem !important;
  height: 1rem !important;
  color: #ffffff !important; /* White accent color */
  background-color: #1a1a1a !important; /* Dark background */
  border: 1px solid #333333 !important; /* Dark gray border */
  cursor: pointer !important;
}

.ai-devtools-checkbox:checked {
  background-color: #ffffff !important; /* White when checked */
  border-color: #ffffff !important;
}

.ai-devtools-type-indicator {
  width: 0.75rem !important;
  height: 0.75rem !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
}

.ai-devtools-type-icon {
  font-size: 1.125rem !important;
}

.ai-devtools-type-label {
  font-size: 0.875rem !important;
  flex: 1 !important;
  color: #ffffff !important; /* White text */
}

.ai-devtools-type-count {
  font-size: 0.75rem !important;
  color: #888888 !important; /* Medium gray */
  background-color: #1a1a1a !important; /* Dark background */
  padding: 0.125rem 0.5rem !important;
}

.ai-devtools-tool-name {
  font-size: 0.875rem !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  color: #ffffff !important; /* White text */
}

.ai-devtools-clear-filters {
  padding-top: 0.5rem !important;
  border-top: 1px solid #333333 !important; /* Dark gray border */
}

.ai-devtools-clear-button {
  font-size: 0.875rem !important;
  color: #cccccc !important; /* Light gray */
  background: none !important;
  border: none !important;
  cursor: pointer !important;
  font-weight: 500 !important;
  transition: color 0.15s ease !important;
}

.ai-devtools-clear-button:hover {
  color: #ffffff !important; /* White on hover */
}

/* Tooltip styles */
.ai-devtools-tooltip-container {
  position: relative !important;
  display: inline-block !important;
}

.ai-devtools-tooltip {
  position: absolute !important;
  bottom: 100% !important;
  left: 50% !important;
  transform: translateX(-30%) !important;
  margin-bottom: 8px !important;
  padding: 0 !important;
  background-color: #1a1a1a !important;
  border: 1px solid #333333 !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8) !important;
  z-index: 2147483648 !important;
  min-width: 200px !important;
  max-width: 400px !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  line-height: 1.4 !important;
  pointer-events: none !important;
}

.ai-devtools-tooltip::after {
  content: "" !important;
  position: absolute !important;
  top: 100% !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  border: 4px solid transparent !important;
  border-top-color: #1a1a1a !important;
}

.ai-devtools-tooltip-content {
  padding: 0.75rem !important;
}

.ai-devtools-tooltip-title {
  color: #ffffff !important;
  font-weight: 600 !important;
  margin-bottom: 0.5rem !important;
  font-size: 0.8rem !important;
}

.ai-devtools-tooltip-params {
  color: #cccccc !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.7rem !important;
  line-height: 1.3 !important;
  margin: 0 !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
  max-height: 200px !important;
  overflow-y: auto !important;
}

/* Parameters indicator */
.ai-devtools-session-params-indicator {
  margin-left: 0.5rem !important;
  font-size: 0.7rem !important;
  opacity: 0.7 !important;
  transition: opacity 0.2s ease !important;
}

.ai-devtools-session-header:hover .ai-devtools-session-params-indicator {
  opacity: 1 !important;
}

/* Removed recPulse animation to prevent bleeding */

@keyframes sparkle {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
}

@keyframes sparklePulse {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: scale(1.3) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 1;
  }
  75% {
    transform: scale(1.3) rotate(270deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

/* Enhanced button effects when receiving events */
.ai-devtools-button.receiving-events {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4) !important;
  border-color: #333333 !important;
  animation: buttonPulse 0.8s ease-in-out infinite !important;
}

.ai-devtools-button.receiving-events .ai-devtools-button-icon {
  color: #22c55e !important;
  animation: iconColorPulse 1.2s ease-in-out infinite !important;
}

@keyframes buttonPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(34, 197, 94, 0.6);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.3);
  }
}

@keyframes iconColorPulse {
  0% {
    color: #22c55e;
    filter: brightness(1);
  }
  25% {
    color: #16a34a;
    filter: brightness(1.2);
  }
  50% {
    color: #15803d;
    filter: brightness(1.4);
  }
  75% {
    color: #16a34a;
    filter: brightness(1.2);
  }
  100% {
    color: #22c55e;
    filter: brightness(1);
  }
}



  stroke-width: 8 !important;
  fill: none !important;
  stroke-linecap: round !important;
  transition: stroke-dashoffset 0.3s ease !important;
}

  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  text-align: center !important;
  z-index: 1 !important;
}

  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  line-height: 1 !important;
  margin-bottom: 0.125rem !important;
}

  font-size: 0.625rem !important;
  color: #888888 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  line-height: 1 !important;
}

/* Context Details */
  display: flex !important;
  flex-direction: column !important;
  gap: 0.25rem !important;
  flex: 1 !important;
  min-width: 0 !important;
}

  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem !important;
  padding: 0.125rem 0 !important;
}

  color: #fbbf24 !important;
  background-color: rgba(251, 191, 36, 0.1) !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 2px !important;
  border: 1px solid rgba(251, 191, 36, 0.3) !important;
}

  font-size: 0.6875rem !important;
  color: #888888 !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.025em !important;
  flex-shrink: 0 !important;
}

  font-size: 0.75rem !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  text-align: right !important;
  flex-shrink: 0 !important;
}

/* Model Info */
.ai-devtools-model-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.125rem !important;
  align-items: flex-end !important;
  text-align: right !important;
  flex-shrink: 0 !important;
  min-width: 120px !important;
}

.ai-devtools-model-name {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  line-height: 1.2 !important;
  margin-bottom: 0.0625rem !important;
}

.ai-devtools-model-provider {
  font-size: 0.625rem !important;
  color: #888888 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  line-height: 1 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 0.75rem !important;
  }


  .ai-devtools-model-info {
    align-items: center !important;
    text-align: center !important;
  }
}


  stroke-width: 2 !important;
  fill: none !important;
  stroke-linecap: round !important;
  transition: stroke-dashoffset 0.3s ease !important;
}

  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  text-align: center !important;
  z-index: 1 !important;
}

  font-size: 0.625rem !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  line-height: 1 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
}

/* Context Circle Tooltip */
  position: absolute !important;
  bottom: calc(100% + 8px) !important;
  right: -20px !important;
  transform: none !important;
  background-color: #0a0a0a !important;
  border: 1px solid #222222 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  z-index: 2147483648 !important;
  width: 200px !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.65rem !important;
  line-height: 1.3 !important;
  pointer-events: none !important;
  opacity: 1 !important;
}

@keyframes contextTooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Arrow removed */

  padding: 1rem !important;
}

/* Progress Section */
  margin-bottom: 0.75rem !important;
}

  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 0.5rem !important;
}

  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
}

  color: #888888 !important;
  font-size: 0.6rem !important;
}

  width: 100% !important;
  height: 4px !important;
  background-color: #404040 !important;
  border-radius: 0 !important;
  overflow: hidden !important;
}

  height: 100% !important;
  background-color: #ffffff !important;
  border-radius: 0 !important;
  transition: width 0.3s ease !important;
}

/* Usage Section */
  margin-bottom: 0.75rem !important;
  padding-top: 0.75rem !important;
  border-top: 1px solid #404040 !important;
}

  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 0.25rem !important;
}

  margin-bottom: 0 !important;
}

  color: #888888 !important;
  font-size: 0.6rem !important;
}

  color: #ffffff !important;
  font-size: 0.6rem !important;
}

/* Cost Section */
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding-top: 0.75rem !important;
  border-top: 1px solid #404040 !important;
}

  color: #888888 !important;
  font-size: 0.6rem !important;
}

  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.6rem !important;
}

  margin-bottom: 0.75rem !important;
}

  margin-bottom: 0 !important;
}

  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.7rem !important;
  margin-bottom: 0.25rem !important;
  line-height: 1.2 !important;
}

  color: #888888 !important;
  font-size: 0.6rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  margin-bottom: 0.5rem !important;
}

  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem !important;
  padding: 0.125rem 0 !important;
  font-size: 0.6rem !important;
}

  color: #fbbf24 !important;
  background-color: rgba(251, 191, 36, 0.1) !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 3px !important;
  border: 1px solid rgba(251, 191, 36, 0.3) !important;
  margin: 0.25rem 0 !important;
}

  color: #888888 !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.025em !important;
  flex-shrink: 0 !important;
}

  color: #ffffff !important;
  font-weight: 600 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  text-align: right !important;
  flex-shrink: 0 !important;
}

/* Context Insights Demo */
  padding: 1rem !important;
  background-color: #111111 !important;
  border: 1px solid #333333 !important;
  border-radius: 4px !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  color: #ffffff !important;
}

  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  margin-bottom: 1rem !important;
  text-align: center !important;
}

.ai-devtools-model-section {
  margin-bottom: 1.5rem !important;
  padding: 0.75rem !important;
  background-color: #1a1a1a !important;
  border: 1px solid #333333 !important;
  border-radius: 4px !important;
}

.ai-devtools-model-section:last-child {
  margin-bottom: 0 !important;
}

.ai-devtools-model-section h4 {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: #cccccc !important;
  margin-bottom: 0.5rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
}

/* Bottom Stats Section */
.ai-devtools-bottom-stats {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 0.125rem 0.75rem !important;
  border-top: 1px solid #333333 !important;
  background-color: transparent !important;
  height: 24px !important;
  overflow: visible !important;
}

.ai-devtools-tokens-section {
  display: flex !important;
  align-items: center !important;
}


/* Streaming Speed Metrics */
.ai-devtools-speed-metrics {
  display: flex !important;
  gap: 1rem !important;
  align-items: center !important;
  font-family:
    "Geist Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
    "Courier New", monospace !important;
  font-size: 0.625rem !important;
  color: #888888 !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
}

.ai-devtools-speed-metric {
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
}

.ai-devtools-speed-value {
  font-weight: 600 !important;
  color: #cccccc !important;
  font-size: 0.625rem !important;
  line-height: 1 !important;
}

.ai-devtools-speed-label {
  font-size: 0.5rem !important;
  color: #666666 !important;
  line-height: 1 !important;
}

/* Context Layout */
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  margin-right: 0.5rem !important;
  gap: 0.375rem !important;
  width: 60px !important;
  height: 20px !important;
}

  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.6rem !important;
  font-weight: 400 !important;
  color: #cccccc !important;
  line-height: 1 !important;
  width: 2.5rem !important;
  text-align: right !important;
  flex-shrink: 0 !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
}


  stroke: #cccccc !important;
  stroke-width: 1.5 !important;
  fill: none !important;
  stroke-linecap: round !important;
  transition: stroke-dashoffset 0.3s ease !important;
}

/* State Watching Styles */
.ai-devtools-btn-badge {
  position: absolute !important;
  top: -4px !important;
  right: -4px !important;
  background: #ef4444 !important;
  color: white !important;
  font-size: 0.5rem !important;
  font-weight: 600 !important;
  padding: 0.125rem 0.25rem !important;
  border-radius: 0.375rem !important;
  min-width: 1rem !important;
  height: 1rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
}

.ai-devtools-state-panel {
  display: flex;
  height: 100%;
  gap: 1px;
}

.ai-devtools-state-panel-left {
  flex: 0 0 40%;
  min-width: 0;
  border-right: 1px solid #333333;
}

.ai-devtools-state-panel-right {
  flex: 1;
  min-width: 0;
}

.ai-devtools-state-panel-full {
  display: flex;
  height: 100%;
  width: 100%;
}

/* State Changes List */
.ai-devtools-state-changes-empty {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  padding: 2rem !important;
}

.ai-devtools-state-changes-empty-content {
  text-align: center !important;
  color: #666666 !important;
}

.ai-devtools-state-changes-empty-icon {
  font-size: 2rem !important;
  margin-bottom: 0.5rem !important;
}

.ai-devtools-state-changes-empty-title {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
  color: #cccccc !important;
}

.ai-devtools-state-changes-empty-description {
  font-size: 0.75rem !important;
  color: #888888 !important;
}

.ai-devtools-state-changes-list {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

.ai-devtools-state-changes-header {
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #333333 !important;
  background: #1a1a1a !important;
}

.ai-devtools-state-changes-title {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  color: #cccccc !important;
}

.ai-devtools-state-changes-content {
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 0.5rem 0 !important;
}

.ai-devtools-state-change-item {
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #222222 !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;
}

.ai-devtools-state-change-item:hover {
  background: #222222 !important;
}

.ai-devtools-state-change-item.selected {
  background: #1e3a8a !important;
}

.ai-devtools-state-change-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 0.5rem !important;
}

.ai-devtools-state-change-type {
  display: flex !important;
  align-items: center !important;
  gap: 0.375rem !important;
}

.ai-devtools-state-change-type-icon {
  font-size: 0.75rem !important;
}

.ai-devtools-state-change-type-label {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  color: #cccccc !important;
  text-transform: capitalize !important;
}

.ai-devtools-state-change-timestamp {
  font-size: 0.625rem !important;
  color: #888888 !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
}

.ai-devtools-state-change-details {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.25rem !important;
}

.ai-devtools-state-change-store {
  font-size: 0.625rem !important;
  color: #888888 !important;
}

.ai-devtools-state-change-store-id {
  color: #cccccc !important;
  font-weight: 500 !important;
}

.ai-devtools-state-change-keys {
  font-size: 0.625rem !important;
}

.ai-devtools-state-change-keys-list {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.25rem !important;
}

.ai-devtools-state-change-key {
  background: #333333 !important;
  color: #cccccc !important;
  padding: 0.125rem 0.375rem !important;
  border-radius: 0.25rem !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.5rem !important;
}

.ai-devtools-state-change-key-more {
  color: #888888 !important;
  font-style: italic !important;
}

.ai-devtools-state-change-keys-none {
  color: #666666 !important;
  font-style: italic !important;
}

/* State Data Explorer */
.ai-devtools-state-explorer-empty {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  padding: 2rem !important;
}

.ai-devtools-state-explorer-empty-content {
  text-align: center !important;
  color: #666666 !important;
}

.ai-devtools-state-explorer-empty-icon {
  font-size: 2rem !important;
  margin-bottom: 0.5rem !important;
}

.ai-devtools-state-explorer-empty-title {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
  color: #cccccc !important;
}

.ai-devtools-state-explorer-empty-description {
  font-size: 0.75rem !important;
  color: #888888 !important;
}

.ai-devtools-state-explorer {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

.ai-devtools-state-explorer-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #333333 !important;
  background: #1a1a1a !important;
}

.ai-devtools-state-explorer-title {
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  color: #cccccc !important;
}

.ai-devtools-state-explorer-subtitle {
  color: #888888 !important;
  font-weight: 400 !important;
  margin-left: 0.5rem !important;
}

.ai-devtools-state-explorer-modes {
  display: flex !important;
  gap: 0.25rem !important;
}

.ai-devtools-state-explorer-mode-btn {
  padding: 0.25rem 0.5rem !important;
  font-size: 0.625rem !important;
  border-radius: 0.25rem !important;
  background: #333333 !important;
  color: #888888 !important;
  transition: all 0.2s ease !important;
}

.ai-devtools-state-explorer-mode-btn:hover {
  background: #444444 !important;
  color: #cccccc !important;
}

.ai-devtools-state-explorer-mode-btn.active {
  background: #1e3a8a !important;
  color: #ffffff !important;
}

.ai-devtools-state-explorer-content {
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 1rem !important;
  font-family:
    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.75rem !important;
  line-height: 1.4 !important;
}

/* JSON Viewer Styles */
.ai-devtools-json-null {
  color: #888888 !important;
  font-style: italic !important;
}

.ai-devtools-json-string {
  color: #cccccc !important;
}

.ai-devtools-json-primitive {
  color: #888888 !important;
}

.ai-devtools-json-array {
  color: #cccccc !important;
}

.ai-devtools-json-array-content {
  margin-left: 0.125rem !important;
}

.ai-devtools-json-array-item {
  margin-bottom: 0.25rem !important;
  margin-left: 0 !important;
  display: block !important;
}

.ai-devtools-json-array-index {
  color: #888888 !important;
  margin-right: 0.5rem !important;
}

.ai-devtools-json-indent {
  white-space: pre !important;
  font-family: monospace !important;
  display: inline !important;
  flex-shrink: 0 !important;
}

.ai-devtools-json-inline {
  display: inline !important;
}

.ai-devtools-json-object {
  color: #cccccc !important;
}

.ai-devtools-json-object-content {
  margin-left: 0.125rem !important;
}

.ai-devtools-json-object-item {
  margin-bottom: 0.25rem !important;
  margin-left: 0 !important;
  display: block !important;
}

.ai-devtools-json-object-key-row {
  display: flex !important;
  align-items: flex-start !important;
  gap: 0.25rem !important;
}

.ai-devtools-json-expand-btn {
  background: none !important;
  border: none !important;
  color: #888888 !important;
  cursor: pointer !important;
  padding: 0 !important;
  margin: 0 !important;
  margin-right: 0.25rem !important;
  font-size: 0.75rem !important;
  width: 1rem !important;
  height: 1rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
}

.ai-devtools-json-expand-btn:hover {
  color: #cccccc !important;
}

.ai-devtools-json-key {
  color: #888888 !important;
  margin-right: 0.5rem !important;
  flex-shrink: 0 !important;
}

.ai-devtools-json-preview {
  color: #888888 !important;
  font-style: italic !important;
}

.ai-devtools-json-bracket {
  color: #cccccc !important;
}

.ai-devtools-json-comma {
  color: #888888 !important;
  margin-left: 0.25rem !important;
  display: inline !important;
}

.ai-devtools-json-truncated {
  color: #888888 !important;
  font-style: italic !important;
  margin-left: 1rem !important;
}

.ai-devtools-json-unknown {
  color: #888888 !important;
}

/* React JSON View Lite Styles */

.ai-devtools-json-basic-child {
  margin: 0 !important;
  padding: 0 !important;
}

.ai-devtools-json-label {
  color: #888888 !important;
}

.ai-devtools-json-string-value {
  color: #cccccc !important;
}

.ai-devtools-json-number-value {
  color: #888888 !important;
}

.ai-devtools-json-boolean-value {
  color: #888888 !important;
}

.ai-devtools-json-null-value {
  color: #888888 !important;
}

.ai-devtools-json-undefined-value {
  color: #888888 !important;
}

.ai-devtools-json-punctuation {
  color: #cccccc !important;
}

.ai-devtools-json-collapse-icon::after {
  content: "▼" !important;
  color: #cccccc !important;
  margin-right: 0.25rem !important;
}

.ai-devtools-json-expand-icon::after {
  content: "▶" !important;
  color: #cccccc !important;
  margin-right: 0.25rem !important;
}

.ai-devtools-json-collapsed-content::after {
  content: "..." !important;
  color: #888888 !important;
}

.ai-devtools-json-child-fields-container {
  margin: 0 !important;
  padding: 0 !important;
  margin-left: 0.75rem !important;
  background: none !important;
}

/* Additional indentation for nested levels */
.ai-devtools-json-child-fields-container
.ai-devtools-json-child-fields-container {
  margin-left: 1rem !important;
}

.ai-devtools-json-child-fields-container
  .ai-devtools-json-child-fields-container
  .ai-devtools-json-child-fields-container {
  margin-left: 1.25rem !important;
}

.ai-devtools-json-child-fields-container
  .ai-devtools-json-child-fields-container
  .ai-devtools-json-child-fields-container
  .ai-devtools-json-child-fields-container {
  margin-left: 1.5rem !important;
}

/* Ensure proper spacing for object and array items */
.ai-devtools-json-child-fields-container > * {
  margin-bottom: 0.25rem !important;
}

/* Improve visual hierarchy with better indentation */
.ai-devtools-json-basic-child {
  margin: 0 !important;
  padding: 0 !important;
  position: relative !important;
}

/* Add visual indentation lines for better structure */
.ai-devtools-json-child-fields-container::before {
  content: "" !important;
  position: absolute !important;
  left: -0.5rem !important;
  top: 0 !important;
  bottom: 0 !important;
  width: 1px !important;
}

/* Style for object and array brackets */
.ai-devtools-json-punctuation {
  color: #cccccc !important;
  font-weight: normal !important;
}

/* Better spacing for array items */
.ai-devtools-json-child-fields-container .ai-devtools-json-basic-child {
  margin-left: 0.25rem !important;
}

/* Add subtle background for better readability */
.ai-devtools-json-child-fields-container {
  border-radius: 2px !important;
  margin-top: 0.125rem !important;
  margin-bottom: 0.125rem !important;
}

/* Improve the visual hierarchy with better spacing */
.ai-devtools-json-container {
  font-family: monospace !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: #cccccc !important;
  background: transparent !important;
  padding-left: 0.25rem !important;
}

/* Improve readability of nested content */
.ai-devtools-json-child-fields-container
.ai-devtools-json-child-fields-container {
  border-left: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding-left: 0.25rem !important;
}

/* Add better visual hierarchy for deeply nested content */
.ai-devtools-json-child-fields-container .ai-devtools-json-child-fields-container
  .ai-devtools-json-child-fields-container {
  border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* Ensure proper spacing between items */
.ai-devtools-json-child-fields-container > * + * {
  margin-top: 0.125rem !important;
}

/* Better visual separation for object keys */
.ai-devtools-json-label {
  color: #888888 !important;
  font-weight: 500 !important;
  margin-right: 0.5rem !important;
}`;
  
  const style = document.createElement('style');
  style.id = 'ai-devtools-styles';
  style.textContent = CSS_CONTENT;
  document.head.appendChild(style);
})();
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
function AgentNodeComponent({ data }) {
  const nodeData = data;
  const {
    name,
    status,
    duration
    // toolCallCount,
    // model,
    // routingStrategy,
    // matchScore,
    // round,
  } = nodeData;
  const getStatusIcon = () => {
    switch (status) {
      case "executing":
        return /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.PlayArrow, { sx: { fontSize: 16 } });
      case "completed":
        return /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.CheckCircle, { sx: { fontSize: 16 } });
      case "error":
        return /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Error, { sx: { fontSize: 16 } });
      default:
        return /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Schedule, { sx: { fontSize: 16 } });
    }
  };
  const getStatusColor = () => {
    switch (status) {
      case "executing":
        return "#f59e0b";
      // orange/yellow accent
      case "completed":
        return "#4b5563";
      // darker gray
      case "error":
        return "#f59e0b";
      // orange for visibility
      default:
        return "#374151";
    }
  };
  const statusColor = getStatusColor();
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      react.Handle,
      {
        type: "target",
        position: react.Position.Left,
        style: {
          background: "#3f3f46",
          width: 10,
          height: 10,
          border: "2px solid #18181b"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: "agent-node",
        style: {
          background: "#18181b",
          border: `1px solid #3f3f46`,
          borderRadius: 0,
          padding: "16px 18px",
          minWidth: 200,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#71717a",
                marginBottom: 8,
                textTransform: "uppercase"
              },
              children: "AGENT"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12
              },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "div",
                  {
                    style: {
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#f4f4f5"
                    },
                    children: name
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: { color: statusColor, display: "flex", fontSize: 14 }, children: getStatusIcon() })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                fontSize: 13,
                color: "#a1a1aa",
                marginBottom: duration !== void 0 ? 12 : 0,
                fontFamily: "monospace"
              },
              children: name.toLowerCase().replace(/\s+/g, "-")
            }
          ),
          duration !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                style: {
                  height: 1,
                  background: "#27272a",
                  margin: "12px 0"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12
                },
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "#71717a" }, children: "Duration" }),
                  /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { color: "#f4f4f5", fontWeight: 500 }, children: [
                    duration.toFixed(2),
                    "s"
                  ] })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      react.Handle,
      {
        type: "source",
        position: react.Position.Right,
        style: {
          background: "#3f3f46",
          width: 10,
          height: 10,
          border: "2px solid #18181b"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("style", { children: `
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px ${statusColor}40, 0 4px 6px -1px rgb(0 0 0 / 0.3);
            }
            50% {
              box-shadow: 0 0 30px ${statusColor}60, 0 4px 6px -1px rgb(0 0 0 / 0.3);
            }
          }
        ` })
  ] });
}
var AgentNode = React2.memo(AgentNodeComponent);
function ToolNodeComponent({ data }) {
  const nodeData = data;
  const { name, description } = nodeData;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      react.Handle,
      {
        type: "target",
        position: react.Position.Left,
        style: {
          background: "#3f3f46",
          width: 10,
          height: 10,
          border: "2px solid #18181b"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: "tool-node",
        style: {
          background: "#18181b",
          border: `1px solid #3f3f46`,
          borderRadius: 0,
          padding: "16px 18px",
          minWidth: 200,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#71717a",
                marginBottom: 8,
                textTransform: "uppercase"
              },
              children: "TOOL"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12
              },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "div",
                  {
                    style: {
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#f4f4f5"
                    },
                    children: name
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: { color: "#f59e0b", display: "flex", fontSize: 14 }, children: /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Build, { sx: { fontSize: 16 } }) })
              ]
            }
          ),
          description && /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                fontSize: 13,
                color: "#a1a1aa"
              },
              children: description
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      react.Handle,
      {
        type: "source",
        position: react.Position.Right,
        style: {
          background: "#3f3f46",
          width: 10,
          height: 10,
          border: "2px solid #18181b"
        }
      }
    )
  ] });
}
var ToolNode = React2.memo(ToolNodeComponent);
var nodeTypes = {
  agentNode: AgentNode,
  toolNode: ToolNode
};
function getLayoutedElements(nodes, edges, direction = "LR") {
  const dagreGraph = new dagre__default.default.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 220;
  const nodeHeight = 180;
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, ranksep: 250, nodesep: 120 });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre__default.default.layout(dagreGraph);
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? react.Position.Left : react.Position.Top,
      sourcePosition: isHorizontal ? react.Position.Right : react.Position.Bottom,
      // Shift dagre node position (anchor=center) to top-left
      // to match React Flow node anchor point (top-left)
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };
  });
  return { nodes: layoutedNodes, edges };
}
function processAgentEvents(events) {
  const agentMap = /* @__PURE__ */ new Map();
  const handoffs = [];
  const toolMap = /* @__PURE__ */ new Map();
  let totalRounds = 0;
  let isActive = false;
  let currentAgent;
  for (const event of events) {
    switch (event.type) {
      case "agent-start": {
        const agentName = event.metadata?.agent;
        if (agentName) {
          currentAgent = agentName;
          const existing = agentMap.get(agentName);
          agentMap.set(agentName, {
            name: agentName,
            status: "executing",
            // Preserve original startTime if it exists (don't overwrite on subsequent starts)
            startTime: existing?.startTime || event.timestamp,
            endTime: existing?.endTime,
            toolCallCount: existing?.toolCallCount || 0,
            routingStrategy: event.metadata?.routingStrategy,
            matchScore: event.metadata?.matchScore,
            round: event.metadata?.round,
            model: event.metadata?.model || existing?.model
          });
          isActive = true;
        }
        break;
      }
      case "agent-finish": {
        const agentName = event.metadata?.agent;
        if (agentName && agentMap.has(agentName)) {
          const agent = agentMap.get(agentName);
          if (agent) {
            agentMap.set(agentName, {
              ...agent,
              status: "completed",
              endTime: event.timestamp,
              model: event.metadata?.model || agent.model
            });
          }
        }
        break;
      }
      case "agent-error": {
        const agentName = event.metadata?.agent;
        if (agentName && agentMap.has(agentName)) {
          const agent = agentMap.get(agentName);
          if (agent) {
            agentMap.set(agentName, {
              ...agent,
              status: "error",
              endTime: event.timestamp
            });
          }
        }
        break;
      }
      case "agent-handoff": {
        const fromAgent = event.metadata?.fromAgent;
        const toAgent = event.metadata?.toAgent;
        if (fromAgent && toAgent) {
          handoffs.push({
            id: `handoff-${handoffs.length}`,
            from: fromAgent,
            to: toAgent,
            reason: event.metadata?.reason,
            routingStrategy: event.metadata?.routingStrategy,
            timestamp: event.timestamp
          });
          if (toAgent && event.metadata?.routingStrategy) {
            const targetAgent = agentMap.get(toAgent);
            if (targetAgent) {
              agentMap.set(toAgent, {
                ...targetAgent,
                routingStrategy: event.metadata.routingStrategy
              });
            } else {
              agentMap.set(toAgent, {
                name: toAgent,
                status: "idle",
                toolCallCount: 0,
                routingStrategy: event.metadata.routingStrategy
              });
            }
          }
        }
        break;
      }
      case "agent-complete": {
        totalRounds = event.metadata?.totalRounds || totalRounds;
        isActive = false;
        break;
      }
      case "tool-call-start": {
        const toolName = event.metadata?.toolName || event.data?.toolName;
        const agentName = currentAgent || event.metadata?.agent;
        const isInternalTool = toolName === "handoff_to_agent";
        if (toolName && toolName !== "unknown" && toolName.trim() !== "" && !isInternalTool) {
          const existing = toolMap.get(toolName);
          toolMap.set(toolName, {
            name: toolName,
            agent: agentName,
            description: event.metadata?.description || `${toolName} tool`,
            callCount: (existing?.callCount || 0) + 1
          });
          if (agentName && agentMap.has(agentName)) {
            const agent = agentMap.get(agentName);
            if (agent) {
              agentMap.set(agentName, {
                ...agent,
                toolCallCount: agent.toolCallCount + 1
              });
            }
          }
        }
        break;
      }
      case "finish": {
        if (currentAgent && agentMap.has(currentAgent)) {
          const agent = agentMap.get(currentAgent);
          const responseModel = event.data?.response?.model || event.data?.model;
          if (agent && responseModel) {
            agentMap.set(currentAgent, {
              ...agent,
              model: responseModel
            });
          }
        }
        break;
      }
    }
  }
  const nodes = Array.from(agentMap.entries()).map(([id, data]) => ({
    id,
    ...data,
    duration: data.startTime && data.endTime ? (data.endTime - data.startTime) / 1e3 : void 0
  }));
  const tools = Array.from(toolMap.entries()).map(([id, data]) => ({
    id,
    ...data
  }));
  const firstEvent = events.find(
    (e) => e.type === "agent-start" || e.type === "agent-handoff"
  );
  const lastEvent = [...events].reverse().find((e) => e.type === "agent-finish" || e.type === "agent-complete");
  const totalDuration = firstEvent && lastEvent ? (lastEvent.timestamp - firstEvent.timestamp) / 1e3 : 0;
  return {
    nodes,
    tools,
    handoffs,
    totalRounds,
    totalDuration,
    isActive
  };
}
function AgentFlowVisualization({
  events
}) {
  const agentFlowData = React2.useMemo(() => processAgentEvents(events), [events]);
  const initialNodes = React2.useMemo(() => {
    const agentNodes = agentFlowData.nodes.map((node, index) => ({
      id: node.id,
      type: "agentNode",
      position: { x: index * 300, y: 50 },
      data: {
        ...node,
        label: node.name
      }
    }));
    const toolNodes = agentFlowData.tools.map((tool) => {
      const agentIndex = agentFlowData.nodes.findIndex(
        (n) => n.id === tool.agent
      );
      return {
        id: `tool-${tool.id}`,
        type: "toolNode",
        position: { x: agentIndex >= 0 ? agentIndex * 300 : 0, y: 280 },
        data: {
          ...tool,
          label: tool.name,
          description: `A ${tool.name} tool`
        }
      };
    });
    return [...agentNodes, ...toolNodes];
  }, [agentFlowData.nodes, agentFlowData.tools]);
  const initialEdges = React2.useMemo(() => {
    const handoffEdges = agentFlowData.handoffs.map((handoff) => {
      const label = handoff.routingStrategy ? `Routing (${handoff.routingStrategy})` : handoff.reason || "Handoff";
      return {
        id: handoff.id,
        source: handoff.from,
        target: handoff.to,
        type: "smoothstep",
        animated: true,
        label,
        style: { stroke: "#3f3f46", strokeWidth: 1.5 },
        labelStyle: {
          fill: "#71717a",
          fontSize: 10,
          fontWeight: 500
        },
        labelBgStyle: { fill: "#18181b", fillOpacity: 0.95 },
        markerEnd: {
          type: react.MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: "#3f3f46"
        }
      };
    });
    const toolEdges = agentFlowData.tools.map((tool) => ({
      id: `edge-${tool.agent}-${tool.id}`,
      source: tool.agent || "",
      target: `tool-${tool.id}`,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#3f3f46", strokeWidth: 1, strokeDasharray: "5,5" },
      markerEnd: {
        type: react.MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "#3f3f46"
      }
    }));
    return [...handoffEdges, ...toolEdges];
  }, [agentFlowData.handoffs, agentFlowData.tools]);
  const layoutedElements = React2.useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, "LR");
  }, [initialNodes, initialEdges]);
  const [nodes, setNodes, onNodesChange] = react.useNodesState(
    layoutedElements.nodes
  );
  const [edges, setEdges, onEdgesChange] = react.useEdgesState(
    layoutedElements.edges
  );
  React2.useEffect(() => {
    const newLayout = getLayoutedElements(initialNodes, initialEdges, "LR");
    setNodes(newLayout.nodes);
    setEdges(newLayout.edges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  const onInit = React2.useCallback(() => {
  }, []);
  if (agentFlowData.nodes.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b"
        },
        children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-state-explorer-empty-content", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-explorer-empty-title", children: "No Agent Activity" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-state-explorer-empty-description", children: [
            "Start a conversation with an agent-based",
            /* @__PURE__ */ jsxRuntime.jsx("br", {}),
            " system to see the orchestration flow here"
          ] })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { height: "100%", width: "100%", background: "#000000" }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { height: "100%", width: "100%", position: "relative" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        react.ReactFlow,
        {
          nodes,
          edges,
          onNodesChange,
          onEdgesChange,
          onInit,
          nodeTypes,
          fitView: true,
          fitViewOptions: { padding: 0.3, maxZoom: 0.8 },
          minZoom: 0.3,
          maxZoom: 2,
          nodesConnectable: false,
          edgesReconnectable: false,
          edgesFocusable: false,
          defaultEdgeOptions: {
            type: "smoothstep",
            animated: true
          },
          children: /* @__PURE__ */ jsxRuntime.jsx(
            react.Background,
            {
              color: "#3f3f46",
              gap: 24,
              size: 1,
              style: { background: "#000000" }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "24px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 12px",
        fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
        fontSize: "10px",
        color: "#cccccc"
      }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: "16px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontWeight: 600, color: "#ffffff" }, children: agentFlowData.nodes.length }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "#666666" }, children: "Agents" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontWeight: 600, color: "#ffffff" }, children: agentFlowData.handoffs.length }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "#666666" }, children: "Handoffs" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontWeight: 600, color: "#ffffff" }, children: agentFlowData.totalRounds }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "#666666" }, children: "Rounds" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontWeight: 600, color: "#ffffff" }, children: agentFlowData.totalDuration > 0 ? `${(agentFlowData.totalDuration / 1e3).toFixed(2)}s` : "0s" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "#666666" }, children: "Duration" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("style", { children: `
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          /* Dark mode ReactFlow overrides */
          .react-flow__node {
            cursor: pointer;
          }
          
          .react-flow__edge-path {
            stroke: #3f3f46;
          }
          
          .react-flow__edge-text {
            fill: #71717a;
          }
          
          .react-flow__background {
            background: #000000;
          }
          
          .react-flow__pane {
            cursor: default;
          }
          
          /* Hide ReactFlow attribution */
          .react-flow__panel.react-flow__attribution {
            display: none;
          }
        ` })
  ] });
}

// src/utils/debug.ts
function createDebugLogger(debug) {
  return (...args) => {
    if (debug) {
      console.log(...args);
    }
  };
}

// src/utils/event-parser.ts
function parseSSEEvent(eventData, eventType, eventId) {
  const timestamp = Date.now();
  try {
    if (eventData.trim() === "[DONE]") {
      return {
        id: eventId,
        timestamp,
        type: "stream-done",
        data: {
          message: "[DONE]"
        }
      };
    }
    let parsedData;
    try {
      parsedData = JSON.parse(eventData);
    } catch {
      parsedData = { message: eventData };
    }
    return parseEventFromDataPart(parsedData, eventId);
  } catch (error) {
    return {
      id: eventId,
      timestamp,
      type: "error",
      data: {
        error: error instanceof Error ? error.message : "Failed to parse SSE event",
        originalData: eventData,
        originalType: eventType
      }
    };
  }
}
function parseEventFromDataPart(dataPart, eventId) {
  const timestamp = Date.now();
  if (!dataPart || typeof dataPart !== "object") {
    return null;
  }
  if (dataPart.type && isAIStreamPart(dataPart)) {
    return parseAIStreamPart(dataPart, eventId, timestamp);
  }
  if (dataPart.type?.startsWith("tool-call")) {
    const toolName = extractToolNameFromType(dataPart.type) || extractToolNameFromData(dataPart) || "unknown";
    if (dataPart.type.endsWith("-start")) {
      return {
        id: eventId,
        timestamp,
        type: "tool-call-start",
        data: {
          toolName,
          toolParams: dataPart.args || dataPart.parameters || {}
        },
        metadata: {
          toolName,
          toolParams: dataPart.args || dataPart.parameters || {},
          messageId: dataPart.id
        }
      };
    }
    if (dataPart.type.endsWith("-result") || dataPart.type.includes("result")) {
      return {
        id: eventId,
        timestamp,
        type: "tool-call-result",
        data: {
          toolName,
          result: dataPart.result || dataPart.data,
          duration: dataPart.duration
        },
        metadata: {
          toolName,
          duration: dataPart.duration,
          messageId: dataPart.id
        }
      };
    }
    if (dataPart.type.endsWith("-error") || dataPart.type.includes("error")) {
      return {
        id: eventId,
        timestamp,
        type: "tool-call-error",
        data: {
          toolName,
          error: dataPart.error || dataPart.message || "Tool execution failed"
        },
        metadata: {
          toolName,
          messageId: dataPart.id
        }
      };
    }
  }
  if (dataPart.type === "tool-input-start") {
    return {
      id: eventId,
      timestamp,
      type: "tool-call-start",
      data: {
        toolName: dataPart.toolName,
        toolCallId: dataPart.toolCallId,
        toolParams: {}
      },
      metadata: {
        toolName: dataPart.toolName,
        toolCallId: dataPart.toolCallId,
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "tool-input-delta") {
    const toolName = dataPart.toolName || extractToolNameFromData(dataPart) || "unknown";
    return {
      id: eventId,
      timestamp,
      type: "tool-call-start",
      data: {
        toolName,
        toolCallId: dataPart.toolCallId,
        inputDelta: dataPart.inputTextDelta
      },
      metadata: {
        toolName,
        toolCallId: dataPart.toolCallId,
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "tool-input-available") {
    const toolName = dataPart.toolName || extractToolNameFromData(dataPart) || "unknown";
    return {
      id: eventId,
      timestamp,
      type: "tool-call-start",
      data: {
        toolName,
        toolCallId: dataPart.toolCallId,
        toolParams: dataPart.input || {}
      },
      metadata: {
        toolName,
        toolCallId: dataPart.toolCallId,
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "tool-output-available") {
    const toolName = dataPart.toolName || extractToolNameFromData(dataPart) || "unknown";
    return {
      id: eventId,
      timestamp,
      type: "tool-call-result",
      data: {
        toolName,
        toolCallId: dataPart.toolCallId,
        result: dataPart.output,
        preliminary: dataPart.preliminary
      },
      metadata: {
        toolName,
        toolCallId: dataPart.toolCallId,
        preliminary: dataPart.preliminary,
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type?.startsWith("tool-")) {
    const toolName = dataPart.type.replace("tool-", "");
    return {
      id: eventId,
      timestamp,
      type: "tool-call-result",
      data: {
        toolName,
        result: dataPart.output || dataPart.data,
        duration: dataPart.duration
      },
      metadata: {
        toolName,
        duration: dataPart.duration,
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "start") {
    return {
      id: eventId,
      timestamp,
      type: "start",
      data: dataPart
    };
  }
  if (dataPart.type === "reasoning-start") {
    return {
      id: eventId,
      timestamp,
      type: "reasoning-start",
      data: dataPart,
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "reasoning-delta") {
    return {
      id: eventId,
      timestamp,
      type: "reasoning-delta",
      data: {
        id: dataPart.id,
        delta: dataPart.delta || ""
      },
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "reasoning-end") {
    return {
      id: eventId,
      timestamp,
      type: "reasoning-end",
      data: dataPart,
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "start-step") {
    return {
      id: eventId,
      timestamp,
      type: "start-step",
      data: {
        step: dataPart.step || "unknown"
      }
    };
  }
  if (dataPart.type === "text-start") {
    return {
      id: eventId,
      timestamp,
      type: "text-start",
      data: {
        id: dataPart.id,
        providerMetadata: dataPart.providerMetadata
      },
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "text-delta") {
    return {
      id: eventId,
      timestamp,
      type: "text-delta",
      data: {
        id: dataPart.id,
        delta: dataPart.delta || ""
      },
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "text-end") {
    return {
      id: eventId,
      timestamp,
      type: "text-end",
      data: {
        id: dataPart.id
      },
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "finish-step") {
    return {
      id: eventId,
      timestamp,
      type: "finish-step",
      data: {
        step: dataPart.step || "unknown"
      }
    };
  }
  if (dataPart.type === "finish") {
    return {
      id: eventId,
      timestamp,
      type: "finish",
      data: {
        reason: dataPart.reason
      }
    };
  }
  if (dataPart.type === "data-agent-status") {
    const agentData = dataPart.data || {};
    return {
      id: eventId,
      timestamp,
      type: agentData.status === "executing" || agentData.status === "routing" ? "agent-start" : agentData.status === "completing" ? "agent-finish" : "unknown",
      data: agentData,
      metadata: {
        agent: agentData.agent,
        originalType: dataPart.type
      }
    };
  }
  if (dataPart.type === "data-agent-handoff") {
    const handoffData = dataPart.data || {};
    return {
      id: eventId,
      timestamp,
      type: "agent-handoff",
      data: handoffData,
      metadata: {
        fromAgent: handoffData.from,
        toAgent: handoffData.to,
        reason: handoffData.reason,
        routingStrategy: handoffData.routingStrategy,
        originalType: dataPart.type
      }
    };
  }
  if (dataPart.type?.startsWith("data-")) {
    const dataType = dataPart.type.replace("data-", "");
    return {
      id: eventId,
      timestamp,
      type: "custom-data",
      data: {
        dataType,
        data: dataPart.data,
        id: dataPart.id,
        transient: dataPart.transient
      },
      metadata: {
        originalType: dataPart.type,
        dataType,
        transient: dataPart.transient
      }
    };
  }
  if (dataPart === "[DONE]" || typeof dataPart === "string" && dataPart.trim() === "[DONE]") {
    return {
      id: eventId,
      timestamp,
      type: "stream-done",
      data: {
        message: "[DONE]"
      }
    };
  }
  if (dataPart.type === "text" || dataPart.type === "text-delta" && !dataPart.delta) {
    return {
      id: eventId,
      timestamp,
      type: "message-chunk",
      data: {
        text: dataPart.text || dataPart.textDelta || "",
        messageId: dataPart.id
      },
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "message-start") {
    return {
      id: eventId,
      timestamp,
      type: "message-start",
      data: dataPart,
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "message-complete" || dataPart.type === "finish") {
    return {
      id: eventId,
      timestamp,
      type: "message-complete",
      data: dataPart,
      metadata: {
        messageId: dataPart.id
      }
    };
  }
  if (dataPart.type === "error" || dataPart.error) {
    return {
      id: eventId,
      timestamp,
      type: "error",
      data: {
        error: dataPart.error || dataPart.message || "Unknown error",
        details: dataPart
      }
    };
  }
  return {
    id: eventId,
    timestamp,
    type: "unknown",
    data: dataPart,
    metadata: {
      originalType: dataPart.type,
      messageId: dataPart.id
    }
  };
}
function extractToolNameFromType(type) {
  let toolName = type.replace(/^tool-call-/, "");
  toolName = toolName.replace(/-(?:start|result|error)$/, "");
  return toolName;
}
function isAIStreamPart(dataPart) {
  const aiStreamTypes = [
    "text-delta",
    "text-done",
    "tool-call",
    "tool-result",
    "data",
    "error",
    "finish"
  ];
  return aiStreamTypes.includes(dataPart.type);
}
function parseAIStreamPart(dataPart, eventId, timestamp) {
  switch (dataPart.type) {
    case "text-delta":
      return {
        id: eventId,
        timestamp,
        type: "text-delta",
        data: dataPart,
        metadata: {
          messageId: dataPart.id
        }
      };
    case "text-done":
      return {
        id: eventId,
        timestamp,
        type: "text-end",
        data: dataPart,
        metadata: {
          messageId: dataPart.id
        }
      };
    case "tool-call":
      return {
        id: eventId,
        timestamp,
        type: "tool-call-start",
        data: dataPart,
        metadata: {
          toolName: dataPart.toolName,
          toolCallId: dataPart.toolCallId,
          toolParams: dataPart.args || {}
        }
      };
    case "tool-result":
      return {
        id: eventId,
        timestamp,
        type: "tool-call-result",
        data: dataPart,
        metadata: {
          toolName: dataPart.toolName,
          toolCallId: dataPart.toolCallId,
          duration: dataPart.duration
        }
      };
    case "data":
      return {
        id: eventId,
        timestamp,
        type: "custom-data",
        // Custom data events
        data: dataPart,
        metadata: {
          originalType: dataPart.type
        }
      };
    case "error":
      return {
        id: eventId,
        timestamp,
        type: "error",
        data: dataPart,
        metadata: {
          originalType: dataPart.type
        }
      };
    case "finish":
      return {
        id: eventId,
        timestamp,
        type: "finish",
        data: dataPart,
        metadata: {
          originalType: dataPart.type
        }
      };
    default:
      return null;
  }
}
function extractToolNameFromData(dataPart) {
  if (dataPart.toolName) return dataPart.toolName;
  if (dataPart.name) return dataPart.name;
  if (dataPart.tool) return dataPart.tool;
  if (dataPart.function) return dataPart.function;
  if (dataPart.toolCall?.name) return dataPart.toolCall.name;
  if (dataPart.toolCall?.function) return dataPart.toolCall.function;
  if (dataPart.args?.toolName) return dataPart.args.toolName;
  if (dataPart.parameters?.toolName) return dataPart.parameters.toolName;
  if (dataPart.input?.toolName) return dataPart.input.toolName;
  if (dataPart.args?.function) return dataPart.args.function;
  if (dataPart.args?.name) return dataPart.args.name;
  if (dataPart.metadata?.toolName) return dataPart.metadata.toolName;
  return null;
}
function formatEventData(event) {
  try {
    return JSON.stringify(event.data, null, 2);
  } catch {
    return String(event.data);
  }
}
function getEventDescription(event) {
  switch (event.type) {
    case "tool-call-start": {
      const toolName = event.data.toolName || event.metadata?.toolName || "unknown";
      const inputDelta = event.data.inputDelta;
      if (inputDelta) {
        return `TOOL INPUT ${toolName} "${inputDelta}"`;
      }
      return `TOOL START ${toolName}`;
    }
    case "tool-call-result": {
      const toolName = event.data.toolName || event.metadata?.toolName || "unknown";
      const duration = event.metadata?.duration ? ` (${event.metadata.duration}ms)` : "";
      const preliminary = event.metadata?.preliminary ? " [preliminary]" : "";
      return `TOOL DONE ${toolName}${duration}${preliminary}`;
    }
    case "tool-call-error":
      return `TOOL ERROR ${event.metadata?.toolName || event.data.toolName || "unknown"}`;
    case "message-start":
      return "MESSAGE START";
    case "message-chunk": {
      const textPreview = event.data.text?.substring(0, 30) || "";
      return `CHUNK "${textPreview}${textPreview.length >= 30 ? "..." : ""}"`;
    }
    case "message-complete":
      return "MESSAGE DONE";
    case "start":
      return "STREAM START";
    case "reasoning-start":
      return "REASONING START";
    case "reasoning-delta": {
      const deltaPreview = event.data.delta?.substring(0, 20) || "";
      return `REASONING "${deltaPreview}${deltaPreview.length >= 20 ? "..." : ""}"`;
    }
    case "reasoning-end":
      return "REASONING END";
    case "start-step":
      return "STEP START";
    case "text-start":
      return `TEXT START ${event.data.id}`;
    case "text-delta": {
      const deltaPreview = event.data.delta?.substring(0, 20) || "";
      return `TEXT "${deltaPreview}${deltaPreview.length >= 20 ? "..." : ""}"`;
    }
    case "text-end":
      return `TEXT END ${event.data.id}`;
    case "finish-step":
      return "STEP DONE";
    case "finish": {
      return `STREAM DONE${event.data.reason ? ` (${event.data.reason})` : ""}`;
    }
    case "stream-done":
      return "STREAM [DONE]";
    case "error":
      return `ERROR ${event.data.error}`;
    case "custom-data": {
      const dataType = event.metadata?.dataType || event.data.dataType || "data";
      const isTransient = event.metadata?.transient || event.data.transient;
      const transientLabel = isTransient ? " (transient)" : "";
      return `DATA ${dataType.toUpperCase()}${transientLabel}`;
    }
    case "agent-start":
      return `AGENT START ${event.metadata?.agent || "unknown"}`;
    case "agent-finish":
      return `AGENT FINISH ${event.metadata?.agent || "unknown"}`;
    case "agent-error":
      return `AGENT ERROR ${event.metadata?.agent || "unknown"}`;
    case "agent-handoff":
      return `HANDOFF ${event.metadata?.fromAgent || "unknown"} \u2192 ${event.metadata?.toAgent || "unknown"}`;
    case "agent-complete":
      return `ORCHESTRATION COMPLETE (${event.metadata?.totalRounds || 0} rounds)`;
    case "agent-step":
      return `AGENT STEP ${event.metadata?.agent || "unknown"}`;
    case "unknown":
      return `UNKNOWN ${event.metadata?.originalType || "no type"}`;
    default:
      return String(event.type).toUpperCase();
  }
}

// src/utils/stream-interceptor.ts
var StreamInterceptor = class {
  // Safety flag to disable on errors
  constructor(options) {
    this.eventIdCounter = 0;
    this.isPatched = false;
    this.hasErrors = false;
    this.originalFetch = window.fetch.bind(window);
    this.options = options;
    const debugLog = createDebugLogger(options.debug || false);
    debugLog("[AI Devtools] StreamInterceptor constructor completed");
  }
  generateEventId() {
    return `sse_event_${Date.now()}_${this.eventIdCounter++}`;
  }
  shouldInterceptUrl(url) {
    const shouldIntercept = this.options.endpoints.some((endpoint) => {
      if (url.includes(endpoint)) {
        return true;
      }
      return false;
    });
    return shouldIntercept;
  }
  async interceptStreamResponse(response) {
    if (!response.body) {
      return response;
    }
    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const stream = new ReadableStream({
        start: (controller) => {
          const pump = async () => {
            try {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              try {
                const chunk = decoder.decode(value, { stream: true });
                this.parseSSEChunk(chunk);
              } catch (parseError) {
              }
              return pump();
            } catch (error) {
              controller.error(error);
            }
          };
          return pump();
        }
      });
      return new Response(stream, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
        // Clone headers to avoid mutation
      });
    } catch (error) {
      return response;
    }
  }
  parseSSEChunk(chunk) {
    const debugLog = createDebugLogger(this.options.debug || false);
    const lines = chunk.split("\n");
    let eventType = "";
    let eventData = "";
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === "") {
        if (eventData) {
          const event = parseSSEEvent(
            eventData,
            eventType,
            this.generateEventId()
          );
          if (event) {
            debugLog("[AI Devtools] Event parsed successfully:", event.type);
            this.options.onEvent(event);
          }
        }
        eventType = "";
        eventData = "";
      } else if (trimmedLine.startsWith("event:")) {
        eventType = trimmedLine.substring(6).trim();
      } else if (trimmedLine.startsWith("data:")) {
        const data = trimmedLine.substring(5).trim();
        eventData += (eventData ? "\n" : "") + data;
      }
    }
    if (eventData) {
      const event = parseSSEEvent(eventData, eventType, this.generateEventId());
      if (event) {
        debugLog("[AI Devtools] Event parsed successfully:", event.type);
        this.options.onEvent(event);
      }
    }
  }
  patch() {
    const debugLog = createDebugLogger(this.options.debug || false);
    debugLog("[AI Devtools] StreamInterceptor.patch() called");
    if (this.isPatched || !this.options.enabled) {
      debugLog("[AI Devtools] Patch skipped - already patched or not enabled");
      return;
    }
    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      if (this.hasErrors) {
        return this.originalFetch(input, init);
      }
      if (this.shouldInterceptUrl(url)) {
        debugLog("[AI Devtools] Intercepting fetch request:", url);
        try {
          const response = await this.originalFetch(input, init);
          const contentType = response.headers.get("content-type");
          if (contentType && (contentType.includes("text/event-stream") || contentType.includes("text/plain"))) {
            if (response.ok && response.body) {
              try {
                return await this.interceptStreamResponse(response);
              } catch (interceptError) {
                this.hasErrors = true;
                return response;
              }
            } else {
              return response;
            }
          } else {
            return response;
          }
        } catch (error) {
          const errorEvent = {
            id: this.generateEventId(),
            timestamp: Date.now(),
            type: "error",
            data: {
              error: error instanceof Error ? error.message : "Network request failed",
              url,
              method: init?.method || "GET"
            }
          };
          this.options.onEvent(errorEvent);
          throw error;
        }
      }
      return this.originalFetch(input, init);
    };
    this.isPatched = true;
  }
  unpatch() {
    if (!this.isPatched) {
      return;
    }
    window.fetch = this.originalFetch;
    this.isPatched = false;
  }
  updateOptions(options) {
    this.options = { ...this.options, ...options };
    if (!this.options.enabled && this.isPatched) {
      this.unpatch();
    } else if (this.options.enabled && !this.isPatched) {
      this.patch();
    }
  }
  isActive() {
    return this.isPatched;
  }
};

// src/hooks/use-ai-devtools.ts
function useAIDevtools(options = {}) {
  const {
    enabled = true,
    maxEvents = 1e3,
    onEvent,
    debug = false,
    streamCapture,
    throttle
  } = options;
  const [events, setEvents] = React2.useState([]);
  const [isCapturing, setIsCapturing] = React2.useState(true);
  const streamInterceptor = React2.useRef(null);
  const debugLog = createDebugLogger(debug);
  const throttleQueue = React2.useRef([]);
  const throttleTimer = React2.useRef(null);
  const lastEventTimes = React2.useRef(/* @__PURE__ */ new Map());
  const shouldThrottleEvent = React2.useCallback(
    (event) => {
      if (!throttle?.enabled) return false;
      const { includeTypes, excludeTypes } = throttle;
      if (includeTypes && includeTypes.length > 0) {
        return includeTypes.includes(event.type);
      }
      if (excludeTypes && excludeTypes.length > 0) {
        return !excludeTypes.includes(event.type);
      }
      return true;
    },
    [throttle]
  );
  const processThrottledEvents = React2.useCallback(() => {
    if (throttleQueue.current.length === 0) return;
    const eventsToProcess = [...throttleQueue.current];
    throttleQueue.current = [];
    setEvents((prev) => {
      const newEvents = [...prev, ...eventsToProcess];
      if (newEvents.length > maxEvents) {
        return newEvents.slice(-maxEvents);
      }
      return newEvents;
    });
    for (const event of eventsToProcess) {
      onEvent?.(event);
    }
  }, [maxEvents, onEvent]);
  const addEvent = React2.useCallback(
    (event) => {
      debugLog(false, "[AI Devtools] addEvent called:", event.type);
      if (!isCapturing) {
        debugLog(false, "[AI Devtools] addEvent skipped - not capturing");
        return;
      }
      if (shouldThrottleEvent(event)) {
        const throttleKey = `${event.type}_${event.metadata?.messageId || "global"}`;
        const now = Date.now();
        const lastTime = lastEventTimes.current.get(throttleKey) || 0;
        const interval = throttle?.interval || 100;
        if (now - lastTime < interval) {
          throttleQueue.current.push(event);
          debugLog(false, "[AI Devtools] Event throttled:", event.type);
          if (!throttleTimer.current) {
            throttleTimer.current = setTimeout(() => {
              processThrottledEvents();
              throttleTimer.current = null;
            }, interval);
          }
          return;
        }
        lastEventTimes.current.set(throttleKey, now);
      }
      debugLog(false, "[AI Devtools] Adding event:", event.type);
      setEvents((prev) => {
        const newEvents = [...prev, event];
        if (newEvents.length > maxEvents) {
          return newEvents.slice(-maxEvents);
        }
        debugLog(false, "[AI Devtools] Events updated:", newEvents.length);
        return newEvents;
      });
      onEvent?.(event);
    },
    [
      isCapturing,
      maxEvents,
      onEvent,
      shouldThrottleEvent,
      throttle,
      processThrottledEvents
    ]
  );
  const clearEvents = React2.useCallback(() => {
    setEvents([]);
  }, []);
  const toggleCapturing = React2.useCallback(() => {
    setIsCapturing((prev) => {
      const newCapturing = !prev;
      if (streamInterceptor.current) {
        streamInterceptor.current.updateOptions({ enabled: newCapturing });
      }
      return newCapturing;
    });
  }, []);
  const filterEvents = React2.useCallback(
    (filterTypes, searchQuery, toolNames) => {
      return events.filter((event) => {
        if (filterTypes && filterTypes.length > 0 && !filterTypes.includes(event.type)) {
          return false;
        }
        if (toolNames && toolNames.length > 0) {
          const eventToolName = event.metadata?.toolName;
          if (!eventToolName || !toolNames.includes(eventToolName)) {
            return false;
          }
        }
        if (searchQuery?.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const eventData = JSON.stringify(event.data).toLowerCase();
          const eventMetadata = JSON.stringify(
            event.metadata || {}
          ).toLowerCase();
          if (!eventData.includes(query) && !eventMetadata.includes(query)) {
            return false;
          }
        }
        return true;
      });
    },
    [events]
  );
  const getUniqueToolNames = React2.useCallback(() => {
    const toolNames = /* @__PURE__ */ new Set();
    for (const event of events) {
      if (event.metadata?.toolName) {
        toolNames.add(event.metadata.toolName);
      }
    }
    return Array.from(toolNames).sort();
  }, [events]);
  const getEventStats = React2.useCallback(() => {
    const stats = {
      total: events.length,
      byType: {},
      byTool: {},
      timeRange: events.length > 0 ? {
        start: Math.min(...events.map((e) => e.timestamp)),
        end: Math.max(...events.map((e) => e.timestamp))
      } : null
    };
    for (const event of events) {
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
      if (event.metadata?.toolName) {
        const toolName = event.metadata.toolName;
        stats.byTool[toolName] = (stats.byTool[toolName] || 0) + 1;
      }
    }
    return stats;
  }, [events]);
  React2.useEffect(() => {
    const streamConfig = streamCapture || {
      enabled,
      endpoints: ["/api/chat"],
      // Exact match for most common endpoint
      autoConnect: true
      // Always auto-connect by default
    };
    debugLog("[AI Devtools] Stream interceptor effect running", {
      enabled: streamConfig.enabled,
      autoConnect: streamConfig.autoConnect,
      endpoints: streamConfig.endpoints,
      isCapturing
    });
    if (streamConfig.enabled && streamConfig.autoConnect) {
      debugLog("[AI Devtools] Creating stream interceptor...");
      const eventHandler = (event) => {
        debugLog("[AI Devtools] Event captured:", {
          type: event.type,
          timestamp: event.timestamp,
          hasData: !!event.data
        });
        addEvent(event);
      };
      streamInterceptor.current = new StreamInterceptor({
        onEvent: eventHandler,
        endpoints: streamConfig.endpoints || ["/api/chat"],
        enabled: isCapturing,
        debug
      });
      debugLog("[AI Devtools] Stream interceptor created, patching fetch...");
      streamInterceptor.current.patch();
      debugLog("[AI Devtools] Fetch patched successfully");
      return () => {
        debugLog("[AI Devtools] Cleaning up stream interceptor");
        if (streamInterceptor.current) {
          streamInterceptor.current.unpatch();
          streamInterceptor.current = null;
        }
        if (throttleTimer.current) {
          clearTimeout(throttleTimer.current);
          throttleTimer.current = null;
        }
      };
    }
  }, [addEvent, isCapturing, streamCapture, enabled]);
  return {
    events,
    isCapturing,
    clearEvents,
    toggleCapturing,
    filterEvents,
    getUniqueToolNames,
    getEventStats
  };
}
function DevtoolsButton({
  onToggle,
  eventCount,
  hasNewEvents,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      type: "button",
      onClick: onToggle,
      className: `ai-devtools-button ${hasNewEvents ? "receiving-events" : ""} ${className}`,
      title: `ai-devtools [${eventCount}]`,
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          fill: "none",
          viewBox: "0 0 95 83",
          className: "ai-devtools-button-icon",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("title", { children: "AI SDK Tools Logo" }),
            /* @__PURE__ */ jsxRuntime.jsx("path", { fill: "url(#a)", d: "m22 .5 16 52L31 83H0L22 .5Z" }),
            /* @__PURE__ */ jsxRuntime.jsx("path", { fill: "#D9D9D9", d: "M62 .5H30l13 41.25L56 83h31L62 .5Z" }),
            /* @__PURE__ */ jsxRuntime.jsx("defs", { children: /* @__PURE__ */ jsxRuntime.jsxs(
              "linearGradient",
              {
                id: "a",
                x1: 21.5,
                x2: 21.5,
                y1: 0.5,
                y2: 83,
                gradientUnits: "userSpaceOnUse",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("stop", { stopColor: "#737373" }),
                  /* @__PURE__ */ jsxRuntime.jsx("stop", { offset: 1, stopColor: "#D9D9D9" })
                ]
              }
            ) })
          ]
        }
      )
    }
  );
}
var ChatStoreContext = store.ChatStoreContext;
function useCurrentState(options = {}) {
  const { enabled = true } = options;
  const [currentStates, setCurrentStates] = React2.useState(
    {}
  );
  const unsubscribeRef = React2.useRef(null);
  const DummyContext = React2.useRef(
    React2__default.default.createContext(void 0)
  ).current;
  const contextToUse = ChatStoreContext || DummyContext;
  const storeApi = React2.useContext(contextToUse);
  const isStoreAvailable = storeApi !== void 0 && storeApi !== null;
  const availableStoreIds = isStoreAvailable ? ["default"] : [];
  const refreshStates = React2.useCallback(() => {
    if (!storeApi || !isStoreAvailable) return;
    try {
      const state = storeApi.getState();
      setCurrentStates({
        default: state
      });
    } catch {
    }
  }, [storeApi, isStoreAvailable]);
  React2.useEffect(() => {
    if (!enabled || !storeApi || !isStoreAvailable) return;
    try {
      const unsubscribe = storeApi.subscribe((newState) => {
        setCurrentStates({
          default: newState
        });
      });
      refreshStates();
      unsubscribeRef.current = unsubscribe;
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    } catch {
      return void 0;
    }
  }, [enabled, storeApi, isStoreAvailable, refreshStates]);
  return {
    isStoreAvailable,
    availableStoreIds,
    currentStates,
    refreshStates
  };
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) + `.${date.getMilliseconds().toString().padStart(3, "0")}`;
}
function getEventTypeColor(type) {
  const colors = {
    "tool-call-start": "#888888",
    // medium gray
    "tool-call-result": "#00ff00",
    // green for success (like 200 status)
    "tool-call-error": "#ff0000",
    // red for errors
    "message-start": "#ffffff",
    // white
    "message-chunk": "#888888",
    // medium gray
    "message-complete": "#00ff00",
    // green for completion
    "text-start": "#ffffff",
    // white
    "text-delta": "#888888",
    // medium gray
    "text-end": "#ffffff",
    // white
    "reasoning-start": "#9c27b0",
    // purple for reasoning
    "reasoning-delta": "#888888",
    // medium gray (same as text-delta)
    "reasoning-end": "#9c27b0",
    // purple for reasoning
    "start": "#87ceeb",
    // light blue
    "start-step": "#888888",
    // medium gray
    "finish-step": "#00ff00",
    // green for success
    finish: "#00ff00",
    // green for success
    "stream-done": "#00ff00",
    // green for success
    error: "#ff0000",
    // red for errors
    unknown: "#888888"
    // medium gray
  };
  return colors[type] || "#888888";
}
function getEventTypeIcon(type) {
  const icons = {
    // Tool calls - using Build/Settings icons for better semantic meaning
    "tool-call-start": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Build, { sx: { fontSize: "0.75rem" } }),
    "tool-call-result": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.CheckCircle, { sx: { fontSize: "0.75rem" } }),
    "tool-call-error": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.ErrorOutline, { sx: { fontSize: "0.75rem" } }),
    // Messages - using Send/Message icons
    "message-start": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Send, { sx: { fontSize: "0.75rem" } }),
    "message-chunk": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Circle, { sx: { fontSize: "0.4rem" } }),
    "message-complete": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.CheckCircle, { sx: { fontSize: "0.75rem" } }),
    // Text events - using Code/TextFields icons
    "text-start": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Code, { sx: { fontSize: "0.75rem" } }),
    "text-delta": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Circle, { sx: { fontSize: "0.4rem" } }),
    "text-end": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Code, { sx: { fontSize: "0.75rem" } }),
    // Reasoning events - using Psychology icon
    "reasoning-start": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Psychology, { sx: { fontSize: "0.75rem" } }),
    "reasoning-delta": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Circle, { sx: { fontSize: "0.4rem" } }),
    "reasoning-end": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Psychology, { sx: { fontSize: "0.75rem" } }),
    // Steps - using Settings/PlayArrow for process steps
    "start-step": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Settings, { sx: { fontSize: "0.75rem" } }),
    "finish-step": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.CheckCircle, { sx: { fontSize: "0.75rem" } }),
    // Stream events - using Api/Done icons
    "start": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Api, { sx: { fontSize: "0.75rem" } }),
    finish: /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Api, { sx: { fontSize: "0.75rem" } }),
    "stream-done": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Api, { sx: { fontSize: "0.75rem" } }),
    // Error and data events
    error: /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.ErrorOutline, { sx: { fontSize: "0.75rem" } }),
    "custom-data": /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.DataObject, { sx: { fontSize: "0.75rem" } }),
    unknown: /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Help, { sx: { fontSize: "0.75rem" } })
  };
  return icons[type] || /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Help, { sx: { fontSize: "0.75rem" } });
}
function formatToolName(toolName) {
  if (!toolName || toolName === "unknown") return toolName;
  let formatted = toolName.replace(/_/g, " ");
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");
  formatted = formatted.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  return formatted;
}

// src/utils/session-grouper.ts
function extractToolNameFromEvent(event) {
  if (event.metadata?.toolName) return event.metadata.toolName;
  if (event.data?.toolName) return event.data.toolName;
  if (event.data?.name) return event.data.name;
  if (event.data?.tool) return event.data.tool;
  if (event.data?.function) return event.data.function;
  if (event.data?.toolCall?.name) return event.data.toolCall.name;
  if (event.data?.toolCall?.function) return event.data.toolCall.function;
  if (event.data?.args?.toolName) return event.data.args.toolName;
  if (event.data?.args?.function) return event.data.args.function;
  if (event.data?.args?.name) return event.data.args.name;
  return "unknown";
}
function groupEventsIntoSessions(events) {
  const sessions = [];
  const standaloneEvents = [];
  const activeSessions = /* @__PURE__ */ new Map();
  let sessionCounter = 0;
  for (const event of events) {
    const toolCallId = event.metadata?.toolCallId;
    let toolName = extractToolNameFromEvent(event);
    if (toolCallId) {
      if (!activeSessions.has(toolCallId)) {
        const uniqueSessionId = `${toolCallId}_${sessionCounter++}`;
        const session = {
          id: uniqueSessionId,
          toolName,
          toolCallId,
          startTime: event.timestamp,
          status: "running",
          events: [event],
          startEvent: event
        };
        activeSessions.set(toolCallId, session);
      } else {
        const session = activeSessions.get(toolCallId);
        if (toolName === "unknown" && session.toolName !== "unknown") {
          toolName = session.toolName;
          if (!event.metadata) {
            event.metadata = {};
          }
          event.metadata.toolName = toolName;
          if (!event.data) {
            event.data = {};
          }
          event.data.toolName = toolName;
        }
        if (toolName !== "unknown") {
          if (!event.data) {
            event.data = {};
          }
          event.data.toolName = toolName;
          if (!event.metadata) {
            event.metadata = {};
          }
          event.metadata.toolName = toolName;
        }
        if (toolName !== "unknown" && session.toolName === "unknown") {
          session.toolName = toolName;
        }
        session.events.push(event);
        if (event.type === "tool-call-result" || event.type === "tool-call-error") {
          if (session.toolName !== "unknown") {
            if (!event.metadata) {
              event.metadata = {};
            }
            event.metadata.toolName = session.toolName;
            if (!event.data) {
              event.data = {};
            }
            event.data.toolName = session.toolName;
          }
          const isPreliminary = event.metadata?.preliminary === true;
          const shouldComplete = event.type === "tool-call-error" || !isPreliminary;
          if (shouldComplete) {
            session.endTime = event.timestamp;
            session.duration = event.timestamp - session.startTime;
            session.status = "completed";
            session.endEvent = event;
            sessions.push(session);
            activeSessions.delete(toolCallId);
          }
        }
      }
    } else if (isToolCallStartEvent(event)) {
      const toolName2 = extractToolNameFromEvent(event);
      const sessionId = `standalone_${event.timestamp}_${sessionCounter++}_${toolName2}`;
      const session = {
        id: sessionId,
        toolName: toolName2,
        startTime: event.timestamp,
        status: "running",
        events: [event],
        startEvent: event
      };
      activeSessions.set(sessionId, session);
    } else {
      standaloneEvents.push(event);
    }
  }
  for (const session of activeSessions.values()) {
    sessions.push(session);
  }
  sessions.sort((a, b) => a.startTime - b.startTime);
  return { sessions, standaloneEvents };
}
function isToolCallStartEvent(event) {
  return event.type === "tool-call-start" || event.type === "unknown" && event.metadata?.originalType === "tool-input-start" || event.type === "unknown" && event.metadata?.originalType === "tool-input-available" && !!event.metadata?.toolName;
}
function getSessionSummary(session) {
  const duration = session.duration ? `${session.duration}ms` : "running";
  const eventCount = session.events.length;
  return `${session.toolName} (${eventCount} events, ${duration})`;
}
function getSessionStatusColor(session) {
  switch (session.status) {
    case "running":
      return "#888888";
    // Gray
    case "completed":
      return "#00ff00";
    // Green
    case "error":
      return "#ff0000";
    // Red
    default:
      return "#888888";
  }
}
function getSessionStatusIcon(session) {
  switch (session.status) {
    case "running":
      return "\u25B6";
    case "completed":
      return "\u2713";
    case "error":
      return "\u2717";
    default:
      return "?";
  }
}
function EventItem({ event, className = "" }) {
  const [isExpanded, setIsExpanded] = React2.useState(false);
  const typeIcon = getEventTypeIcon(event.type);
  const description = getEventDescription(event);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: `ai-devtools-event-item ${className}`,
      "data-type": event.type,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: "ai-devtools-event-header",
            onClick: () => setIsExpanded(!isExpanded),
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-content", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-indicator", title: event.type }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-event-icon", children: typeIcon }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-description", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-text", children: description }) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-timestamp", children: formatTimestamp(event.timestamp) }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-expand", children: /* @__PURE__ */ jsxRuntime.jsx(
                "svg",
                {
                  className: `ai-devtools-event-arrow ${isExpanded ? "ai-devtools-event-arrow-expanded" : ""}`,
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsxRuntime.jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M19 9l-7 7-7-7"
                    }
                  )
                }
              ) })
            ]
          }
        ),
        isExpanded && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-expanded", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-details", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-metadata", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-metadata-title", children: "Event Details" }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-metadata-grid", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-metadata-item", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-event-metadata-label", children: "ID:" }),
                " ",
                event.id
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-metadata-item", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-event-metadata-label", children: "Type:" }),
                " ",
                event.type
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-metadata-item", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-event-metadata-label", children: "Timestamp:" }),
                " ",
                new Date(event.timestamp).toISOString()
              ] }),
              event.metadata?.messageId && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-metadata-item", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-event-metadata-label", children: "Message ID:" }),
                " ",
                event.metadata.messageId
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-data-title", children: "Data" }),
            /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "ai-devtools-event-data-content", children: formatEventData(event) })
          ] }),
          event.metadata && Object.keys(event.metadata).length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-event-metadata-section", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-event-metadata-title", children: "Metadata" }),
            /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "ai-devtools-event-metadata-content", children: JSON.stringify(event.metadata, null, 2) })
          ] })
        ] }) })
      ]
    }
  );
}
function Tooltip({
  children,
  content,
  show
}) {
  if (!show) return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-tooltip-container", children: [
    children,
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-tooltip", children: content })
  ] });
}
function formatToolParams(toolParams) {
  if (!toolParams || Object.keys(toolParams).length === 0) {
    return "No parameters";
  }
  return Object.entries(toolParams).map(([key, value]) => {
    const formattedValue = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
    return `${key}: ${formattedValue}`;
  }).join("\n");
}
function ToolCallSessionComponent({
  session,
  className = ""
}) {
  const [isExpanded, setIsExpanded] = React2.useState(false);
  const [showTooltip, setShowTooltip] = React2.useState(false);
  const summary = getSessionSummary(session);
  const statusColor = getSessionStatusColor(session);
  const statusIcon = getSessionStatusIcon(session);
  const toolParams = session.startEvent?.metadata?.toolParams || session.startEvent?.data?.toolParams;
  const hasParams = toolParams && Object.keys(toolParams).length > 0;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: `ai-devtools-session ${className}`,
      "data-session-id": session.id,
      "data-status": session.status,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          Tooltip,
          {
            show: hasParams && showTooltip,
            content: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-tooltip-content", children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-tooltip-title", children: "Tool Parameters" }),
              /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "ai-devtools-tooltip-params", children: formatToolParams(toolParams) })
            ] }),
            children: /* @__PURE__ */ jsxRuntime.jsxs(
              "div",
              {
                className: "ai-devtools-session-header",
                onClick: () => setIsExpanded(!isExpanded),
                onMouseEnter: () => hasParams && setShowTooltip(true),
                onMouseLeave: () => setShowTooltip(false),
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-session-content", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "div",
                      {
                        className: "ai-devtools-session-indicator",
                        style: { backgroundColor: statusColor },
                        title: `${session.status} - ${session.toolName}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-session-icon", children: statusIcon }),
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-session-info", children: [
                      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-session-tool-name", children: [
                        formatToolName(session.toolName),
                        hasParams && /* @__PURE__ */ jsxRuntime.jsx(
                          "span",
                          {
                            className: "ai-devtools-session-params-indicator",
                            title: "Has parameters",
                            children: "\u2699\uFE0F"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-session-summary", children: summary })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-session-timestamp", children: formatTimestamp(session.startTime) }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-session-expand", children: /* @__PURE__ */ jsxRuntime.jsx(
                    "svg",
                    {
                      className: `ai-devtools-session-arrow ${isExpanded ? "ai-devtools-session-arrow-expanded" : ""}`,
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntime.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M19 9l-7 7-7-7"
                        }
                      )
                    }
                  ) })
                ]
              }
            )
          }
        ),
        isExpanded && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-session-events", children: session.events.map((event) => /* @__PURE__ */ jsxRuntime.jsx(
          EventItem,
          {
            event,
            className: "ai-devtools-session-event"
          },
          event.id
        )) })
      ]
    }
  );
}
function EventList({
  events,
  className = "",
  groupByToolCalls = true
}) {
  if (events.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `ai-devtools-empty-state ${className}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-empty-content", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-empty-title", children: "\u25B8 waiting for events..." }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-empty-subtitle", children: "start streaming to capture events" })
    ] }) });
  }
  if (!groupByToolCalls) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `ai-devtools-event-list ${className}`, children: events.slice().reverse().map((event) => /* @__PURE__ */ jsxRuntime.jsx(EventItem, { event }, event.id)) });
  }
  const { sessions, standaloneEvents } = groupEventsIntoSessions(events);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `ai-devtools-event-list ${className}`, children: [
    sessions.slice().reverse().map((session) => /* @__PURE__ */ jsxRuntime.jsx(
      ToolCallSessionComponent,
      {
        session
      },
      `session-${session.id}`
    )),
    standaloneEvents.slice().reverse().map((event) => /* @__PURE__ */ jsxRuntime.jsx(EventItem, { event }, `event-${event.id}`))
  ] });
}
function StateDataExplorer({
  currentState,
  className = ""
}) {
  const displayData = React2.useMemo(() => {
    if (!currentState || typeof currentState !== "object") {
      return currentState;
    }
    const essentialProps = ["id", "messages", "error", "status"];
    const filteredState = {};
    for (const prop of essentialProps) {
      if (prop in currentState) {
        filteredState[prop] = currentState[prop];
      }
    }
    return filteredState;
  }, [currentState]);
  if (!displayData) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `ai-devtools-state-explorer-empty ${className}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-state-explorer-empty-content", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-explorer-empty-icon", children: "\u26A1" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-explorer-empty-title", children: "No State Data" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-explorer-empty-description", children: "Select a store to view its current state" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `ai-devtools-state-explorer ${className}`, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-explorer-content", children: /* @__PURE__ */ jsxRuntime.jsx(
    reactJsonViewLite.JsonView,
    {
      data: displayData,
      style: {
        ...reactJsonViewLite.darkStyles,
        container: "ai-devtools-json-container",
        basicChildStyle: "ai-devtools-json-basic-child",
        label: "ai-devtools-json-label",
        stringValue: "ai-devtools-json-string-value",
        numberValue: "ai-devtools-json-number-value",
        booleanValue: "ai-devtools-json-boolean-value",
        nullValue: "ai-devtools-json-null-value",
        undefinedValue: "ai-devtools-json-undefined-value",
        punctuation: "ai-devtools-json-punctuation",
        collapseIcon: "ai-devtools-json-collapse-icon",
        expandIcon: "ai-devtools-json-expand-icon",
        collapsedContent: "ai-devtools-json-collapsed-content",
        childFieldsContainer: "ai-devtools-json-child-fields-container"
      }
    }
  ) }) });
}
var EVENT_TYPES = [
  "tool-call-start",
  "tool-call-result",
  "tool-call-error",
  "message-start",
  "message-chunk",
  "message-complete",
  "start",
  "start-step",
  "text-start",
  "text-delta",
  "text-end",
  "reasoning-start",
  "reasoning-delta",
  "reasoning-end",
  "finish-step",
  "finish",
  "stream-done",
  "error",
  "unknown"
];
var EVENT_TYPE_LABELS = {
  "tool-call-start": "Tool Starts",
  "tool-call-result": "Tool Results",
  "tool-call-error": "Tool Errors",
  "message-start": "Message Starts",
  "message-chunk": "Message Chunks",
  "message-complete": "Message Complete",
  start: "Stream Start",
  "start-step": "Step Starts",
  "text-start": "Text Starts",
  "text-delta": "Text Deltas",
  "text-end": "Text Ends",
  "reasoning-start": "Reasoning Start",
  "reasoning-delta": "Reasoning Deltas",
  "reasoning-end": "Reasoning End",
  "finish-step": "Step Finishes",
  finish: "Stream Finishes",
  "stream-done": "Stream Done",
  error: "Errors",
  unknown: "Unknown Events"
};
function DevtoolsPanel({
  events,
  isCapturing,
  onToggleCapturing,
  onClearEvents,
  onClose,
  onTogglePosition,
  config,
  className = ""
}) {
  const [showFilters] = React2.useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = React2.useState(false);
  const [filters, setFilters] = React2.useState({
    types: [],
    toolNames: [],
    searchQuery: ""
  });
  const [selectedStoreId, setSelectedStoreId] = React2.useState(null);
  const [activeTab, setActiveTab] = React2.useState(
    "events"
  );
  const { isStoreAvailable, availableStoreIds, currentStates } = useCurrentState({
    enabled: true
  });
  React2.useEffect(() => {
    if (availableStoreIds.length > 0 && !selectedStoreId) {
      const defaultStoreId = availableStoreIds.includes("default") ? "default" : availableStoreIds[0];
      setSelectedStoreId(defaultStoreId);
    }
  }, [availableStoreIds, selectedStoreId]);
  const [isResizing, setIsResizing] = React2.useState(false);
  const [panelHeight, setPanelHeight] = React2.useState(config.height || 300);
  const [panelWidth, setPanelWidth] = React2.useState(config.width || 500);
  const panelRef = React2.useRef(null);
  const resizeRef = React2.useRef(null);
  const [isReceivingEvents, setIsReceivingEvents] = React2.useState(false);
  const lastEventCountRef = React2.useRef(events.length);
  const { availableToolNames, eventCounts } = React2.useMemo(() => {
    const toolNames = /* @__PURE__ */ new Set();
    const counts = {};
    let detectedModel;
    for (const event of events) {
      counts[event.type] = (counts[event.type] || 0) + 1;
      if (event.metadata?.toolName) {
        toolNames.add(event.metadata.toolName);
      }
      if (!detectedModel && event.data) {
        const model = event.data.model || event.data.modelId || event.data.providerMetadata?.openai?.model || event.data.providerMetadata?.anthropic?.model || event.data.providerMetadata?.google?.model;
        if (model) {
          detectedModel = model;
        }
      }
    }
    return {
      availableToolNames: Array.from(toolNames).sort(),
      eventCounts: counts,
      detectedModelId: detectedModel
    };
  }, [events]);
  const filteredSuggestions = React2.useMemo(() => {
    return {
      eventTypes: EVENT_TYPES,
      tools: availableToolNames,
      quickSearches: ["error", "tool", "text", "message", "start", "end"]
    };
  }, [availableToolNames]);
  const filteredEvents = React2.useMemo(() => {
    return events.filter((event) => {
      if (filters.types.length > 0 && !filters.types.includes(event.type)) {
        return false;
      }
      if (filters.toolNames.length > 0) {
        const eventToolName = event.metadata?.toolName;
        if (!eventToolName || !filters.toolNames.includes(eventToolName)) {
          return false;
        }
      }
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const eventData = JSON.stringify(event.data).toLowerCase();
        const eventMetadata = JSON.stringify(
          event.metadata || {}
        ).toLowerCase();
        if (!eventData.includes(query) && !eventMetadata.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [events, filters]);
  const hasActiveFilters = filters.types.length > 0 || filters.toolNames.length > 0 || filters.searchQuery.trim().length > 0;
  const handleMouseDown = React2.useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);
  const handleMouseMove = React2.useCallback(
    (e) => {
      if (!isResizing) return;
      if (config.position === "bottom") {
        const newHeight = window.innerHeight - e.clientY;
        const minHeight = 200;
        const maxHeight = window.innerHeight * 0.8;
        setPanelHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
      } else {
        const newWidth = window.innerWidth - e.clientX;
        const minWidth = 500;
        const maxWidth = window.innerWidth * 0.8;
        setPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
      }
    },
    [isResizing, config.position]
  );
  const handleMouseUp = React2.useCallback(() => {
    setIsResizing(false);
  }, []);
  React2__default.default.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = config.position === "bottom" ? "ns-resize" : "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp, config.position]);
  React2__default.default.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  const streamingSpeed = React2.useMemo(() => {
    const now = Date.now();
    const lastMinute = now - 6e4;
    const recentTextDeltas = events.filter(
      (event) => event.type === "text-delta" && event.timestamp >= lastMinute
    );
    if (recentTextDeltas.length === 0) {
      return { tokensPerSecond: 0, charactersPerSecond: 0 };
    }
    const totalCharacters = recentTextDeltas.reduce((sum, event) => {
      const content = event.data?.delta || event.data?.text || "";
      return sum + content.length;
    }, 0);
    const totalTokens = Math.round(totalCharacters / 4);
    const firstEvent = recentTextDeltas[0];
    const lastEvent = recentTextDeltas[recentTextDeltas.length - 1];
    if (!firstEvent || !lastEvent) {
      return { tokensPerSecond: 0, charactersPerSecond: 0 };
    }
    const firstEventTime = firstEvent.timestamp;
    const lastEventTime = lastEvent.timestamp;
    const durationSeconds = (lastEventTime - firstEventTime) / 1e3;
    if (durationSeconds === 0) {
      return { tokensPerSecond: 0, charactersPerSecond: 0 };
    }
    return {
      tokensPerSecond: Number.parseFloat(
        (totalTokens / durationSeconds).toFixed(2)
      ),
      charactersPerSecond: Number.parseFloat(
        (totalCharacters / durationSeconds).toFixed(2)
      )
    };
  }, [events]);
  React2__default.default.useEffect(() => {
    if (events.length > lastEventCountRef.current) {
      setIsReceivingEvents(true);
      const timer = setTimeout(() => {
        setIsReceivingEvents(false);
      }, 1e3);
      lastEventCountRef.current = events.length;
      return () => clearTimeout(timer);
    }
  }, [events.length]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref: panelRef,
      className: `ai-devtools-panel ai-devtools-panel-${config.position} ${className}`,
      style: {
        height: config.position === "bottom" ? panelHeight : void 0,
        width: config.position === "right" ? panelWidth : void 0
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            ref: resizeRef,
            type: "button",
            className: `ai-devtools-resize-handle ai-devtools-resize-handle-${config.position}`,
            onMouseDown: handleMouseDown,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const syntheticEvent = {
                  ...e,
                  preventDefault: e.preventDefault,
                  clientX: 0,
                  clientY: 0,
                  button: 0,
                  buttons: 0,
                  movementX: 0,
                  movementY: 0,
                  pageX: 0,
                  pageY: 0,
                  screenX: 0,
                  screenY: 0,
                  relatedTarget: null
                };
                handleMouseDown(syntheticEvent);
              }
            }
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-header", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-search-bar", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-search-input-container", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "input",
                {
                  type: "text",
                  value: filters.searchQuery,
                  onChange: (e) => {
                    const value = e.target.value;
                    setFilters((prev) => ({ ...prev, searchQuery: value }));
                    setShowSearchSuggestions(false);
                  },
                  onFocus: () => {
                    setShowSearchSuggestions(true);
                  },
                  onBlur: () => {
                    setTimeout(() => setShowSearchSuggestions(false), 200);
                  },
                  placeholder: `${filteredEvents.length} total events found...`,
                  className: "ai-devtools-search-input-main"
                }
              ),
              (filters.types.length > 0 || filters.toolNames.length > 0) && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-filter-indicator", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-filter-indicator-count", children: filters.types.length + filters.toolNames.length }) })
            ] }),
            showSearchSuggestions && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-search-suggestions", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-search-suggestions-content", children: [
              filteredSuggestions.eventTypes.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-suggestion-section", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-suggestion-section-title", children: "Event Types" }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-suggestion-options", children: filteredSuggestions.eventTypes.map((type) => {
                  const isActive = filters.types.includes(type);
                  return /* @__PURE__ */ jsxRuntime.jsxs(
                    "button",
                    {
                      type: "button",
                      className: `ai-devtools-suggestion-option ${isActive ? "active" : ""}`,
                      onClick: () => {
                        setFilters((prev) => ({
                          ...prev,
                          types: isActive ? prev.types.filter((t) => t !== type) : [...prev.types, type]
                        }));
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-suggestion-icon", children: getEventTypeIcon(type) }),
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-suggestion-label", children: EVENT_TYPE_LABELS[type] }),
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-suggestion-count", children: eventCounts[type] || 0 })
                      ]
                    },
                    type
                  );
                }) })
              ] }),
              filteredSuggestions.tools.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-suggestion-section", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-suggestion-section-title", children: "Tools" }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-suggestion-options", children: filteredSuggestions.tools.map((toolName) => {
                  const isActive = filters.toolNames.includes(toolName);
                  return /* @__PURE__ */ jsxRuntime.jsxs(
                    "button",
                    {
                      type: "button",
                      className: `ai-devtools-suggestion-option ${isActive ? "active" : ""}`,
                      onClick: () => {
                        setFilters((prev) => ({
                          ...prev,
                          toolNames: isActive ? prev.toolNames.filter((t) => t !== toolName) : [...prev.toolNames, toolName]
                        }));
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-suggestion-icon", children: "\u{1F527}" }),
                        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-suggestion-label", children: formatToolName(toolName) })
                      ]
                    },
                    toolName
                  );
                }) })
              ] }),
              filteredSuggestions.quickSearches.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-suggestion-section", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-suggestion-section-title", children: "Quick Search" }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-suggestion-options", children: filteredSuggestions.quickSearches.map((term) => /* @__PURE__ */ jsxRuntime.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "ai-devtools-suggestion-option",
                    onClick: () => {
                      setFilters((prev) => ({
                        ...prev,
                        searchQuery: term
                      }));
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-suggestion-icon", children: term === "error" ? "!" : term === "tool" ? "\u25B6" : "T" }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-suggestion-label", children: term })
                    ]
                  },
                  term
                )) })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-header-right", children: [
            /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                onClick: onToggleCapturing,
                className: `ai-devtools-btn ${isReceivingEvents ? "receiving" : ""}`,
                children: [
                  isCapturing ? /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Pause, { className: "ai-devtools-btn-icon" }) : /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.PlayArrow, { className: "ai-devtools-btn-icon" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Live" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                onClick: onClearEvents,
                className: "ai-devtools-btn",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Clear, { className: "ai-devtools-btn-icon" }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children: "clear" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                onClick: onTogglePosition,
                className: "ai-devtools-position-toggle-btn",
                title: `Switch to ${config.position === "bottom" ? "right" : "bottom"} panel`,
                children: config.position === "bottom" ? /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.ViewSidebar, { className: "ai-devtools-position-toggle-icon" }) : /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.ViewList, { className: "ai-devtools-position-toggle-icon" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "ai-devtools-close-btn",
                children: /* @__PURE__ */ jsxRuntime.jsx(iconsMaterial.Close, { className: "ai-devtools-close-icon" })
              }
            )
          ] })
        ] }),
        showFilters && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-filter-badges", children: [
          filters.types.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-filter-group", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-filter-group-label", children: "Types:" }),
            filters.types.map((type) => /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                className: "ai-devtools-filter-badge active",
                onClick: () => {
                  setFilters((prev) => ({
                    ...prev,
                    types: prev.types.filter((t) => t !== type)
                  }));
                },
                children: [
                  type.replace(/-/g, " "),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-filter-remove", children: "\xD7" })
                ]
              },
              type
            ))
          ] }),
          filters.toolNames.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-filter-group", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-filter-group-label", children: "Tools:" }),
            filters.toolNames.map((toolName) => /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                className: "ai-devtools-filter-badge active",
                onClick: () => {
                  setFilters((prev) => ({
                    ...prev,
                    toolNames: prev.toolNames.filter((t) => t !== toolName)
                  }));
                },
                children: [
                  formatToolName(toolName),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-filter-remove", children: "\xD7" })
                ]
              },
              toolName
            ))
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-filter-group", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-filter-group-label", children: "Quick:" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                className: `ai-devtools-filter-badge ${filters.types.includes("tool-call-start") ? "active" : ""}`,
                onClick: () => {
                  const isActive = filters.types.includes("tool-call-start");
                  setFilters((prev) => ({
                    ...prev,
                    types: isActive ? prev.types.filter((t) => t !== "tool-call-start") : [...prev.types, "tool-call-start"]
                  }));
                },
                children: "Tool Calls"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                className: `ai-devtools-filter-badge ${filters.types.includes("text-delta") ? "active" : ""}`,
                onClick: () => {
                  const isActive = filters.types.includes("text-delta");
                  setFilters((prev) => ({
                    ...prev,
                    types: isActive ? prev.types.filter((t) => t !== "text-delta") : [...prev.types, "text-delta"]
                  }));
                },
                children: "Text Events"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                className: `ai-devtools-filter-badge ${filters.types.includes("error") ? "active" : ""}`,
                onClick: () => {
                  const isActive = filters.types.includes("error");
                  setFilters((prev) => ({
                    ...prev,
                    types: isActive ? prev.types.filter((t) => t !== "error") : [...prev.types, "error"]
                  }));
                },
                children: "Errors"
              }
            ),
            hasActiveFilters && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                className: "ai-devtools-filter-badge clear",
                onClick: () => {
                  setFilters((prev) => ({
                    ...prev,
                    types: [],
                    toolNames: [],
                    searchQuery: ""
                  }));
                },
                children: "Clear All"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            style: {
              display: "flex",
              gap: 0,
              borderBottom: "1px solid #27272a"
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab("events"),
                  style: {
                    padding: "8px 16px",
                    background: "transparent",
                    border: "none",
                    color: activeTab === "events" ? "#e5e7eb" : "#666666",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  },
                  children: "Events"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab("agents"),
                  style: {
                    padding: "8px 16px",
                    background: "transparent",
                    border: "none",
                    color: activeTab === "agents" ? "#e5e7eb" : "#666666",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  },
                  children: "Agents"
                }
              ),
              isStoreAvailable && /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab("state"),
                  style: {
                    padding: "8px 16px",
                    background: "transparent",
                    border: "none",
                    color: activeTab === "state" ? "#e5e7eb" : "#666666",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  },
                  children: "State"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-panel-content", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-content", children: [
          activeTab === "events" && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-events", children: /* @__PURE__ */ jsxRuntime.jsx(EventList, { events: filteredEvents }) }),
          activeTab === "agents" && /* @__PURE__ */ jsxRuntime.jsx(AgentFlowVisualization, { events }),
          activeTab === "state" && isStoreAvailable && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-panel-full", children: /* @__PURE__ */ jsxRuntime.jsx(
            StateDataExplorer,
            {
              currentState: selectedStoreId ? currentStates[selectedStoreId] : void 0
            }
          ) })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-bottom-stats", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-tokens-section", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-speed-metrics", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-speed-metric", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-speed-value", children: streamingSpeed.tokensPerSecond }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-speed-label", children: "tok/s" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-speed-metric", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-speed-value", children: streamingSpeed.charactersPerSecond }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-speed-label", children: "char/s" })
          ] })
        ] }) }) })
      ]
    }
  );
}
var defaultConfig = {
  enabled: true,
  maxEvents: 1e3,
  position: "bottom",
  height: 400,
  theme: "auto",
  streamCapture: {
    enabled: true,
    endpoint: "/api/chat",
    autoConnect: true
  },
  throttle: {
    enabled: true,
    interval: 100,
    // 100ms throttle by default
    includeTypes: ["text-delta"]
    // Only throttle high-frequency text-delta events by default
  }
};
function AIDevtools({
  enabled = true,
  maxEvents = 1e3,
  onEvent,
  config = {},
  className = "",
  debug = false
}) {
  const [isOpen, setIsOpen] = React2.useState(false);
  const [hasNewEvents, setHasNewEvents] = React2.useState(false);
  const [isMounted, setIsMounted] = React2.useState(false);
  const [position, setPosition] = React2.useState("bottom");
  const previousEventCountRef = React2.useRef(0);
  React2.useEffect(() => {
    if (isMounted) {
      const savedState = localStorage.getItem("ai-devtools-panel-open");
      if (savedState !== null) {
        setIsOpen(JSON.parse(savedState));
      }
      const savedPosition = localStorage.getItem("ai-devtools-panel-position");
      if (savedPosition && (savedPosition === "bottom" || savedPosition === "right")) {
        setPosition(savedPosition);
      }
    }
  }, [isMounted]);
  React2.useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ai-devtools-panel-open", JSON.stringify(isOpen));
    }
  }, [isOpen, isMounted]);
  React2.useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ai-devtools-panel-position", position);
    }
  }, [position, isMounted]);
  const finalConfig = { ...defaultConfig, ...config, position };
  const togglePosition = () => {
    setPosition((prev) => prev === "bottom" ? "right" : "bottom");
  };
  const { events, isCapturing, clearEvents, toggleCapturing } = useAIDevtools({
    enabled: enabled && isMounted,
    // Only enable after mounted
    maxEvents,
    onEvent,
    debug,
    streamCapture: finalConfig.streamCapture ? {
      enabled: finalConfig.streamCapture.enabled,
      endpoints: [finalConfig.streamCapture.endpoint],
      autoConnect: finalConfig.streamCapture.autoConnect
    } : void 0,
    throttle: finalConfig.throttle
  });
  React2.useEffect(() => {
    setIsMounted(true);
  }, []);
  React2.useEffect(() => {
    if (isMounted && events.length > previousEventCountRef.current) {
      setHasNewEvents(true);
      const timer = setTimeout(() => setHasNewEvents(false), 2e3);
      return () => clearTimeout(timer);
    }
    previousEventCountRef.current = events.length;
  }, [events.length, isMounted]);
  if (!isMounted) {
    return null;
  }
  if (!finalConfig.enabled) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      DevtoolsButton,
      {
        onToggle: () => setIsOpen(!isOpen),
        eventCount: events.length,
        hasNewEvents: hasNewEvents && !isOpen,
        className
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntime.jsx(
      DevtoolsPanel,
      {
        events,
        isCapturing,
        onToggleCapturing: toggleCapturing,
        onClearEvents: clearEvents,
        onClose: () => setIsOpen(false),
        onTogglePosition: togglePosition,
        config: finalConfig
      }
    )
  ] });
}
function StoreList({
  storeIds,
  selectedStoreId,
  onSelectStore
}) {
  if (storeIds.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-changes-empty", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-state-changes-empty-content", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-changes-empty-icon", children: "\u{1F4CA}" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-changes-empty-title", children: "No Stores Found" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-changes-empty-description", children: "Ensure you are using `@ai-sdk-tools/store` in your application." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-state-changes-list", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-state-changes-header", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Available Stores" }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "ai-devtools-state-changes-count", children: [
        storeIds.length,
        " store",
        storeIds.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-changes-items", children: storeIds.map((storeId) => /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelectStore(storeId),
        className: `ai-devtools-state-change-item ${selectedStoreId === storeId ? "selected" : ""}`,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectStore(storeId);
          }
        },
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-change-item-content", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ai-devtools-state-change-item-header", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ai-devtools-state-change-type", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-state-change-type-label", children: storeId === "default" ? "Default" : storeId }) }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ai-devtools-state-change-timestamp", children: "Store" })
        ] }) })
      },
      storeId
    )) })
  ] });
}

// src/utils/working-state-detection.ts
function isStorePackageAvailable() {
  try {
    __require("@ai-sdk-tools/store");
    return true;
  } catch {
    return false;
  }
}

exports.AIDevtools = AIDevtools;
exports.AgentFlowVisualization = AgentFlowVisualization;
exports.AgentNode = AgentNode;
exports.DevtoolsButton = DevtoolsButton;
exports.DevtoolsPanel = DevtoolsPanel;
exports.EventItem = EventItem;
exports.EventList = EventList;
exports.StateDataExplorer = StateDataExplorer;
exports.StoreList = StoreList;
exports.StreamInterceptor = StreamInterceptor;
exports.ToolNode = ToolNode;
exports.createDebugLogger = createDebugLogger;
exports.formatEventData = formatEventData;
exports.formatTimestamp = formatTimestamp;
exports.getEventDescription = getEventDescription;
exports.getEventTypeColor = getEventTypeColor;
exports.getEventTypeIcon = getEventTypeIcon;
exports.getSessionStatusColor = getSessionStatusColor;
exports.getSessionStatusIcon = getSessionStatusIcon;
exports.getSessionSummary = getSessionSummary;
exports.groupEventsIntoSessions = groupEventsIntoSessions;
exports.isStorePackageAvailable = isStorePackageAvailable;
exports.parseEventFromDataPart = parseEventFromDataPart;
exports.parseSSEEvent = parseSSEEvent;
exports.useAIDevtools = useAIDevtools;
exports.useCurrentState = useCurrentState;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map