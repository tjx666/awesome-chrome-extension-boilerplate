declare module '*.vue' {
    import { defineComponent } from 'vue';
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
}

declare type StyleSheetModule = { [key: string]: string };

declare module '*.scss' {
    const exports: StyleSheetModule;
    export default exports;
}

declare module '*.svg' {
    const src: string;
    export default src;
}

declare module '*.bmp' {
    const path: string;
    export default path;
}

declare module '*.gif' {
    const path: string;
    export default path;
}

declare module '*.jpg' {
    const path: string;
    export default path;
}

declare module '*.jpeg' {
    const path: string;
    export default path;
}

declare module '*.png' {
    const path: string;
    export default path;
}