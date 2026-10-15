/**
 * @fileoverview Card component.
 *
 * A Card groups a title, an optional subtitle, a body, and optional
 * actions into a visually contained element. It is built entirely with
 * the DOM API and does not depend on any templating library.
 *
 * @module components/card/card
 */

import './card.css';

/** @typedef {'default' | 'outlined' | 'elevated'} CardVariant */

/**
 * @typedef {Object} CardAction
 * @property {string} label - Visible text of the action button.
 * @property {(event: MouseEvent) => void} onClick - Click handler.
 * @property {'primary' | 'secondary'} [variant='secondary'] - Visual variant.
 */

/**
 * @typedef {Object} CardOptions
 * @property {string} title - Card title. Required.
 * @property {string} [subtitle] - Optional subtitle rendered below the title.
 * @property {string} [body] - Optional body text.
 * @property {CardAction[]} [actions] - Optional list of action buttons.
 * @property {CardVariant} [variant='default'] - Visual variant.
 */

const VALID_VARIANTS = new Set(['default', 'outlined', 'elevated']);

/**
 * A reusable card component.
 *
 * @example
 * const card = new Card({
 *   title: 'Weekly summary',
 *   body: 'All tasks completed successfully.',
 *   variant: 'outlined',
 *   actions: [{ label: 'Dismiss', onClick: () => card.destroy() }],
 * });
 * document.body.appendChild(card.render());
 */
export class Card {
  /** @type {CardOptions} */
  #options;

  /** @type {HTMLElement | null} */
  #element = null;

  /** @type {Map<HTMLButtonElement, (event: MouseEvent) => void>} */
  #actionListeners = new Map();

  /**
   * Creates a new Card instance.
   *
   * @param {CardOptions} options - Configuration for the card.
   * @throws {TypeError} If `options` is missing or `title` is not a non-empty string.
   * @throws {RangeError} If `variant` is not a supported value.
   */
  constructor(options) {
    if (!options || typeof options !== 'object') {
      throw new TypeError('Card: options object is required.');
    }
    if (typeof options.title !== 'string' || options.title.trim() === '') {
      throw new TypeError('Card: "title" must be a non-empty string.');
    }
    const variant = options.variant ?? 'default';
    if (!VALID_VARIANTS.has(variant)) {
      throw new RangeError(`Card: "variant" must be one of ${[...VALID_VARIANTS].join(', ')}.`);
    }
    if (options.actions !== undefined && !Array.isArray(options.actions)) {
      throw new TypeError('Card: "actions" must be an array when provided.');
    }

    this.#options = { ...options, variant };
  }

  /**
   * Renders the card into an HTMLElement.
   *
   * Calling `render()` multiple times returns the same element instance.
   * Call {@link Card#destroy} to release the element and its listeners.
   *
   * @returns {HTMLElement} The card root element.
   */
  render() {
    if (this.#element) {
      return this.#element;
    }

    const { title, subtitle, body, actions, variant } = this.#options;

    const root = document.createElement('article');
    root.className = `jc-card jc-card--${variant}`;
    root.setAttribute('role', 'article');

    const header = document.createElement('header');
    header.className = 'jc-card__header';

    const titleEl = document.createElement('h2');
    titleEl.className = 'jc-card__title';
    titleEl.textContent = title;
    header.appendChild(titleEl);

    if (subtitle) {
      const subtitleEl = document.createElement('p');
      subtitleEl.className = 'jc-card__subtitle';
      subtitleEl.textContent = subtitle;
      header.appendChild(subtitleEl);
    }

    root.appendChild(header);

    if (body) {
      const bodyEl = document.createElement('div');
      bodyEl.className = 'jc-card__body';
      bodyEl.textContent = body;
      root.appendChild(bodyEl);
    }

    if (actions && actions.length > 0) {
      const footer = document.createElement('footer');
      footer.className = 'jc-card__footer';

      for (const action of actions) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `jc-card__action jc-card__action--${action.variant ?? 'secondary'}`;
        button.textContent = action.label;

        const listener = (event) => action.onClick(event);
        button.addEventListener('click', listener);
        this.#actionListeners.set(button, listener);

        footer.appendChild(button);
      }

      root.appendChild(footer);
    }

    this.#element = root;
    return root;
  }

  /**
   * Removes all event listeners registered by this instance and detaches
   * the rendered element from its parent, if any.
   *
   * Safe to call multiple times.
   *
   * @returns {void}
   */
  destroy() {
    for (const [button, listener] of this.#actionListeners) {
      button.removeEventListener('click', listener);
    }
    this.#actionListeners.clear();

    if (this.#element && this.#element.parentNode) {
      this.#element.parentNode.removeChild(this.#element);
    }
    this.#element = null;
  }

  /**
   * Returns the rendered element, or null when the card has not been
   * rendered yet or has already been destroyed.
   *
   * @returns {HTMLElement | null}
   */
  get element() {
    return this.#element;
  }
}
