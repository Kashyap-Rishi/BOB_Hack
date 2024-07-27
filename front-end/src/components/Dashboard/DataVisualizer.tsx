import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import ChatInterface from '../chat/ChatInterface';

const DataVisualizer: React.FC = () => {
  const [file, setFile] = useState<File | { name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileSelected = (selectedFile: File | { name: string }) => {
    setFile(selectedFile);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <ChatInterface isActive={!!file} isProcessing={isProcessing} onFileSelected={handleFileSelected} />
      </Box>
    </Container>
  );
};

export default DataVisualizer;
