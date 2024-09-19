import React, { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "../App.css";
import { Box } from "@mui/material";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "@aws-amplify/ui-react/styles.css";


const client = generateClient<Schema>({
    authMode: "userPool",
});

const HomePage: React.FC = () => {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);


    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);

            const { data, errors } = await client.queries.askBedrock({
                ingredients: [formData.get("ingredients")?.toString() || ""],
            });

            if (!errors) {
                setResult(data?.body || "No data returned");
            } else {
                console.log(errors);
            }

        } catch (e) {
            console.error('Error in onSubmit:', e);
            if (e instanceof Error) {
                setResult(`An error occurred: ${e.message}`);
            } else {
                setResult('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }


    };

    return (
        <div className="app-container">
            <div className="header-container">
                <h1 className="main-header">
                    Meet Your Personal
                    <br />
                    <span className="highlight">Recipe AI</span>
                </h1>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <p className="description">
                    Simply type a few ingredients using the format ingredient1,
                    ingredient2, etc., and Recipe AI will generate an all-new recipe on
                    demand...
                </p>
                <form onSubmit={onSubmit} className="form-container">
                    <div className="search-container">
                        <input
                            type="text"
                            className="wide-input"
                            id="ingredients"
                            name="ingredients"
                            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
                        />
                        <button type="submit" className="search-button">
                            Generate
                        </button>
                    </div>
                </form>
                <div className="result-container">
                    {loading ? (
                        <div className="loader-container">
                            <p>Loading...</p>
                            <Loader size="large" />
                            <Placeholder size="large" />
                            <Placeholder size="large" />
                            <Placeholder size="large" />
                        </div>
                    ) : (
                        result && <p className="result">{result}</p>
                    )}
                </div>
            </Box>
        </div>
    );
};

export default HomePage;