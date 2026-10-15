import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Tooltip } from './tooltip.js';

/**
 * jsdom returns zeroes from getBoundingClientRect. To exercise the
 * positioning math, we mock the method on the elements the tooltip
 * interacts with.
 */
function mockRect(el, rect) {
  el.getBoundingClientRect = () => ({
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    x: rect.left,
    y: rect.top,
    toJSON: () => rect,
  });
}

describe('Tooltip', () => {
  describe('constructor', () => {
    it('throws when options are missing', () => {
      expect(() => new Tooltip()).toThrow(TypeError);
    });

    it('throws when text is missing', () => {
      expect(() => new Tooltip({})).toThrow(TypeError);
    });

    it('throws when text is an empty string', () => {
      expect(() => new Tooltip({ text: '   ' })).toThrow(TypeError);
    });

    it('throws when position is not supported', () => {
      expect(() => new Tooltip({ text: 'Hi', position: 'diagonal' })).toThrow(RangeError);
    });

    it('accepts a minimal valid configuration', () => {
      expect(() => new Tooltip({ text: 'Hello' })).not.toThrow();
    });
  });

  describe('attach', () => {
    it('throws when target is not an HTMLElement', () => {
      const tooltip = new Tooltip({ text: 'Hi' });
      expect(() => tooltip.attach(null)).toThrow(TypeError);
      expect(() => tooltip.attach('button')).toThrow(TypeError);
    });

    it('sets aria-describedby on the target', () => {
      const target = document.createElement('button');
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      expect(target.getAttribute('aria-describedby')).toBe(tooltip.element?.id ?? null);
    });

    it('is idempotent when attaching the same target', () => {
      const target = document.createElement('button');
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      const idFirst = target.getAttribute('aria-describedby');
      tooltip.attach(target);
      const idSecond = target.getAttribute('aria-describedby');
      expect(idFirst).toBe(idSecond);
    });

    it('detaches the previous target when attaching a new one', () => {
      const first = document.createElement('button');
      const second = document.createElement('button');
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(first);
      tooltip.attach(second);
      expect(first.hasAttribute('aria-describedby')).toBe(false);
      expect(second.hasAttribute('aria-describedby')).toBe(true);
    });
  });

  describe('show / hide', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('button');
      mockRect(target, { top: 100, left: 100, right: 200, bottom: 140, width: 100, height: 40 });
    });

    afterEach(() => {
      target.remove();
    });

    it('does nothing when no target is attached', () => {
      const tooltip = new Tooltip({ text: 'Hi' });
      expect(() => tooltip.show()).not.toThrow();
      expect(tooltip.element).toBeNull();
    });

    it('creates and appends the tooltip element on show', () => {
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      tooltip.show();
      expect(tooltip.element).not.toBeNull();
      expect(document.body.contains(tooltip.element)).toBe(true);
      expect(tooltip.element.classList.contains('jc-tooltip--visible')).toBe(true);
    });

    it('sets the aria-hidden attribute accordingly', () => {
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      tooltip.show();
      expect(tooltip.element.getAttribute('aria-hidden')).toBe('false');
      tooltip.hide();
      expect(tooltip.element.getAttribute('aria-hidden')).toBe('true');
    });

    it('positions the tooltip for the top placement', () => {
      mockRect({ getBoundingClientRect: () => ({}) }, {});
      const tooltip = new Tooltip({ text: 'Hi', position: 'top' });
      tooltip.attach(target);
      tooltip.show();
      const el = tooltip.element;
      // The tooltip element itself reports zero dimensions in jsdom.
      // With target rect top=100, height=40, and tooltip height=0:
      //   top = 100 - 0 = 100
      //   left = 100 + 100 / 2 - 0 / 2 = 150
      expect(el.style.top).toBe('100px');
      expect(el.style.left).toBe('150px');
    });

    it('positions the tooltip for the bottom placement', () => {
      const tooltip = new Tooltip({ text: 'Hi', position: 'bottom' });
      tooltip.attach(target);
      tooltip.show();
      // top = targetRect.bottom = 140
      expect(tooltip.element.style.top).toBe('140px');
    });

    it('positions the tooltip for the left placement', () => {
      const tooltip = new Tooltip({ text: 'Hi', position: 'left' });
      tooltip.attach(target);
      tooltip.show();
      // left = targetRect.left - tooltipWidth = 100 - 0 = 100
      expect(tooltip.element.style.left).toBe('100px');
    });

    it('positions the tooltip for the right placement', () => {
      const tooltip = new Tooltip({ text: 'Hi', position: 'right' });
      tooltip.attach(target);
      tooltip.show();
      // left = targetRect.right = 200
      expect(tooltip.element.style.left).toBe('200px');
    });
  });

  describe('event listeners', () => {
    it('shows on mouseenter and hides on mouseleave', () => {
      const target = document.createElement('button');
      mockRect(target, { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 });
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);

      target.dispatchEvent(new MouseEvent('mouseenter'));
      expect(tooltip.element?.classList.contains('jc-tooltip--visible')).toBe(true);

      target.dispatchEvent(new MouseEvent('mouseleave'));
      expect(tooltip.element?.classList.contains('jc-tooltip--visible')).toBe(false);
    });

    it('shows on focus and hides on blur', () => {
      const target = document.createElement('button');
      mockRect(target, { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 });
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);

      target.dispatchEvent(new FocusEvent('focus'));
      expect(tooltip.element?.classList.contains('jc-tooltip--visible')).toBe(true);

      target.dispatchEvent(new FocusEvent('blur'));
      expect(tooltip.element?.classList.contains('jc-tooltip--visible')).toBe(false);
    });

    it('hides on Escape key', () => {
      const target = document.createElement('button');
      mockRect(target, { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 });
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      tooltip.show();

      target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(tooltip.element?.classList.contains('jc-tooltip--visible')).toBe(false);
    });

    it('hides on window resize', () => {
      const target = document.createElement('button');
      mockRect(target, { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 });
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      tooltip.show();

      window.dispatchEvent(new Event('resize'));
      expect(tooltip.element?.classList.contains('jc-tooltip--visible')).toBe(false);
    });
  });

  describe('destroy', () => {
    it('removes the tooltip element from the DOM', () => {
      const target = document.createElement('button');
      mockRect(target, { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 });
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      tooltip.show();

      tooltip.destroy();
      expect(document.body.querySelector('.jc-tooltip')).toBeNull();
      expect(tooltip.element).toBeNull();
    });

    it('removes aria-describedby from the target', () => {
      const target = document.createElement('button');
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      tooltip.destroy();
      expect(target.hasAttribute('aria-describedby')).toBe(false);
      expect(tooltip.target).toBeNull();
    });

    it('removes event listeners from the target', () => {
      const target = document.createElement('button');
      mockRect(target, { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 });
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      tooltip.destroy();

      target.dispatchEvent(new MouseEvent('mouseenter'));
      expect(tooltip.element).toBeNull();
    });

    it('is idempotent', () => {
      const target = document.createElement('button');
      const tooltip = new Tooltip({ text: 'Hi' });
      tooltip.attach(target);
      expect(() => {
        tooltip.destroy();
        tooltip.destroy();
      }).not.toThrow();
    });
  });

  describe('ids', () => {
    it('assigns unique ids to different instances', () => {
      const a = new Tooltip({ text: 'A' });
      const b = new Tooltip({ text: 'B' });
      const targetA = document.createElement('button');
      const targetB = document.createElement('button');
      a.attach(targetA);
      b.attach(targetB);
      a.show();
      b.show();
      expect(a.element.id).not.toBe(b.element.id);
    });
  });
});
