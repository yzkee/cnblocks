export const veilKitBlockMap = {
    'hero-section': {
        one: () => import('./hero-section/one').then((mod) => mod.default),
        two: () => import('./hero-section/two').then((mod) => mod.default),
        three: () => import('./hero-section/three').then((mod) => mod.default),
        four: () => import('./hero-section/four').then((mod) => mod.default),
    },
    'logo-cloud': {
        one: () => import('./logo-cloud/one').then((mod) => mod.default),
        two: () => import('./logo-cloud/two').then((mod) => mod.default),
    },
    features: {
        one: () => import('./features/one').then((mod) => mod.default),
        two: () => import('./features/two').then((mod) => mod.default),
        three: () => import('./features/three').then((mod) => mod.default),
    },
    integrations: {
        one: () => import('./integrations/one').then((mod) => mod.default),
        two: () => import('./integrations/two').then((mod) => mod.default),
    },
    content: {
        one: () => import('./content/one').then((mod) => mod.default),
        two: () => import('./content/two').then((mod) => mod.default),
        three: () => import('./content/three').then((mod) => mod.default),
    },
    stats: {
        one: () => import('./stats/one').then((mod) => mod.default),
        two: () => import('./stats/two').then((mod) => mod.default),
        three: () => import('./stats/three').then((mod) => mod.default),
        four: () => import('./stats/four').then((mod) => mod.default),
    },
}
