import json
from typing import Any, Dict, List, Optional

# Use a type alias for better readability and maintainability
DamagePriceData = Dict[str, Dict[str, Dict[str, int]]]

# Sample damage price dictionary (can be modified as per real pricing rules)
damage_price_data: DamagePriceData = {
    "sedan": {
        "door": {"minor": 100, "major": 300, "total": 1000},
        "window": {"minor": 50, "major": 200, "total": 500},
        "bumper": {"minor": 150, "major": 400, "total": 1200}
    },
    "suv": {
        "door": {"minor": 120, "major": 350, "total": 1100},
        "window": {"minor": 60, "major": 220, "total": 550},
        "bumper": {"minor": 180, "major": 450, "total": 1300}
    },
    # Add more vehicle categories and parts as needed
}

def get_vehicle_damage_price(vehicle_category: str, vehicle_part: str, vehicle_damage_severity: str) -> Optional[int]:
    """Retrieve the price for the given vehicle part, category, and damage severity."""
    try:
        return damage_price_data[vehicle_category][vehicle_part][vehicle_damage_severity]
    except KeyError:
        print(f"Error: Invalid category '{vehicle_category}', part '{vehicle_part}', or severity '{vehicle_damage_severity}'.")
        return None

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    agent = event['agent']
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])
    
    print(f"Processed vehicule parameters: {parameters}")
    
    # Check if 'messageVersion' exists in the event
    if 'messageVersion' not in event:
        raise KeyError("The 'messageVersion' key is missing in the event object")

    # Processing each vehiculePart from parameters
    parts_info = []
    for param in parameters:
        
        if param['name'] == 'vehiculePart':
            vehicule_part = param['value'].lower()
            print(f"Processed vehicule part: {vehicule_part}")
        
        if param['name'] == 'vehiculeCategory':
            vehicule_category = param['value'].lower()
            print(f"Processed vehicule category: {vehicule_category}")
        
        if param['name'] == 'vehiculeDamageSeverity':
            vehicule_damage_severity = param['value'].lower()
            print(f"Processed vehicule damage severity: {vehicule_damage_severity}")
        
        # Ensure all necessary parameters are available before proceeding
        if 'vehicule_part' in locals() and 'vehicule_category' in locals() and 'vehicule_damage_severity' in locals():
            # Get the damage price for the vehicule part
            damage_price = get_vehicle_damage_price(vehicule_category, vehicule_part, vehicule_damage_severity)
            print(f"Processed vehicule parameters damage_price: {damage_price}")
            
            # Add the part info with damage price to the list
            print(f"Processed vehicule parts before: {json.dumps(parts_info)}")
            parts_info.append({
                "vehiculePart": vehicule_part,
                "vehiculeCategory": vehicule_category,
                "vehiculeDamageSeverity": vehicule_damage_severity,
                "vehiculeDamagePrice": damage_price
            })


    # Example of logging all parts info
    print(f"Processed vehicule parts after: {json.dumps(parts_info)}")

    # Business logic execution
    response_body = {
        "TEXT": {
            "body": f"The function {function} was called successfully!"
        },
        "PartsProcessed": parts_info
    }

    # Prepare the response
    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': response_body
        }
    }
    
    session_attributes = event['sessionAttributes']
    prompt_session_attributes = event['promptSessionAttributes']

    # Prepare final dummy response
    action_response = {
        'messageVersion': '1.0', 
        'response': action_response,
        'sessionAttributes': session_attributes,
        'promptSessionAttributes': prompt