import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import "../App.css";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "@aws-amplify/ui-react/styles.css";


const client = generateClient<Schema>({
    authMode: "userPool",
});

const PersistPage: React.FC = () => {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        client.models.Todo.create({ content: window.prompt("Todo content") });
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id })
    }

    return (
        <div className="app-container">
            <div className="header-container">
                <h1 className="main-header">
                    Meet Your Personal
                    <br />
                    <span className="highlight">Vehicule AI</span>
                </h1>
            </div>
            <Box>
                <div>
                    <h1>My vehicule informations</h1>
                    <button onClick={createTodo}>+ new</button>
                    <ul>
                        {todos.map((todo) => (
                            <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content}</li>
                        ))}
                    </ul>
                </div>
            </Box>
        </div>
    );
};

export default PersistPage;