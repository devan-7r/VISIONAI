import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFx } from '../utils/audio';
import { Camera, FastForward, Sparkles } from 'lucide-react';

export const CinematicIntro = ({ onComplete }) => {
  const mountRef = useRef(null);
  const [stage, setStage] = useState('focus'); // 'focus', 'flash', 'portal', 'done'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup - Light Goldenrod Yellow Backdrop for Intro Photoshoot
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fafad2'); // Light Goldenrod Yellow Backdrop
    scene.fog = new THREE.FogExp2('#fafad2', 0.04);

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.1, 3.6);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Environment (Bright Studio Photoshoot)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key Light (Front Right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light (Soft Warm Tint)
    const fillLight = new THREE.DirectionalLight(0xfef08a, 1.5);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    // Rim Light (Backlight for Chrome Reflections)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Dynamic Flash & Portal Light inside Camera Lens
    const flashLight = new THREE.PointLight(0xffffff, 0, 10);
    flashLight.position.set(0, 0, 0.6);
    scene.add(flashLight);

    // 5. Studio Floor Plane (Light Goldenrod Yellow Floor)
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#fafad2',
      roughness: 0.3,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.75;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Detailed Vintage Rangefinder Camera Assembly (Scales down for sleek aesthetic)
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(0, 0, 0);
    cameraGroup.scale.setScalar(0.72); // Reduced scale for refined, elegant proportioning

    // Materials - Sleek Metallic Two-Tone Palette
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Polished Titanium Platinum Silver
      metalness: 0.95,
      roughness: 0.12
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Warm Champagne Gold Accent
      metalness: 0.9,
      roughness: 0.15
    });

    const darkLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x090d16, // Rich Deep Obsidian Black Leatherette Body
      roughness: 0.85,
      metalness: 0.1
    });

    const blackAnodizedMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.25,
      metalness: 0.95
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d9488, // Emerald Cyan Multi-Coated Lens Glass
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.92,
      thickness: 0.4,
      ior: 1.52,
      clearcoat: 1.0
    });

    // A. Main Body Base (Textured Deep Obsidian Leatherette)
    const bodyGeo = new THREE.BoxGeometry(1.65, 0.76, 0.46);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkLeatherMat);
    bodyMesh.castShadow = true;
    cameraGroup.add(bodyMesh);

    // Front Iconic Red Dot Badge Accent (Upper Right)
    const redDotGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
    redDotGeo.rotateX(Math.PI / 2);
    const redDotMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const redDot = new THREE.Mesh(redDotGeo, redDotMat);
    redDot.position.set(-0.6, 0.22, 0.24);
    cameraGroup.add(redDot);

    // B. Top Silver Chrome Plate
    const topPlateGeo = new THREE.BoxGeometry(1.66, 0.28, 0.47);
    const topPlate = new THREE.Mesh(topPlateGeo, chromeMat);
    topPlate.position.set(0, 0.48, 0);
    topPlate.castShadow = true;
    cameraGroup.add(topPlate);

    // C. Bottom Silver Chrome Plate
    const bottomPlateGeo = new THREE.BoxGeometry(1.66, 0.1, 0.47);
    const bottomPlate = new THREE.Mesh(bottomPlateGeo, chromeMat);
    bottomPlate.position.set(0, -0.42, 0);
    cameraGroup.add(bottomPlate);

    // D. Front Central Multi-Ring Lens Barrel
    const lensGroup = new THREE.Group();
    lensGroup.position.set(0, -0.05, 0.23);

    // Base Chrome Ring
    const lensBaseGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.22, 32);
    lensBaseGeo.rotateX(Math.PI / 2);
    const lensBase = new THREE.Mesh(lensBaseGeo, chromeMat);
    lensBase.position.set(0, 0, 0.11);
    lensGroup.add(lensBase);

    // Gold Accent Ring
    const goldRingGeo = new THREE.TorusGeometry(0.41, 0.012, 16, 32);
    const goldRing = new THREE.Mesh(goldRingGeo, goldAccentMat);
    goldRing.position.set(0, 0, 0.23);
    lensGroup.add(goldRing);

    // Middle Black Aperture Ring
    const apertureRingGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    apertureRingGeo.rotateX(Math.PI / 2);
    const apertureRing = new THREE.Mesh(apertureRingGeo, blackAnodizedMat);
    apertureRing.position.set(0, 0, 0.22);
    lensGroup.add(apertureRing);

    // Outer Silver Bezel
    const outerBezelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 32);
    outerBezelGeo.rotateX(Math.PI / 2);
    const outerBezel = new THREE.Mesh(outerBezelGeo, chromeMat);
    outerBezel.position.set(0, 0, 0.32);
    lensGroup.add(outerBezel);

    // Front Optics Convex Glass Element
    const glassGeo = new THREE.SphereGeometry(0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    glassGeo.rotateX(Math.PI / 2);
    const lensGlass = new THREE.Mesh(glassGeo, glassMat);
    lensGlass.position.set(0, 0, 0.35);
    lensGroup.add(lensGlass);

    cameraGroup.add(lensGroup);

    // E. Top Control Knobs & Shutter Button (Matching User Image)
    // 1. Shutter Release Button (Right Top)
    const shutterBtnGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.14, 16);
    const shutterBtn = new THREE.Mesh(shutterBtnGeo, chromeMat);
    shutterBtn.position.set(0.55, 0.68, 0);
    cameraGroup.add(shutterBtn);

    // 2. Shutter Speed Dial (Right Top Middle)
    const speedDialGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.09, 24);
    const speedDial = new THREE.Mesh(speedDialGeo, chromeMat);
    speedDial.position.set(0.28, 0.65, 0);
    cameraGroup.add(speedDial);

    // 3. Film Advance Lever
    const leverGeo = new THREE.BoxGeometry(0.28, 0.03, 0.08);
    const lever = new THREE.Mesh(leverGeo, chromeMat);
    lever.position.set(0.68, 0.63, 0);
    lever.rotation.y = -0.3;
    cameraGroup.add(lever);

    // 4. ISO Rewind Knob (Left Top)
    const rewindKnobGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 24);
    const rewindKnob = new THREE.Mesh(rewindKnobGeo, chromeMat);
    rewindKnob.position.set(-0.55, 0.66, 0);
    cameraGroup.add(rewindKnob);

    // 5. Cold Shoe Mount (Top Center)
    const coldShoeGeo = new THREE.BoxGeometry(0.16, 0.04, 0.16);
    const coldShoe = new THREE.Mesh(coldShoeGeo, chromeMat);
    coldShoe.position.set(0, 0.64, 0);
    cameraGroup.add(coldShoe);

    // F. Optical Viewfinder Window (Top Front Right)
    const vfGeo = new THREE.BoxGeometry(0.18, 0.12, 0.06);
    const vfWindow = new THREE.Mesh(vfGeo, glassMat);
    vfWindow.position.set(0.42, 0.48, 0.22);
    cameraGroup.add(vfWindow);

    // G. Rangefinder Focus Window (Top Front Left)
    const rfGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16);
    rfGeo.rotateX(Math.PI / 2);
    const rfWindow = new THREE.Mesh(rfGeo, glassMat);
    rfWindow.position.set(-0.35, 0.48, 0.22);
    cameraGroup.add(rfWindow);

    // H. Self-Timer Front Lever (Front Left Body)
    const timerLeverGeo = new THREE.BoxGeometry(0.05, 0.22, 0.04);
    const timerLever = new THREE.Mesh(timerLeverGeo, chromeMat);
    timerLever.position.set(-0.45, -0.08, 0.24);
    timerLever.rotation.z = -0.2;
    cameraGroup.add(timerLever);

    scene.add(cameraGroup);

    // 7. Animation State Loop & Photoshoot Sequence
    let startTime = performance.now();
    let frameId;
    let flashed = false;
    let shutterTriggered = false;

    const animate = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000; // elapsed time in seconds
      const normProgress = Math.min(elapsed / 2.8, 1);
      setProgress(Math.round(normProgress * 100));

      // Gentle handheld breathing oscillation
      cameraGroup.rotation.y = Math.sin(elapsed * 1.5) * 0.03;
      cameraGroup.rotation.x = Math.sin(elapsed * 2.0) * 0.015;

      // Lens aperture ring photoshoot rotation
      apertureRing.rotation.z = elapsed * 3.0;

      // Stage 1: Photoshoot Focus & Beep (0.6s)
      if (elapsed > 0.6 && !shutterTriggered) {
        shutterTriggered = true;
        soundFx.playFocusBeep();
        // Shutter release button depresses
        shutterBtn.position.y = 0.63;
      }

      // Stage 2: Photoshoot Mechanical Shutter Click & Camera Flash (1.8s)
      if (elapsed > 1.8 && !flashed) {
        flashed = true;
        setStage('flash');
        soundFx.playShutterSound();
        flashLight.intensity = 25;
        shutterBtn.position.y = 0.68;
      }

      // Stage 3: Camera Flash / Lens Portal Expansion into Dashboard (2.0s - 2.8s)
      if (elapsed > 2.0) {
        setStage('portal');
        flashLight.intensity = Math.min((elapsed - 2.0) * 35, 60);
        lensGlass.scale.setScalar(1 + (elapsed - 2.0) * 8);
        camera.position.z = Math.max(3.6 - (elapsed - 2.0) * 3.2, 0.4);
      }

      // Stage 4: Transition to Main Dashboard
      if (elapsed >= 2.8) {
        setStage('done');
        onComplete();
        return;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#fafad2] overflow-hidden font-sans select-none">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-pointer" />

      {/* Camera Shutter Flash Screen Overlay */}
      {stage === 'flash' && (
        <div className="absolute inset-0 bg-white opacity-95 transition-opacity duration-300 pointer-events-none z-40" />
      )}

      {/* Lens Flash Portal Zoom Tunnel Effect */}
      {stage === 'portal' && (
        <div className="absolute inset-0 bg-radial-gradient from-teal-400/50 via-amber-400/30 to-dark-900/95 animate-pulse pointer-events-none z-30" />
      )}

      {/* Top Header Overlay Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50 pointer-events-auto">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-300 shadow-md">
          <Camera className="w-5 h-5 text-slate-800 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-slate-800 uppercase font-semibold">
            Classic Rangefinder Photoshoot &bull; {stage === 'focus' ? 'Autofocus Active' : stage === 'flash' ? 'Shutter Fired' : 'Opening Dashboard'}
          </span>
        </div>

        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
        >
          <span>Skip Intro</span>
          <FastForward className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Progress Bar & Title */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 pointer-events-none">
        <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>VisionAI Classic Studio</span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-300 rounded-full overflow-hidden border border-slate-400/60">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-amber-500 to-teal-400 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
