import React from 'react';
import type { FigmaFile } from '../types';

interface Props {
  file: FigmaFile;
  isSelected: boolean;
  onSelect: (file: FigmaFile) => void;
  onDelete: (fileId: string) => void;
}

export const FileItem: React.FC<Props> = ({ file, isSelected, onSelect, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this file and all its elements?')) {
      onDelete(file.id);
    }
  };

  return (
    <li className={isSelected ? 'selected' : ''} onClick={() => onSelect(file)}>
      <div>
        <div className="file-name">{file.name}</div>
        <div className="file-date">{new Date(file.upload_timestamp).toLocaleString()}</div>
      </div>
      <button onClick={handleDelete} className="delete-button">
        Delete
      </button>
    </li>
  );
};
