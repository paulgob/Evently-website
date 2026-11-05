import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Event types scene, rendered in dithered pixels like the hero image.
// Scroll: each shape breaks into fragments and the next one rebuilds itself.
// Mouse: the shape leans slightly towards the pointer.

const PIXEL_SIZE = 4; // size of one rendered pixel, in CSS pixels
const SHAPE_SIZE = 6; // largest dimension of every shape, in scene units
const GRAY_LEVELS = 6; // #000, #333, #666, #999, #CCC, #FFF

// One stage per text block of the section
const stages = [
    "statue",
    "vinyl",
    "frame",
    "temple",
    "stopwatch",
    "reel",
    "curtain",
    "statue",
];

const section = document.querySelector("#event-types");
const canvas = document.querySelector("#pixel-scene");
const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;
const desktop = window.matchMedia("(min-width: 1024px)");

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.z = 14;

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
keyLight.position.set(-4, 4, 5);
scene.add(keyLight);

// ---------- Material: fragments + ordered dithering in GRAY_LEVELS grays ----------

const createMaterial = (explode) => {
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        vertexColors: true,
        roughness: 1,
        side: THREE.DoubleSide,
    });
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uExplode = explode;
        shader.vertexShader = shader.vertexShader
            .replace(
                "#include <common>",
                `#include <common>
                uniform float uExplode;
                attribute vec3 aOffset;
                attribute vec3 aCentroid;
                attribute float aDelay;`,
            )
            .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
                float t = clamp((uExplode - aDelay * 0.4) / 0.6, 0.0, 1.0);
                transformed = mix(transformed, aCentroid, t) + aOffset * t * t;`,
            );
        shader.fragmentShader = shader.fragmentShader
            .replace(
                "#include <common>",
                `#include <common>
                float bayer4(vec2 p) {
                    int index = int(mod(p.x, 4.0)) + int(mod(p.y, 4.0)) * 4;
                    float matrix[16] = float[16](0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0);
                    return (matrix[index] + 0.5) / 16.0;
                }`,
            )
            .replace(
                "#include <dithering_fragment>",
                `#include <dithering_fragment>
                float luminance = clamp(dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
                float steps = ${GRAY_LEVELS - 1}.0;
                float level = clamp(floor(luminance * steps + bayer4(gl_FragCoord.xy)), 0.0, steps);
                gl_FragColor = vec4(vec3(level / steps), 1.0);`,
            );
    };
    return material;
};

// ---------- Geometry helpers ----------

// Keeps position and normal only, gives the piece its shade (0 black, 1 white)
// then moves it into place
const part = (
    geometry,
    { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, shade = 1 } = {},
) => {
    const piece = geometry.index ? geometry.toNonIndexed() : geometry;
    for (const name of Object.keys(piece.attributes)) {
        if (name !== "position" && name !== "normal") piece.deleteAttribute(name);
    }
    const colors = new Float32Array(piece.attributes.position.count * 3).fill(shade);
    piece.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return piece.rotateX(rx).rotateY(ry).rotateZ(rz).translate(x, y, z);
};

// Box cut into small faces, so it breaks into enough fragments
const box = (width, height, depth) =>
    new THREE.BoxGeometry(
        width,
        height,
        depth,
        Math.ceil(width / 0.4),
        Math.ceil(height / 0.4),
        Math.ceil(depth / 0.4),
    );

// Centers the shape and scales it to SHAPE_SIZE
const fit = (geometry) => {
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    return geometry.scale(...Array(3).fill(SHAPE_SIZE / Math.max(size.x, size.y, size.z)));
};

// Gives every triangle a direction, a distance, a delay and its center
const addFragments = (geometry) => {
    geometry.computeBoundingSphere();
    const { radius } = geometry.boundingSphere;
    const positions = geometry.attributes.position;
    const offsets = new Float32Array(positions.count * 3);
    const centroids = new Float32Array(positions.count * 3);
    const delays = new Float32Array(positions.count);
    const centroid = new THREE.Vector3();
    const vertex = new THREE.Vector3();
    const direction = new THREE.Vector3();

    for (let i = 0; i < positions.count; i += 3) {
        centroid.set(0, 0, 0);
        for (let j = 0; j < 3; j++) {
            centroid.add(vertex.fromBufferAttribute(positions, i + j));
        }
        centroid.divideScalar(3);

        direction
            .copy(centroid)
            .normalize()
            .add(vertex.randomDirection().multiplyScalar(0.7))
            .normalize()
            .multiplyScalar(radius * (0.3 + Math.random() * 0.9));
        const delay = Math.random();

        for (let j = 0; j < 3; j++) {
            direction.toArray(offsets, (i + j) * 3);
            centroid.toArray(centroids, (i + j) * 3);
            delays[i + j] = delay;
        }
    }

    geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 3));
    geometry.setAttribute("aCentroid", new THREE.BufferAttribute(centroids, 3));
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
    return geometry;
};

// ---------- Shapes ----------

// Music: vinyl record and a sound wave behind it
const createVinyl = () => {
    const parts = [
        part(new THREE.CylinderGeometry(3, 3, 0.1, 96), { rx: Math.PI / 2, shade: 0.25 }),
        part(new THREE.CylinderGeometry(1.1, 1.1, 0.18, 64), { rx: Math.PI / 2 }),
        part(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16), { rx: Math.PI / 2, shade: 0 }),
    ];
    for (let radius = 1.4; radius < 2.9; radius += 0.22) {
        parts.push(
            part(new THREE.TorusGeometry(radius, 0.03, 6, 96), { z: 0.06, shade: 0.7 }),
        );
    }
    const wave = [];
    for (let x = -5.5; x <= 5.5; x += 0.1) {
        const envelope = 1 - Math.abs(x) / 5.5;
        wave.push(new THREE.Vector3(x, Math.sin(x * 2.4) * 1.4 * envelope, -0.8));
    }
    parts.push(
        part(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wave), 240, 0.08, 8)),
    );
    return mergeGeometries(parts).rotateX(-0.45);
};

// Visual arts: picture frame holding Vinci's circle and square
const createFrame = () => {
    const width = 4.4;
    const height = 5.6;
    const bar = 0.45;
    const parts = [
        part(box(width, bar, 0.35), { y: (height - bar) / 2 }),
        part(box(width, bar, 0.35), { y: -(height - bar) / 2 }),
        part(box(bar, height - bar * 2, 0.35), { x: (width - bar) / 2 }),
        part(box(bar, height - bar * 2, 0.35), { x: -(width - bar) / 2 }),
        part(new THREE.TorusGeometry(1.65, 0.06, 8, 96), { y: 0.25 }),
    ];
    const side = 2.8;
    parts.push(
        part(box(side, 0.1, 0.1), { y: side / 2 }),
        part(box(side, 0.1, 0.1), { y: -side / 2 }),
        part(box(0.1, side, 0.1), { x: side / 2 }),
        part(box(0.1, side, 0.1), { x: -side / 2 }),
    );
    return mergeGeometries(parts);
};

// Exhibition: classical temple with columns and pediment
const createTemple = () => {
    const parts = [
        part(box(6, 0.25, 3), { y: -2.6 }),
        part(box(5.6, 0.25, 2.6), { y: -2.35 }),
        part(box(5.2, 0.25, 2.2), { y: -2.1 }),
        part(box(5.4, 0.4, 2.2), { y: 1.78 }),
    ];
    for (let i = 0; i < 6; i++) {
        const x = -2.2 + i * 0.88;
        for (const z of [0.7, -0.7]) {
            parts.push(
                part(new THREE.CylinderGeometry(0.22, 0.26, 3.4, 16, 6), { x, y: -0.28, z }),
                part(box(0.6, 0.15, 0.6), { x, y: 1.5, z }),
            );
        }
    }
    const pediment = new THREE.Shape()
        .moveTo(-2.8, 0)
        .lineTo(2.8, 0)
        .lineTo(0, 1.1)
        .closePath();
    parts.push(
        part(new THREE.ExtrudeGeometry(pediment, { depth: 2.2, bevelEnabled: false }), {
            y: 1.98,
            z: -1.1,
        }),
    );
    return mergeGeometries(parts);
};

// Sport: stopwatch with dark dial, 12 ticks, one hand, crown and pusher
const createStopwatch = () => {
    const onDial = (angle, radius) => ({
        x: Math.sin(angle) * radius,
        y: Math.cos(angle) * radius,
        rz: -angle,
    });
    const parts = [
        part(new THREE.CylinderGeometry(2.6, 2.6, 0.7, 96), { rx: Math.PI / 2, shade: 0.8 }),
        part(new THREE.TorusGeometry(2.6, 0.25, 12, 96), { z: 0.35 }),
        part(new THREE.CylinderGeometry(2.35, 2.35, 0.1, 96), {
            rx: Math.PI / 2,
            z: 0.36,
            shade: 0.15,
        }),
        // Hand and center cap
        part(box(0.2, 1.9, 0.08), { ...onDial(1, 0.75), z: 0.5 }),
        part(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 24), { rx: Math.PI / 2, z: 0.5 }),
        // Crown, ring and side pusher
        part(new THREE.CylinderGeometry(0.45, 0.45, 0.6, 32), { y: 3 }),
        part(new THREE.TorusGeometry(0.5, 0.14, 8, 32), { y: 3.75 }),
        part(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 24), { ...onDial(Math.PI / 4, 2.8) }),
    ];
    for (let i = 0; i < 12; i++) {
        parts.push(
            part(box(0.2, 0.45, 0.08), {
                ...onDial((i / 12) * Math.PI * 2, 1.9),
                z: 0.44,
            }),
        );
    }
    return mergeGeometries(parts);
};

// Cinema: film reel and film strip
const createReel = () => {
    const reel = new THREE.Shape().absarc(0, 0, 2.4, 0, Math.PI * 2);
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        reel.holes.push(
            new THREE.Path().absarc(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0.6, 0, Math.PI * 2, true),
        );
    }
    const strip = new THREE.Shape()
        .moveTo(0, -0.55)
        .lineTo(5, -0.55)
        .lineTo(5, 0.55)
        .lineTo(0, 0.55)
        .closePath();
    for (let x = 0.15; x < 4.9; x += 0.35) {
        for (const y of [-0.42, 0.28]) {
            strip.holes.push(
                new THREE.Path()
                    .moveTo(x, y)
                    .lineTo(x, y + 0.14)
                    .lineTo(x + 0.14, y + 0.14)
                    .lineTo(x + 0.14, y)
                    .closePath(),
            );
        }
    }
    return mergeGeometries([
        part(new THREE.ExtrudeGeometry(reel, { depth: 0.25, bevelEnabled: false, curveSegments: 48 }), {
            z: -0.125,
        }),
        part(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 32), { rx: Math.PI / 2 }),
        part(new THREE.ExtrudeGeometry(strip, { depth: 0.05, bevelEnabled: false }), {
            x: 0.6,
            y: -2.6,
            z: 0.3,
            ry: -0.3,
            rz: -0.3,
        }),
    ]);
};

// Performing arts: stage curtains with pleats
const createCurtain = () => {
    // Drape hanging from x = 0 towards +x, tied back at 35 % of its height
    const drape = (width, height) => {
        const geometry = new THREE.PlaneGeometry(1, 1, 64, 40);
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const u = positions.getX(i) + 0.5; // 0 outer edge, 1 inner edge
            const v = positions.getY(i) + 0.5; // 0 bottom, 1 top
            const spread =
                v > 0.35
                    ? THREE.MathUtils.lerp(0.3, 1, ((v - 0.35) / 0.65) ** 1.5)
                    : THREE.MathUtils.lerp(0.45, 0.3, v / 0.35);
            positions.setXYZ(
                i,
                u * width * spread,
                (v - 0.5) * height,
                Math.sin(u * Math.PI * 14) * (0.15 + (1 - spread) * 0.25),
            );
        }
        geometry.computeVertexNormals();
        return geometry;
    };
    const valance = new THREE.PlaneGeometry(6.6, 0.9, 64, 6);
    const positions = valance.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        positions.setZ(i, Math.sin(positions.getX(i) * 10) * 0.12);
    }
    valance.computeVertexNormals();
    return mergeGeometries([
        part(drape(3.2, 5), { x: -3.2 }),
        part(drape(3.2, 5), { x: 3.2, ry: Math.PI }),
        part(valance, { y: 2.3, z: 0.4 }),
        part(box(7, 0.3, 2), { y: -2.65, z: 0.6, shade: 0.6 }),
    ]);
};

// ---------- Scene setup ----------

// Pivot: holds every shape so they turn around their center
const pivot = new THREE.Group();
scene.add(pivot);

const shapes = {};
const addShape = (name, geometry) => {
    const explode = { value: 1 };
    const mesh = new THREE.Mesh(addFragments(fit(geometry)), createMaterial(explode));
    mesh.frustumCulled = false; // fragments leave the original bounding box
    mesh.visible = false;
    pivot.add(mesh);
    shapes[name] = { mesh, explode };
};

addShape("vinyl", createVinyl());
addShape("frame", createFrame());
addShape("temple", createTemple());
addShape("stopwatch", createStopwatch());
addShape("reel", createReel());
addShape("curtain", createCurtain());

new GLTFLoader().load(
    "assets/3d-models/greek-underwater-broken-statue-1/scene.gltf",
    (gltf) => {
        gltf.scene.updateMatrixWorld(true);
        const parts = [];
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                parts.push(part(child.geometry.clone().applyMatrix4(child.matrixWorld)));
            }
        });
        addShape("statue", mergeGeometries(parts));
        render();
    },
    undefined,
    (error) => console.error("Unable to load the statue model:", error),
);

// ---------- Animation ----------

const pointer = { x: 0, y: 0 };
const tilt = { x: 0, y: 0 };

const getStagePosition = () => {
    const rect = section.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp(
        -rect.top / (rect.height - window.innerHeight),
        0,
        1,
    );
    return progress * (stages.length - 1);
};

function render() {
    const position = getStagePosition();
    const current = Math.round(position);

    for (const [name, shape] of Object.entries(shapes)) {
        let explode = 1;
        stages.forEach((stage, i) => {
            if (stage !== name) return;
            const value = reducedMotion
                ? Number(i !== current)
                : THREE.MathUtils.smoothstep(Math.abs(position - i), 0.15, 0.85);
            explode = Math.min(explode, value);
        });
        shape.explode.value = explode;
        shape.mesh.visible = explode < 1;
    }

    if (!reducedMotion) {
        tilt.x += (pointer.y * 0.25 - tilt.x) * 0.08;
        tilt.y += (pointer.x * 0.5 - tilt.y) * 0.08;
    }
    const turn = reducedMotion ? 0 : (position - current) * 1.2;
    pivot.rotation.set(tilt.x, -0.35 + turn + tilt.y, 0);

    renderer.render(scene, camera);
}

const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    renderer.setSize(Math.ceil(width / PIXEL_SIZE), Math.ceil(height / PIXEL_SIZE), false);
    camera.aspect = width / height;
    // Narrow screens: move back so the widest shapes still fit
    camera.position.z = Math.max(14, 11 / camera.aspect);
    camera.updateProjectionMatrix();

    // Desktop: shape on the right, texts on the left
    // Mobile: shape at the top, texts at the bottom
    const halfHeight =
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfWidth = halfHeight * camera.aspect;
    pivot.position.x = desktop.matches ? halfWidth * 0.4 : 0;
    pivot.position.y = desktop.matches ? 0 : halfHeight * 0.4;
    render();
};

new ResizeObserver(resize).observe(canvas);

if (!reducedMotion) {
    window.addEventListener("pointermove", (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    });
}

// Animate only while the section is on screen
let visible = false;
const loop = () => {
    if (!visible) return;
    render();
    requestAnimationFrame(loop);
};
new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) loop();
}).observe(section);
