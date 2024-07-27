import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Tooltip,
  IconButton,
  Snackbar,
  MenuItem,
  Select,
  Container,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import { BlobServiceClient } from "@azure/storage-blob";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { STORAGE_ACCOUNT_URL, SAS_TOKENS } from "../../config/config";

type ContainerKey =
  | "financialData"
  | "customerData"
  | "transactionData"
  | "loanData"
  | "fraudData";

interface FileData {
  name: string;
  url: string;
  createdTime: Date;
}

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [selectedContainer, setSelectedContainer] =
    useState<ContainerKey>("financialData");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const containers: { name: string; key: ContainerKey }[] = [
    { name: "financial-data", key: "financialData" },
    { name: "customer-data", key: "customerData" },
    { name: "transaction-data", key: "transactionData" },
    { name: "loan-data", key: "loanData" },
    { name: "fraud-data", key: "fraudData" },
  ];

  useEffect(() => {
    fetchFiles();
  }, [selectedContainer]);

  const fetchFiles = async () => {
    const blobServiceClient = new BlobServiceClient(
      `${STORAGE_ACCOUNT_URL}?${SAS_TOKENS[selectedContainer]}`
    );
    const containerClient = blobServiceClient.getContainerClient(
      containers.find((container) => container.key === selectedContainer)?.name || ""
    ); 
    try {
      const blobs: FileData[] = [];
      for await (const blob of containerClient.listBlobsFlat()) {
        const properties = await containerClient.getBlobClient(blob.name).getProperties();
        const sasTokenEncoded = encodeURIComponent(SAS_TOKENS[selectedContainer]);
        blobs.push({
          name: blob.name,
          url: `https://bob-hack.vercel.app/file-viewer/${blob.name}?container=${containers.find((container) => container.key === selectedContainer)?.name}&sasToken=${sasTokenEncoded}`,
          createdTime: properties.createdOn || new Date(),
        });
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
    const blobServiceClient = new BlobServiceClient(
      `${STORAGE_ACCOUNT_URL}?${SAS_TOKENS[selectedContainer]}`
    );
    const containerClient = blobServiceClient.getContainerClient(
      containers.find((container) => container.key === selectedContainer)
        ?.name || ""
    );
    const blockBlobClient = containerClient.getBlockBlobClient(
      selectedFile.name
    );

    try {
      await blockBlobClient.uploadBrowserData(selectedFile);
      alert("File uploaded successfully!");
      fetchFiles(); 
      setSelectedFile(null); 
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
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

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess("URL copied to clipboard");
        setTimeout(() => setCopySuccess(null), 3000);
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          File Upload
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Select Container</InputLabel>
          <Select
            value={selectedContainer}
            label="Select Container"
            onChange={(e) =>
              setSelectedContainer(e.target.value as ContainerKey)
            }
          >
            {containers.map((container, index) => (
              <MenuItem key={index} value={container.key}>
                {container.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: "2px dashed #ccc",
            p: 4,
            mb: 4,
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input
            accept=".csv"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Typography variant="body1" sx={{ mb: 2 }}>
              Drag and drop files here, or click to select files
            </Typography>
            <Button
              variant="contained"
              component="span"
              sx={{
                mb: 2,
                backgroundColor: "#7AB2B2",
                "&:hover": { backgroundColor: "#4D869C" },
              }}
            >
              Choose File
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedFile.name}
            </Typography>
          )}
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
        <Typography variant="h5" gutterBottom>
          Files in Container
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Link (JSON formatted)</TableCell>
                <TableCell>Entry Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      <Typography
                        component="a"
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: "blue", textDecoration: "underline" }}
                      >
                        {file.url}
                      </Typography>
                    </TableCell>
                    <TableCell>{file.createdTime.toLocaleString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Copy URL">
                        <IconButton onClick={() => handleCopyUrl(file.url)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
              
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={files.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        {copySuccess && (
          <Snackbar
            open={true}
            message={copySuccess}
            autoHideDuration={3000}
            onClose={() => setCopySuccess(null)}
          />
        )}
      </Paper>
    </Container>
  );
};

export default FileUpload;
