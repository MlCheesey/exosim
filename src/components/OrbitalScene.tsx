"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

function Star() {
    return (
      <group>
        {/* Main visible surface of the star */}
        <mesh>
          <sphereGeometry args={[1.35, 64, 64]} />
          <meshStandardMaterial
            color="#f0c982"
            emissive="#b9682f"
            emissiveIntensity={1.6}
            roughness={0.8}
          />
        </mesh>
  
        {/* Light emitted by the star */}
        <pointLight
          color="#f2b45f"
          intensity={32}
          distance={18}
          decay={2}
        />
      </group>
    );
  }

function Planet() {
    return (
        <mesh position={[2.7, 0.2, 0.5]}>
            <sphereGeometry args={[0.38, 48, 48]} />
            <meshStandardMaterial
            color="#703d32"
            roughness={0.9}
            metalness={0.05}
            />
        </mesh>
    )
}

export default function OrbitalScene() {
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
          <ambientLight intensity={0.12} />
  
          <Stars
            radius={45}
            depth={25}
            count={900}
            factor={2}
            saturation={0}
            fade
            speed={0.15}
          />
  
          <Star />
          <Planet />
        </Canvas>
      </div>
    );
  }