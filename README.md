# @ter4uchi/dga-icons

デジタル庁が公開している「イラストレーション・アイコン素材」を、フレームワーク非依存の **Web Components** として提供する npm パッケージ。ランタイム依存ゼロ。

> **本パッケージはデジタル庁公式ではありません。** 第三者によるアイコン素材の再配布物です。

- 60 アイコン × 2 バリアント（`fill` / `line`）
- カスタム要素は `<dga-icon>` 1 種類のみ
- Shadow DOM による完全カプセル化（`clipPath` ID 衝突なし）
- React 18 / React 19+ / Vue 3 / Svelte 5 / VSCode の補完に対応
- ESM + CJS 同梱

## インストール

```bash
npm install @ter4uchi/dga-icons
```

## クイックスタート

### 素の HTML

```html
<script type="module">
  import '@ter4uchi/dga-icons';
</script>

<dga-icon name="house" variant="line" size="24"></dga-icon>
<dga-icon name="search" variant="fill" size="32" color="#005bac"></dga-icon>
```

import した時点で自動的に `customElements.define('dga-icon', ...)` が実行されます。

### 明示的に登録したい場合

```ts
import { defineDgaIcon } from '@ter4uchi/dga-icons';
defineDgaIcon(); // またはカスタム tag 名: defineDgaIcon('my-icon');
```

## API

```html
<dga-icon name="house" variant="line" size="24" color="currentColor"></dga-icon>
```

| 属性 | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `name` | `IconName` | — | アイコン名（必須） |
| `variant` | `'fill' \| 'line'` | `'line'` | バリアント |
| `size` | `string \| number` | `'24'` | 数値は `px` 扱い。`'1.5rem'` のような CSS 値も可 |
| `color` | `string` | `'currentColor'` | CSS color。親の `color` プロパティから制御可能 |

すべて属性は動的に変更可能（`attributeChangedCallback` で再描画）。

## CSS から制御

`color` 属性を未指定 or `currentColor` にすると親の文字色を継承します。

```css
.warning {
  color: #d33;
}
```

```html
<span class="warning">
  <dga-icon name="attention" variant="fill"></dga-icon>
  注意
</span>
```

## フレームワーク統合

### React 18

`package.json` の `types` を参照するだけで JSX 補完が効きます。

```tsx
import '@ter4uchi/dga-icons';

export function Button() {
  return <dga-icon name="add" variant="fill" size={20} />;
}
```

### React 19+

React 19 は Custom Elements の型付けを `CustomElements` インターフェース経由で行います。本パッケージはこちらにも登録済みなので、追加設定なしで補完が効きます。

### Vue 3（Volar）

`tsconfig.json` の `compilerOptions.types` に追加：

```json
{
  "compilerOptions": {
    "types": ["@ter4uchi/dga-icons"]
  }
}
```

`vite.config.ts` で `dga-` で始まるタグを Custom Element として扱うよう指定：

```ts
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [
    vue({
      template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('dga-') } },
    }),
  ],
};
```

```vue
<script setup lang="ts">
import '@ter4uchi/dga-icons';
</script>

<template>
  <dga-icon name="house" variant="line" :size="24" />
</template>
```

### Svelte 5

`svelte.config.js` で Custom Element として許可：

```js
export default {
  compilerOptions: {
    customElement: false,
  },
  // svelte 5 は未知の HTML タグを警告するのみで動作する
};
```

型補完は本パッケージの `svelteHTML` 拡張で自動対応。

```svelte
<script lang="ts">
  import '@ter4uchi/dga-icons';
</script>

<dga-icon name="house" variant="line" size="24" />
```

### Angular

`AppModule`（または standalone component）で `CUSTOM_ELEMENTS_SCHEMA` を追加：

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@ter4uchi/dga-icons';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

### 素の HTML + VSCode

`.vscode/settings.json` にカスタム HTML data を登録すると、タグ名・属性値の補完が効きます。

```json
{
  "html.customData": ["./node_modules/@ter4uchi/dga-icons/types/vscode.html-custom-data.json"]
}
```

## SSR（Next.js など）

`HTMLElement` が未定義でも import 時に落ちないよう、基底クラスは条件付きで解決します。ただし実際の描画はブラウザでのみ行われます（`customElements.define` がブラウザにしか存在しないため）。

## IconName 一覧

`IconName` 型は 60 種。型補完でそのまま確認できます。実値は `svg/` 配下のファイル名（末尾の `_fill` / `_line` を除いたもの）と一致。

## ライセンス

このパッケージは 2 種類のライセンスを含みます。

### コード（`src/`, `scripts/`, `types/`, `tests/`, および `dist/` のうち SVG 文字列以外）

[MIT License](./LICENSE)

### アイコン素材（`svg/` および `dist/` に埋め込まれた SVG 文字列）

[「イラストレーション・アイコン素材」](https://www.digital.go.jp/policies/servicedesign/designsystem/Illustration_Icons)（デジタル庁）を加工して利用しています。

- 原典ライセンス：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- 配布規約：[イラストレーション・アイコン素材利用規約](https://www.digital.go.jp/policies/servicedesign/designsystem/Illustration_Icons/terms_of_use)（デジタル庁）

原典 SVG に対し、`fill="#1A1A1C"` を `fill="currentColor"` に置換、ルート `<svg>` の `width` / `height` 属性を除去、JavaScript 文字列としてバンドルへ埋め込む処理を行っています。アイコンのパスデータ（`<path d="...">`）は変更していません。

詳細は [LICENSE-ICONS](./LICENSE-ICONS) を参照してください。デジタル庁が作成したかのような表示で利用しないようご注意ください。
