import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.153.0/three.module.min.js';

document.getElementById("range-x").childNodes.forEach(child => child.addEventListener("input", () => updateM1()));
document.getElementById("range-xall").addEventListener("input", e => updateM1(e.target.value));

document.getElementById("range-y").childNodes.forEach(child => child.addEventListener("input", () => updateM2()));
document.getElementById("range-yall").addEventListener("input", e => updateM2(e.target.value));

document.getElementById("range-z").childNodes.forEach(child => child.addEventListener("input", () => updateM3()));
document.getElementById("range-zall").addEventListener("input", e => updateM3(e.target.value));

// THREE INITIALIZATION
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
let container = document.getElementById('three-container');
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild( renderer.domElement );

// CAMERA
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 3;

// GRID
const gridHelper = new THREE.GridHelper(30, 100, 0xFFFFFF, 0x999999)
gridHelper.rotateX(Math.PI/2)
gridHelper.position.z = -1;
scene.add(gridHelper)

// LIGHTS
const ambientLight = new THREE.AmbientLight(0xFFCCCC, .3);
scene.add(ambientLight);
const dLight = new THREE.DirectionalLight(0xFFCCCC, 1);
dLight.position.set(0, 3, 0);
scene.add(dLight);

// BOX
const geometry = new THREE.TorusKnotGeometry( .7, .15, 50, 8 ); 

const material = matrixShader(
    rotationMatrixX(),
    rotationMatrixY(),
    rotationMatrixZ()
)

const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// ANIMATE
animate();

function animate() {
	requestAnimationFrame( animate );
	cube.rotation.x += 0;
	cube.rotation.y += 0;
	renderer.render( scene, camera );
}

function updateM1(angle=0) {
    cube.material.uniforms.m1.value = rotationMatrixX(
        angle || document.getElementById("range-x1").value,
        angle || document.getElementById("range-x2").value,
        angle || document.getElementById("range-x3").value,
        angle || document.getElementById("range-x4").value
    )
}

function updateM2(angle=0) {
    cube.material.uniforms.m2.value = rotationMatrixY(
        angle || document.getElementById("range-y1").value,
        angle || document.getElementById("range-y2").value,
        angle || document.getElementById("range-y3").value,
        angle || document.getElementById("range-y4").value
    )
}

function updateM3(angle=0) {
    cube.material.uniforms.m3.value = rotationMatrixZ(
        angle || document.getElementById("range-z1").value,
        angle || document.getElementById("range-z2").value,
        angle || document.getElementById("range-z3").value,
        angle || document.getElementById("range-z4").value
    )
}

function rotationMatrixX(a1=0,a2=0,a3=0,a4=0) {
    let m = new THREE.Matrix4();
    m.set(
        1,0,0,0,
        0,Math.cos(a1),-Math.sin(a2),0,
        0,Math.sin(a3),Math.cos(a4),0,
        0,0,0,1
    );
    return m;
}

function rotationMatrixY(a1=0,a2=0,a3=0,a4=0) {
    let m = new THREE.Matrix4();
    m.set(
        Math.cos(a1),0,Math.sin(a2),0,
        0,1,0,0,
        -Math.sin(a3),0,Math.cos(a4),0,
        0,0,0,1
        
    );
    return m;
}

function rotationMatrixZ(a1=0,a2=0,a3=0,a4=0) {
    let m = new THREE.Matrix4();
    m.set(
        Math.cos(a1),-Math.sin(a2),0,0,
        Math.sin(a3),Math.cos(a4),0,0,
        0,0,1,0,
        0,0,0,1
    );
    return m;
}

function matrixShader(m1, m2, m3) {
    return new THREE.ShaderMaterial( {

        uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
            m1: { value: m1},
            m2: { value: m2 },
            m3: { value: m3 }
        },    
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    
    } );
}