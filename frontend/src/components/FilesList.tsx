import React from 'react';
import type { FigmaFile } from '../types';
import { FileItem } from './FileItem';

interface Props {
  files: FigmaFile[];
  selectedFileId: string | null;
  onFileSelect: (file: FigmaFile) => void;
  onFileDelete: (fileId: string) => void;
  loading: boolean;
  error: string | null;
}

export const FilesList: React.FC<Props> = ({ files, selectedFileId, onFileSelect, onFileDelete, loading, error }) => {
  return (
    <div className="file-list-section">
      <h2>Uploaded Files</h2>
      {loading && <p>Loading files...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && files.length === 0 && <p>No files uploaded yet.</p>}
      <ul>
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            isSelected={selectedFileId === file.id}
            onSelect={onFileSelect}
            onDelete={onFileDelete}
          />
        ))}
      </ul>
    </div>
  );
};
