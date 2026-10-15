/**
 * Public entry point for @jalau-labs/jala-u-ds4-web-components.
 *
 * Consumers can import the package as ESM:
 *
 *   import { Card, Tooltip } from '@jalau-labs/jala-u-ds4-web-components';
 *
 * or via the UMD bundle in the browser:
 *
 *   const { Card, Tooltip } = window.JalaUWebComponents;
 *
 * The design tokens are imported here so that the aggregated stylesheet
 * produced by the build always contains them, regardless of which
 * component a consumer imports.
 */

import './styles/tokens.css';

export { Card } from './components/card/card.js';
