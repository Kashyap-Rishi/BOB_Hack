import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DataVisualizer from './components/Dashboard/DataVisualizer';
import FileUpload from './components/Dashboard/FileUpload';
import FileContentViewer from './components/FileContentViewer';
import Signup from './components/Signup';

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="file-upload" element={<FileUpload  />} />
          <Route path="data-visualizer" element={<DataVisualizer  />} />
        </Route>
        <Route path="file-viewer/:fileName" element={<FileContentViewer />} />
      </Routes>
    </Router>
  );
};

export default App;
