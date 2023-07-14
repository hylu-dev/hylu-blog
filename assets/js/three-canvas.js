import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.153.0/three.module.min.js';

const containers = document.getElementsByClassName("three-container");

for (let c of containers) {
    setupCanvas(c);
}

function setupCanvas(container) {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize(container.offsetWidth, container.offsetHeight); 
    container.appendChild( renderer.domElement );
    // CAMERA
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);

    // CANVAS
    // Use unmodified vertices if vertex shader not given
    let vertexShader = container.querySelector(".vertexShader");
    let fragmentShader = container.querySelector(".fragmentShader");

    if (!vertexShader) {
        vertexShader = "void main() {gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
    } else {
        vertexShader = vertexShader.textContent;
    }

    if (!fragmentShader) {
        fragmentShader = "void main() {gl_FragColor = vec4(1.0);}"
    } else {
        fragmentShader = fragmentShader.textContent;
    }

    const geometry = new THREE.PlaneGeometry(2, 2); 
    const material = getShader(vertexShader, fragmentShader, container);
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer.render( scene, camera );
    animate(renderer, scene, camera, mesh)
}

function getShader(vShader, fShader, container) {
    return new THREE.ShaderMaterial( {
        uniforms: {
            u_time: { type: "f", value: 0 },
            u_resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
        },    
        vertexShader: vShader,
        fragmentShader: fShader
    } );
}

function animate(renderer, scene, camera, mesh) {
	requestAnimationFrame( () => animate(renderer, scene, camera, mesh) );
    mesh.material.uniforms.u_time.value += 0.01;
	renderer.render( scene, camera );
}

async function retrieveShader(path) {
    const shader = await fetch(path)
    return shader.text();
}