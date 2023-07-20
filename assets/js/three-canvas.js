import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.153.0/three.module.min.js';

apply();

async function apply() {
    const containers2D = document.getElementsByClassName("three-2d-container");
    const containers3D = document.getElementsByClassName("three-3d-container");
    const containers3DR = document.getElementsByClassName("three-3dr-container");
    for (let c of containers2D) {
        setupCanvas(
            c,
            getOrthographicCamera(c),
            getPlaneMesh(await getShader(c)),
            animate
        );
    }

    for (let c of containers3D) {
        setupCanvas(
            c,
            getPerspectiveCamera(c),
            getBoxMesh(await getShader(c)),
            animate
        );
    }

    for (let c of containers3DR) {
        setupCanvas(
            c,
            getPerspectiveCamera(c),
            getBoxMesh(await getShader(c)),
            animateRotate
        );
    }
}

function setupCanvas(container, camera, mesh, animator) {
    //console.log(await retrieveShader("shaders/square-grid.frag"));
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(container.offsetWidth, container.offsetHeight); 
    container.appendChild( renderer.domElement );
    scene.add( mesh );
    renderer.render( scene, camera );
    animator(renderer, scene, camera, mesh);
}

function getPlaneMesh(material) {
    const geometry = new THREE.PlaneGeometry(2, 2);
    return new THREE.Mesh( geometry, material );
}

function getBoxMesh(material) {
    const geometry = new THREE.BoxGeometry(1, 1, 1); 
    return new THREE.Mesh( geometry, material );
}

function getOrthographicCamera() {
    return new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
}

function getPerspectiveCamera(container) {
    const camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 1000 );
    camera.position.z = 2;
    return camera;
}

async function getShader(container) {
    let vertexShader = "void main() {gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}";
    let fragmentShader = "void main() {gl_FragColor = vec4(1.0);}";
    
    // Load from file if available
    const vertexFile = container.querySelector(".vertex-file");
    const fragFile = container.querySelector(".fragment-file");
    if (vertexFile) {
        vertexShader = await retrieveShader(vertexFile.textContent);
    }
    if (fragFile) {
        fragmentShader = await retrieveShader(fragFile.textContent);
    }

    // Load shaders directly
    const vertexQuery = container.querySelector(".vertex-shader");
    const fragmentQuery = container.querySelector(".fragment-shader");
    if (vertexQuery) {
        vertexShader = vertexQuery.textContent;
    }
    if (fragmentQuery) {
        fragmentShader = fragmentQuery.textContent;
    }

    return new THREE.ShaderMaterial( {
        uniforms: {
            u_time: { type: "f", value: 0 },
            u_resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
        },    
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    } );
}

function animate(renderer, scene, camera, mesh) {
	requestAnimationFrame( () => animate(renderer, scene, camera, mesh) );
    mesh.material.uniforms.u_time.value += 0.01;
	renderer.render( scene, camera );
}

function animateRotate(renderer, scene, camera, mesh) {
	requestAnimationFrame( () => animateRotate(renderer, scene, camera, mesh) );
    mesh.material.uniforms.u_time.value += 0.01;
    mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.005;
	renderer.render( scene, camera );
}

async function retrieveShader(path) {
    const shader = await fetch(path)
    return shader.text();
}