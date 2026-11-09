export type CameraAngle =
  | 'front'
  | 'frontLeftThreeQuarter'
  | 'leftProfile'
  | 'rearLeftThreeQuarter'
  | 'rear'
  | 'rearRightThreeQuarter'
  | 'rightProfile'
  | 'frontRightThreeQuarter'
  | 'top'
  | 'cockpit';

export interface PaintOption {
  id: string;
  name: string;
  hex: string;
  finish: 'metallic' | 'gloss' | 'matte' | 'frozen';
  roughness: number;
  metalness: number;
  clearcoat?: number;
}

export interface WheelOption {
  id: string;
  name: string;
  finish: string;
  color: string;
  priceDelta: string;
}

export interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  category: 'aero' | 'powertrain' | 'chassis' | 'interior';
}

export interface VehicleData {
  id: string;
  name: string;
  brand: string;
  year: number;
  tagline: string;
  category: string;
  basePrice: string;
  modelPath: string;
  shadowPath?: string;
  poster: string;
  videoUrl?: string;
  scale: number;
  modelOffset: [number, number, number];
  rotationOffset?: [number, number, number];
  defaultPaint: PaintOption;
  availablePaints: PaintOption[];
  availableWheels: WheelOption[];
  hasCockpitView: boolean;
  specs: {
    power: string;
    torque: string;
    acceleration: string;
    topSpeed: string;
    engine: string;
    transmission: string;
    weight: string;
    drivetrain: string;
    quarterMile: string;
  };
  attribution: {
    author: string;
    source: string;
    license: string;
    licenseUrl: string;
    notes?: string;
  };
  cameraPresets: Record<
    CameraAngle,
    {
      position: [number, number, number];
      target: [number, number, number];
      fov: number;
    }
  >;
  hotspots: Hotspot[];
}
