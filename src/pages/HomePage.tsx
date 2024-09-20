import React, { FormEvent, useState } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";


const client = generateClient<Schema>({
    authMode: "userPool",
});

const HomePage: React.FC = () => {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState("");

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, errors } = await client.queries.askBedrock({
                ingredients: [ingredients],
            });

            if (!errors) {
                setResult(data?.body || "No data returned");
            } else {
                setError("An error occurred while generating the recipe. Please try again.");
                console.log(errors);
            }
        } catch (e) {
            console.error('Error in onSubmit:', e);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setIngredients("");
        setResult("");
        setError(null);
    };

    return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Meet Your Personal
                <br />
                <Typography component="span" variant="h2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    Vehicule AI
                </Typography>
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Simply type a few vehiocule information, and Vehicule AI will generate recommandation just for you!
            </Typography>
            <Box component="form" onSubmit={onSubmit} sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    id="ingredients"
                    name="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Vehicule Type, Transmission Type, Favorites Brand"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    inputProps={{
                        'aria-label': 'Enter ingredients',
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading || !ingredients.trim()}
                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        sx={{ 
                            py: 1.5, 
                            px: 4, 
                            fontSize: '1.1rem',
                            '&:hover': { 
                                backgroundColor: 'secondary.main',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'Generating...' : 'Generate Recommandations'}
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={handleClear}
                        disabled={loading}
                        sx={{ 
                            py: 1.5, 
                            px: 4, 
                            fontSize: '1.1rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Creating your recipe...</Typography>
                        <CircularProgress size={60} thickness={4} />
                    </Box>
                ) : (
                    result && (
                        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
                            <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                                {result}
                            </Typography>
                        </Paper>
                    )
                )}
            </Box>
        </Box>
    );
};

export default HomePage;