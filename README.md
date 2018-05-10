# postcss-managed-media

> Really custom media in CSS

Transpiles CSS with managed media queries to standard CSS.

## Install

```bash
$ yarn add -D postcss-managed-media
$ yarn add css-managed-media
```

## Usage

### `postcss.config.js`

```javascript
const managedMedia = require('postcss-managed-media').default;

module.exports = {
    plugins: [managedMedia],
};
```

### `styles.less`

```less
// Assuming you use both `less-loader` and `postcss-loader`.
// Also assuming you transpile LESS vars to CSS vars.

@managed-media --light;

@bg: #000;
@fg: #fff;

.page {
    background-color: @bg;
    color: @fg;
}

@media (--light) {
    @bg: #fff;
    @fg: #000;
}
```

### `media.js`

```javascript
import { setMedia } from 'css-managed-media';
import { store } from './store';

let { theme: current } = store.getState();
const setLight = setMedia('light', current === 'light');

setLight();

store.subscribe(() => {
    const { theme: next } = store.getState();

    if (current !== next) {
        current = next;
        setLight();
    }
});
```

## Roadmap

*   Discrete features (`--theme: light`, `--theme: dark`).
*   Integration with `postcss-custom-media`.
    *   Discrete custom media:
        ```css
        @custom-media --size {
            s: (max-width: 599px);
            m: (min-width: 600px) and (max-width: 1199px);
            l: (min-width: 1200px);
        }
        ```
*   `matchMedia` support.
*   Future-proof `setMedia` API. (E.g. on `CSS` global.)
*   Parametrized managed media (`--min-scrollbar-width: 10px`).

# License

MIT
