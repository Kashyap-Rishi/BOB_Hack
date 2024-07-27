import React, { useState, ChangeEvent } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import WarningIcon from '@mui/icons-material/Warning';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatInterfaceProps {
  isActive: boolean;
  isProcessing: boolean;
  onFileSelected: (file: File | { name: string }) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isActive, isProcessing, onFileSelected }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
        setFileUploaded(true);
      }
    },
    noClick: true,
    noKeyboard: true,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
      setFileUploaded(true);
    }
  };

  const handleSend = () => {
    if (input.trim() && isActive && !isProcessing) {
      const userMessage: Message = { sender: 'user', text: input };
      setMessages([...messages, userMessage]);

      setTimeout(() => {
        const botResponse: Message = { sender: 'bot', text: `Received: ${input}` };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);

      setInput('');
    }
  };

  return (
    <>
          {!isActive && !fileUploaded && !isProcessing && (

    <Box
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}
    {...getRootProps()}
    style={{
      border: isDragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
      borderRadius: 4,
      padding: 20,
      width: '100%',
      textAlign: 'center',
      cursor: 'pointer',
    }}
  >
    <input {...getInputProps()} type="file" hidden onChange={handleFileUpload} />
    <Typography variant="h6" gutterBottom>
      {isDragActive ? 'Drop the file here...' : 'Drag or Upload a File'}
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
      <input type="file" hidden onChange={handleFileUpload} />
    </Button>
  </Box>

)}
    <Box sx={{ position: 'relative' }}>
      <Typography variant="h6">Chat Interface</Typography>
      {isProcessing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ marginLeft: 2 }}>Processing...</Typography>
        </Box>
      ) : (
        <Paper sx={{ height: 300, overflowY: 'scroll', padding: 2, marginBottom: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                padding: 1,
              }}
            >
              <Typography variant="body2">
                <strong>{msg.sender}:</strong> {msg.text}
              </Typography>
            </Box>
          ))}
          {!isActive && !fileUploaded && !isProcessing && (
            <Box sx={{ textAlign: 'center', padding: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}>
                Graphs, metrics, statistics - Get whatever you want for your data
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
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        sx={{ marginBottom: 2 }}
        disabled={!isActive || isProcessing}
        style={{ cursor: !isActive || isProcessing ? 'not-allowed' : 'text' }}
      />
      <Button
        variant="contained"
        onClick={handleSend}
        fullWidth
        disabled={!isActive || isProcessing}
      >
        Send
      </Button>
      {!isActive && !fileUploaded && !isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <WarningIcon sx={{ color: 'red', fontSize: 20, marginRight: 1 }} />
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
