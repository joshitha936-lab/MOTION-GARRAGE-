import React from 'react';
import { Environment, ContactShadows } from '@react-three/drei';

export const StudioEnvironment: React.FC = () => {
  return (
    <>
      {/* High-quality HDR studio environment map for photorealistic paint & glass reflections */}
      <Environment preset="studio" background={false} environmentIntensity={0.95} />

      {/* Balanced automotive studio ambient fill */}
      <ambientLight intensity={0.5} color="#e6edf3" />

      {/* Main overhead studio softbox light */}
      <directionalLight
        position={[0, 8, 2]}
        intensity={1.6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />

      {/* Front-left automotive sculpt fill */}
      <directionalLight
        position={[5, 2.5, 4]}
        intensity={0.9}
        color="#f8fafc"
      />

      {/* Rear silhouette & roofline rim highlight */}
      <directionalLight
        position={[-5, 3.5, -4]}
        intensity={1.1}
        color="#e2e8f0"
      />

      {/* Subtle electric cyan edge accent (restrained to maintain vehicle focus) */}
      <directionalLight
        position={[-4, 1.8, 3]}
        intensity={0.55}
        color="#00f0ff"
      />

      {/* Ground contact soft shadows under chassis and tires */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.8}
        scale={10}
        blur={2.4}
        far={3.5}
        resolution={1024}
        color="#000000"
      />

      {/* Showroom studio floor & turntable platform */}
      <group position={[0, -0.002, 0]}>
        {/* Infinite reflective studio floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color="#08090c"
            roughness={0.32}
            metalness={0.68}
            envMapIntensity={0.85}
          />
        </mesh>

        {/* Outer turntable demarcation ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <ringGeometry args={[3.2, 3.24, 64]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.25} />
        </mesh>

        {/* Secondary subtle halo ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <ringGeometry args={[4.5, 4.52, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>

        {/* Minimal measurement grid */}
        <gridHelper
          args={[20, 20, 0x00f0ff, 0x1a2230]}
          position={[0, 0.002, 0]}
        />
      </group>
    </>
  );
};
