# jala-u-ds4-web-components

[![npm version](https://img.shields.io/npm/v/jala-u-ds4-web-components.svg?style=flat-square)](https://www.npmjs.com/package/jala-u-ds4-web-components)
[![npm downloads](https://img.shields.io/npm/dm/jala-u-ds4-web-components.svg?style=flat-square)](https://www.npmjs.com/package/jala-u-ds4-web-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js version](https://img.shields.io/badge/node-%3E%3D26.5.0-brightgreen.svg?style=flat-square)](https://nodejs.org)
[![GitHub CI](https://github.com/JalaU-Labs/jala-u-ds4-web-components/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/JalaU-Labs/jala-u-ds4-web-components/actions/workflows/ci.yml)
[![GitLab CI](https://gitlab.com/jala-university1/cohort-5/ES.CSSD-245.GA.T2.26.M2/SD/group-b/individual-laboratories/alejandro-botina/week-03/jala-u-ds4-web-components/badges/main/pipeline.svg)](https://gitlab.com/jala-university1/cohort-5/ES.CSSD-245.GA.T2.26.M2/SD/group-b/individual-laboratories/alejandro-botina/week-03/jala-u-ds4-web-components/-/pipelines)

A small, dependency-free library of reusable web components built with plain HTML, CSS, and JavaScript. It is designed to be published as an npm package and consumed both as an ES module and as a UMD bundle in any modern browser.

The library currently ships two components:

- `Card` — a structured container for grouped content.
- `Tooltip` — an accessible pop-up that describes a target element on hover or focus.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [ES modules](#es-modules)
  - [UMD / browser](#umd--browser)
  - [Card](#card)
  - [Tooltip](#tooltip)
- [API reference](#api-reference)
- [Project structure](#project-structure)
- [Development](#development)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Available scripts](#available-scripts)
  - [Docker](#docker)
- [Testing](#testing)
- [Build](#build)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- Written in plain JavaScript, no runtime dependencies.
- Styled with modern CSS (custom properties, logical properties).
- Distributed as both ESM and UMD builds.
- Documented public methods with JSDoc.
- Tested with Vitest and jsdom.
- Linted with ESLint and formatted with Prettier.
- Continuous integration on GitHub Actions and GitLab CI.
- Ready to be published to the npm registry.

## Installation

```bash
npm install jala-u-ds4-web-components
```

## Usage

### ES modules

```js
import { Card, Tooltip } from 'jala-u-ds4-web-components';

const card = new Card({
  title: 'Weekly summary',
  body: 'All tasks completed successfully.',
  variant: 'outlined',
});

document.querySelector('#app').appendChild(card.render());

const tooltip = new Tooltip({
  text: 'Additional context for the action.',
  position: 'top',
});

tooltip.attach(document.querySelector('#help-button'));
```

### UMD / browser

```html
<link rel="stylesheet" href="https://unpkg.com/jala-u-ds4-web-components/dist/style.css" />

<script src="https://unpkg.com/jala-u-ds4-web-components/dist/index.umd.js"></script>
<script>
  const { Card, Tooltip } = window.JalaUWebComponents;
  // The API is identical to the ESM build.
</script>
```

### Card

A `Card` groups a title, an optional subtitle, a body, and optional actions. It supports the following variants: `default`, `outlined`, and `elevated`.

### Tooltip

A `Tooltip` attaches to a target element and shows a short description on mouse hover or keyboard focus. The position can be `top`, `right`, `bottom`, or `left`, and defaults to `top`.

## API reference

Full API documentation is available in the JSDoc comments inside each component source file:

- [`src/components/card/card.js`](src/components/card/card.js)
- [`src/components/tooltip/tooltip.js`](src/components/tooltip/tooltip.js)

Summary:

| Class     | Method                 | Description                                           |
| --------- | ---------------------- | ----------------------------------------------------- |
| `Card`    | `constructor(options)` | Creates a card instance with the provided options.    |
| `Card`    | `render()`             | Returns the card as an `HTMLElement`.                 |
| `Card`    | `destroy()`            | Removes listeners and detaches the element.           |
| `Tooltip` | `constructor(options)` | Creates a tooltip instance with the provided options. |
| `Tooltip` | `attach(target)`       | Binds the tooltip to a target element.                |
| `Tooltip` | `show()` / `hide()`    | Shows or hides the tooltip programmatically.          |
| `Tooltip` | `destroy()`            | Removes listeners and detaches the tooltip.           |

## Project structure

```
jala-u-ds4-web-components/
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── docs/
├── examples/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── card/
│   │   └── tooltip/
│   ├── styles/
│   │   └── tokens.css
│   └── index.js
├── tests/
│   └── setup.js
├── .dockerignore
├── .editorconfig
├── .gitignore
├── .gitlab-ci.yml
├── .nvmrc
├── .prettierignore
├── .prettierrc.json
├── CHANGELOG.md
├── Dockerfile
├── eslint.config.js
├── LICENSE
├── Makefile
├── package.json
├── README.md
├── vite.config.js
└── vitest.config.js
```

## Development

### Requirements

- Node.js `>=26.5.0`
- npm `>=12.0.2`
- GNU Make `>=4.4`
- Docker `>=29.9` (optional, for the containerized workflow)

### Setup

```bash
git clone git@gitlab.com:jala-university1/cohort-5/ES.CSSD-245.GA.T2.26.M2/SD/group-b/individual-laboratories/alejandro-botina/week-03/jala-u-ds4-web-components.git
cd jala-u-ds4-web-components
make install
```

### Available scripts

The project is driven by a `Makefile` that wraps the npm scripts. Run `make` with no arguments to list every target.

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `make install`     | Install dependencies with `npm ci`.               |
| `make dev`         | Start the Vite development server.                |
| `make test`        | Run the unit test suite once.                     |
| `make test-watch`  | Run the unit test suite in watch mode.            |
| `make lint`        | Run ESLint on the source tree.                    |
| `make format`      | Run Prettier in write mode.                       |
| `make build`       | Produce the ESM and UMD bundles in `dist/`.       |
| `make clean`       | Remove `dist/`, `coverage/`, and `node_modules/`. |
| `make publish-dry` | Simulate `npm publish` without uploading.         |

### Docker

A `Dockerfile` is provided for reproducible local development and CI runs.

```bash
docker build -t jala-u-ds4-web-components .
docker run --rm -it -v "$PWD":/app jala-u-ds4-web-components make test
```

## Testing

```bash
make test
```

Tests are written with Vitest and executed against jsdom. Each component has its own `*.test.js` file next to its source, covering constructor validation, DOM rendering, event handling, and cleanup.

## Build

```bash
make build
```

The build produces:

- `dist/index.js` — ESM bundle.
- `dist/index.umd.js` — UMD bundle for browsers.
- `dist/style.css` — aggregated CSS.
- Source maps for both bundles.

## Contributing

This repository is a personal laboratory for the Software Development IV course at Jala University. External contributions are not expected at this time.

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.

## Author

Diego Alejandro Botina
