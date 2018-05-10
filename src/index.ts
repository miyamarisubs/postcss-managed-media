import * as postcss from 'postcss';

import plugin from './plugin';

/* language=PostCSS */
const code = String.raw`
    @managed-media --touch;
    @managed-media --light;
    @managed-media --dark;

    @media (--touch) {
        .touch {}
    }
`;

(async () => {
    console.log((await postcss([plugin]).process(code, { from: undefined })).css);
})();
