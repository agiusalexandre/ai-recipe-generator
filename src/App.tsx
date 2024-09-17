import React, { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import { Tabs, Tab, Box } from "@mui/material";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { FileUploader } from '@aws-amplify/ui-react-storage';



import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [uploadedFiles] = useState<string[]>([]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const { data, errors } = await amplifyClient.queries.askBedrock({
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
        <Tabs 
          value={tabValue}
          onChange={handleTabChange} 
          aria-label="app tabs"
          sx={{
            '& .MuiTab-root': { color: 'grey' },
            '& .Mui-selected': { color: 'primary.main', fontWeight: 'bold' },
          }}
        >
          <Tab label="Generate Recipe" />
          <Tab label="Upload Images" />
          <Tab label="About" />
        </Tabs>
      </Box>
      <Box sx={{ padding: 2 }}>
        {tabValue === 0 && (
          <>
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
          </>
        )}
        {tabValue === 1 && (
          <div>
            <h2>Upload and View Images</h2>
            <FileUploader
              acceptedFileTypes={['image/*']}
              path="media/*"
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
        )}
        {tabValue === 2 && (
          <p>Recipe AI is your personal cooking assistant powered by artificial intelligence.</p>
        )}
      </Box>
    </div>
  );
}

export default App;