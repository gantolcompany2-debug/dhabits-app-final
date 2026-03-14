import React from 'react';
import { useApp, ShopItem } from '@/contexts/AppContext';

interface CharacterDisplayProps {
  width?: number;
  height?: number;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ width = 150, height = 200 }) => {
  const { characterState, shopItems } = useApp();

  // Базовый персонаж (пустой, без одежды)
  const baseCharacter = (
    <svg width={width} height={height} viewBox="0 0 100 150" style={{ position: 'relative' }}>
      {/* Head */}
      <circle cx="50" cy="25" r="20" fill="#E0B98D" />
      {/* Body */}
      <rect x="40" y="45" width="20" height="50" fill="#E0B98D" />
      {/* Left Arm */}
      <rect x="25" y="45" width="15" height="40" fill="#E0B98D" transform="rotate(-10 32.5 65)" />
      {/* Right Arm */}
      <rect x="60" y="45" width="15" height="40" fill="#E0B98D" transform="rotate(10 67.5 65)" />
      {/* Left Leg */}
      <rect x="40" y="95" width="15" height="50" fill="#E0B98D" />
      {/* Right Leg */}
      <rect x="45" y="95" width="15" height="50" fill="#E0B98D" />
    </svg>
  );

  const equippedItems: { [key: string]: ShopItem } = {};
  Object.entries(characterState).forEach(([slot, itemId]) => {
    const item = shopItems.find(i => i.id === itemId);
    if (item) {
      equippedItems[slot] = item;
    }
  });

  // Создаём единый SVG со всеми слоями
  const svgContent = (
    <svg width={width} height={height} viewBox="0 0 100 150" style={{ position: 'relative', display: 'block' }}>
      {/* Base character */}
      <circle cx="50" cy="25" r="20" fill="#E0B98D" />
      <rect x="40" y="45" width="20" height="50" fill="#E0B98D" />
      <rect x="25" y="45" width="15" height="40" fill="#E0B98D" transform="rotate(-10 32.5 65)" />
      <rect x="60" y="45" width="15" height="40" fill="#E0B98D" transform="rotate(10 67.5 65)" />
      <rect x="40" y="95" width="15" height="50" fill="#E0B98D" />
      <rect x="45" y="95" width="15" height="50" fill="#E0B98D" />

      {/* Equipped items */}
      {equippedItems.head && (
        <g dangerouslySetInnerHTML={{ __html: equippedItems.head.assetPath || '' }} />
      )}
      {equippedItems.body && (
        <g dangerouslySetInnerHTML={{ __html: equippedItems.body.assetPath || '' }} />
      )}
      {equippedItems.hands && (
        <g dangerouslySetInnerHTML={{ __html: equippedItems.hands.assetPath || '' }} />
      )}
      {equippedItems.feet && (
        <g dangerouslySetInnerHTML={{ __html: equippedItems.feet.assetPath || '' }} />
      )}
      {equippedItems.accessory && (
        <g dangerouslySetInnerHTML={{ __html: equippedItems.accessory.assetPath || '' }} />
      )}
    </svg>
  );

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {svgContent}
    </div>
  );
};

export default CharacterDisplay;
