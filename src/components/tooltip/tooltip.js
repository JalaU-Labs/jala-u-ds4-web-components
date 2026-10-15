/**
 * @fileoverview Tooltip component.
 *
 * A Tooltip attaches to a target element and displays a short description
 * on hover or keyboard focus. It renders into a portal element appended
 * to `document.body` to avoid clipping by ancestors with `overflow: hidden`.
 *
 * @module components/tooltip/tooltip
 */

import './tooltip.css';

/** @typedef {'top' | 'right' | 'bottom' | 'left'} TooltipPosition */

/**
 * @typedef {Object} TooltipOptions
 * @property {string} text - Tooltip content. Required, non-empty.
 * @property {TooltipPosition} [position='top'] - Placement relative to the target.
 */

const VALID_POSITIONS = new Set(['top', 'right', 'bottom', 'left']);

let instanceCounter = 0;

/**
 * A reusable tooltip component.
 *
 * @example
 * const tooltip = new Tooltip({ text: 'Copies the value', position: 'top' });
 * tooltip.attach(document.querySelector('#copy-button'));
 */
export class Tooltip {
  /** @type {TooltipOptions} */
  #options;

  /** @type {HTMLElement | null} */
  #tooltipEl = null;

  /** @type {HTMLElement | null} */
  #target = null;

  /** @type {string} */
  #id;

  /** @type {Map<string, EventListener>} */
  #listeners = new Map();

  /**
   * Creates a new Tooltip instance.
   *
   * @param {TooltipOptions} options - Configuration for the tooltip.
   * @throws {TypeError} If `options` is missing or `text` is not a non-empty string.
   * @throws {RangeError} If `position` is not a supported value.
   */
  constructor(options) {
    if (!options || typeof options !== 'object') {
      throw new TypeError('Tooltip: options object is required.');
    }
    if (typeof options.text !== 'string' || options.text.trim() === '') {
      throw new TypeError('Tooltip: "text" must be a non-empty string.');
    }
    const position = options.position ?? 'top';
    if (!VALID_POSITIONS.has(position)) {
      throw new RangeError(
        `Tooltip: "position" must be one of ${[...VALID_POSITIONS].join(', ')}.`,
      );
    }

    this.#options = { ...options, position };
    this.#id = `jc-tooltip-${++instanceCounter}`;
  }

  /**
   * Binds the tooltip to a target element.
   *
   * Calling `attach()` again with the same target is a no-op. Calling it
   * with a different target detaches the previous one first.
   *
   * @param {HTMLElement} target - The element the tooltip describes.
   * @throws {TypeError} If `target` is not an HTMLElement.
   * @returns {void}
   */
  attach(target) {
    if (!(target instanceof HTMLElement)) {
      throw new TypeError('Tooltip: "target" must be an HTMLElement.');
    }
    if (this.#target === target) {
      return;
    }

    this.#detachTarget();
    this.#target = target;

    target.setAttribute('aria-describedby', this.#id);

    const onEnter = () => this.show();
    const onLeave = () => this.hide();
    const onFocus = () => this.show();
    const onBlur = () => this.hide();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.hide();
      }
    };
    const onWindowChange = () => this.hide();

    this.#listeners.set('mouseenter', onEnter);
    this.#listeners.set('mouseleave', onLeave);
    this.#listeners.set('focus', onFocus);
    this.#listeners.set('blur', onBlur);
    this.#listeners.set('keydown', onKeyDown);

    target.addEventListener('mouseenter', onEnter);
    target.addEventListener('mouseleave', onLeave);
    target.addEventListener('focus', onFocus);
    target.addEventListener('blur', onBlur);
    target.addEventListener('keydown', onKeyDown);

    window.addEventListener('scroll', onWindowChange, true);
    window.addEventListener('resize', onWindowChange);
  }

  /**
   * Shows the tooltip, positioning it according to the configured placement.
   *
   * Does nothing when the tooltip has no target attached.
   *
   * @returns {void}
   */
  show() {
    if (!this.#target) {
      return;
    }

    if (!this.#tooltipEl) {
      this.#tooltipEl = this.#buildElement();
      document.body.appendChild(this.#tooltipEl);
    }

    this.#tooltipEl.setAttribute('aria-hidden', 'false');
    this.#tooltipEl.classList.add('jc-tooltip--visible');
    this.#positionElement();
  }

  /**
   * Hides the tooltip.
   *
   * The tooltip element is kept in the DOM so that re-showing is cheap.
   * It is removed only when {@link Tooltip#destroy} is called.
   *
   * @returns {void}
   */
  hide() {
    if (!this.#tooltipEl) {
      return;
    }
    this.#tooltipEl.classList.remove('jc-tooltip--visible');
    this.#tooltipEl.setAttribute('aria-hidden', 'true');
  }

  /**
   * Removes the tooltip from the DOM, detaches all event listeners, and
   * cleans up ARIA attributes on the target element.
   *
   * Safe to call multiple times.
   *
   * @returns {void}
   */
  destroy() {
    this.#detachTarget();

    if (this.#tooltipEl && this.#tooltipEl.parentNode) {
      this.#tooltipEl.parentNode.removeChild(this.#tooltipEl);
    }
    this.#tooltipEl = null;
  }

  /**
   * Returns the rendered tooltip element, or null when it has not been
   * shown yet or has already been destroyed.
   *
   * @returns {HTMLElement | null}
   */
  get element() {
    return this.#tooltipEl;
  }

  /**
   * Returns the currently attached target, or null when none is attached.
   *
   * @returns {HTMLElement | null}
   */
  get target() {
    return this.#target;
  }

  /**
   * Returns the unique identifier assigned to this tooltip instance.
   *
   * This is the value that gets written to the target's `aria-describedby`
   * attribute when {@link Tooltip#attach} is called. It is exposed so that
   * consumers can reference the tooltip from custom ARIA markup.
   *
   * @returns {string}
   */
  get id() {
    return this.#id;
  }

  /* ------------------------------------------------------------------ */
  /* Private helpers                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * @private
   * @returns {HTMLElement}
   */
  #buildElement() {
    const el = document.createElement('div');
    el.id = this.#id;
    el.className = `jc-tooltip jc-tooltip--${this.#options.position}`;
    el.setAttribute('role', 'tooltip');
    el.setAttribute('aria-hidden', 'true');

    const arrow = document.createElement('span');
    arrow.className = 'jc-tooltip__arrow';
    arrow.setAttribute('aria-hidden', 'true');

    const content = document.createElement('span');
    content.className = 'jc-tooltip__content';
    content.textContent = this.#options.text;

    el.appendChild(arrow);
    el.appendChild(content);
    return el;
  }

  /**
   * @private
   * @returns {void}
   */
  #positionElement() {
    if (!this.#target || !this.#tooltipEl) {
      return;
    }

    const targetRect = this.#target.getBoundingClientRect();
    const tooltipRect = this.#tooltipEl.getBoundingClientRect();
    const position = this.#options.position;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = targetRect.bottom;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.left - tooltipRect.width;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.right;
        break;
    }

    this.#tooltipEl.style.top = `${top}px`;
    this.#tooltipEl.style.left = `${left}px`;
  }

  /**
   * @private
   * @returns {void}
   */
  #detachTarget() {
    if (this.#target) {
      this.#target.removeAttribute('aria-describedby');

      for (const [event, listener] of this.#listeners) {
        if (
          event === 'mouseenter' ||
          event === 'mouseleave' ||
          event === 'focus' ||
          event === 'blur' ||
          event === 'keydown'
        ) {
          this.#target.removeEventListener(event, listener);
        }
      }

      const onWindowChange = this.#listeners.get('resize');
      if (onWindowChange) {
        window.removeEventListener('scroll', onWindowChange, true);
        window.removeEventListener('resize', onWindowChange);
      }
    }

    this.#listeners.clear();
    this.#target = null;
  }
}
