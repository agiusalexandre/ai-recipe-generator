import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

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

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });

async function callBedrockAgent(prompt: string): Promise<string> {
    const input = {
        modelId: "anthropic.claude-v2",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            prompt: `Human: ${prompt}\n\nAssistant:`,
            max_tokens_to_sample: 300,
            temperature: 0.7,
            top_p: 1,
        }),
    };

    try {
        const command = new InvokeModelCommand(input);
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        return responseBody.completion;
    } catch (error) {
        console.error("Error calling Bedrock agent:", error);
        throw error;
    }
}

export async function lambdaHandler(event: Event): Promise<LambdaResponse> {
    const { agent, actionGroup, function: functionName, parameters = [] } = event;

    console.log(`Received event: ${JSON.stringify(event)}`);

    //const prompt = `Analyze the following vehicle information and provide insights: ${JSON.stringify(parameters)}`;
    const prompt = "I want to get the price of a minor damage for suv on the bumper"
    const bedrockResponse = await callBedrockAgent(prompt);

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
