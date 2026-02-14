'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import ComputerScreen from './screens/ComputerScreen';
import Joystick from './Joystick';
import { useIsMobile } from '../hooks/useIsMobile';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

function ScifiPC() {
  const { scene } = useGLTF('/models/environment/scifi_pc.glb');
  return <primitive object={scene} position={[0, 0, -2.5]} scale={2} />;
}

// const DESK_POSITION: [number, number, number] = [0.75, 0, 2];

// function Desk() {
//   const { scene } = useGLTF('/models/environment/desk.glb');
//   return <primitive object={scene} position={DESK_POSITION} scale={1} />;
// }

function Player({ onPositionChange, onRotationChange, pcPosition, cameraAngle, onInteractAvailable, isInteracting, onBoundaryHit, joystickRef }: {
  onPositionChange: (pos: [number, number, number]) => void;
  onRotationChange: (rot: number) => void;
  pcPosition: [number, number, number];
  cameraAngle: number;
  onInteractAvailable: (canInteract: boolean) => void;
  isInteracting: boolean;
  onBoundaryHit: () => void;
  joystickRef: React.RefObject<{ x: number; z: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/character/player.glb');
  const { actions, names } = useAnimations(animations, groupRef);
  const GROUND_LEVEL = -0.5;
  const BOUNDARY_LIMIT = 16;
  const [position, setPosition] = useState<[number, number, number]>([0, GROUND_LEVEL, -8]);
  const [rotation, setRotation] = useState(Math.PI);
  const [isMoving, setIsMoving] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());
  const movementDirection = useRef<{ x: number; z: number }>({ x: 0, z: 0 });

  useEffect(() => {
    console.log('Available animations:', names);
  }, [names]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (actions) {
        const waveAction = actions['wave'] || actions['Wave'] || actions['Waving'] || actions['CharacterArmature|Wave'];
        if (waveAction) {
          waveAction.reset().setLoop(THREE.LoopOnce, 1).play();
          waveAction.clampWhenFinished = true;
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [actions]);

  useEffect(() => {
    if (actions) {
      const walkAction = actions['walk'] || actions['Walk'] || actions['Walking'] || actions['CharacterArmature|Walk'];
      if (walkAction) {
        if (isMoving) {
          walkAction.reset().fadeIn(0.2).play();
        } else {
          walkAction.fadeOut(0.2);
        }
      }
    }
  }, [isMoving, actions]);

  useEffect(() => {
    onPositionChange(position);
  }, [position, onPositionChange]);

  useEffect(() => {
    onRotationChange(rotation);
  }, [rotation, onRotationChange]);

  useEffect(() => {
    if (isInteracting && actions) {
      const interactAction =
        actions['Interact'] ||
        actions['interact'] ||
        actions['Typing'] ||
        actions['typing'] ||
        actions['CharacterArmature|Interact'];
      if (interactAction) {
        interactAction.reset().setLoop(THREE.LoopOnce, 1).play();
        interactAction.clampWhenFinished = true;
      }
    }
  }, [isInteracting, actions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysPressed.current.add(key);
        setIsMoving(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
      if (keysPressed.current.size === 0) {
        setIsMoving(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const [x, , z] = position;
    const [pcX, , pcZ] = pcPosition;
    const distanceToPc = Math.sqrt(Math.pow(x - pcX, 2) + Math.pow(z - pcZ, 2));

    const isInFrontOfPc = z < pcZ;
    const isWithinXRange = Math.abs(x - pcX) < 2;
    const canInteract = distanceToPc < 2.5 && isInFrontOfPc && isWithinXRange;
    onInteractAvailable(canInteract);

    const jx = joystickRef.current.x;
    const jz = joystickRef.current.z;
    const hasJoystick = Math.abs(jx) > 0.05 || Math.abs(jz) > 0.05;

    if (!hasJoystick && keysPressed.current.size === 0) {
      setIsMoving(false);
    }

    if (!isInteracting && (keysPressed.current.size > 0 || hasJoystick)) {
      const speed = 2.5 * delta;

      let moveX = 0;
      let moveZ = 0;

      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        moveX += Math.sin(cameraAngle) * speed;
        moveZ += Math.cos(cameraAngle) * speed;
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        moveX -= Math.sin(cameraAngle) * speed;
        moveZ -= Math.cos(cameraAngle) * speed;
      }
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        moveX += Math.sin(cameraAngle + Math.PI / 2) * speed;
        moveZ += Math.cos(cameraAngle + Math.PI / 2) * speed;
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        moveX += Math.sin(cameraAngle - Math.PI / 2) * speed;
        moveZ += Math.cos(cameraAngle - Math.PI / 2) * speed;
      }

      if (hasJoystick) {
        moveX += (Math.sin(cameraAngle) * jz + Math.sin(cameraAngle - Math.PI / 2) * jx) * speed * 2;
        moveZ += (Math.cos(cameraAngle) * jz + Math.cos(cameraAngle - Math.PI / 2) * jx) * speed * 2;
        setIsMoving(true);
      }

      const newX = x + moveX;
      const newZ = z + moveZ;
      const newPos: [number, number, number] = [newX, GROUND_LEVEL, newZ];

      if (Math.abs(newX) > BOUNDARY_LIMIT || Math.abs(newZ) > BOUNDARY_LIMIT) {
        onBoundaryHit();
        const angleToPC = Math.atan2(pcX - x, pcZ - z);
        setRotation(angleToPC);
        return;
      }

      if (!checkCollision(newPos)) {
        setPosition(newPos);

        if (moveX !== 0 || moveZ !== 0) {
          movementDirection.current = { x: moveX, z: moveZ };
          const targetRotation = Math.atan2(moveX, moveZ);
          const rotDiff = targetRotation - rotation;
          const normalizedDiff = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
          setRotation(rotation + normalizedDiff * 0.15);
        }
      }
    }
  });

  const checkCollision = (newPos: [number, number, number]): boolean => {
    const [newX, , newZ] = newPos;

    // SciFi PC
    const [pcX, , pcZ] = pcPosition;
    if (Math.sqrt(Math.pow(newX - pcX, 2) + Math.pow(newZ - pcZ, 2)) < 1.5) return true;

    // // Desk
    // if (Math.sqrt(Math.pow(newX - DESK_POSITION[0], 2) + Math.pow(newZ - DESK_POSITION[2], 2)) < 1.5) return true;

    return false;
  };

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      <primitive object={scene} scale={1} />
    </group>
  );
}

function CameraController({ target, onCameraAngleChange, isInteracting, pcPosition, isMobile }: {
  target: [number, number, number];
  onCameraAngleChange: (angle: number) => void;
  isInteracting: boolean;
  pcPosition: [number, number, number];
  isMobile: boolean;
}) {
  const { camera, gl } = useThree();
  const [cameraAngle, setCameraAngle] = useState(6.2);
  const [cameraPitch, setCameraPitch] = useState(0);
  const touchRef = useRef<{ id: number; lastX: number; lastY: number } | null>(null);

  useEffect(() => {
    onCameraAngleChange(cameraAngle);
  }, [cameraAngle, onCameraAngleChange]);

  useEffect(() => {
    const canvas = gl.domElement;

    // Desktop pointer lock
    const handleClick = () => {
      if (!isMobile) canvas.requestPointerLock();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas && !isInteracting) {
        const sensitivity = 0.002;
        setCameraAngle(prev => prev - e.movementX * sensitivity);
        setCameraPitch(prev => Math.max(-0.2, Math.min(Math.PI / 3, prev + e.movementY * sensitivity)));
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobile || isInteracting || touchRef.current !== null) return;
      const touch = e.changedTouches[0];
      const screenW = window.innerWidth;
      if (touch.clientX < screenW * 0.4) return;
      touchRef.current = { id: touch.identifier, lastX: touch.clientX, lastY: touch.clientY };
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobile || !touchRef.current) return;
      let touch: Touch | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchRef.current.id) {
          touch = e.changedTouches[i];
          break;
        }
      }
      if (!touch) return;
      const sensitivity = 0.005;
      const dx = touch.clientX - touchRef.current.lastX;
      const dy = touch.clientY - touchRef.current.lastY;
      setCameraAngle(prev => prev - dx * sensitivity);
      setCameraPitch(prev => Math.max(-0.2, Math.min(Math.PI / 3, prev + dy * sensitivity)));
      touchRef.current.lastX = touch.clientX;
      touchRef.current.lastY = touch.clientY;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchRef.current) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchRef.current.id) {
          touchRef.current = null;
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl, isInteracting, isMobile]);

  useFrame(() => {
    if (isInteracting) {
      const midpoint = new THREE.Vector3(
        (target[0] + pcPosition[0]) / 2,
        (target[1] + pcPosition[1]) / 2,
        (target[2] + pcPosition[2]) / 2
      );
      const sideAngle = Math.PI / 2;
      const sideDistance = 5;
      const idealPosition = new THREE.Vector3(
        midpoint.x + Math.cos(sideAngle) * sideDistance,
        midpoint.y + 1.5,
        midpoint.z + Math.sin(sideAngle) * sideDistance
      );
      camera.position.lerp(idealPosition, 0.05);
      camera.lookAt(midpoint.x, midpoint.y + 0.5, midpoint.z);
    } else {
      const distance = 4;
      const offsetX = Math.sin(cameraAngle) * distance * Math.cos(cameraPitch);
      const offsetZ = Math.cos(cameraAngle) * distance * Math.cos(cameraPitch);
      const height = 2 + distance * Math.sin(cameraPitch);
      const idealPosition = new THREE.Vector3(
        target[0] - offsetX,
        target[1] + height,
        target[2] - offsetZ
      );
      camera.position.lerp(idealPosition, 0.1);
      camera.lookAt(target[0], target[1] + 1, target[2]);
    }
  });

  return null;
}

function Spotlight({ targetPosition }: { targetPosition: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      lightRef.current.target.updateMatrixWorld();
    }
  }, [targetPosition]);

  return (
    <spotLight
      ref={lightRef}
      position={[targetPosition[0], 5, targetPosition[2] + 3]}
      angle={0.9}
      penumbra={0.8}
      intensity={200}
      distance={15}
      color="#fcf41a"
      castShadow
    />
  );
}

function SceneContent({ onInteractAvailableChange, isInteracting, isPlayingInteractAnim, onBoundaryHit, joystickRef, isMobile }: {
  onInteractAvailableChange: (available: boolean) => void;
  isInteracting: boolean;
  isPlayingInteractAnim: boolean;
  onBoundaryHit: () => void;
  joystickRef: React.RefObject<{ x: number; z: number }>;
  isMobile: boolean;
}) {
  const pcPosition: [number, number, number] = [0, 0, -2.5];
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, -0.5, 1]);
  const [playerRotation, setPlayerRotation] = useState(Math.PI);
  const [cameraAngle, setCameraAngle] = useState(Math.PI);

  const handlePositionChange = useCallback((pos: [number, number, number]) => setPlayerPosition(pos), []);
  const handleRotationChange = useCallback((rot: number) => setPlayerRotation(rot), []);
  const handleCameraAngleChange = useCallback((angle: number) => setCameraAngle(angle), []);
  const handleInteractAvailable = useCallback((available: boolean) => onInteractAvailableChange(available), [onInteractAvailableChange]);
  const handleBoundaryHit = useCallback(() => onBoundaryHit(), [onBoundaryHit]);

  return (
    <>
      <color attach="background" args={['#000000']} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>

      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Spotlight targetPosition={pcPosition} />
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#ffffff" />

      <Suspense fallback={null}>
        {/* {
          isMobile ?
            <Desk />
            :
            <ScifiPC />
        } */}
        <ScifiPC />
        <Player
          onPositionChange={handlePositionChange}
          onRotationChange={handleRotationChange}
          pcPosition={pcPosition}
          cameraAngle={cameraAngle}
          onInteractAvailable={handleInteractAvailable}
          isInteracting={isInteracting || isPlayingInteractAnim}
          onBoundaryHit={handleBoundaryHit}
          joystickRef={joystickRef}
        />
      </Suspense>

      <CameraController
        target={playerPosition}
        onCameraAngleChange={handleCameraAngleChange}
        isInteracting={isInteracting}
        pcPosition={pcPosition}
        isMobile={isMobile}
      />
    </>
  );
}

const QUESTS = [
  { id: 'personal', label: 'Extract Personal Information', optional: false },
  { id: 'career', label: 'Learn about career', optional: false },
  { id: 'skills', label: "Investigate target's skills", optional: false },
  { id: 'hobbies', label: "What are target's hobbies by the way?", optional: true },
];

function GameCheckmark({ done, color }: { done: boolean; color: string }) {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        flexShrink: 0,
        border: `1.5px solid ${done ? color : `${color}55`}`,
        borderRadius: 2,
        background: done ? `${color}33` : 'transparent',
        boxShadow: done ? `0 0 6px ${color}99` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
      }}
    >
      {done && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <polyline
            points="1.5,4.5 3.5,7 7.5,1.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function QuestHUD({ completedApps }: { completedApps: Set<string> }) {
  const mainDone = QUESTS.filter(q => !q.optional).every(q => completedApps.has(q.id));
  return (
    <div
      className="absolute right-4 pointer-events-none"
      style={{ top: '1rem', zIndex: 10, width: 230, fontFamily: 'monospace' }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.60)',
          border: '1px solid var(--primary)66',
          borderRadius: 6,
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 18px var(--primary)22',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '5px 10px',
          borderBottom: '1px solid var(--primary)33',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--primary)11',
        }}>
          <span style={{ color: 'var(--primary)', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em' }}>
            ◈ ACTIVE QUEST
          </span>
          {mainDone && (
            <span style={{ color: 'var(--success)', fontSize: 8, letterSpacing: '0.1em' }}>
              COMPLETE ✦
            </span>
          )}
        </div>

        {/* Operation title */}
        <div style={{ padding: '5px 10px 4px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'var(--body)', fontSize: 10, fontWeight: 600 }}>
            Operation: Data Breach
          </p>
        </div>

        {/* Quest items */}
        <div style={{ padding: '7px 10px 9px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {QUESTS.map(q => {
            const done = completedApps.has(q.id);
            const color = q.optional ? 'var(--warning)' : 'var(--primary)';
            return (
              <div key={q.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <GameCheckmark done={done} color={color} />
                <span style={{
                  fontSize: 9,
                  lineHeight: 1.4,
                  color: done ? 'var(--subtle)' : (q.optional ? 'var(--warning)' : 'var(--body)'),
                  textDecoration: done ? 'line-through' : 'none',
                  opacity: done ? 0.55 : 1,
                }}>
                  {q.optional && <span style={{ color: 'var(--warning)', opacity: 0.7, marginRight: 2 }}>[optional] </span>}
                  {q.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '4px 10px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 8, color: 'var(--subtle)', letterSpacing: '0.1em' }}>
            {completedApps.size}/{QUESTS.length} OBJECTIVES
          </span>
          <span style={{ fontSize: 8, color: 'var(--subtle)' }}>✦</span>
        </div>
      </div>
    </div>
  );
}

export default function Scene() {
  const [showHint, setShowHint] = useState(true);
  const [canInteract, setCanInteract] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPlayingInteractAnim, setIsPlayingInteractAnim] = useState(false);
  const [showBoundaryMessage, setShowBoundaryMessage] = useState(false);
  const [completedApps, setCompletedApps] = useState<Set<string>>(new Set());
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const joystickRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const isMobile = useIsMobile();

  const handleAppOpened = useCallback((appId: string) => {
    setCompletedApps(prev => new Set([...prev, appId]));
  }, []);

  useEffect(() => {
    const handlePointerLockChange = () => {
      setShowHint(document.pointerLockElement === null);
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && canInteract && !isInteracting && !isPlayingInteractAnim) {
        triggerInteract();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canInteract, isInteracting, isPlayingInteractAnim]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showMissionComplete && !isInteracting && !isPlayingInteractAnim) {
        if (e.key.toLowerCase() === 's') {
          setShowMissionComplete(false);
        } else if (e.key.toLowerCase() === 'r') {
          window.close();
        }
      }  
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMissionComplete, isInteracting, isPlayingInteractAnim]);

  const triggerInteract = () => {
    setIsPlayingInteractAnim(true);
    setTimeout(() => {
      setIsInteracting(true);
      setIsPlayingInteractAnim(false);
    }, 1200);
  };

  const handleExitScreen = () => setIsInteracting(false);

  const mainQuestsDone = QUESTS.filter(q => !q.optional).every(q => completedApps.has(q.id));

  const handleBoundaryHit = () => {
    if (mainQuestsDone) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      setShowMissionComplete(true);
    } else {
      setShowBoundaryMessage(true);
      setTimeout(() => setShowBoundaryMessage(false), 4000);
    }
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 2, 3.5], fov: 50, near: 0.1, far: 1000 }}
      >
        <SceneContent
          onInteractAvailableChange={setCanInteract}
          isInteracting={isInteracting}
          isPlayingInteractAnim={isPlayingInteractAnim}
          onBoundaryHit={handleBoundaryHit}
          joystickRef={joystickRef}
          isMobile={isMobile}
        />
      </Canvas>

      {!isInteracting && <QuestHUD completedApps={completedApps} />}

      {canInteract && !isInteracting && !isMobile && (
        <div className="absolute top-1/2 right-1/4 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-neutral-300/70 to-neutral-300/40 backdrop-blur-xs px-8 py-2 rounded-lg border border-neutral-400/40 shadow-lg">
            <p className="text-white text-lg font-bold flex items-center gap-2">
              Press <kbd className="bg-slate-300/20 border border-white px-3 py-1 rounded">E</kbd> to interact
            </p>
          </div>
        </div>
      )}

      {/* Mobile: tap button to interact */}
      {canInteract && !isInteracting && isMobile && (
        <button
          onClick={() => !isPlayingInteractAnim && triggerInteract()}
          className="absolute bottom-28 right-8 z-40 w-16 h-16 rounded-full bg-cyan-500/30 border-2 border-cyan-400/80 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
          style={{ boxShadow: '0 0 20px rgba(0,255,255,0.35)' }}
        >
          USE
        </button>
      )}

      {/* Mobile joystick */}
      {isMobile && !isInteracting && (
        <Joystick outputRef={joystickRef} />
      )}

      {/* Mobile camera hint */}
      {isMobile && !isInteracting && showHint && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <p className="text-white/50 text-xs font-mono bg-black/40 px-3 py-1 rounded-full">
            Drag right side to rotate camera
          </p>
        </div>
      )}

      {/* Boundary warning — only when main quests not done */}
      {showBoundaryMessage && !isInteracting && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-50 px-4"
          style={{
            background: "var(--gardient-subtitle)"
          }}
        >
          <div className="backdrop-blur-md px-6 py-5 rounded-lg shadow-2xl max-w-3/4 mx-auto"
            style={{
              background: "var(--gardient-subtitle)"
            }}
          >
            <p className="text-base font-bold text-center leading-relaxed">
              I don't have much time, I must extract information as soon as possible before I get caught
            </p>
          </div>
        </div>
      )}

      {/* Mission complete popup */}
      {showMissionComplete && !isInteracting && (
        <div className="absolute inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="flex flex-col items-center gap-5 px-8 py-7 rounded-lg max-w-sm w-full"
            style={{
              background: 'rgba(0,0,0,0.92)',
              border: '1px solid var(--primary)99',
              boxShadow: '0 0 40px var(--primary)33, 0 0 80px var(--primary)11',
              fontFamily: 'monospace',
            }}
          >
            {/* Header glyph */}
            <div style={{
              width: 48, height: 48,
              border: '1px solid var(--primary)',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--primary)22',
              boxShadow: '0 0 16px var(--primary)44',
              fontSize: 22,
              color: 'var(--primary)',
            }}>
              ✦
            </div>

            <div className="text-center flex flex-col gap-1">
              <p style={{ color: 'var(--primary)', fontSize: 11, fontWeight: 700, letterSpacing: '0.25em' }}>
                MISSION COMPLETE
              </p>
              <p style={{ color: 'var(--body)', fontSize: 15, fontWeight: 700 }}>
                Call for backup and retreat<br />with information
              </p>
              {
                !isMobile &&
                <caption style={{ color: 'var(--body)', fontSize: 9, fontWeight: 700 }}>
                  (Note: Press Esc key or designated keys to enable cursor)
                </caption>
              }
            </div>

            <div className="flex gap-3 w-full">
              {/* Retreat */}
              <button
                onClick={() => window.close()}
                className="flex-1 py-2 rounded transition-all active:scale-95"
                style={{
                  background: 'var(--primary)22',
                  border: '1px solid var(--primary)88',
                  color: 'var(--primary)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  fontFamily: 'monospace',
                  boxShadow: '0 0 10px var(--primary)22',
                }}
              >
                RETREAT [R]
              </button>

              {/* Stay */}
              <button
                onClick={() => setShowMissionComplete(false)}
                className="flex-1 py-2 rounded transition-all active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--muted)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  fontFamily: 'monospace',
                }}
              >
                STAY [S]
              </button>
            </div>
          </div>
        </div>
      )}

      {isInteracting && <ComputerScreen onExit={handleExitScreen} isMobile={isMobile} onAppOpened={handleAppOpened} />}
    </div>
  );
}
