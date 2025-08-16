import React from 'react';
import type { FigmaFile } from '../types';
import { FileViewer } from './FileViewer';

interface Props {
  selectedFile: FigmaFile | null;
}

export const MainContent: React.FC<Props> = ({ selectedFile }) => {
  return (
    <main className="content">
      {selectedFile ? (
        <FileViewer file={selectedFile} />
      ) : (
        <div className="empty-placeholder">Select a file from the list to view its details.</div>
      )}
    </main>
  );
};
