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
import {
  getPlanetVisualProfile,
  type PlanetVisualProfile,
} from "@/data/planetVisualProfiles";

type OrbitalSceneProps = {
  planetRadius?: number;
  starRadius?: number;
  planetName?: string;
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
  planetName?: string;
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

type PlanetSurfaceTextures = {
  colorTexture: DataTexture;
  bumpTexture: DataTexture;
};

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.max(
    minimum,
    Math.min(maximum, value),
  );
}

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

function prepareTexture(
  texture: DataTexture,
  usesColorSpace: boolean,
) {
  if (usesColorSpace) {
    texture.colorSpace = SRGBColorSpace;
  }

  texture.wrapS = RepeatWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
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

      brightness = clamp(
        brightness,
        0.16,
        1,
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

  prepareTexture(texture, true);

  return texture;
}

function createPlanetTextures(
  profile: PlanetVisualProfile,
): PlanetSurfaceTextures {
  const width = 512;
  const height = 256;

  const colorData =
    new Uint8Array(
      width * height * 4,
    );

  const bumpData =
    new Uint8Array(
      width * height * 4,
    );

  const craters = [
    {
      x: 0.12,
      y: 0.31,
      radius: 0.047,
    },
    {
      x: 0.21,
      y: 0.67,
      radius: 0.029,
    },
    {
      x: 0.34,
      y: 0.45,
      radius: 0.061,
    },
    {
      x: 0.46,
      y: 0.72,
      radius: 0.036,
    },
    {
      x: 0.55,
      y: 0.28,
      radius: 0.024,
    },
    {
      x: 0.64,
      y: 0.53,
      radius: 0.052,
    },
    {
      x: 0.73,
      y: 0.76,
      radius: 0.032,
    },
    {
      x: 0.82,
      y: 0.39,
      radius: 0.041,
    },
    {
      x: 0.91,
      y: 0.61,
      radius: 0.022,
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

      const broadTerrain =
        Math.sin(
          u * 15 +
            Math.sin(v * 9) * 2.8,
        ) * 0.28;

      const brokenPlateaus =
        Math.sin(
          v * 23 -
            Math.cos(u * 17) * 3.2,
        ) * 0.2;

      const windingRidges =
        Math.sin(
          (u + v) * 39 +
            Math.sin(u * 8),
        ) * 0.11;

      const fineRock =
        Math.sin(u * 113) *
        Math.sin(v * 97) *
        0.055;

      const latitude =
        Math.abs(v - 0.5) * 2;

      let terrain =
        broadTerrain +
        brokenPlateaus +
        windingRidges +
        fineRock -
        latitude * 0.05;

      for (const crater of craters) {
        let horizontalDistance =
          Math.abs(u - crater.x);

        horizontalDistance =
          Math.min(
            horizontalDistance,
            1 - horizontalDistance,
          );

        const verticalDistance =
          v - crater.y;

        const distance = Math.sqrt(
          horizontalDistance *
            horizontalDistance +
            verticalDistance *
              verticalDistance,
        );

        const normalizedDistance =
          distance / crater.radius;

        if (normalizedDistance < 0.72) {
          terrain -=
            (1 -
              normalizedDistance /
                0.72) *
            0.32 *
            profile.craterStrength;
        } else if (
          normalizedDistance < 1
        ) {
          const rimPosition =
            (normalizedDistance -
              0.72) /
            0.28;

          terrain +=
            Math.sin(
              rimPosition * Math.PI,
            ) *
            0.19 *
            profile.craterStrength;
        }
      }

      terrain = clamp(
        terrain,
        -0.75,
        0.75,
      );

      const normalizedTerrain =
        (terrain + 0.75) / 1.5;

      const colorMix = clamp(
        0.5 +
          (normalizedTerrain - 0.5) *
            profile.terrainContrast,
        0,
        1,
      );

      const surfaceVariation =
        Math.sin(
          u * 31 +
            Math.sin(v * 14),
        ) * 6;

      const red = clamp(
        profile.lowlandColor[0] +
          (profile.highlandColor[0] -
            profile.lowlandColor[0]) *
            colorMix +
          surfaceVariation,
        0,
        255,
      );

      const green = clamp(
        profile.lowlandColor[1] +
          (profile.highlandColor[1] -
            profile.lowlandColor[1]) *
            colorMix +
          surfaceVariation * 0.35,
        0,
        255,
      );

      const blue = clamp(
        profile.lowlandColor[2] +
          (profile.highlandColor[2] -
            profile.lowlandColor[2]) *
            colorMix,
        0,
        255,
      );

      const bumpValue = clamp(
        126 +
          terrain *
            105 *
            profile.terrainContrast,
        0,
        255,
      );

      const pixelIndex =
        (y * width + x) * 4;

      colorData[pixelIndex] =
        Math.round(red);

      colorData[pixelIndex + 1] =
        Math.round(green);

      colorData[pixelIndex + 2] =
        Math.round(blue);

      colorData[pixelIndex + 3] =
        255;

      bumpData[pixelIndex] =
        Math.round(bumpValue);

      bumpData[pixelIndex + 1] =
        Math.round(bumpValue);

      bumpData[pixelIndex + 2] =
        Math.round(bumpValue);

      bumpData[pixelIndex + 3] =
        255;
    }
  }

  const colorTexture = new DataTexture(
    colorData,
    width,
    height,
    RGBAFormat,
  );

  const bumpTexture = new DataTexture(
    bumpData,
    width,
    height,
    RGBAFormat,
  );

  prepareTexture(colorTexture, true);
  prepareTexture(bumpTexture, false);

  return {
    colorTexture,
    bumpTexture,
  };
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
          (index / 128) *
          Math.PI *
          2;

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
    <Line
      points={points}
      color="#d49a46"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
}

function Planet({
  radius,
  planetName,
  inclination,
  isPaused,
  simulationSpeed,
  resetSignal,
  onOrbitUpdate,
}: PlanetProps) {
  const planetGroup =
    useRef<Group>(null);

  const orbitProgress = useRef(0);
  const lastUpdateTime = useRef(0);

  const orbitUpdateCallback =
    useRef(onOrbitUpdate);

  const visualProfile = useMemo(() => {
    return getPlanetVisualProfile(
      planetName,
    );
  }, [planetName]);

  const planetTextures = useMemo(() => {
    return createPlanetTextures(
      visualProfile,
    );
  }, [visualProfile]);

  useEffect(() => {
    return () => {
      planetTextures.colorTexture.dispose();
      planetTextures.bumpTexture.dispose();
    };
  }, [planetTextures]);

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
          delta *
            0.45 *
            simulationSpeed) %
        (Math.PI * 2);

      planetGroup.current.rotation.y +=
        delta *
        0.34 *
        simulationSpeed;
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

    const currentTime =
      performance.now();

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
    <group
      ref={planetGroup}
      rotation={[0, 0, 0.18]}
    >
      <mesh>
        <sphereGeometry
          args={[radius, 96, 96]}
        />

        <meshStandardMaterial
          map={
            planetTextures.colorTexture
          }
          bumpMap={
            planetTextures.bumpTexture
          }
          bumpScale={
            visualProfile.bumpScale
          }
          color="#ffffff"
          roughness={0.96}
          metalness={0.01}
        />
      </mesh>

      <mesh scale={1.025}>
        <sphereGeometry
          args={[radius, 64, 64]}
        />

        <meshBasicMaterial
          color={
            visualProfile.atmosphereColor
          }
          transparent
          opacity={
            visualProfile.atmosphereOpacity
          }
          side={BackSide}
          blending={
            AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.055}>
        <sphereGeometry
          args={[radius, 64, 64]}
        />

        <meshBasicMaterial
          color={
            visualProfile.atmosphereColor
          }
          transparent
          opacity={
            visualProfile.atmosphereOpacity *
            0.3
          }
          side={BackSide}
          blending={
            AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function OrbitalScene({
  planetRadius = 1,
  starRadius = 1,
  planetName,
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
    Math.min(
      90,
      orbitalInclination,
    ),
  );

  return (
    <div className="h-full min-h-[360px] w-full">
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 45,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={0.055} />

        <directionalLight
          position={[4, 3, 6]}
          color="#ffd6a0"
          intensity={0.38}
        />

        <Stars
          radius={45}
          depth={25}
          count={900}
          factor={2}
          saturation={0}
          fade
          speed={
            isPaused
              ? 0
              : 0.15 *
                simulationSpeed
          }
        />

        <OrbitPath
          inclination={safeInclination}
        />

        <Star
          radius={renderedStarRadius}
          isPaused={isPaused}
          simulationSpeed={
            simulationSpeed
          }
        />

        <Planet
          radius={renderedPlanetRadius}
          planetName={planetName}
          inclination={safeInclination}
          isPaused={isPaused}
          simulationSpeed={
            simulationSpeed
          }
          resetSignal={resetSignal}
          onOrbitUpdate={onOrbitUpdate}
        />
      </Canvas>
    </div>
  );
}