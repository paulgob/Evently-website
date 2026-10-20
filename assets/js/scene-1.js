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
camera.position.z = 5;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(3, 5, 5);
scene.add(directionalLight);

// Add a Greek statue model to the scene
const loader = new GLTFLoader();
loader.load(
    "assets/3d-models/greek-underwater-broken-statue-1/scene.gltf",
    (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
        renderer.render(scene, camera);
    },
    undefined,
    (error) => {
        console.error("An error occurred while loading the model:", error);
    },
);
