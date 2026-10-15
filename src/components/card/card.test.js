import { describe, it, expect, vi } from 'vitest';
import { Card } from './card.js';

describe('Card', () => {
  describe('constructor', () => {
    it('throws when options are missing', () => {
      expect(() => new Card()).toThrow(TypeError);
    });

    it('throws when title is missing', () => {
      expect(() => new Card({})).toThrow(TypeError);
    });

    it('throws when title is an empty string', () => {
      expect(() => new Card({ title: '   ' })).toThrow(TypeError);
    });

    it('throws when variant is not supported', () => {
      expect(() => new Card({ title: 'Hi', variant: 'ghost' })).toThrow(RangeError);
    });

    it('throws when actions is not an array', () => {
      expect(() => new Card({ title: 'Hi', actions: 'nope' })).toThrow(TypeError);
    });

    it('accepts a minimal valid configuration', () => {
      expect(() => new Card({ title: 'Hello' })).not.toThrow();
    });
  });

  describe('render', () => {
    it('returns an HTMLElement with the base classes', () => {
      const card = new Card({ title: 'Hello' });
      const el = card.render();
      expect(el).toBeInstanceOf(HTMLElement);
      expect(el.classList.contains('jc-card')).toBe(true);
      expect(el.classList.contains('jc-card--default')).toBe(true);
    });

    it('renders the title', () => {
      const card = new Card({ title: 'Hello' });
      const el = card.render();
      expect(el.querySelector('.jc-card__title')?.textContent).toBe('Hello');
    });

    it('renders an optional subtitle', () => {
      const card = new Card({ title: 'Hello', subtitle: 'World' });
      const el = card.render();
      expect(el.querySelector('.jc-card__subtitle')?.textContent).toBe('World');
    });

    it('omits the subtitle when not provided', () => {
      const card = new Card({ title: 'Hello' });
      expect(card.render().querySelector('.jc-card__subtitle')).toBeNull();
    });

    it('renders the body when provided', () => {
      const card = new Card({ title: 'Hello', body: 'Some content' });
      expect(card.render().querySelector('.jc-card__body')?.textContent).toBe('Some content');
    });

    it('applies the requested variant', () => {
      const card = new Card({ title: 'Hello', variant: 'elevated' });
      expect(card.render().classList.contains('jc-card--elevated')).toBe(true);
    });

    it('is idempotent', () => {
      const card = new Card({ title: 'Hello' });
      expect(card.render()).toBe(card.render());
    });

    it('escapes HTML characters in text content', () => {
      const card = new Card({ title: '<script>alert(1)</script>' });
      const el = card.render();
      expect(el.querySelector('.jc-card__title')?.innerHTML).toBe(
        '&lt;script&gt;alert(1)&lt;/script&gt;',
      );
    });
  });

  describe('actions', () => {
    it('renders action buttons', () => {
      const onClick = vi.fn();
      const card = new Card({
        title: 'Hi',
        actions: [
          { label: 'Cancel', onClick },
          { label: 'Confirm', onClick, variant: 'primary' },
        ],
      });
      const el = card.render();
      const buttons = el.querySelectorAll('.jc-card__action');
      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent).toBe('Cancel');
      expect(buttons[1].textContent).toBe('Confirm');
      expect(buttons[1].classList.contains('jc-card__action--primary')).toBe(true);
    });

    it('invokes onClick when the button is clicked', () => {
      const onClick = vi.fn();
      const card = new Card({
        title: 'Hi',
        actions: [{ label: 'Go', onClick }],
      });
      const button = card.render().querySelector('.jc-card__action');
      button.click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not render the footer when there are no actions', () => {
      const card = new Card({ title: 'Hi' });
      expect(card.render().querySelector('.jc-card__footer')).toBeNull();
    });
  });

  describe('destroy', () => {
    it('detaches the element from the DOM', () => {
      const card = new Card({ title: 'Hello' });
      document.body.appendChild(card.render());
      card.destroy();
      expect(document.body.querySelector('.jc-card')).toBeNull();
    });

    it('removes click listeners from action buttons', () => {
      const onClick = vi.fn();
      const card = new Card({
        title: 'Hi',
        actions: [{ label: 'Go', onClick }],
      });
      const el = card.render();
      const button = el.querySelector('.jc-card__action');
      button.click();
      expect(onClick).toHaveBeenCalledTimes(1);

      card.destroy();
      button.click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is idempotent', () => {
      const card = new Card({ title: 'Hi' });
      card.render();
      expect(() => {
        card.destroy();
        card.destroy();
      }).not.toThrow();
    });

    it('resets the element reference', () => {
      const card = new Card({ title: 'Hi' });
      card.render();
      card.destroy();
      expect(card.element).toBeNull();
    });
  });
});
