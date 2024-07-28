import React, { useState, ChangeEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import WarningIcon from "@mui/icons-material/Warning";
import { VegaLite } from "react-vega";

interface Message {
  sender: "user" | "bot";
  text: string;
  imageBase64?: string;
  vegaSpec?: any;
}

interface ChatInterfaceProps {
  isActive: boolean;
  isProcessing: boolean;
  onFileSelected: (file: File | { name: string }) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isActive,
  isProcessing,
  onFileSelected,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
        setFileUploaded(true);
        handleFileUpload(acceptedFiles[0]);
      }
    },
    noClick: true,
    noKeyboard: true,
  });

  const handleFileUpload = (file: File) => {
    const data = {
      data_url:
        "https://raw.githubusercontent.com/uwdata/draco/master/data/cars.csv",
      query: "string",
      n_goals: 2,
      library: "seaborn",
    };
  
    setLoading(true);

    fetch("https://audit-visual-fastapi.onrender.com/visualization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.image_base64_raster) {
          const botMessage: Message = {
            sender: "bot",
            text: "Here is your visualization:",
            imageBase64: data.image_base64_raster,
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
        setLoading(false);
        setFileUploaded(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
      console.log(file)
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
      setFileUploaded(true);
      handleFileUpload(file);
    }
  };

  const handleSend = () => {
    if (input.trim() && isActive && !isProcessing) {
      const userMessage: Message = { sender: "user", text: input };
      setMessages([...messages, userMessage]);

      const data = {
        data_url:
          "https://raw.githubusercontent.com/uwdata/draco/master/data/cars.csv",
        query: input.trim(),
        n_goals: 2,
        library: "altair",
      };

      setLoading(true);

      fetch("https://audit-visual-fastapi.onrender.com/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.image_base64_vega) {
            const botMessage: Message = {
              sender: "bot",
              text: "Here is your visualization:",
              vegaSpec: data.image_base64_vega,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });

      setInput("");
    }
  };

  return (
    <>
      {!isActive && !fileUploaded && !isProcessing && !loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
          {...getRootProps()}
          style={{
            border: isDragActive ? "2px dashed #1976d2" : "2px dashed #ccc",
            borderRadius: 4,
            padding: 20,
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input
            {...getInputProps()}
            type="file"
            hidden
            onChange={handleFileInputChange}
          />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? "Drop the file here..." : "Drag or Upload a File"}
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFile />}
            sx={{
              mb: 2,
              backgroundColor: "#7AB2B2",
              "&:hover": { backgroundColor: "#4D869C" },
            }}
          >
            Upload
            <input type="file" hidden onChange={handleFileInputChange} />
          </Button>
        </Box>
      )}
      <Box sx={{ position: "relative" }}>
        <Typography variant="h6">Chat Interface</Typography>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <CircularProgress />
            <Typography variant="body2" sx={{ marginLeft: 2 }}>
              Processing...
            </Typography>
          </Box>
        ) : (
          <Paper
            sx={{
              minHeight: "100vh",
              overflowY: "scroll",
              padding: 2,
              marginBottom: 2,
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  padding: 1,
                }}
              >
                <Typography variant="body2">
                  <strong>{msg.sender}:</strong> {msg.text}
                </Typography>
                {msg.imageBase64 && (
                  <Box sx={{ textAlign: "left", marginTop: 1 }}>
                    <img
                      src={`data:image/png;base64,${msg.imageBase64}`}
                      alt="visualization"
                      style={{ width: 500, height: 450 }}
                    />
                  </Box>
                )}
                {msg.vegaSpec && (
                  <Box sx={{ textAlign: "left", marginTop: 1 }}>
                    <VegaLite spec={msg.vegaSpec} actions={false} />
                  </Box>
                )}
              </Box>
            ))}
            {!isActive && !fileUploaded && !isProcessing && !loading && (
              <Box sx={{ textAlign: "center", padding: 2 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontWeight: "bold" }}
                >
                  Graphs, metrics, statistics - Get whatever you want for your
                  data
                </Typography>
              </Box>
            )}
          </Paper>
        )}
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          sx={{ marginBottom: 2 }}
          disabled={!isActive || isProcessing || loading}
          style={{
            cursor:
              !isActive || isProcessing || loading ? "not-allowed" : "text",
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          fullWidth
          disabled={!isActive || isProcessing || loading}
        >
          Send
        </Button>
        {!isActive && !fileUploaded && !isProcessing && !loading && (
          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <WarningIcon sx={{ color: "red", fontSize: 20, marginRight: 1 }} />
            <Typography variant="body2" color="red" fontWeight="bold">
              Upload a file to start the conversation.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChatInterface;
