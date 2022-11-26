// import message from '@gaoding/gd-antd-plus/es/message';
// import { Store } from 'vuex';

import type { State } from '../store';

declare module '@vue/runtime-core' {
    // type definition for `this.$store`
    interface ComponentCustomProperties {
        // $store: Store<State>;
        // $message: typeof message;
    }
}
