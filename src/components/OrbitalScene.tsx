"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Canvas,
  useFrame,
} from "@react-three/fiber";
import {
  Line,
  Stars,
} from "@react-three/drei";
import {
  AdditiveBlending,
  BackSide,
  ClampToEdgeWrapping,
  DataTexture,
  LinearFilter,
  RepeatWrapping,
  RGBAFormat,
  SRGBColorSpace,
} from "three";
import type { Group } from "three";

type OrbitalSceneProps = {
  planetRadius?: number;
  starRadius?: number;
  orbitalInclination?: number;
  isPaused?: boolean;
  simulationSpeed?: number;
  resetSignal?: number;
  onOrbitUpdate?: (
    phase: number,
  ) => void;
};

type StarProps = {
  radius: number;
  isPaused: boolean;
  simulationSpeed: number;
};

type OrbitPathProps = {
  inclination: number;
};

type PlanetProps = {
  radius: number;
  inclination: number;
  isPaused: boolean;
  simulationSpeed: number;
  resetSignal: number;
  onOrbitUpdate?: (
    phase: number,
  ) => void;
};

type OrbitPosition = {
  x: number;
  y: number;
  z: number;
};

function calculateOrbitPosition(
  angle: number,
  inclinationDegrees: number,
): OrbitPosition {
  const inclinationRadians =
    (inclinationDegrees * Math.PI) /
    180;

  const x = Math.cos(angle) * 3;

  const y =
    0.12 +
    Math.sin(angle) *
      4 *
      Math.cos(inclinationRadians);

  const z =
    Math.sin(angle) *
    2.2 *
    Math.sin(inclinationRadians);

  return { x, y, z };
}

function createStarTexture() {
  const width = 256;
  const height = 128;

  const pixelData =
    new Uint8Array(
      width * height * 4,
    );

  const sunspots = [
    {
      x: 0.22,
      y: 0.38,
      radius: 0.055,
    },
    {
      x: 0.58,
      y: 0.63,
      radius: 0.04,
    },
    {
      x: 0.78,
      y: 0.43,
      radius: 0.03,
    },
  ];

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      const u = x / width;
      const v = y / height;

      const flowingBands =
        Math.sin(
          u * 45 +
            Math.sin(v * 18) * 2.5,
        ) * 0.12;

      const smallerCells =
        Math.sin(
          v * 60 +
            Math.cos(u * 24) * 3,
        ) * 0.09;

      const fineDetail =
        Math.sin(
          (u + v) * 95,
        ) * 0.045;

      let brightness =
        0.72 +
        flowingBands +
        smallerCells +
        fineDetail;

      for (const spot of sunspots) {
        let horizontalDistance =
          Math.abs(u - spot.x);

        horizontalDistance =
          Math.min(
            horizontalDistance,
            1 - horizontalDistance,
          );

        const verticalDistance =
          v - spot.y;

        const distance = Math.sqrt(
          horizontalDistance *
            horizontalDistance +
            verticalDistance *
              verticalDistance,
        );

        if (
          distance < spot.radius
        ) {
          const spotStrength =
            1 -
            distance / spot.radius;

          brightness -=
            spotStrength * 0.48;
        }
      }

      brightness = Math.max(
        0.16,
        Math.min(1, brightness),
      );

      const pixelIndex =
        (y * width + x) * 4;

      pixelData[pixelIndex] =
        Math.round(
          220 + brightness * 35,
        );

      pixelData[pixelIndex + 1] =
        Math.round(
          70 + brightness * 145,
        );

      pixelData[pixelIndex + 2] =
        Math.round(
          10 + brightness * 55,
        );

      pixelData[pixelIndex + 3] =
        255;
    }
  }

  const texture = new DataTexture(
    pixelData,
    width,
    height,
    RGBAFormat,
  );

  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT =
    ClampToEdgeWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

function Star({
  radius,
  isPaused,
  simulationSpeed,
}: StarProps) {
  const starGroup =
    useRef<Group>(null);

  const starTexture = useMemo(() => {
    return createStarTexture();
  }, []);

  useEffect(() => {
    return () => {
      starTexture.dispose();
    };
  }, [starTexture]);

  useFrame((_, delta) => {
    if (
      !starGroup.current ||
      isPaused
    ) {
      return;
    }

    starGroup.current.rotation.y +=
      delta *
      0.06 *
      simulationSpeed;
  });

  return (
    <group ref={starGroup}>
      <mesh>
        <sphereGeometry
          args={[radius, 96, 96]}
        />

        <meshStandardMaterial
          map={starTexture}
          emissiveMap={starTexture}
          color="#fff1d0"
          emissive="#d95518"
          emissiveIntensity={0.9}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      <mesh scale={1.06}>
        <sphereGeometry
          args={[radius, 64, 64]}
        />

        <meshBasicMaterial
          color="#f3a33a"
          transparent
          opacity={0.14}
          side={BackSide}
          blending={
            AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.13}>
        <sphereGeometry
          args={[radius, 64, 64]}
        />

        <meshBasicMaterial
          color="#d66b2c"
          transparent
          opacity={0.055}
          side={BackSide}
          blending={
            AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>

      <pointLight
        color="#f2a74f"
        intensity={34}
        distance={18}
        decay={2}
      />
    </group>
  );
}

function OrbitPath({
  inclination,
}: OrbitPathProps) {
  const points = useMemo(() => {
    return Array.from(
      { length: 129 },
      (_, index) => {
        const angle =
          (index / 128) * Math.PI * 2;

        const position =
          calculateOrbitPosition(
            angle,
            inclination,
          );

        return [
          position.x,
          position.y,
          position.z,
        ] as [number, number, number];
      },
    );
  }, [inclination]);

  return (
    <Line      points={points}
      color="#d49a46"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
}

function Planet({
  radius,
  inclination,
  isPaused,
  simulationSpeed,
  resetSignal,
  onOrbitUpdate,
}: PlanetProps) {
  const planetGroup = useRef<Group>(null);
  const orbitProgress = useRef(0);
  const lastUpdateTime = useRef(0);

  const orbitUpdateCallback =
    useRef(onOrbitUpdate);

  useEffect(() => {
    orbitUpdateCallback.current =
      onOrbitUpdate;
  }, [onOrbitUpdate]);

  useEffect(() => {
    orbitProgress.current = 0;

    if (planetGroup.current) {
      const resetPosition =
        calculateOrbitPosition(
          0,
          inclination,
        );

      planetGroup.current.position.set(
        resetPosition.x,
        resetPosition.y,
        resetPosition.z,
      );
    }

    orbitUpdateCallback.current?.(0);
  }, [inclination, resetSignal]);

  useFrame((_, delta) => {
    if (!planetGroup.current) {
      return;
    }

     if (!isPaused) {
      orbitProgress.current =
        (orbitProgress.current +
          delta * 0.45 * simulationSpeed) %
        (Math.PI * 2);

      planetGroup.current.rotation.y +=
        delta * 0.5 * simulationSpeed;
     }

    const angle = orbitProgress.current;

    const position =
      calculateOrbitPosition(
        angle,
        inclination,
      );

    planetGroup.current.position.set(
      position.x,
      position.y,
      position.z,
    );

    const currentTime = performance.now();

    if (
      currentTime -
        lastUpdateTime.current >=
      50
    ) {
      const orbitalPhase =
        angle / (Math.PI * 2);

      orbitUpdateCallback.current?.(
        orbitalPhase,
      );

      lastUpdateTime.current =
        currentTime;
    }
  });

  return (
    <group ref={planetGroup}>
      <mesh>
        <sphereGeometry          args={[radius, 48, 48]}
        />

        <meshStandardMaterial          color="#703d32"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry          args={[radius, 48, 48]}
        />

        <meshBasicMaterial          color="#b46146"
          transparent
          opacity={0.08}
        />
      </mesh>    </group>  );
}

export default function OrbitalScene({
  planetRadius = 1,
  starRadius = 1,
  orbitalInclination = 90,
  isPaused = false,
  simulationSpeed = 1,
  resetSignal = 0,
  onOrbitUpdate,
}: OrbitalSceneProps) {
  const renderedPlanetRadius =
    0.38 * planetRadius;

  const renderedStarRadius =
    1.35 * starRadius;

  const safeInclination = Math.max(
    0,
    Math.min(90, orbitalInclination),
  );

  return (
    <div className="h-full min-h-[360px] w-full">
      <Canvas        camera={{
          position: [0, 0, 7],
          fov: 45,
      }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={0.1} />

        <directionalLight          position={[4, 3, 6]}
          color="#ffd6a0"
          intensity={1.2}
        />

        <Stars          radius={45}
          depth={25}
          count={900}
          factor={2}
          saturation={0}
          fade
          speed={
            isPaused
              ? 0
              : 0.15 * simulationSpeed
          }
        />

        <OrbitPath          inclination={safeInclination}
        />

        <Star          radius={renderedStarRadius}
          isPaused={isPaused}
          simulationSpeed={simulationSpeed}
        />

        <Planet          radius={renderedPlanetRadius}
          inclination={safeInclination}
          isPaused={isPaused}
          simulationSpeed={simulationSpeed}
          resetSignal={resetSignal}
          onOrbitUpdate={onOrbitUpdate}
        />
      </Canvas>    </div>  );
}