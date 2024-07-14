import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import FileUpload from './components/Dashboard/FileUpload';
import FileContentViewer from './components/FileContentViewer';
import Signup from './components/Signup';

const App: React.FC = () => {
  const storageAccountUrl = "https://storagecentercsvfiles.blob.core.windows.net";
  const sasToken = "sp=racwdli&st=2024-07-14T13:05:30Z&se=2024-07-25T21:05:30Z&sv=2022-11-02&sr=c&sig=vF7VkSkwvt9gGCzF789RKtQmY1bMz66ie89dJN758H8%3D";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="file-upload" element={<FileUpload storageAccountUrl={storageAccountUrl} sasToken={sasToken} />} />
         
        </Route>
        <Route path="file-viewer/:fileName" element={<FileContentViewer />} />
      </Routes>
    </Router>
  );
};

export default App;
