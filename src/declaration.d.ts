declare type StyleSheetModule = { [key: string]: string };

declare module '*.scss' {
    const exports: StyleSheetModule;
    export default exports;
}
