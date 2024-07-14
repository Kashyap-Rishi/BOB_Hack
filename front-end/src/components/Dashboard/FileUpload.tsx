import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, List, ListItem, ListItemText, Container, Paper, Divider, IconButton, Tooltip, Snackbar } from '@mui/material';
import { BlobServiceClient } from '@azure/storage-blob';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface FileUploadProps {
  storageAccountUrl: string;
  sasToken: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ storageAccountUrl, sasToken }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const blobServiceClient = new BlobServiceClient(`${storageAccountUrl}?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient("1st-storage-for-csv");

    try {
      const blobs: string[] = [];
      for await (const blob of containerClient.listBlobsFlat()) {
        blobs.push(blob.name);
      }
      setFiles(blobs);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Failed to fetch files.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    const blobServiceClient = new BlobServiceClient(`${storageAccountUrl}?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient("1st-storage-for-csv");
    const blockBlobClient = containerClient.getBlockBlobClient(selectedFile.name);

    try {
      await blockBlobClient.uploadBrowserData(selectedFile);
      alert("File uploaded successfully!");
      fetchFiles(); // Refresh file list after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  const handleFileClick = (fileName: string) => {
    navigate(`/file-viewer/${fileName}`);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleCopyUrl = (fileName: string) => {
    const url = `http://localhost:5173/file-viewer/${fileName}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess('URL copied to clipboard');
      setTimeout(() => setCopySuccess(null), 3000);
    }, (err) => {
      console.error("Failed to copy URL: ", err);
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>File Upload</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{ border: '2px dashed #ccc', p: 4, mb: 4, width: '100%', textAlign: 'center', cursor: 'pointer' }}
        >
          <input
            accept=".csv,.xlsx,.xls,.txt,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Typography variant="body1" sx={{ mb: 2 }}>Drag and drop files here, or click to select files</Typography>
            <Button variant="contained" component="span" sx={{ mb: 2,         backgroundColor: "#7AB2B2",
            "&:hover": {
              backgroundColor: "#4D869C",
            }, }}>
              Choose File
            </Button>
          </label>
          {selectedFile && <Typography variant="body1" sx={{ mb: 2 }}>{selectedFile.name}</Typography>}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleFileUpload} 
            disabled={!selectedFile}
            sx={{ mt: 2 }}
          >
            Upload
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom>Files in Container</Typography>
        <List component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <span style={{ cursor: 'pointer' }} onClick={() => handleFileClick(file)}>
                    {file} (JSON formatted)
                  </span>
                }
                secondary={
                  <span style={{ cursor: 'pointer' }} onClick={() => handleFileClick(file)}>
                    {`http://localhost:5173/file-viewer/${file}`}
                  </span>
                }
              />
              <Tooltip title="Copy URL">
                <IconButton edge="end" onClick={() => handleCopyUrl(file)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Snackbar
        open={copySuccess !== null}
        message={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(null)}
      />
    </Container>
  );
};

export default FileUpload;
