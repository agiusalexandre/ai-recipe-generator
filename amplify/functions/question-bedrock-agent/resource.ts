import {defineFunction} from '@aws-amplify/backend';

export const bedrockAgentDamageMatrix = defineFunction({
    name: 'question-bedrock-agent',
    entry: "./handler.ts",
    timeoutSeconds: 300,
    environment: {
    },
});