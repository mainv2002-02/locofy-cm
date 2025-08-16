import React, { useState } from 'react';
import { api } from '../api';

interface Props {
  onUploadSuccess: () => void;
}

export const UploadForm: React.FC<Props> = ({ onUploadSuccess }) => {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParseFigmaFile = async () => {
    if (!figmaUrl || !figmaToken) {
      setError('Please provide both a Figma URL and a token.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      await api.parseFigmaFile(figmaUrl, figmaToken);
      setFigmaUrl('');
      setFigmaToken('');
      onUploadSuccess();
    } catch (err) {
      setError('Failed to parse Figma file. Check the URL and token.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <h2>Upload New Figma File</h2>
      <input
        type="text"
        placeholder="Figma URL"
        value={figmaUrl}
        onChange={(e) => setFigmaUrl(e.target.value)}
      />
      <input
        type="password"
        placeholder="Figma Token"
        value={figmaToken}
        onChange={(e) => setFigmaToken(e.target.value)}
      />
      <button onClick={handleParseFigmaFile} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Parse & Upload'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
