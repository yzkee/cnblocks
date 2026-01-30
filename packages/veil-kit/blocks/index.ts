export const veilKitBlockMap = {
    'hero-section': {
        one: () => import('./hero-section/one').then((mod) => mod.default),
        two: () => import('./hero-section/two').then((mod) => mod.default),
        three: () => import('./hero-section/three').then((mod) => mod.default),
        four: () => import('./hero-section/four').then((mod) => mod.default),
    },
}
