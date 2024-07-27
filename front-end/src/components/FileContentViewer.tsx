
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';
import { parse } from 'papaparse';

interface RouteParams {
  [key: string]: string | undefined;
}

const FileContentViewer: React.FC = () => {
  const { fileName } = useParams<RouteParams>();
  const [fileContent, setFileContent] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!fileName) {
        console.error("fileName is undefined");
        setError("File name is not provided.");
        return;
      }

      const queryParams = new URLSearchParams(location.search);
      const containerName = queryParams.get('container');
      const sasToken = queryParams.get('sasToken');

      console.log('Location search:', location.search);
      console.log('Container name:', containerName);
      console.log('SAS token:', sasToken);
  
      if (!containerName || !sasToken) {
        console.error("Container name or SAS token is missing");
        setError("Container name or SAS token is not provided.");
        return;
      }

      const decodedSasToken = decodeURIComponent(sasToken);
      const storageAccountUrl = "https://storagecentercsvfiles.blob.core.windows.net";
      const blobServiceClient = new BlobServiceClient(`${storageAccountUrl}?${decodedSasToken}`);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      try {
        console.log("Fetching file from blob URL:", blockBlobClient.url);

        const downloadResponse = await blockBlobClient.download();
        const blob = await downloadResponse.blobBody?.then(body => body);

        if (blob) {
          const text = await blob.text();
          const parsedData = parse(text, { header: true }).data;
          setFileContent(parsedData);
        } else {
          console.error("Blob is undefined");
          setError("Failed to download file content.");
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        setError("Failed to download file.");
      }
    };

    fetchFileContent();
  }, [fileName, location.search]);

  return (
    <>
      {error && <div>{error}</div>}
      {fileContent && (
        <pre>{JSON.stringify(fileContent, null, 2)}</pre>
      )}
    </>
  );
};

export default FileContentViewer;

