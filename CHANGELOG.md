# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-15

### Added

- Initial repository scaffolding: `.gitignore`, `.editorconfig`, and `.nvmrc`.
- MIT license.
- Project README with badges for npm, license, Node.js, GitHub Actions, and GitLab CI.
- `CHANGELOG.md` following the Keep a Changelog format.
- npm package manifest for `@jalau-labs/jala-u-ds4-web-components`.
- ESLint and Prettier configuration with flat config.
- Vite library build producing ESM and UMD bundles plus an aggregated stylesheet.
- Vitest and jsdom test infrastructure with coverage reporting.
- Makefile wrapping common development and CI tasks.
- Docker development image and docker compose configuration.
- GitHub Actions workflows for CI, release and Dependabot.
- GitLab CI pipeline for lint, test and build.
- Design tokens for colors, typography, spacing, radii, shadows, transitions and z-index layers, exposed with low specificity via `:where(:root)`.
- `Card` component with three visual variants (`default`, `outlined`, `elevated`), optional subtitle, body and actions.
- `Tooltip` component with four placement positions (`top`, `right`, `bottom`, `left`), keyboard support, ARIA wiring and portal rendering.
- Interactive example page under `examples/index.html`.
- Laboratory deliverable reports under `docs/`.

[Unreleased]: https://github.com/JalaU-Labs/jala-u-ds4-web-components/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/JalaU-Labs/jala-u-ds4-web-components/releases/tag/v0.1.0
