import React from 'react';
import type { FigmaElement } from '../types';
import { ElementItem } from './ElementItem';

interface Props {
  elements: FigmaElement[];
  highlightedId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementHover: (id: string | null) => void;
}

export const ElementsList: React.FC<Props> = ({ elements, highlightedId, onElementSelect, onElementHover }) => {
  const handleSelect = (id: string) => {
    onElementSelect(highlightedId === id ? null : id);
  };

  return (
    <aside className="elements-list-container">
      <h3>Extracted Elements ({elements.length})</h3>
      {elements.length === 0 && <div className="empty-placeholder">No elements found.</div>}
      <ul>
        {elements.map((element) => (
          <ElementItem
            key={element.id}
            element={element}
            isHighlighted={highlightedId === element.id}
            onSelect={handleSelect}
            onHover={onElementHover}
          />
        ))}
      </ul>
    </aside>
  );
};
