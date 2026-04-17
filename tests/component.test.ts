import { beforeAll, afterEach, describe, expect, it } from 'vitest';
import { DgaIcon, defineDgaIcon, icons } from '../src/index.js';

beforeAll(() => {
  defineDgaIcon();
});

afterEach(() => {
  document.body.innerHTML = '';
});

function mount(attrs: Record<string, string | number> = {}): HTMLElement {
  const el = document.createElement('dga-icon');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  document.body.append(el);
  return el;
}

function pathD(svg: string): string {
  const m = /<path[^>]*\bd="([^"]+)"/.exec(svg);
  if (!m) throw new Error(`no <path d="..."> found in: ${svg.slice(0, 80)}`);
  return m[1]!;
}

function renderedD(el: HTMLElement): string | null {
  return el.shadowRoot?.querySelector('path')?.getAttribute('d') ?? null;
}

describe('registration', () => {
  it('registers the dga-icon custom element', () => {
    expect(customElements.get('dga-icon')).toBe(DgaIcon);
  });

  it('is idempotent — calling defineDgaIcon twice does not throw', () => {
    expect(() => defineDgaIcon()).not.toThrow();
  });

  it('exposes 120 icons (60 names x 2 variants)', () => {
    const keys = Object.keys(icons);
    expect(keys.length).toBe(120);
    const names = new Set(keys.map((k) => k.replace(/_(fill|line)$/, '')));
    expect(names.size).toBe(60);
  });
});

describe('rendering', () => {
  it('renders an inline svg for a valid name', () => {
    const el = mount({ name: 'house', variant: 'line' });
    const svg = el.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('defaults variant to line', () => {
    const el = mount({ name: 'house' });
    expect(renderedD(el)).toBe(pathD(icons.house_line!));
  });

  it('renders the fill variant when requested', () => {
    const el = mount({ name: 'house', variant: 'fill' });
    expect(renderedD(el)).toBe(pathD(icons.house_fill!));
  });

  it('renders nothing for an unknown name', () => {
    const el = mount({ name: 'definitely_not_an_icon' });
    expect(el.shadowRoot?.querySelector('svg')).toBeNull();
  });

  it('renders nothing when name is missing', () => {
    const el = mount();
    expect(el.shadowRoot?.querySelector('svg')).toBeNull();
  });
});

describe('attribute reactivity', () => {
  it('re-renders when name changes', () => {
    const el = mount({ name: 'house', variant: 'line' });
    const before = renderedD(el);
    el.setAttribute('name', 'search');
    const after = renderedD(el);
    expect(after).not.toBe(before);
    expect(after).toBe(pathD(icons.search_line!));
  });

  it('re-renders when variant changes', () => {
    const el = mount({ name: 'house', variant: 'line' });
    el.setAttribute('variant', 'fill');
    expect(renderedD(el)).toBe(pathD(icons.house_fill!));
  });
});

describe('sizing', () => {
  it('defaults size to 24px', () => {
    const el = mount({ name: 'house' });
    const style = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(style).toContain('width:24px');
    expect(style).toContain('height:24px');
  });

  it('treats bare numbers as pixels', () => {
    const el = mount({ name: 'house', size: '48' });
    const style = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(style).toContain('width:48px');
    expect(style).toContain('height:48px');
  });

  it('passes through CSS length values', () => {
    const el = mount({ name: 'house', size: '1.5rem' });
    const style = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(style).toContain('width:1.5rem');
  });
});

describe('color', () => {
  it('defaults to currentColor', () => {
    const el = mount({ name: 'house' });
    const style = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(style).toContain('color:currentColor');
  });

  it('accepts an explicit color', () => {
    const el = mount({ name: 'house', color: '#005bac' });
    const style = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(style).toContain('color:#005bac');
  });

  it('injects fill="currentColor" in the SVG (not the raw #1A1A1C)', () => {
    const el = mount({ name: 'house' });
    const html = el.shadowRoot!.innerHTML;
    expect(html).not.toContain('#1A1A1C');
    expect(html).toContain('currentColor');
  });
});

describe('SVG normalization', () => {
  it('strips width/height from the root svg so CSS controls size', () => {
    for (const key of Object.keys(icons)) {
      const svg = icons[key]!;
      const rootMatch = /<svg\b([^>]*)>/.exec(svg);
      expect(rootMatch, key).toBeTruthy();
      const rootAttrs = rootMatch![1]!;
      expect(rootAttrs, `${key} root has width`).not.toMatch(/\bwidth=/);
      expect(rootAttrs, `${key} root has height`).not.toMatch(/\bheight=/);
    }
  });

  it('retains viewBox on every icon', () => {
    for (const key of Object.keys(icons)) {
      expect(icons[key], key).toContain('viewBox="0 0 24 24"');
    }
  });
});
