import React, { FormEvent, useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Avatar,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from "@mui/material";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { v4 as uuidv4 } from 'uuid';

const client = generateClient<Schema>({
    authMode: "userPool",
});

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    complete: boolean;
}

interface AIExpert {
    id: string;
    name: string;
    avatar: string;
    expertise: string;
}

const AI_EXPERTS: AIExpert[] = [
    { id: uuidv4(), name: "Vehicle Expert", avatar: "/avatars/vehicle-expert.png", expertise: "General vehicle knowledge" },
    { id: uuidv4(), name: "Car Mechanic", avatar: "/avatars/car-mechanic.png", expertise: "Car maintenance and repair" },
    { id: uuidv4(), name: "Green Vehicle Specialist", avatar: "/avatars/green-specialist.png", expertise: "Electric and hybrid vehicles" },
];

export function useMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        let currentMessage: Message | null = null;
        let accumulatedContent = '';

        const messageData = client.subscriptions.receive().subscribe({
            next: (event: { content: string }) => {
                console.log(event.content);

                if (event.content === 'stop_publish') {
                    if (accumulatedContent) {
                        const newMessage: Message = {
                            id: uuidv4(),
                            text: accumulatedContent,
                            sender: 'ai',
                            timestamp: new Date(),
                            complete: true,
                        };

                        setMessages(prevMessages => [...prevMessages, newMessage]);
                        accumulatedContent = ''; // Reset accumulated content
                    }
                } else {
                    accumulatedContent += event.content;

                    // Update the current message in state to show progress
                    setMessages(prevMessages => {
                        if (currentMessage) {
                            return prevMessages.map(msg =>
                                //@ts-ignore
                                msg.id === currentMessage.id
                                    ? { ...msg, text: accumulatedContent, complete: false }
                                    : msg
                            );
                        } else {
                            currentMessage = {
                                id: uuidv4(),
                                text: accumulatedContent,
                                sender: 'ai',
                                timestamp: new Date(),
                                complete: false,
                            };
                            return [...prevMessages, currentMessage];
                        }
                    });
                }
            },
        });

        return () => messageData.unsubscribe();
    }, [client]);

    return { messages, setMessages };
}

const MessageList: React.FC<{ messages: Message[], selectedExpert: AIExpert | null }> = ({ messages, selectedExpert }) => (
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
                        secondary={message.timestamp ? message.timestamp.toLocaleTimeString() : "Time not available"}
                    />
                </Paper>
            </ListItem>
        ))}
    </List>
);

const useInput = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
    return { value, onChange, setValue };
};

const handleSubmit = async (
    inputMessage: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setInputMessage: (value: string) => void,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
        id: uuidv4(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
        complete: true,
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setLoading(true);

    try {
        await client.queries.analyseAnswer({
            prompt: inputMessage,
        });
    } catch (e) {
        console.error('Error in onSubmit:', e);
    } finally {
        setLoading(false);
    }
};

const ChatPage: React.FC = () => {
    const { messages, setMessages } = useMessages();
    const inputProps = useInput("");
    const [loading, setLoading] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState<AIExpert | null>(AI_EXPERTS[0]);
    const [suggestions] = useState<string[]>([]);

    useEffect(() => {
        setSelectedExpert(AI_EXPERTS[0]);
    }, []);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit(inputProps.value, setMessages, inputProps.setValue, setLoading);
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
                        <MessageList messages={messages} selectedExpert={selectedExpert} />
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>
                    <Box component="form" onSubmit={onSubmit} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <TextField
                            fullWidth
                            {...inputProps}
                            placeholder="Type your message here"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading || !inputProps.value.trim()}
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
                                <ListItemText primary={suggestion} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChatPage;
