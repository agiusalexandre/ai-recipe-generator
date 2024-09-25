import type { Handler } from 'aws-lambda';
import {
    BedrockRuntimeClient, ConverseStreamCommand, ConverseStreamCommandInput,
} from "@aws-sdk/client-bedrock-runtime";
import { generateClient } from 'aws-amplify/data';
import { Amplify } from "aws-amplify";
import amplifyConfig from '../../../amplify_outputs.json';
import {Schema} from "../../data/resource";


Amplify.configure(amplifyConfig)
const graphQLClient = generateClient<Schema>();
const ANALYSE_ANSWER_MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"
const client = new BedrockRuntimeClient({region: "us-west-2"});

export const handler: Handler = async (event, context) => {
    console.log(JSON.stringify(event));
    const prompt = event.arguments.prompt;

    const conversation = [
        {
            role: "user",
            content: [{ text: prompt }],
        },
    ];

    const input = {
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        messages: conversation,
        inferenceConfig: {
            maxTokens: 1000,
        }
    } as ConverseStreamCommandInput;

    const command = new ConverseStreamCommand(input);
    const response = await client.send(command);

    console.log(`Response: ${JSON.stringify(response)}`);

    try {
        // @ts-ignore
        for await (const item of response.stream) {
            if (item.contentBlockDelta) {
                const message = {
                    channelName: "genai",
                    content: item.contentBlockDelta.delta?.text,
                } ;
                console.log(`Message: ${JSON.stringify(message)}`);
                // @ts-ignore
                await graphQLClient.mutations.publish(message);
            }
        };
        return `RES: OK`;
    } catch (e) {
        return `RES: ${e}`;
    }

};