import React, { useState } from "react";
import { Box } from "@mui/material";
import "../App.css";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import "@aws-amplify/ui-react/styles.css";

const UploadPage: React.FC = () => {
    const [uploadedFiles] = useState<string[]>([]);
    return (
        <div className="app-container">
            <div className="header-container">
                <h1 className="main-header">
                    Meet Your Personal
                    <br />
                    <span className="highlight">Recipe AI</span>
                </h1>
            </div>
            <Box>

                <div>
                    <h2>Upload and View Images</h2>
                    <FileUploader
                        acceptedFileTypes={['image/*']}
                        path="media/{entity_id}/"
                        maxFileCount={4}
                        isResumable
                        autoUpload={false}
                    />
                    {uploadedFiles.length > 0 && (
                        <div>
                            <h3>Uploaded Images:</h3>
                            <ul>
                                {uploadedFiles.map((file, index) => (
                                    <li key={index}>{file}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

            </Box>
        </div>
    );
};

export default UploadPage;