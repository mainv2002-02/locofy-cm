import React from 'react';
import type { FigmaFile } from '../types';
import { UploadForm } from './UploadForm';
import { FilesList } from './FilesList';

interface Props {
  files: FigmaFile[];
  selectedFile: FigmaFile | null;
  onFileSelect: (file: FigmaFile) => void;
  onFileDelete: (fileId: string) => void;
  onUploadSuccess: () => void;
  loading: boolean;
  error: string | null;
}

export const Sidebar: React.FC<Props> = (props) => {
  return (
    <aside className="sidebar">
      <UploadForm onUploadSuccess={props.onUploadSuccess} />
      <FilesList
        files={props.files}
        selectedFileId={props.selectedFile?.id || null}
        onFileSelect={props.onFileSelect}
        onFileDelete={props.onFileDelete}
        loading={props.loading}
        error={props.error}
      />
    </aside>
  );
};
