import { icons } from './icons/index.js';

const TAG = 'dga-icon';
const OBSERVED = ['name', 'variant', 'size', 'color'] as const;

function resolveSize(value: string | null): string {
  if (!value) return '24px';
  return /^-?\d*\.?\d+$/.test(value.trim()) ? `${value.trim()}px` : value;
}

const BaseHTMLElement: typeof HTMLElement =
  typeof HTMLElement !== 'undefined'
    ? HTMLElement
    : (class {} as unknown as typeof HTMLElement);

export class DgaIcon extends BaseHTMLElement {
  static get observedAttributes(): readonly string[] {
    return OBSERVED;
  }

  #root!: ShadowRoot;
  #styleEl!: HTMLStyleElement;
  #slotEl!: HTMLSpanElement;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#styleEl = document.createElement('style');
    this.#slotEl = document.createElement('span');
    this.#slotEl.setAttribute('part', 'icon');
    this.#root.append(this.#styleEl, this.#slotEl);
  }

  connectedCallback(): void {
    this.#render();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.#render();
  }

  #render(): void {
    const name = this.getAttribute('name');
    const variant = this.getAttribute('variant') ?? 'line';
    const size = resolveSize(this.getAttribute('size'));
    const color = this.getAttribute('color') ?? 'currentColor';

    this.#styleEl.textContent = `:host{display:inline-flex;width:${size};height:${size};color:${color};line-height:0}:host([hidden]){display:none}span{display:contents}svg{width:100%;height:100%;display:block}`;

    if (!name) {
      this.#slotEl.textContent = '';
      return;
    }
    const svg = icons[`${name}_${variant}`];
    if (!svg) {
      this.#slotEl.textContent = '';
      return;
    }
    this.#slotEl.innerHTML = svg;
  }
}

export function defineDgaIcon(tagName: string = TAG): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, DgaIcon);
  }
}
