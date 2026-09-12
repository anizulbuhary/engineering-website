import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type Part = {
  mesh: THREE.Mesh;
  system: string;
  level: number;
  materials: THREE.MeshStandardMaterial[];
  shadowMaterial: THREE.MeshDepthMaterial;
  edges?: THREE.LineSegments;
};
// The camera and building systems share one reversible scroll timeline.
const shots = [
  {
    angle: 0.68,
    height: 0.43,
    distance: 28,
    spread: 0,
    facade: 1,
    solid: 1,
    rebar: 0,
    services: 0,
    drawing: 0,
  },
  {
    angle: 1.2,
    height: 0.36,
    distance: 30,
    spread: 0.28,
    facade: 0,
    solid: 1,
    rebar: 0,
    services: 0,
    drawing: 0,
  },
  {
    angle: 1.95,
    height: 0.28,
    distance: 30,
    spread: 0.55,
    facade: 0,
    solid: 0.055,
    rebar: 1,
    services: 0,
    drawing: 0.22,
  },
  {
    angle: 2.65,
    height: 0.53,
    distance: 32,
    spread: 0.65,
    facade: 0,
    solid: 0.065,
    rebar: 0,
    services: 1,
    drawing: 0.25,
  },
  {
    angle: Math.PI,
    height: 0.025,
    distance: 31,
    spread: 0.22,
    facade: 0,
    solid: 0.025,
    rebar: 0,
    services: 0,
    drawing: 1,
  },
  {
    angle: Math.PI * 2 + 0.68,
    height: 0.43,
    distance: 28,
    spread: 0,
    facade: 1,
    solid: 1,
    rebar: 0,
    services: 0,
    drawing: 0,
  },
];

export function mountEngineeringScene(
  host: HTMLElement,
  onReady: () => void,
  onFailure: () => void,
) {
  const compact = matchMedia("(max-width: 767px), (max-height: 600px)").matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 150);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const studio = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.05);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.42;
  studio.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe8ece6, 0x52493d, 0.95));
  const key = new THREE.DirectionalLight(0xffedda, 2.6);
  key.position.set(10, 24, 14);
  key.target.position.set(0, 5, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
  key.shadow.camera.left = key.shadow.camera.bottom = -13;
  key.shadow.camera.right = key.shadow.camera.top = 13;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 60;
  key.shadow.normalBias = 0.018;
  key.shadow.bias = -0.00008;
  key.shadow.radius = 2.2;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xd8e2e1, 0.65);
  rim.position.set(-10, 12, -8);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xe9d3bb, 0.3);
  fill.position.set(8, 4, -10);
  scene.add(fill);
  const grid = createGroundGrid();
  grid.position.y = -1;
  scene.add(grid);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ opacity: 0.25 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1;
  shadow.receiveShadow = true;
  scene.add(shadow);
  const parts: Part[] = [];
  const target = new THREE.Vector3(0, 5.4, 0);
  let desired = 0,
    current = 0,
    frame = 0,
    lastTime = 0;
  let visible = false,
    disposed = false,
    loaded = false;
  let previousShadowState = "";
  // Only the technical overlay changes tone. Model materials, lighting and the
  // reversible camera timeline remain independent of the page appearance.
  const drawingInk = new THREE.Color();
  const updateDrawingInk = () => {
    drawingInk.set(
      getComputedStyle(host).getPropertyValue("--story-drawing-ink").trim(),
    );
    for (const part of parts) {
      if (part.edges)
        (part.edges.material as THREE.LineBasicMaterial).color.copy(drawingInk);
    }
    if (loaded && !disposed && visible && !document.hidden) renderFrame();
  };
  updateDrawingInk();
  const appearanceObserver = new MutationObserver(updateDrawingInk);
  appearanceObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const appearanceMedia = matchMedia("(prefers-color-scheme: dark)");
  appearanceMedia.addEventListener("change", updateDrawingInk);
  function draw(time: number) {
    frame = 0;
    if (disposed || !visible || document.hidden || !loaded) return;
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    current = THREE.MathUtils.damp(current, desired, 7, delta);
    if (Math.abs(current - desired) < 0.0001) current = desired;
    renderFrame();
    if (current !== desired) wake();
  }
  function renderFrame() {
    const p = current * (shots.length - 1);
    const index = Math.min(Math.floor(p), shots.length - 2);
    const local = p - index;
    const blend = local * local * (3 - 2 * local);
    const a = shots[index],
      b = shots[index + 1];
    const at = (k: keyof typeof a) => THREE.MathUtils.lerp(a[k], b[k], blend);
    // Camera-only movement reuses the same world-space shadow map. Geometry
    // separation and material fades invalidate it, in either scroll direction.
    const shadowState = [at("spread"), at("facade"), at("solid")]
      .map((value) => value.toFixed(5))
      .join("/");
    if (shadowState !== previousShadowState) {
      renderer.shadowMap.needsUpdate = true;
      previousShadowState = shadowState;
    }
    const centerHeight = 5.4 + 3.5 * at("spread");
    const distance = at("distance") * Math.max(1, 0.75 / camera.aspect);
    target.set(0, centerHeight, 0);
    camera.position.set(
      Math.sin(at("angle")) * distance,
      centerHeight + at("height") * distance,
      Math.cos(at("angle")) * distance,
    );
    camera.lookAt(target);
    for (const {
      mesh,
      system,
      level,
      materials,
      shadowMaterial,
      edges,
    } of parts) {
      mesh.position.y = level >= 0 ? level * at("spread") : 0;
      let opacity = 1;
      if (system === "facade") {
        opacity = at("facade");
      }
      if (system === "structure") opacity = at("solid");
      if (system === "rebar") opacity = at("rebar");
      if (system === "services") opacity = at("services");
      mesh.visible = opacity > 0.015;
      // Alpha-hashed depth fades shadows with their source geometry instead
      // of abruptly switching off the entire facade at 95% opacity.
      mesh.castShadow = system !== "rebar" && system !== "services";
      // Ghosted explanatory layers should not accumulate a dense, stippled
      // shadow through many overlapping floors. Keep the assembled shadow full.
      shadowMaterial.opacity = opacity ** 3;
      const fadingShadow = shadowMaterial.opacity < 1;
      if (shadowMaterial.alphaHash !== fadingShadow) {
        shadowMaterial.alphaHash = fadingShadow;
        shadowMaterial.needsUpdate = true;
      }
      for (const mat of materials) {
        mat.opacity = opacity;
        mat.depthWrite = opacity > 0.95;
      }
      if (edges) {
        edges.position.copy(mesh.position);
        (edges.material as THREE.LineBasicMaterial).opacity =
          at("drawing") * 0.72;
        edges.visible = at("drawing") > 0.02;
      }
    }
    renderer.render(scene, camera);
    renderer.domElement.dataset.progress = current.toFixed(4);
  }
  function refreshVisibility() {
    const rect = host.getBoundingClientRect();
    const next =
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < innerHeight &&
      rect.right > 0 &&
      rect.left < innerWidth;
    if (next && !visible) lastTime = performance.now();
    visible = next;
  }
  function wake(checkVisibility = false) {
    if (checkVisibility) refreshVisibility();
    if (!frame && !disposed && visible && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.fov = width / height < 1 ? 44 : 36;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    wake(true);
  }
  const resizer = new ResizeObserver(resize);
  resizer.observe(host);
  const observer = new IntersectionObserver(() => {
    // Read the current bounds instead of trusting an older queued entry.
    refreshVisibility();
    if (visible) {
      lastTime = performance.now();
      wake();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  observer.observe(host);
  const visibility = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = performance.now();
    if (!document.hidden) wake(true);
  };
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("pageshow", visibility);
  const contextLost = (event: Event) => {
    event.preventDefault();
    onFailure();
  };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  const controller = new AbortController();
  const loader = new GLTFLoader();
  fetch("/models/formwork-pavilion.glb", { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error("Model unavailable");
      return response.arrayBuffer();
    })
    .then((buffer) => loader.parseAsync(buffer, "/models/"))
    .then((gltf) => {
      if (disposed) {
        disposeObject(gltf.scene);
        return;
      }
      const originals = new Set<THREE.Material>();
      gltf.scene.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return;
        const metadata = node.userData.system
          ? node.userData
          : node.parent?.userData;
        const system = metadata?.system ?? "base";
        const materials = (
          Array.isArray(node.material) ? node.material : [node.material]
        ).map((mat) => {
          originals.add(mat);
          const clone = (mat as THREE.MeshStandardMaterial).clone();
          clone.transparent = true;
          if (system === "rebar" || system === "services") {
            clone.emissive.copy(clone.color);
            clone.emissiveIntensity = 0.25;
            clone.depthTest = false;
            node.renderOrder = 3;
          }
          return clone;
        });
        node.material = Array.isArray(node.material) ? materials : materials[0];
        const shadowMaterial = new THREE.MeshDepthMaterial();
        node.customDepthMaterial = shadowMaterial;
        node.receiveShadow = true;
        let edges: THREE.LineSegments | undefined;
        if (system === "structure")
          edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(node.geometry, 30),
            new THREE.LineBasicMaterial({
              color: drawingInk,
              transparent: true,
              opacity: 0,
            }),
          );
        parts.push({
          mesh: node,
          system,
          level: metadata?.level ?? -1,
          materials,
          shadowMaterial,
          edges,
        });
      });
      originals.forEach((mat) => mat.dispose());
      for (const part of parts)
        if (part.edges) part.mesh.parent?.add(part.edges);
      scene.add(gltf.scene);
      loaded = true;
      current = desired;
      resize();
      renderFrame();
      onReady();
      wake();
    })
    .catch((error) => {
      if (!disposed && error.name !== "AbortError") onFailure();
    });
  return {
    getProgress() {
      return current;
    },
    captureOpening() {
      // Read immediately after rendering: no persistent GPU drawing buffer.
      cancelAnimationFrame(frame);
      frame = 0;
      current = desired = 0;
      renderFrame();
      return renderer.domElement.toDataURL("image/png");
    },
    setProgress(value: number, immediate = false) {
      desired = THREE.MathUtils.clamp(value, 0, 1);
      if (immediate && loaded && !disposed) {
        current = desired;
        cancelAnimationFrame(frame);
        frame = 0;
        renderFrame();
      } else {
        // Scrolling must also wake the renderer when visibility notifications
        // are delayed after a fast return to the sticky section.
        wake(true);
      }
    },
    dispose() {
      disposed = true;
      controller.abort();
      environment.dispose();
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      appearanceObserver.disconnect();
      appearanceMedia.removeEventListener("change", updateDrawingInk);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pageshow", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      disposeObject(scene);
      renderer.dispose();
      if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

/** Neutral, transparent ground lines work over either theme and in the paused
 * PNG. Subdivided segments allow their vertex alpha to fade before the perimeter. */
function createGroundGrid() {
  const positions: number[] = [];
  const colors: number[] = [];
  const ink = new THREE.Color(0x77766f);
  const vertex = (x: number, z: number) => {
    const opacity =
      (1 - THREE.MathUtils.smoothstep(Math.hypot(x, z), 7, 16)) * 0.12;
    positions.push(x, 0, z);
    colors.push(ink.r, ink.g, ink.b, opacity);
  };
  for (let line = -16; line <= 16; line++) {
    for (let step = -16; step < 16; step++) {
      vertex(line, step);
      vertex(line, step + 1);
      vertex(step, line);
      vertex(step + 1, line);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((node) => {
    if (node instanceof THREE.Mesh || node instanceof THREE.LineSegments) {
      node.geometry.dispose();
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      materials.forEach((mat) => mat.dispose());
      if (node instanceof THREE.Mesh) node.customDepthMaterial?.dispose();
    }
  });
}
