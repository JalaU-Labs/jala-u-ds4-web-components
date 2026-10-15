import { describe, it, expect } from 'vitest';

describe('test environment', () => {
  it('provides a jsdom document', () => {
    expect(typeof document).toBe('object');
    expect(document.body).toBeDefined();
  });

  it('supports DOM manipulation', () => {
    const el = document.createElement('div');
    el.textContent = 'hello';
    document.body.appendChild(el);
    expect(document.body.children).toHaveLength(1);
    expect(document.body.firstElementChild?.textContent).toBe('hello');
  });
});
