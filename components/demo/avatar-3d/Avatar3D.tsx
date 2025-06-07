// components/demo/avatar-3d/Avatar3D.tsx
import React, { Suspense, useMemo, useRef } from 'react'; // Import useRef
import { Canvas, useFrame } from '@react-three/fiber'; // Import useFrame
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type AvatarShape = 'sphere' | 'cube' | 'torus';
export type AvatarPattern = 'solid' | 'stripes' | 'polkaDots';

interface Avatar3DProps {
  bodyColor?: string;
  shape?: AvatarShape;
  pattern?: AvatarPattern;
  hasHat?: boolean;
  isTalking?: boolean; // New prop
}

// Helper to create a stripe texture
const createStripesTexture = (color1String: string, color2String: string, width: number = 128, height: number = 128): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d')!;

  context.fillStyle = color1String;
  context.fillRect(0, 0, width, height);

  context.fillStyle = color2String;
  const stripeWidth = width / 8;
  for (let i = 0; i < width / stripeWidth; i += 2) {
    context.fillRect(i * stripeWidth, 0, stripeWidth, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
};

// Helper to create a polka dot texture
const createPolkaDotsTexture = (color1String: string, color2String: string, width: number = 128, height: number = 128): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d')!;

  context.fillStyle = color1String;
  context.fillRect(0, 0, width, height);

  context.fillStyle = color2String;
  const dotRadius = width / 16;
  for (let i = 0; i < width / (dotRadius * 2.5); i++) {
    for (let j = 0; j < height / (dotRadius * 2.5); j++) {
      context.beginPath();
      context.arc(dotRadius + i * dotRadius * 2.5, dotRadius + j * dotRadius * 2.5, dotRadius, 0, 2 * Math.PI);
      context.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

// Helper component to render the dynamic shape
const DynamicShape: React.FC<{ shape: AvatarShape; color: string; pattern: AvatarPattern }> = ({ shape, color, pattern }) => {
  const geometry = useMemo(() => {
    switch (shape) {
      case 'cube':
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 16, 100]} />;
      case 'sphere':
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  }, [shape]);

  const materialProps = useMemo(() => {
    const primaryColorTHREE = new THREE.Color(color);
    const hsl = { h: 0, s: 0, l: 0 };
    primaryColorTHREE.getHSL(hsl);
    const secondaryColorTHREE = new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l > 0.5 ? hsl.l - 0.2 : hsl.l + 0.2);
    const secondaryColorHex = `#${secondaryColorTHREE.getHexString()}`;

    switch (pattern) {
      case 'stripes':
        return { map: createStripesTexture(color, secondaryColorHex) };
      case 'polkaDots':
        return { map: createPolkaDotsTexture(color, secondaryColorHex) };
      case 'solid':
      default:
        return { color: color };
    }
  }, [pattern, color]);

  return (
    <mesh>
      {geometry}
      <meshToonMaterial {...materialProps} />
    </mesh>
  );
};

const Hat: React.FC<{ shape: AvatarShape, hatColor: string }> = ({ shape, hatColor }) => {
  let hatYPosition = 0;
  let hatScale = 1;

  switch (shape) {
    case 'sphere':
      hatYPosition = 0.8;
      break;
    case 'cube':
      hatYPosition = 0.75 * 1.5;
      break;
    case 'torus':
      hatYPosition = 0.3;
      break;
  }
   if (shape === 'cube') {
    hatScale = 0.8;
  }

  return (
    <group position={[0, hatYPosition, 0]} scale={hatScale}>
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 32]} />
        <meshToonMaterial color={hatColor} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.6, 32]} />
        <meshToonMaterial color={hatColor} />
      </mesh>
    </group>
  );
};

const Avatar3D: React.FC<Avatar3DProps> = ({
  bodyColor = '#ffffff',
  shape = 'sphere',
  pattern = 'solid',
  hasHat = false,
  isTalking = false, // Default to not talking
}) => {
  const hatColor = useMemo(() => {
    const base = new THREE.Color(bodyColor);
    const hsl = { h: 0, s: 0, l: 0 };
    base.getHSL(hsl);
    return hsl.l > 0.5 ? '#333333' : '#D3D3D3';
  }, [bodyColor]);

  const avatarGroupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (isTalking && avatarGroupRef.current) {
      const time = clock.getElapsedTime();
      avatarGroupRef.current.position.y = Math.sin(time * 10) * 0.05;
    } else if (avatarGroupRef.current) {
      avatarGroupRef.current.position.y = 0;
    }
  });

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '200px', minWidth: '200px' }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <hemisphereLight skyColor={0xffffff} groundColor={0xaaaaaa} intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1.0}
          />
          <directionalLight
            position={[-10, 5, -5]}
            intensity={0.3}
            color={0xffccaa}
          />

          <group ref={avatarGroupRef}> {/* This group contains shape AND hat, and will bob */}
            <DynamicShape shape={shape} color={bodyColor} pattern={pattern} />
            {hasHat && <Hat shape={shape} hatColor={hatColor} />}
          </group>

          <OrbitControls enableZoom={true} target={[0, 0.5, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Avatar3D;
