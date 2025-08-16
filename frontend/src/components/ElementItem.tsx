import React from 'react';
import type { FigmaElement } from '../types';

interface Props {
  element: FigmaElement;
  isHighlighted: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export const ElementItem: React.FC<Props> = ({ element, isHighlighted, onSelect, onHover }) => {
  return (
    <li
      onClick={() => onSelect(element.id)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      className={isHighlighted ? 'highlighted' : ''}
    >
      {element.name} ({element.type})
    </li>
  );
};
