import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface FileUploadOrSelectProps {
  onFileSelected: (file: File | { name: string }) => void;
}

const FileUploadOrSelect: React.FC<FileUploadOrSelectProps> = ({ onFileSelected }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    noClick: true,
    noKeyboard: true,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
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
        </Button>
     
    </Box>
  );
};

export default FileUploadOrSelect;
