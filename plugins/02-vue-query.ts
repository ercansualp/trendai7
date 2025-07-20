// plugins/vue-query.client.ts
import { VueQueryPlugin } from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
    console.log("vue-query.ts");
    nuxtApp.vueApp.use(VueQueryPlugin, {
        queryClientConfig: {
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 5, // 5 dakika
                    gcTime: 1000 * 60 * 10, // 10 dakika
                },
            },
        },
    });
});
