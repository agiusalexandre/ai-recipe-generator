
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { generateClient } from 'aws-amplify/data';
import { Schema } from "../../data/resource";


interface Parameter {
    name: string;
    value: string;
}

interface Event {
    agent: string;
    actionGroup: string;
    function: string;
    parameters: Parameter[];
    sessionAttributes: any;
    promptSessionAttributes: any;
}

interface ResponseBody {
    TEXT: {
        body: string;
    };
}

interface ActionResponse {
    actionGroup: string;
    function: string;
    functionResponse: {
        responseBody: ResponseBody;
    };
}

interface LambdaResponse {
    response: ActionResponse;
    sessionAttributes: any;
    promptSessionAttributes: any;
}

const graphQLClient = generateClient<Schema>();

const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });

export const invokeBedrockAgent = async (prompt: string, sessionId: string) => {
    const agentId = "QKMXJOKB1B";
    const agentAliasId = "TCBWDMQJEH";


    const command = new InvokeAgentCommand({
        agentId,
        agentAliasId,
        sessionId,
        inputText: prompt,
    });

    try {
        let completion = "";
        const response = await client.send(command);

        if (response.completion === undefined) {
            throw new Error("Completion is undefined");
        }

        for await (let chunkEvent of response.completion) {
            if (chunkEvent.chunk) {
                const chunk = chunkEvent.chunk;
                console.log(chunk);
                // @ts-ignore
                const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
                completion += decodedResponse;
                const message = {
                    channelName: "genaiagent",
                    content: decodedResponse,
                };
                await graphQLClient.mutations.publish(message);
            } else if (!chunkEvent.chunk) {
                console.log('Message: stop_publish');
                const message = {
                    channelName: "genaiagent",
                    content: "stop_publish",
                };
                await graphQLClient.mutations.publish(message);

            }
        }

        return { sessionId: sessionId, completion };
    } catch (err) {
        console.error(err);
    }
};

export async function lambdaHandler(event: Event): Promise<LambdaResponse> {
    const { agent, actionGroup, function: functionName, parameters = [] } = event;

    console.log(`Received event: ${JSON.stringify(event)}`);

    //const prompt = `Analyze the following vehicle information and provide insights: ${JSON.stringify(parameters)}`;
    const prompt = "I want to get the price of a minor damage for suv on the bumper"
    const bedrockResponse = await invokeBedrockAgent(prompt, "sessionId");

    console.log(`Bedrock agent response: ${bedrockResponse}`);

    const responseBody: ResponseBody = {
        TEXT: {
            body: `Bedrock agent analysis: ${bedrockResponse}`
        }
    };

    const actionResponse: ActionResponse = {
        actionGroup,
        function: functionName,
        functionResponse: {
            responseBody
        }
    };

    const lambdaResponse: LambdaResponse = {
        response: actionResponse,
        sessionAttributes: event.sessionAttributes,
        promptSessionAttributes: event.promptSessionAttributes
    };

    console.log(`Lambda response: ${JSON.stringify(lambdaResponse)}`);

    return lambdaResponse;
}

export const handler = lambdaHandler;
