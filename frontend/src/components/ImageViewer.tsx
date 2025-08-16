import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { FigmaElement } from '../types';

interface Props {
  imageUrl: string;
  imageName: string;
  elements: FigmaElement[];
  highlightedId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementHover: (id: string | null) => void;
}

export const ImageViewer: React.FC<Props> = ({ imageUrl, imageName, elements, highlightedId, onElementSelect, onElementHover }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [canvasBoundingBox, setCanvasBoundingBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [imageSize, setImageSize] = useState<{width: number, height: number} | null>(null);

  useEffect(() => {
    if (elements.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      elements.forEach(element => {
        if (element.properties.absoluteBoundingBox) {
          const { x, y, width, height } = element.properties.absoluteBoundingBox;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + width);
          maxY = Math.max(maxY, y + height);
        }
      });

      if (minX !== Infinity) {
        setCanvasBoundingBox({ x: minX, y: minY, width: maxX - minX, height: maxY - minY });
      } else {
        setCanvasBoundingBox(null);
      }
    } else {
      setCanvasBoundingBox(null);
    }
  }, [elements]);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { width, height } = imageRef.current;
      setImageSize({ width, height });
    }
  }, []);

  // Handle window resize to update image dimensions
  useEffect(() => {
    const handleResize = () => {
        // Reset image size to trigger recalculation on next load
        setImageSize(null);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (imageRef.current?.complete) {
        handleImageLoad();
    }
  }, [imageUrl, handleImageLoad]);

  const getMarkerStyle = (element: FigmaElement): CSSProperties => {
    if (!element.properties.absoluteBoundingBox || !canvasBoundingBox || !imageSize) {
      return { display: 'none' };
    }

    const { x, y, width, height } = element.properties.absoluteBoundingBox;
    
    if (canvasBoundingBox.width === 0) {
        return { display: 'none' };
    }

    const scale = imageSize.width / canvasBoundingBox.width;
    const relativeX = x - canvasBoundingBox.x;
    const relativeY = y - canvasBoundingBox.y;

    return {
        left: `${relativeX * scale}px`,
        top: `${relativeY * scale}px`,
        width: `${width * scale}px`,
        height: `${height * scale}px`,
    };
  };

  const handleSelect = (id: string) => {
    onElementSelect(highlightedId === id ? null : id);
  };

  return (
    <div className="figma-image-container">
      <img
        ref={imageRef}
        src={imageUrl}
        alt={`Figma file: ${imageName}`}
        className="figma-image"
        onLoad={handleImageLoad}
        style={{ visibility: imageSize ? 'visible' : 'hidden' }}
      />
      {imageSize && canvasBoundingBox && elements.map((element) => (
        <div
          key={element.id}
          className={`component-marker ${highlightedId === element.id ? 'highlighted' : ''}`}
          style={getMarkerStyle(element)}
          onClick={() => handleSelect(element.id)}
          onMouseEnter={() => onElementHover(element.id)}
          onMouseLeave={() => onElementHover(null)}
        ></div>
      ))}
      {!imageSize && <div className="loading-placeholder">Loading image...</div>}
    </div>
  );
};