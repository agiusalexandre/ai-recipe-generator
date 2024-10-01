import {defineFunction} from '@aws-amplify/backend';

export const bedrockAgentDamageMatrix = defineFunction({
    name: 'question-bedrock-agent',
    entry: "./handler.py",
    timeoutSeconds: 300,
    environment: {
    },
});