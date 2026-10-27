import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene setup
const canvas = document.querySelector("#scene1");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);
camera.position.z = 10;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(3, 5, 5);
scene.add(directionalLight);

// Add a Greek statue model to the scene
let model = null;
const loader = new GLTFLoader();
loader.load(
    "assets/3d-models/greek-underwater-broken-statue-1/scene.gltf",
    (gltf) => {
        model = gltf.scene;
        model.position.set(0, -6, 0);
        model.scale.set(0.1, 0.1, 0.1);
        scene.add(model);
    },
    undefined,
    (error) => {
        console.error("An error occurred while loading the model:", error);
    },
);

// Animation loop
const scrollRotationFactor = 0.002;
const scrollScaleFactor = 0.0001;

const render = () => {
    if (model) {
        model.rotation.y = window.scrollY * scrollRotationFactor; // Rotate the model with the page scroll
        model.scale.set(
            0.1 + window.scrollY * scrollScaleFactor,
            0.1 + window.scrollY * scrollScaleFactor,
            0.1 + window.scrollY * scrollScaleFactor,
        ); // Scale the model with the page scroll
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();
