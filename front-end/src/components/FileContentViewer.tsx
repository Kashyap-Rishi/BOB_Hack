import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';
import { parse } from 'papaparse';

interface RouteParams {
  [key: string]: string | undefined;
}

interface DataRow {
  [key: string]: string | number;
}

const FileContentViewer: React.FC = () => {
  const { fileName } = useParams<RouteParams>();
  const [fileContent, setFileContent] = useState<DataRow[] | null>(null);
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
        const downloadResponse = await blockBlobClient.download();
        const blob = await downloadResponse.blobBody?.then(body => body);

        if (blob) {
          const text = await blob.text();
          const parsedData = parse(text, { header: true }).data;
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setFileContent(parsedData as DataRow[]);
          } else {
            console.error("Parsed data is not in the expected format.");
            setError("Parsed data is not in the expected format.");
          }
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

  const renderTable = () => {
    if (!fileContent || fileContent.length === 0) return null;

    const headers = Object.keys(fileContent[0]);

    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header} style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fileContent.map((row, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header} style={{ border: '1px solid black', padding: '8px' }}>
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {renderTable()}
    </>
  );
};

export default FileContentViewer;
