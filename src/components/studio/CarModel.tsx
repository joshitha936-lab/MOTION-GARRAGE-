import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { MeshoptDecoder } from 'three-stdlib';
import type { VehicleData, PaintOption, WheelOption } from '../../types/vehicle';

interface CarModelProps {
  vehicle: VehicleData;
  activePaint: PaintOption;
  activeWheel: WheelOption;
  isRotating?: boolean;
}

// Pre-initialize MeshoptDecoder for EXT_meshopt_compression models (BMW M4)
const resolvedMeshopt = typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder;

export const CarModel: React.FC<CarModelProps> = ({
  vehicle,
  activePaint,
  activeWheel,
}) => {
  // Load model with both Draco and Meshopt decoders active
  const gltf = useGLTF(
    vehicle.modelPath,
    true,
    true,
    (loader) => {
      loader.setMeshoptDecoder(resolvedMeshopt);
    }
  );

  const groupRef = useRef<THREE.Group>(null);

  // Car paint physical material (PBR with clearcoat, reflectivity and metallic sheen)
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activePaint.hex),
      metalness: activePaint.metalness,
      roughness: activePaint.roughness,
      clearcoat: activePaint.clearcoat ?? 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      envMapIntensity: 1.1,
    });
  }, [activePaint]);

  // Wheel rim finish material (matching selected forged wheel specification)
  const rimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeWheel.color),
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.25,
    });
  }, [activeWheel]);

  // Automotive rubber tire material (deep charcoal with authentic satin sheen)
  const tireMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141416'),
      metalness: 0.06,
      roughness: 0.86,
      envMapIntensity: 0.4,
    });
  }, []);

  // Brake rotor / carbon-ceramic disc material
  const brakeDiscMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#bcc0c8'),
      metalness: 0.94,
      roughness: 0.24,
      envMapIntensity: 1.0,
    });
  }, []);

  // Glass material for realistic automotive reflections, IOR, and transmission
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      metalness: 0.05,
      roughness: 0.02,
      transmission: 0.94,
      thickness: 0.55,
      transparent: true,
      opacity: 0.92,
      ior: 1.52,
      envMapIntensity: 1.3,
    });
  }, []);

  // Texture loader for Ferrari AO shadow if applicable
  const shadowTexture = useMemo(() => {
    if (vehicle.shadowPath) {
      return new THREE.TextureLoader().load(vehicle.shadowPath);
    }
    return null;
  }, [vehicle.shadowPath]);

  // Clone and normalize geometry ONCE per vehicle asset
  const preparedScene = useMemo(() => {
    const scene = gltf.scene.clone(true);

    // Initial bounding box calculation
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Target real-world supercar length ~ 4.6 meters
    const maxDim = Math.max(size.x, size.z);
    const targetLength = 4.6;
    const autoScale = maxDim > 0 ? targetLength / maxDim : 1.0;
    const finalScale = (vehicle.scale || 1.0) * autoScale;

    scene.scale.setScalar(finalScale);

    // Re-measure with final scale applied to calculate exact ground contact
    scene.updateMatrixWorld(true);
    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);

    scene.position.x = -scaledCenter.x + (vehicle.modelOffset?.[0] || 0);
    scene.position.y = -scaledBox.min.y; // Sits flush on studio floor at Y=0
    scene.position.z = -scaledCenter.z + (vehicle.modelOffset?.[2] || 0);

    // Apply rotation offset if vehicle requires coordinate alignment (e.g. Ferrari faces +Z)
    if (vehicle.rotationOffset) {
      scene.rotation.set(
        vehicle.rotationOffset[0],
        vehicle.rotationOffset[1],
        vehicle.rotationOffset[2]
      );
    }

    return scene;
  }, [gltf.scene, vehicle.id, vehicle.scale, vehicle.modelOffset, vehicle.rotationOffset]);

  // Apply materials cleanly without ever touching transforms or scales
  useMemo(() => {
    const scene = preparedScene;

    if (vehicle.id === 'porsche-911') {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const meshName = mesh.name;
          const parentName = mesh.parent?.name || '';
          let matName = '';
          if (Array.isArray(mesh.material)) {
            matName = mesh.material.map((m) => m.name.toLowerCase()).join(' ');
          } else if (mesh.material) {
            matName = mesh.material.name.toLowerCase();
          }

          // Exterior body paint
          if (
            matName === 'paint' ||
            meshName.startsWith('boot.001') ||
            meshName.startsWith('boot.002') ||
            meshName.startsWith('boot.005') ||
            meshName.startsWith('boot.008') ||
            meshName.startsWith('Plane.002') ||
            meshName.startsWith('Plane.003') ||
            meshName.startsWith('Plane.004')
          ) {
            mesh.material = bodyMaterial;
          }
          // Rims (Cylinder.000_0 = Rear Rims, Cylinder.001_0 = Front Rims)
          else if (
            (parentName.includes('Cylinder') || meshName.includes('Cylinder')) &&
            (meshName.endsWith('_0') || matName === 'silver')
          ) {
            mesh.material = rimMaterial;
          }
          // Tires (Cylinder.000_2 = Rear Tires, Cylinder.001_2 = Front Tires)
          else if (
            (parentName.includes('Cylinder') || meshName.includes('Cylinder')) &&
            (meshName.endsWith('_2') || matName === 'rubber')
          ) {
            mesh.material = tireMaterial;
          }
          // Brake rotors & calipers
          else if (
            (parentName.includes('Cylinder') || meshName.includes('Cylinder')) &&
            (meshName.endsWith('_3') || matName === 'material.001')
          ) {
            mesh.material = brakeDiscMaterial;
          }
          // Windows & Glass
          else if (
            matName === 'window' ||
            matName === 'glass' ||
            meshName.includes('windshield') ||
            meshName.includes('window')
          ) {
            mesh.material = glassMaterial;
          }
        }
      });
    } else if (vehicle.id === 'ferrari-458') {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const meshName = mesh.name.toLowerCase();
          const parentName = mesh.parent?.name.toLowerCase() || '';

          // Exterior Body Paint
          if (meshName === 'body') {
            mesh.material = bodyMaterial;
          }
          // Glass
          else if (meshName === 'glass') {
            mesh.material = glassMaterial;
          }
          // Rims & Wheel spokes
          else if (
            meshName.includes('rim_') ||
            (parentName.startsWith('wheel_') && meshName.startsWith('wheel'))
          ) {
            mesh.material = rimMaterial;
          }
          // Tires
          else if (meshName.startsWith('tire')) {
            mesh.material = tireMaterial;
          }
          // Brake rotors
          else if (meshName.startsWith('brake')) {
            mesh.material = brakeDiscMaterial;
          }
        }
      });
    } else if (vehicle.id === 'lamborghini-aventador') {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const meshName = mesh.name;

          // Body paint
          if (meshName.includes('Body')) {
            mesh.material = bodyMaterial;
          }
          // Glass
          else if (meshName.includes('Glass')) {
            mesh.material = glassMaterial;
          }
          // Wheels (FL, FR, RL, RR)
          else if (meshName.includes('Wheel_')) {
            // Clone texture atlas material and apply subtle metalness & selected wheel tint
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).map) {
              const originalMat = mesh.material as THREE.MeshStandardMaterial;
              const customWheelMat = originalMat.clone();
              customWheelMat.metalness = 0.88;
              customWheelMat.roughness = 0.3;
              customWheelMat.envMapIntensity = 1.1;
              mesh.material = customWheelMat;
            }
          }
        }
      });
    } else if (vehicle.id === 'bmw-m4') {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const meshName = mesh.name;
          let matName = '';
          if (Array.isArray(mesh.material)) {
            matName = mesh.material.map((m) => m.name).join(' ');
          } else if (mesh.material) {
            matName = mesh.material.name;
          }

          // Exterior Body Paint
          if (meshName === 'Object_23' || matName === 'Meshesbody151Mtl') {
            mesh.material = bodyMaterial;
          }
          // Wheel Rims (Object_33 with Meshesm8rim1Mtl)
          else if (meshName === 'Object_33' || matName === 'Meshesm8rim1Mtl') {
            mesh.material = rimMaterial;
          }
          // Rubber Tires (Object_34 with Meshesm8rim0011Mtl)
          else if (meshName === 'Object_34' || matName === 'Meshesm8rim0011Mtl') {
            mesh.material = tireMaterial;
          }
          // Brake Calipers (Object_32 with Caliper1Mtl)
          else if (meshName === 'Object_32' || matName === 'Caliper1Mtl') {
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#e5b018'),
              metalness: 0.9,
              roughness: 0.25,
            });
          }
          // Glass Windows (Object_25)
          else if (meshName === 'Object_25' || matName === 'Mesheswindows1Mtl') {
            mesh.material = glassMaterial;
          }
          // M Kidney Grille & Aerodynamic Vents (Object_5, 20, 24, 30)
          else if (
            matName === 'Meshespiggrill1Mtl' ||
            meshName === 'Object_5' ||
            meshName === 'Object_20' ||
            meshName === 'Object_24' ||
            meshName === 'Object_30'
          ) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#0a0b0d'),
              metalness: 0.9,
              roughness: 0.16,
            });
          }
          // Carbon Roof & Shadowline trim (Object_4)
          else if (meshName === 'Object_4' || matName === 'Meshesblack161Mtl') {
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#121316'),
              metalness: 0.7,
              roughness: 0.28,
            });
          }
        }
      });
    }
  }, [
    preparedScene,
    vehicle.id,
    bodyMaterial,
    rimMaterial,
    tireMaterial,
    brakeDiscMaterial,
    glassMaterial,
  ]);

  return (
    <group ref={groupRef} name="car-model-group" dispose={null}>
      <primitive object={preparedScene} />

      {/* Ground contact shadow */}
      {shadowTexture ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} renderOrder={2}>
          <planeGeometry args={[0.655 * 4.6, 1.3 * 4.6]} />
          <meshBasicMaterial
            map={shadowTexture}
            blending={THREE.MultiplyBlending}
            premultipliedAlpha={true}
            toneMapped={false}
            transparent
            opacity={0.88}
          />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[2.8, 5.2]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.45}
          />
        </mesh>
      )}
    </group>
  );
};
