// external imports
import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

// custom component imports
import Renderer from './components/Renderer'
import ProjectShape from './components/ProjectShape'
import BackgroundGradientPlane from './components/BackgroundGradientPlane'
import BackgroundSpacePlane from './components/BackgroundSpacePlane'
import ParticleField from './components/ParticleField'
import WireframeShapeSwirl from './components/WireframeShapeSwirl'

let mainContainer
let renderer
let scene, camera
let needUpdate = []
let raycaster
let mouse
let interactiveObjects = []

function init() {
  mainContainer = document.querySelector('.main-container')

  renderer = new Renderer(0x140057)
  mainContainer.appendChild(renderer.rendererElement)
  renderer.rendererElement.addEventListener('touchstart', function(e) {
     e.preventDefault()
  })

  scene = renderer.scene
  camera = renderer.camera

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  for (let i = 0; i < 10; i++) {
    let newShape = new ProjectShape(i)
    scene.add(newShape.container)
    needUpdate.push(newShape)
    interactiveObjects.push(newShape.shape)
  }

  let background = new BackgroundGradientPlane()
  background.mesh.position.z = -360
  scene.add(background.mesh)
  needUpdate.push(background)

  let space = new BackgroundSpacePlane()
  space.mesh.position.z = -350
  scene.add(space.mesh)
  needUpdate.push(space)

  let starLoader = new THREE.TextureLoader()
  starLoader.load(
    'textures/star-1024.png',
    (texture) => {
      let particles = new ParticleField(1000, texture)
      scene.add(particles.particleSystem)
      needUpdate.push(particles)
    }
  )

  let shapeSwirl = new WireframeShapeSwirl(10)
  scene.add(shapeSwirl.container)

  window.addEventListener('click', onClick)

  TweenMax.ticker.addEventListener('tick', loop)
}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  let intersects = raycaster.intersectObjects(interactiveObjects)
  if(intersects.length > 0) {
    for(let i = 0; i < interactiveObjects.length; i++) {
      if(interactiveObjects[i] == intersects[0].object) {
        console.log(i)
      }
    }
  }
}

function loop() {
  renderer.render()

  for (var i = 0; i < needUpdate.length; i++) {
    needUpdate[i].update()
  }
}

window.addEventListener('load', init)
