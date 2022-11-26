// read more https://github.com/vuejs/vue-next/pull/3399

declare module 'vue' {
    // type definition for global component
    export interface GlobalComponents {
        // GButton: typeof import('@gaoding/gd-antd-plus/es')['Button'];
    }
}

export {};
