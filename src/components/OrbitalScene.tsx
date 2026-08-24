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
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import {
  AdditiveBlending,
  BackSide,
  ClampToEdgeWrapping,
  DataTexture,
  LinearFilter,
  MathUtils,
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
  onOrbitUpdate?: (phase: number) => void;
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
  onOrbitUpdate?: (phase: number) => void;
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

function interpolate(
  start: number,
  end: number,
  amount: number,
) {
  return start + (end - start) * amount;
}

function hash2D(x: number, y: number) {
  const value =
    Math.sin(
      x * 127.1 + y * 311.7,
    ) * 43758.5453123;

  return value - Math.floor(value);
}

function smoothNoise2D(
  x: number,
  y: number,
) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const xFraction = x - x0;
  const yFraction = y - y0;

  const smoothX =
    xFraction *
    xFraction *
    (3 - 2 * xFraction);

  const smoothY =
    yFraction *
    yFraction *
    (3 - 2 * yFraction);

  const top = interpolate(
    hash2D(x0, y0),
    hash2D(x0 + 1, y0),
    smoothX,
  );

  const bottom = interpolate(
    hash2D(x0, y0 + 1),
    hash2D(x0 + 1, y0 + 1),
    smoothX,
  );

  return interpolate(
    top,
    bottom,
    smoothY,
  );
}

function fractalNoise2D(
  x: number,
  y: number,
  octaves = 5,
) {
  let value = 0;
  let amplitude = 0.55;
  let frequency = 1;
  let amplitudeTotal = 0;

  for (
    let octave = 0;
    octave < octaves;
    octave += 1
  ) {
    value +=
      smoothNoise2D(
        x * frequency,
        y * frequency,
      ) * amplitude;

    amplitudeTotal += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }

  return value / amplitudeTotal;
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
  texture.anisotropy = 8;
  texture.needsUpdate = true;
}

function createStarTexture() {
  const width = 384;
  const height = 192;
  const pixelData = new Uint8Array(
    width * height * 4,
  );

  const sunspots = [
    { x: 0.18, y: 0.36, radius: 0.052 },
    { x: 0.37, y: 0.61, radius: 0.031 },
    { x: 0.64, y: 0.43, radius: 0.044 },
    { x: 0.82, y: 0.69, radius: 0.024 },
  ];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const v = y / height;

      const largePlasma =
        fractalNoise2D(
          u * 7,
          v * 5,
          4,
        );

      const granulation =
        fractalNoise2D(
          u * 34 + 9.3,
          v * 24 + 4.7,
          3,
        );

      const magneticBands =
        Math.sin(
          u * 52 +
            largePlasma * 8 +
            Math.sin(v * 13) * 2,
        ) * 0.08;

      let brightness =
        0.3 +
        largePlasma * 0.48 +
        granulation * 0.25 +
        magneticBands;

      for (const spot of sunspots) {
        let horizontalDistance =
          Math.abs(u - spot.x);

        horizontalDistance = Math.min(
          horizontalDistance,
          1 - horizontalDistance,
        );

        const verticalDistance =
          v - spot.y;

        const distance = Math.sqrt(
          horizontalDistance ** 2 +
            verticalDistance ** 2,
        );

        if (distance < spot.radius) {
          const normalizedDistance =
            distance / spot.radius;

          const darkCore =
            1 -
            normalizedDistance *
              normalizedDistance;

          brightness -= darkCore * 0.48;

          if (normalizedDistance > 0.68) {
            brightness +=
              Math.sin(
                ((normalizedDistance -
                  0.68) /
                  0.32) *
                  Math.PI,
              ) * 0.12;
          }
        }
      }

      brightness = clamp(
        brightness,
        0.12,
        1,
      );

      const pixelIndex =
        (y * width + x) * 4;

      pixelData[pixelIndex] =
        Math.round(
          205 + brightness * 50,
        );

      pixelData[pixelIndex + 1] =
        Math.round(
          38 + brightness * 170,
        );

      pixelData[pixelIndex + 2] =
        Math.round(
          4 + brightness * 56,
        );

      pixelData[pixelIndex + 3] = 255;
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

function createGlowTexture() {
  const size = 256;
  const pixelData = new Uint8Array(
    size * size * 4,
  );

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const normalizedX =
        (x / (size - 1)) * 2 - 1;

      const normalizedY =
        (y / (size - 1)) * 2 - 1;

      const distance = Math.sqrt(
        normalizedX ** 2 +
          normalizedY ** 2,
      );

      const coreGlow = clamp(
        1 - distance,
        0,
        1,
      );

      const outerGlow = Math.pow(
        coreGlow,
        2.35,
      );

      const pixelIndex =
        (y * size + x) * 4;

      pixelData[pixelIndex] = 255;
      pixelData[pixelIndex + 1] = 111;
      pixelData[pixelIndex + 2] = 28;
      pixelData[pixelIndex + 3] =
        Math.round(outerGlow * 190);
    }
  }

  const texture = new DataTexture(
    pixelData,
    size,
    size,
    RGBAFormat,
  );

  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

function createPlanetTextures(
  profile: PlanetVisualProfile,
): PlanetSurfaceTextures {
  const width = 384;
  const height = 192;
  const colorData = new Uint8Array(
    width * height * 4,
  );

  const bumpData = new Uint8Array(
    width * height * 4,
  );

  const craters = [
    { x: 0.09, y: 0.28, radius: 0.043 },
    { x: 0.18, y: 0.65, radius: 0.025 },
    { x: 0.31, y: 0.43, radius: 0.06 },
    { x: 0.43, y: 0.74, radius: 0.034 },
    { x: 0.56, y: 0.27, radius: 0.022 },
    { x: 0.67, y: 0.54, radius: 0.048 },
    { x: 0.79, y: 0.72, radius: 0.03 },
    { x: 0.9, y: 0.39, radius: 0.038 },
  ];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const v = y / height;

      const continents =
        fractalNoise2D(
          u * 6.5,
          v * 5,
          5,
        ) *
          2 -
        1;

      const mountainNoise =
        fractalNoise2D(
          u * 21 + 8.4,
          v * 16 + 2.1,
          4,
        ) *
          2 -
        1;

      const ridgeNoise =
        1 -
        Math.abs(
          fractalNoise2D(
            u * 44,
            v * 31,
            3,
          ) *
            2 -
            1,
        );

      const latitude =
        Math.abs(v - 0.5) * 2;

      let terrain =
        continents * 0.56 +
        mountainNoise * 0.22 +
        ridgeNoise * 0.12 -
        latitude * 0.035;

      for (const crater of craters) {
        let horizontalDistance =
          Math.abs(u - crater.x);

        horizontalDistance = Math.min(
          horizontalDistance,
          1 - horizontalDistance,
        );

        const verticalDistance =
          v - crater.y;

        const normalizedDistance =
          Math.sqrt(
            horizontalDistance ** 2 +
              verticalDistance ** 2,
          ) / crater.radius;

        if (normalizedDistance < 0.68) {
          terrain -=
            (1 -
              normalizedDistance /
                0.68) *
            0.34 *
            profile.craterStrength;
        } else if (
          normalizedDistance < 1
        ) {
          terrain +=
            Math.sin(
              ((normalizedDistance -
                0.68) /
                0.32) *
                Math.PI,
            ) *
            0.18 *
            profile.craterStrength;
        }
      }

      terrain = clamp(
        terrain,
        -0.78,
        0.78,
      );

      const normalizedTerrain =
        (terrain + 0.78) / 1.56;

      const colorMix = clamp(
        0.5 +
          (normalizedTerrain - 0.5) *
            profile.terrainContrast,
        0,
        1,
      );

      const mineralVariation =
        (fractalNoise2D(
          u * 58 + 6,
          v * 42 + 3,
          3,
        ) -
          0.5) *
        18;

      const red = clamp(
        interpolate(
          profile.lowlandColor[0],
          profile.highlandColor[0],
          colorMix,
        ) + mineralVariation,
        0,
        255,
      );

      const green = clamp(
        interpolate(
          profile.lowlandColor[1],
          profile.highlandColor[1],
          colorMix,
        ) + mineralVariation * 0.44,
        0,
        255,
      );

      const blue = clamp(
        interpolate(
          profile.lowlandColor[2],
          profile.highlandColor[2],
          colorMix,
        ) + mineralVariation * 0.18,
        0,
        255,
      );

      const bumpValue = clamp(
        128 +
          terrain *
            112 *
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
      colorData[pixelIndex + 3] = 255;

      bumpData[pixelIndex] =
        Math.round(bumpValue);
      bumpData[pixelIndex + 1] =
        Math.round(bumpValue);
      bumpData[pixelIndex + 2] =
        Math.round(bumpValue);
      bumpData[pixelIndex + 3] = 255;
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

  return { colorTexture, bumpTexture };
}

function CameraRig() {
  useFrame((state, delta) => {
    const targetX =
      state.pointer.x * 0.075;

    const targetY =
      state.pointer.y * 0.055;

    state.camera.position.x =
      MathUtils.damp(
        state.camera.position.x,
        targetX,
        2.4,
        delta,
      );

    state.camera.position.y =
      MathUtils.damp(
        state.camera.position.y,
        targetY,
        2.4,
        delta,
      );

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function Star({
  radius,
  isPaused,
  simulationSpeed,
}: StarProps) {
  const starGroup = useRef<Group>(null);

  const starTexture = useMemo(
    () => createStarTexture(),
    [],
  );

  const glowTexture = useMemo(
    () => createGlowTexture(),
    [],
  );

  useEffect(() => {
    return () => {
      starTexture.dispose();
      glowTexture.dispose();
    };
  }, [glowTexture, starTexture]);

  useFrame((_, delta) => {
    if (!starGroup.current || isPaused) {
      return;
    }

    starGroup.current.rotation.y +=
      delta *
      0.045 *
      simulationSpeed;
  });

  return (
    <group ref={starGroup}>
      <mesh position={[0, 0, -0.32]}>
        <planeGeometry
          args={[
            radius * 4.1,
            radius * 4.1,
          ]}
        />

        <meshBasicMaterial
          map={glowTexture}
          color="#ff7a18"
          transparent
          opacity={0.82}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry
          args={[radius, 128, 128]}
        />

        <meshStandardMaterial
          map={starTexture}
          emissiveMap={starTexture}
          color="#fff0cb"
          emissive="#ff5a0a"
          emissiveIntensity={1.55}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      <mesh scale={1.035}>
        <sphereGeometry
          args={[radius, 96, 96]}
        />

        <meshBasicMaterial
          color="#ffb14a"
          transparent
          opacity={0.12}
          side={BackSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.085}>
        <sphereGeometry
          args={[radius, 80, 80]}
        />

        <meshBasicMaterial
          color="#ff6a18"
          transparent
          opacity={0.055}
          side={BackSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        color="#ffb05e"
        intensity={48}
        distance={22}
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
      { length: 161 },
      (_, index) => {
        const angle =
          (index / 160) *
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
      color="#d8a84f"
      lineWidth={1.25}
      transparent
      opacity={0.42}
      depthWrite={false}
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
  const planetGroup = useRef<Group>(null);
  const orbitProgress = useRef(0);
  const lastUpdateTime = useRef(0);
  const orbitUpdateCallback =
    useRef(onOrbitUpdate);

  const visualProfile = useMemo(
    () =>
      getPlanetVisualProfile(
        planetName,
      ),
    [planetName],
  );

  const planetTextures = useMemo(
    () =>
      createPlanetTextures(
        visualProfile,
      ),
    [visualProfile],
  );

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
        0.3 *
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

    const currentTime = performance.now();

    if (
      currentTime -
        lastUpdateTime.current >=
      50
    ) {
      orbitUpdateCallback.current?.(
        angle / (Math.PI * 2),
      );

      lastUpdateTime.current =
        currentTime;
    }
  });

  return (
    <group
      ref={planetGroup}
      rotation={[0.08, 0, 0.18]}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry
          args={[radius, 128, 128]}
        />

        <meshStandardMaterial
          map={
            planetTextures.colorTexture
          }
          bumpMap={
            planetTextures.bumpTexture
          }
          bumpScale={
            visualProfile.bumpScale *
            1.15
          }
          color="#ffffff"
          roughness={0.88}
          metalness={0.015}
          emissive="#080402"
          emissiveIntensity={0.025}
        />
      </mesh>

      <mesh scale={1.018}>
        <sphereGeometry
          args={[radius, 96, 96]}
        />

        <meshBasicMaterial
          color={
            visualProfile.atmosphereColor
          }
          transparent
          opacity={
            visualProfile.atmosphereOpacity *
            1.2
          }
          side={BackSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.045}>
        <sphereGeometry
          args={[radius, 80, 80]}
        />

        <meshBasicMaterial
          color={
            visualProfile.atmosphereColor
          }
          transparent
          opacity={
            visualProfile.atmosphereOpacity *
            0.28
          }
          side={BackSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ObservationWindow() {
  const rivets = [
    "left-3 top-3",
    "right-3 top-3",
    "bottom-3 left-3",
    "bottom-3 right-3",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-lg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 47%, transparent 46%, rgba(0,0,0,0.18) 76%, rgba(0,0,0,0.62) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(116deg, transparent 12%, rgba(255,255,255,0.018) 30%, rgba(255,210,155,0.038) 37%, transparent 48%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-3 border-b border-[#6b5945]/50 bg-gradient-to-b from-[#26231f] via-[#12110f] to-[#080807] shadow-[0_8px_22px_rgba(0,0,0,0.7)] sm:h-4" />

      <div className="absolute inset-x-0 bottom-0 h-3 border-t border-[#6b5945]/40 bg-gradient-to-t from-[#211f1b] via-[#11100e] to-[#080807] shadow-[0_-8px_22px_rgba(0,0,0,0.7)] sm:h-4" />

      <div className="absolute inset-y-0 left-0 w-3 border-r border-[#6b5945]/40 bg-gradient-to-r from-[#25221e] via-[#11100e] to-[#080807] shadow-[8px_0_22px_rgba(0,0,0,0.6)] sm:w-4" />

      <div className="absolute inset-y-0 right-0 w-3 border-l border-[#6b5945]/40 bg-gradient-to-l from-[#25221e] via-[#11100e] to-[#080807] shadow-[-8px_0_22px_rgba(0,0,0,0.6)] sm:w-4" />

      <div className="absolute inset-[11px] rounded-md border border-amber-200/[0.08] shadow-[inset_0_0_24px_rgba(255,186,96,0.035)] sm:inset-[15px]" />

      {rivets.map((position) => (
        <span
          key={position}
          className={`absolute ${position} size-1.5 rounded-full border border-[#776855]/70 bg-[#171512] shadow-[inset_0_0_2px_rgba(255,255,255,0.28)] sm:size-2`}
        />
      ))}
    </div>
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
    Math.min(90, orbitalInclination),
  );

  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden bg-[#010203]">
      <Canvas
        dpr={[1, 1.75]}
        shadows
        camera={{
          position: [0, 0, 7.15],
          fov: 43,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference:
            "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.08;
        }}
      >
        <color
          attach="background"
          args={["#010203"]}
        />

        <CameraRig />

        <ambientLight intensity={0.018} />

        <directionalLight
          position={[0, 2, 7]}
          color="#7990aa"
          intensity={0.055}
        />

        <Stars
          radius={48}
          depth={32}
          count={1550}
          factor={1.75}
          saturation={0.18}
          fade
          speed={
            isPaused
              ? 0
              : 0.055 *
                simulationSpeed
          }
        />

        <Stars
          radius={30}
          depth={14}
          count={260}
          factor={2.6}
          saturation={0.35}
          fade
          speed={
            isPaused
              ? 0
              : 0.025 *
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

        <EffectComposer
          multisampling={4}
          enableNormalPass={false}
        >
          <Bloom
            mipmapBlur
            intensity={0.72}
            luminanceThreshold={0.72}
            luminanceSmoothing={0.3}
          />

          <Vignette
            eskil={false}
            offset={0.16}
            darkness={0.58}
          />
        </EffectComposer>
      </Canvas>

      <ObservationWindow />
    </div>
  );
}
