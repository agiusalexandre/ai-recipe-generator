import React, { FormEvent, useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress, Avatar, Grid, List, ListItem, ListItemText, ListItemAvatar } from "@mui/material";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>({
    authMode: "userPool",
});

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface AIExpert {
    id: number;
    name: string;
    avatar: string;
    expertise: string;
}

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedExpert, setSelectedExpert] = useState<AIExpert | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const aiExperts: AIExpert[] = [
        { id: 1, name: "Vehicle Expert", avatar: "/avatars/vehicle-expert.png", expertise: "General vehicle knowledge" },
        { id: 2, name: "Car Mechanic", avatar: "/avatars/car-mechanic.png", expertise: "Car maintenance and repair" },
        { id: 3, name: "Green Vehicle Specialist", avatar: "/avatars/green-specialist.png", expertise: "Electric and hybrid vehicles" },
    ];

    useEffect(() => {
        setSelectedExpert(aiExperts[0]);
    }, []);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!inputMessage.trim()) return;

        const newUserMessage: Message = {
            id: messages.length,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setInputMessage("");
        setLoading(true);
        setError(null);

        try {
            const { data, errors } = await client.queries.askBedrock({
                informations: [inputMessage],
            });

            if (!errors) {
                const aiResponse: Message = {
                    id: messages.length + 1,
                    text: data?.body || "I'm sorry, I couldn't generate a response.",
                    sender: 'ai',
                    timestamp: new Date(),
                };
                setMessages(prevMessages => [...prevMessages, aiResponse]);
                generateSuggestions(inputMessage);
            } else {
                setError("An error occurred while generating the response. Please try again.");
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
        setMessages([]);
        setInputMessage("");
        setError(null);
        setSuggestions([]);
    };

    const generateSuggestions = (message: string) => {
        // This is a placeholder. In a real application, you would use a more sophisticated method to generate suggestions.
        const dummySuggestions = [
            "Tell me more about electric vehicles",
            "What are the best practices for car maintenance?",
            "How can I improve my vehicle's fuel efficiency?",
        ];
        setSuggestions(dummySuggestions);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="h1">Chat with Your Personal Vehicle AI</Typography>
                {selectedExpert && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Avatar src={selectedExpert.avatar} alt={selectedExpert.name} />
                        <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1">{selectedExpert.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{selectedExpert.expertise}</Typography>
                        </Box>
                    </Box>
                )}
            </Box>
            <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Grid item xs={12} md={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                        <List>
                            {messages.map((message) => (
                                <ListItem key={message.id} sx={{ flexDirection: message.sender === 'user' ? 'row-reverse' : 'row' }}>
                                    <ListItemAvatar>
                                        <Avatar src={message.sender === 'ai' ? selectedExpert?.avatar : undefined}>
                                            {message.sender === 'user' ? 'U' : 'AI'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Paper elevation={1} sx={{ 
                                        p: 2, 
                                        maxWidth: '70%', 
                                        bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper'
                                    }}>
                                        <ListItemText 
                                            primary={message.text}
                                            secondary={message.timestamp.toLocaleTimeString()}
                                        />
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>
                    <Box component="form" onSubmit={onSubmit} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <TextField
                            fullWidth
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message here"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        disabled={loading || !inputMessage.trim()}
                                    >
                                        Send
                                    </Button>
                                ),
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' }, borderLeft: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" gutterBottom>Suggestions</Typography>
                    <List>
                        {suggestions.map((suggestion, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemText 
                                    primary={suggestion}
                                    primaryTypographyProps={{ variant: 'body2' }}
                                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                    onClick={() => setInputMessage(suggestion)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChatPage;