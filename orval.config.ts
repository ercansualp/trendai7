// orval.config.ts
import { defineConfig } from 'orval';
import { isDevelopment } from './constants/configs';

export default defineConfig({
    backendForAdminClient: {
        input: {
            target: isDevelopment ? 'http://localhost:5222/swagger/v1/swagger.json' : 'https://prod-api.trendaiapp.com/bfa/swagger/v1/swagger.json',
        },
        output: {
            mode: 'single',
            target: 'clients/api/bfaClient.ts',
            schemas: 'types/api/bfaModels.ts',
            client: 'vue-query',
            prettier: false,
            override: {
                mutator: {
                    path: 'mutators/backendForAdminMutator.ts',
                    name: 'backendForAdminClient',
                },
            },
        },
    }, 
    backendForFrontendClient: {
        input: {
            target: isDevelopment ? 'http://localhost:5271/swagger/v1/swagger.json' : 'https://prod-api.trendaiapp.com/bff/swagger/v1/swagger.json',
        },
        output: {
            mode: 'single',
            target: 'clients/api/bffClient.ts',
            schemas: 'types/api/bffModels.ts',
            client: 'vue-query',
            prettier: false,
            override: {
                mutator: {
                    path: 'mutators/backendForFrontendMutator.ts',
                    name: 'backendForFrontendClient',
                },
            },
        },
    },
});