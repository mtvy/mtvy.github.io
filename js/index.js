(() => {
  const canvas = document.getElementById('scene');

  if (!canvas || typeof THREE === 'undefined') {
    console.warn('3D background skipped: missing canvas or THREE.');
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030303, 0.018);

  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 18);

  const ambient = new THREE.AmbientLight(0xfef9f1, 0.35);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xd9b777, 0x050505, 0.6);
  scene.add(hemi);

  const particleGroup = new THREE.Group();
  scene.add(particleGroup);

  const particleCount = 6200;
  const positions = new Float32Array(particleCount * 3);
  const basePositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const colorA = new THREE.Color(0xd9b777);
  const colorB = new THREE.Color(0xb8844f);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < particleCount; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 6.5 + (Math.random() - 0.5) * 0.6;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const idx = i * 3;

    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    basePositions[idx] = x;
    basePositions[idx + 1] = y;
    basePositions[idx + 2] = z;

    tmpColor.copy(colorA).lerp(colorB, Math.random());
    colors[idx] = tmpColor.r;
    colors[idx + 1] = tmpColor.g;
    colors[idx + 2] = tmpColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const createParticleTexture = () => {
    const size = 128;
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureCanvas.height = size;
    const ctx = textureCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.08,
    map: createParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const spherePoints = new THREE.Points(geometry, particleMaterial);
  particleGroup.add(spherePoints);

  const clock = new THREE.Clock();
  const motionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  let reduceMotion = motionQuery ? motionQuery.matches : false;

  const handleMotionChange = (event) => {
    reduceMotion = event.matches;
  };

  if (motionQuery) {
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(handleMotionChange);
    }
  }

  const animate = () => {
    if (!reduceMotion) {
      const elapsed = clock.getElapsedTime();
      const positionAttr = geometry.getAttribute('position');
      const arr = positionAttr.array;

      for (let i = 0; i < particleCount; i += 1) {
        const idx = i * 3;
        const baseX = basePositions[idx];
        const baseY = basePositions[idx + 1];
        const baseZ = basePositions[idx + 2];
        const swell = 1 + Math.sin(elapsed * 0.4 + i * 0.12) * 0.015;

        arr[idx] = baseX * swell;
        arr[idx + 1] = baseY * swell + Math.cos(elapsed * 0.6 + baseZ) * 0.02;
        arr[idx + 2] = baseZ * swell;
      }

      positionAttr.needsUpdate = true;
      particleGroup.rotation.y += 0.0006;
      particleGroup.rotation.x = Math.sin(elapsed * 0.05) * 0.08;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  const onResize = () => {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };

  window.addEventListener('resize', onResize);
  animate();
})();