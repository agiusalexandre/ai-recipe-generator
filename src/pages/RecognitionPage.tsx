import { type ChangeEvent, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Box } from "@mui/material";
import { Schema } from "../../amplify/data/resource";
import { uploadData } from "aws-amplify/storage";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";

// Generating the client
const client = generateClient<Schema>();

type IdentifyTextReturnType = Schema["identifyText"]["returnType"];



const RecognitionPage: React.FC = () => {

    // State to hold the recognized text
    const [path, setPath] = useState<string>("");
    const [textData, setTextData] = useState<IdentifyTextReturnType>();

    // Function to handle file upload to S3 bucket
    const handleTranslate = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];

            const s3Path = "media/" + file.name;

            try {
                uploadData({
                    path: s3Path,
                    data: file,
                });

                setPath(s3Path);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Function to recognize text from the uploaded image
    const recognizeText = async () => {
        // Identifying text in the uploaded image
        const { data } = await client.queries.identifyText({
            path, // File name
        });
        setTextData(data);
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
            <Box>
                <div>
                    <h1>Amazon Rekognition Text Recognition</h1>
                    <div>
                        <input type="file" onChange={handleTranslate} />
                        <button onClick={recognizeText}>Recognize Text</button>
                        <div>
                            <h3>Recognized Text:</h3>
                            {textData}
                        </div>
                    </div>
                </div>

            </Box>
        </div>
    );
};

export default RecognitionPage;