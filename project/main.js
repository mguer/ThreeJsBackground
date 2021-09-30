import './style.css'

import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth/innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

console.log(OrbitControls)

new OrbitControls(camera, renderer.domElement )

const planeGeometry = new THREE.PlaneGeometry(10, 10, 17, 17);
const planMaterial = new THREE.MeshPhongMaterial( {
    // color: 0xC191FF,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors : true
});
const planMesh = new THREE.Mesh( planeGeometry, planMaterial );


const {array} = planMesh.geometry.attributes.position
for (let i = 0; i<array.length; i += 3 ){
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]

    array[i + 2] = z + Math.random()
}

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set(0, 0, 1)

// const backLight = new THREE.DirectionalLight( 0xffffff, 1 );
// light.position.set(0, 0, -1)

const raycaster = new THREE.Raycaster()

scene.add( planMesh );
// scene.add( backLight );
scene.add( light);
camera.position.z = 5

const mouse = {
    x: undefined,
    y: undefined
}

const colors = []
for (let i = 0; i < planMesh.geometry.attributes.position.count; i++){
colors.push(0.7, 0.6 ,1)
}
planMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planMesh)
    if (intersects.length > 0) {

        const { color } = intersects[0].object.geometry.attributes


        intersects[0].object.geometry.attributes.color.needsUpdate= true

        const initialColor = {
            r: 0.7,
            g: 0.6,
            b: 1
        }

        const hoverColor = {
            r: 0,
            g: 1,
            b: 0.5
        }

        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setY(intersects[0].face.a, hoverColor.g)
                color.setZ(intersects[0].face.a, hoverColor.b)

                color.setX(intersects[0].face.b, hoverColor.r)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setZ(intersects[0].face.b, hoverColor.b)

                color.setX(intersects[0].face.c, hoverColor.r)
                color.setY(intersects[0].face.c, hoverColor.g)
                color.setZ(intersects[0].face.c, hoverColor.b)

                color.needsUpdate = true
            }
        })
    }
}

animate()


addEventListener('mousemove', (event)=>{
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY  / innerHeight) * 2 + 1
})

