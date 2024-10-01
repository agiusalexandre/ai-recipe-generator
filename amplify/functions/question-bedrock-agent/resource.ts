import {defineFunction} from '@aws-amplify/backend';

export const bedrockAgentDamageMatrixFunction = defineFunction({
    name: 'question-bedrock-agent',
    entry: "./handler.ts",
    timeoutSeconds: 300,
    environment: {
    },
});