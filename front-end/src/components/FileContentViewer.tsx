import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';
import { parse } from 'papaparse';
import { Box, Typography } from '@mui/material';

interface RouteParams {
  fileName: string;
  [key: string]: string | undefined;
}

const FileContentViewer: React.FC = () => {
  const { fileName } = useParams<RouteParams>();
  const [fileContent, setFileContent] = useState<any[] | null>(null);
  const history = useNavigate();

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!fileName) {
        console.error("fileName is undefined");
        alert("File name is not provided.");
        history('/'); 
        return;
      }

      const storageAccountUrl = "https://storagecentercsvfiles.blob.core.windows.net";
      const sasToken = "sp=racwdli&st=2024-07-14T04:07:38Z&se=2024-07-14T12:07:38Z&sv=2022-11-02&sr=c&sig=qZY2UqGi0S1J2Qb%2BCRzLmmSJB3CyQ3G9iU6qPE66Q38%3D";
      const blobServiceClient = new BlobServiceClient(`${storageAccountUrl}?${sasToken}`);
      const containerClient = blobServiceClient.getContainerClient("1st-storage-for-csv");
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      try {
        const downloadResponse = await blockBlobClient.download();
        const blob = await downloadResponse.blobBody?.then(body => body);

        if (blob) {
          const text = await blob.text();
          const parsedData = parse(text, { header: true }).data; 
          setFileContent(parsedData); 
        } else {
          console.error("Blob is undefined");
          alert("Failed to download file content.");
          history('/'); 
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download file.");
        history('/'); 
      }
    };

    fetchFileContent();
  }, [fileName, history]);

  return (
 
  <>
      {fileContent && (
  
          <pre>{JSON.stringify(fileContent, null, 2)}</pre>
        
      )}
</>
  );
};

export default FileContentViewer;
