import { useState, useEffect } from 'react';
import './App.css';
import { api } from './api';
import type { FigmaFile } from './types';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

function App() {
  const [figmaFiles, setFigmaFiles] = useState<FigmaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<FigmaFile | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFigmaFiles = async () => {
    setLoadingFiles(true);
    setError(null);
    try {
      const files: FigmaFile[] = await api.getFigmaFiles();
      setFigmaFiles(files);
    } catch (err) {
      setError('Failed to fetch Figma files.');
      console.error(err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchFigmaFiles();
  }, []);

  const handleFileSelect = (file: FigmaFile) => {
    if (selectedFile?.id !== file.id) {
      setSelectedFile(file);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await api.deleteFigmaFile(fileId);
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      await fetchFigmaFiles();
    } catch (err) {
      alert('Failed to delete file.');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Figma Component Inspector</h1>
      </header>
      <div className="main-container">
        <Sidebar
          files={figmaFiles}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFileDelete={handleDeleteFile}
          onUploadSuccess={fetchFigmaFiles}
          loading={loadingFiles}
          error={error}
        />
        <MainContent selectedFile={selectedFile} />
      </div>
    </div>
  );
}

export default App;
