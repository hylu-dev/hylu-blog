import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.153.0/three.module.min.js';

// THREE INITIALIZATION
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
let container = document.getElementById('three-container');
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild( renderer.domElement );

// CAMERA
const camera = new THREE.OrthographicCamera(window.innerWidth, window.innerHeight, 1, 1000);

// GRID & Axes
const gridHelper = new THREE.GridHelper(30, 100, 0xFFFFFF, 0x999999)
gridHelper.rotateX(Math.PI/2)
gridHelper.position.z = -1;
scene.add(gridHelper)
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// BOX
const geometry = new THREE.PlaneGeometry(1, 1); 

const plane = new THREE.Mesh( geometry, getShader() );
scene.add( plane );

renderer.render( scene, camera );

function getShader() {
    return new THREE.ShaderMaterial( {

        uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
        },    
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
}