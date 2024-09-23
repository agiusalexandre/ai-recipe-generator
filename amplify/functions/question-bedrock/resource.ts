import {defineFunction} from '@aws-amplify/backend';

export const questionEngineFunction = defineFunction({
    name: 'question-bedrock',
    entry: "./handler.ts",
    timeoutSeconds: 300,
    environment: {
    },
});