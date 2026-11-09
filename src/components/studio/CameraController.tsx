import React, { useEffect, useRef, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import type { CameraAngle, VehicleData } from '../../types/vehicle';

interface CameraControllerProps {
  vehicle: VehicleData;
  activeAngle: CameraAngle;
  autoRotate: boolean;
  onCameraChange?: () => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  vehicle,
  activeAngle,
  autoRotate,
}) => {
  const { camera, gl, scene, size: canvasSize } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Calculate dynamic framing from actual model dimensions and viewer aspect ratio
  const framing = useMemo(() => {
    // Look for the car model group in the scene
    const carGroup = scene.getObjectByName('car-model-group');
    const box = new THREE.Box3();

    if (carGroup) {
      box.setFromObject(carGroup);
    } else {
      // Fallback standard automotive envelope: width ~ 2.1m, height ~ 1.3m, length ~ 4.6m
      box.min.set(-1.1, 0, -2.4);
      box.max.set(1.1, 1.35, 2.4);
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Keep center Y focused on vehicle beltline / visual center of mass
    const targetY = Math.max(0.5, Math.min(size.y * 0.48, 0.7));
    const targetCenter = new THREE.Vector3(center.x, targetY, center.z);

    const maxDim = Math.max(size.x, size.z, 4.4);
    const fov = 42;
    const fovRad = (fov * Math.PI) / 180;
    const aspect = canvasSize.width / Math.max(1, canvasSize.height);

    // Generous automotive framing margin to ensure complete car remains inside viewing area
    let distance = (maxDim / 2) / Math.tan(fovRad / 2) * 1.32;
    if (aspect < 1.0) {
      // Mobile / portrait: expand distance to maintain full car in viewport
      distance /= Math.max(0.55, aspect);
    }

    return {
      distance,
      targetCenter,
      size,
    };
  }, [scene, vehicle.id, canvasSize.width, canvasSize.height]);

  // Compute camera position & target for the active angle
  useEffect(() => {
    if (!controlsRef.current) return;

    const { distance, targetCenter } = framing;
    const cx = targetCenter.x;
    const cy = targetCenter.y;
    const cz = targetCenter.z;

    let px = cx;
    let py = cy + distance * 0.18;
    let pz = cz + distance;
    let tx = cx;
    let ty = cy;
    let tz = cz;
    let targetFov = 42;

    switch (activeAngle) {
      case 'front':
        px = cx;
        py = cy + distance * 0.16;
        pz = cz + distance;
        break;
      case 'frontLeftThreeQuarter':
        px = cx + distance * 0.707;
        py = cy + distance * 0.22;
        pz = cz + distance * 0.707;
        break;
      case 'leftProfile':
        px = cx + distance * 1.02;
        py = cy + distance * 0.16;
        pz = cz;
        break;
      case 'rearLeftThreeQuarter':
        px = cx + distance * 0.707;
        py = cy + distance * 0.22;
        pz = cz - distance * 0.707;
        break;
      case 'rear':
        px = cx;
        py = cy + distance * 0.16;
        pz = cz - distance;
        break;
      case 'rearRightThreeQuarter':
        px = cx - distance * 0.707;
        py = cy + distance * 0.22;
        pz = cz - distance * 0.707;
        break;
      case 'rightProfile':
        px = cx - distance * 1.02;
        py = cy + distance * 0.16;
        pz = cz;
        break;
      case 'frontRightThreeQuarter':
        px = cx - distance * 0.707;
        py = cy + distance * 0.22;
        pz = cz + distance * 0.707;
        break;
      case 'top':
        px = cx;
        py = cy + distance * 1.15;
        pz = cz + distance * 0.05;
        targetFov = 45;
        break;
      case 'cockpit':
        if (vehicle.cameraPresets?.cockpit) {
          const cp = vehicle.cameraPresets.cockpit;
          px = cp.position[0];
          py = cp.position[1];
          pz = cp.position[2];
          tx = cp.target[0];
          ty = cp.target[1];
          tz = cp.target[2];
          targetFov = cp.fov || 56;
        } else {
          px = cx + 0.3;
          py = cy + 0.45;
          pz = cz + 0.1;
          tx = cx + 0.3;
          ty = cy + 0.4;
          tz = cz + 1.2;
          targetFov = 56;
        }
        break;
    }

    // Kill any ongoing tweens
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controlsRef.current.target);

    // Smooth transition between predefined camera views
    gsap.to(camera.position, {
      x: px,
      y: py,
      z: pz,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix();
        controlsRef.current?.update();
      },
    });

    gsap.to(controlsRef.current.target, {
      x: tx,
      y: ty,
      z: tz,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        controlsRef.current?.update();
      },
    });

    // Smoothly adjust perspective camera FOV
    const persCamera = camera as THREE.PerspectiveCamera;
    if (persCamera.isPerspectiveCamera && Math.abs(persCamera.fov - targetFov) > 0.5) {
      gsap.to(persCamera, {
        fov: targetFov,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          persCamera.updateProjectionMatrix();
        },
      });
    }
  }, [activeAngle, framing, vehicle, camera]);

  const isCockpit = activeAngle === 'cockpit';
  const minZoomDist = isCockpit ? 0.05 : framing.distance * 0.45;
  const maxZoomDist = isCockpit ? 2.5 : framing.distance * 2.2;

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={0.85}
      panSpeed={0.5}
      minDistance={minZoomDist}
      maxDistance={maxZoomDist}
      maxPolarAngle={isCockpit ? Math.PI - 0.1 : Math.PI / 2 - 0.01} // Prevent dipping through studio floor
      minPolarAngle={0.04}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      enablePan={isCockpit}
      makeDefault
    />
  );
};
