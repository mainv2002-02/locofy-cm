import React, { useState, useEffect } from 'react';
import type { FigmaFile, FigmaElement } from '../types';
import { api } from '../api';
import { ImageViewer } from './ImageViewer';
import { ElementsList } from './ElementsList';

interface Props {
  file: FigmaFile;
}

export const FileViewer: React.FC<Props> = ({ file }) => {
  const [elements, setElements] = useState<FigmaElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  useEffect(() => {
    const fetchElements = async () => {
      setLoading(true);
      setError(null);
      setElements([]);
      setSelectedElementId(null);
      setHoveredElementId(null);
      try {
        const fetchedElements: FigmaElement[] = await api.getFigmaElements(file.id);
        setElements(fetchedElements.filter(el => el.properties.absoluteBoundingBox));
      } catch (err) {
        setError('Failed to fetch Figma elements.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchElements();
  }, [file.id]);

  const highlightedId = selectedElementId || hoveredElementId;

  return (
    <div className="selected-file-container">
      <div className="image-and-elements-container">
        <h2>{file.name}</h2>
        {loading && <div className="loading-placeholder">Loading elements...</div>}
        {error && <p className="error">{error}</p>}
        {!loading && file.image_url ? (
          <ImageViewer
            imageUrl={file.image_url}
            imageName={file.name}
            elements={elements}
            highlightedId={highlightedId}
            onElementSelect={setSelectedElementId}
            onElementHover={setHoveredElementId}
          />
        ) : (
          !loading && <div className="empty-placeholder">No image preview available for this file.</div>
        )}
      </div>
      <ElementsList
        elements={elements}
        highlightedId={highlightedId}
        onElementSelect={setSelectedElementId}
        onElementHover={setHoveredElementId}
      />
    </div>
  );
};
