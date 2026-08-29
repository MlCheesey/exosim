"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { BufferAttribute, BufferGeometry, MathUtils } from "three";
import type { Group, Vector3 } from "three";
import { getPlanetVisualProfile } from "@/data/planetVisualProfiles";

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

function getOrbitPoint(angle: number, inclination: number) {
  const tilt = MathUtils.degToRad(inclination);

  return [Math.cos(angle) * 3.2, 0.12 + Math.sin(angle) * 4 * Math.cos(tilt), Math.sin(angle) * 2.25 * Math.sin(tilt)] as const;
}

function setOrbitPosition(position: Vector3, angle: number, inclination: number) {
  const tilt = MathUtils.degToRad(inclination);
  position.set(
    Math.cos(angle) * 3.2,
    0.12 + Math.sin(angle) * 4 * Math.cos(tilt),
    Math.sin(angle) * 2.25 * Math.sin(tilt),
  );
}

function CameraNudge() {
  useFrame((state, delta) => {
    const targetX = state.pointer.x * 0.12;
    const targetY = state.pointer.y * 0.08;

    state.camera.position.x = MathUtils.damp(state.camera.position.x, targetX, 2.4, delta);
    state.camera.position.y = MathUtils.damp(state.camera.position.y, targetY, 2.4, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function OrbitPath({ inclination }: { inclination: number }) {
  const geometry = useRef<BufferGeometry>(null);

  useEffect(() => {
    const pointCount = 140;
    const positions = new Float32Array(pointCount * 3);

    for (let index = 0; index < pointCount; index += 1) {
      const angle = (index / (pointCount - 1)) * Math.PI * 2;
      const [x, y, z] = getOrbitPoint(angle, inclination);
      const offset = index * 3;

      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = z;
    }

    geometry.current?.setAttribute("position", new BufferAttribute(positions, 3));
  }, [inclination]);

  return (
    <line>
      <bufferGeometry ref={geometry} />
      <lineBasicMaterial color="#b98b3a" transparent opacity={0.55} />
    </line>
  );
}

function Star({ radius, paused, speed }: { radius: number; paused: boolean; speed: number }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current || paused) {
      return;
    }

    group.current.rotation.y += delta * 0.08 * speed;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[radius, 80, 80]} />
        <meshStandardMaterial
          color="#f6c56f"
          emissive="#a94d19"
          emissiveIntensity={1.7}
          roughness={0.78}
        />
      </mesh>

      <mesh scale={1.16}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color="#c8752d" transparent opacity={0.14} depthWrite={false} />
      </mesh>

      <pointLight color="#e8a958" intensity={42} distance={22} decay={2} />
    </group>
  );
}

function Planet({
  radius,
  name,
  inclination,
  paused,
  speed,
  resetSignal,
  onOrbitUpdate,
}: {
  radius: number;
  name?: string;
  inclination: number;
  paused: boolean;
  speed: number;
  resetSignal: number;
  onOrbitUpdate?: (phase: number) => void;
}) {
  const group = useRef<Group>(null);
  const orbitAngle = useRef(0);
  const lastPhaseUpdate = useRef(0);

  const profile = getPlanetVisualProfile(name);
  const planetColor = `rgb(${profile.lowlandColor.join(",")})`;
  const highlandColor = `rgb(${profile.highlandColor.join(",")})`;

  useEffect(() => {
    orbitAngle.current = 0;
    if (group.current) {
      setOrbitPosition(group.current.position, 0, inclination);
    }
    onOrbitUpdate?.(0);
  }, [inclination, onOrbitUpdate, resetSignal]);

  useFrame((state, delta) => {
    if (!group.current) {
      return;
    }

    if (!paused) {
      orbitAngle.current = (orbitAngle.current + delta * 0.45 * speed) % (Math.PI * 2);
      group.current.rotation.y += delta * 0.45 * speed;
    }

    setOrbitPosition(group.current.position, orbitAngle.current, inclination);

    if (state.clock.elapsedTime - lastPhaseUpdate.current > 0.05) {
      onOrbitUpdate?.(orbitAngle.current / (Math.PI * 2));
      lastPhaseUpdate.current = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={group} rotation={[0.1, 0, 0.16]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={planetColor}
          emissive={highlandColor}
          emissiveIntensity={0.04}
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      <mesh scale={1.04}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color={profile.atmosphereColor}
          transparent
          opacity={profile.atmosphereOpacity}
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
  orbitalInclination = 89,
  isPaused = false,
  simulationSpeed = 1,
  resetSignal = 0,
  onOrbitUpdate,
}: OrbitalSceneProps) {
  const scenePlanetRadius = MathUtils.clamp(0.22 + Math.sqrt(planetRadius) * 0.16, 0.3, 0.95);
  const sceneStarRadius = MathUtils.clamp(0.72 + starRadius * 0.56, 0.8, 1.9);
  const safeInclination = MathUtils.clamp(orbitalInclination, 0, 90);

  return (
    <div className="relative h-full min-h-[360px] overflow-hidden bg-[#020202]">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.1, 7.2], fov: 44 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#020202"]} />
        <CameraNudge />

        <ambientLight intensity={0.035} />
        <directionalLight position={[3, 4, 6]} intensity={0.1} color="#c7b89d" />

        <Stars radius={48} depth={28} count={700} factor={1.35} saturation={0.15} fade speed={0.015} />
        <OrbitPath inclination={safeInclination} />
        <Star radius={sceneStarRadius} paused={isPaused} speed={simulationSpeed} />
        <Planet
          radius={scenePlanetRadius}
          name={planetName}
          inclination={safeInclination}
          paused={isPaused}
          speed={simulationSpeed}
          resetSignal={resetSignal}
          onOrbitUpdate={onOrbitUpdate}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 rounded border border-stone-800 bg-black/45 px-3 py-2 font-mono text-xs text-stone-500">
        Earth view
      </div>
    </div>
  );
}
