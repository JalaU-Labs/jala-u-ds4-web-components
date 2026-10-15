/**
 * Global test setup for Vitest.
 *
 * This file runs once before every test file. It resets shared state that
 * could otherwise leak between tests, such as lingering DOM nodes and
 * registered event listeners attached to `document` or `window`.
 *
 * As the component library grows, additional global fixtures or matchers
 * can be registered here.
 */

import { afterEach } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});
