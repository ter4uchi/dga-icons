import type { IconName, IconVariant } from './icon-names.js';

export type { IconName, IconVariant };

export interface DgaIconAttributes {
  name?: IconName;
  variant?: IconVariant;
  size?: string | number;
  color?: string;
}

export declare class DgaIcon extends HTMLElement {
  static readonly observedAttributes: readonly string[];
  connectedCallback(): void;
  attributeChangedCallback(): void;
}

export declare function defineDgaIcon(tagName?: string): void;
export declare const icons: Record<string, string>;

declare global {
  interface HTMLElementTagNameMap {
    'dga-icon': DgaIcon;
  }
}

// ---------- React 18 ----------
// Users on React 18 get JSX typings via JSX.IntrinsicElements.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dga-icon': DgaIconReactProps;
    }
  }
}

type ReactLikeHTMLAttributes = {
  class?: string;
  className?: string;
  id?: string;
  style?: unknown;
  hidden?: boolean;
  title?: string;
  slot?: string;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  children?: unknown;
  key?: string | number | null;
  ref?: unknown;
  onClick?: unknown;
};

export type DgaIconReactProps = ReactLikeHTMLAttributes & DgaIconAttributes;

// ---------- React 19+ ----------
// React 19 moved custom element typing to a dedicated interface.
declare global {
  interface CustomElements {
    'dga-icon': DgaIconReactProps;
  }
}

// ---------- Vue 3 (Volar) ----------
declare module '@vue/runtime-dom' {
  export interface GlobalComponents {
    'dga-icon': new () => {
      $props: {
        name?: IconName;
        variant?: IconVariant;
        size?: string | number;
        color?: string;
      };
    };
  }
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'dga-icon': new () => {
      $props: {
        name?: IconName;
        variant?: IconVariant;
        size?: string | number;
        color?: string;
      };
    };
  }
}

// ---------- Svelte 5 ----------
declare namespace svelteHTML {
  interface IntrinsicElements {
    'dga-icon': {
      name?: IconName;
      variant?: IconVariant;
      size?: string | number;
      color?: string;
      [key: `aria-${string}`]: string | boolean | undefined;
      [key: `data-${string}`]: string | number | boolean | undefined;
    };
  }
}
