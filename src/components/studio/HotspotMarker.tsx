import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Hotspot } from '../../types/vehicle';

interface HotspotMarkerProps {
  hotspot: Hotspot;
  onSelect?: (hotspot: Hotspot) => void;
  isSelected?: boolean;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  hotspot,
  onSelect,
  isSelected = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Smooth subtle pulse animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 3;
    if (ringRef.current) {
      const s = 1 + Math.sin(t) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
    if (coreRef.current) {
      coreRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group
      position={hotspot.position}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(hotspot);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer pulsing beacon ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial
          color={hovered || isSelected ? '#00f0ff' : '#38bdf8'}
          transparent
          opacity={hovered || isSelected ? 0.95 : 0.6}
          side={THREE.DoubleSide}
          depthTest={false}
        />
      </mesh>

      {/* Center glowing core dot */}
      <mesh ref={coreRef}>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial
          color={hovered || isSelected ? '#ffffff' : '#00f0ff'}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          depthTest={false}
        />
      </mesh>
    </group>
  );
};
