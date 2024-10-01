// Type definitions
type DamageSeverity = 'minor' | 'major' | 'total';
type VehiclePart = 'door' | 'window' | 'bumper';
type VehicleCategory = 'sedan' | 'suv';

interface DamagePriceData {
    [category: string]: {
        [part: string]: {
            [severity: string]: number;
        };
    };
}

interface Parameter {
    name: string;
    value: string;
}

interface Event {
    agent: string;
    actionGroup: string;
    function: string;
    parameters: Parameter[];
    messageVersion?: string;
    sessionAttributes: any;
    promptSessionAttributes: any;
}

interface PartInfo {
    vehiculePart: string;
    vehiculeCategory: string;
    vehiculeDamageSeverity: string;
    vehiculeDamagePrice: number | null;
}

interface ResponseBody {
    TEXT: {
        body: string;
    };
    PartsProcessed: PartInfo[];
}

interface ActionResponse {
    actionGroup: string;
    function: string;
    functionResponse: {
        responseBody: ResponseBody;
    };
}

interface LambdaResponse {
    messageVersion: string;
    response: ActionResponse;
    sessionAttributes: any;
    promptSessionAttributes: any;
}

// Sample damage price data
const damagePriceData: DamagePriceData = {
    sedan: {
        door: { minor: 100, major: 300, total: 1000 },
        window: { minor: 50, major: 200, total: 500 },
        bumper: { minor: 150, major: 400, total: 1200 }
    },
    suv: {
        door: { minor: 120, major: 350, total: 1100 },
        window: { minor: 60, major: 220, total: 550 },
        bumper: { minor: 180, major: 450, total: 1300 }
    }
};

function getVehicleDamagePrice(
    vehicleCategory: VehicleCategory,
    vehiclePart: VehiclePart,
    vehicleDamageSeverity: DamageSeverity
): number | null {
    try {
        return damagePriceData[vehicleCategory][vehiclePart][vehicleDamageSeverity];
    } catch (error) {
        console.error(`Error: Invalid category '${vehicleCategory}', part '${vehiclePart}', or severity '${vehicleDamageSeverity}'.`);
        return null;
    }
}

export function lambdaHandler(event: Event): LambdaResponse {
    const { agent, actionGroup, function: functionName, parameters = [] } = event;

    console.log(`Processed vehicle parameters: ${JSON.stringify(parameters)}`);

    if (!event.messageVersion) {
        throw new Error("The 'messageVersion' key is missing in the event object");
    }

    const partsInfo: PartInfo[] = [];
    let currentPart: Partial<PartInfo> = {};

    for (const param of parameters) {
        switch (param.name) {
            case 'vehiculePart':
                currentPart.vehiculePart = param.value.toLowerCase();
                console.log(`Processed vehicle part: ${currentPart.vehiculePart}`);
                break;
            case 'vehiculeCategory':
                currentPart.vehiculeCategory = param.value.toLowerCase();
                console.log(`Processed vehicle category: ${currentPart.vehiculeCategory}`);
                break;
            case 'vehiculeDamageSeverity':
                currentPart.vehiculeDamageSeverity = param.value.toLowerCase();
                console.log(`Processed vehicle damage severity: ${currentPart.vehiculeDamageSeverity}`);
                break;
        }

        if (currentPart.vehiculePart && currentPart.vehiculeCategory && currentPart.vehiculeDamageSeverity) {
            const damagePrice = getVehicleDamagePrice(
                currentPart.vehiculeCategory as VehicleCategory,
                currentPart.vehiculePart as VehiclePart,
                currentPart.vehiculeDamageSeverity as DamageSeverity
            );
            console.log(`Processed vehicle parameters damage_price: ${damagePrice}`);

            partsInfo.push({
                ...currentPart as PartInfo,
                vehiculeDamagePrice: damagePrice
            });

            currentPart = {};
        }
    }

    console.log(`Processed vehicle parts: ${JSON.stringify(partsInfo)}`);

    const responseBody: ResponseBody = {
        TEXT: {
            body: `The function ${functionName} was called successfully!`
        },
        PartsProcessed: partsInfo
    };

    const actionResponse: ActionResponse = {
        actionGroup,
        function: functionName,
        functionResponse: {
            responseBody
        }
    };

    const lambdaResponse: LambdaResponse = {
        messageVersion: '1.0',
        response: actionResponse,
        sessionAttributes: event.sessionAttributes,
        promptSessionAttributes: event.promptSessionAttributes
    };

    console.log(`Response: ${JSON.stringify(lambdaResponse)}`);

    return lambdaResponse;
}
