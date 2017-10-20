# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning].

This change log follows the format documented in [Keep a CHANGELOG].

[Semantic Versioning]: http://semver.org/
[Keep a CHANGELOG]: http://keepachangelog.com/

## Unreleased

## 0.3.1 - 2017-10-20

## Fixed

- Fix a couple of bugs, caused by opening an URL of scenario which doesn't exist.
  ([#42](https://github.com/tessereact/tessereact/pull/42),
  [#44](https://github.com/tessereact/tessereact/pull/44))

- Improve visual diff render style.
  ([#45](https://github.com/tessereact/tessereact/pull/45))

## 0.3.0 - 2017-10-18

### Changed

- Update `styled-components`. Remove `styled-mixin` which was causing an error
  in React 16.
  ([#39](https://github.com/tessereact/tessereact/pull/39))

- Now CI, screenshot diffs and CSS are calculated in [`puppeteer`](https://github.com/GoogleChrome/puppeteer).
  ([#40](https://github.com/tessereact/tessereact/pull/40))

- Remove `lastAcceptedBrowserData.json` functionality.
  It is not needed anymore, as CSS is now calculated in the fixed version of Chromium,
  provided by `puppeteer`.
  ([#41](https://github.com/tessereact/tessereact/pull/41))

## 0.2.1 - 2017-10-12

### Fixed

- Fix minor screenshot render bug.
  ([a67f04f](https://github.com/tessereact/tessereact/commit/a67f04f7abbc1d2c749c1c6e6443dd7a87f08732))

## 0.2.0 - 2017-10-12

### Added

- Write `lastAcceptedBrowserData.json` when any snapshot is accepted.
  ([#29](https://github.com/tessereact/tessereact/pull/29))

- CI now logs text diffs for non-accepted snapshots.
  ([#29](https://github.com/tessereact/tessereact/pull/29))

- Single column and split view modes.
  ([#32](https://github.com/tessereact/tessereact/pull/32),
  [#34](https://github.com/tessereact/tessereact/pull/34))

### Changed

- On client, diffs are now calculated when the scenario is rendered,
  instead of when they are received from server.
  ([#29](https://github.com/tessereact/tessereact/pull/29))

- Add "before" and "after" labels to the visual diff.
  Slightly change frame delay.
  ([#36](https://github.com/tessereact/tessereact/pull/36))

- Move failed scenarios and contexts to the top of the sidebar list.
  ([#35](https://github.com/tessereact/tessereact/pull/35))

### Fixed

- Fix context view CSS.
  ([#31](https://github.com/tessereact/tessereact/pull/31))

- Fix chromedriver incorrectly not exiting when CI is finished running.
  ([#33](https://github.com/tessereact/tessereact/pull/33))

- Fix "CI doesn't print all logs before exiting" bug.
  ([#37](https://github.com/tessereact/tessereact/pull/37))

## 0.1.2 - 2017-10-06

### Fixed

- Add missing files to `"files"` property in package.json.
  ([fa11c3e](https://github.com/tessereact/tessereact/commit/fa11c3ee62a1073088828ca227553922683607e7))

## 0.1.1 - 2017-10-06

### Fixed

- Fix CI runner. ([#30](https://github.com/tessereact/tessereact/pull/30))

## 0.1.0 - 2017-10-06

### Added

- CSS and screenshot diffs.
