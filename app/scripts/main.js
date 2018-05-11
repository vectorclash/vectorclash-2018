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
let projects = []
let projectIsActive = false
let closeButton, closeButtonHit

let background, space, particles, shapeSwirl

function init() {
  mainContainer = document.querySelector('.main-container')

  renderer = new Renderer(0x140057)
  mainContainer.appendChild(renderer.rendererElement)

  scene = renderer.scene
  camera = renderer.camera

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  for (let i = 0; i < 10; i++) {
    let newShape = new ProjectShape(i)
    projects.push(newShape)
    scene.add(newShape.container)
    needUpdate.push(newShape)
    interactiveObjects.push(newShape.shape)
  }

  background = new BackgroundGradientPlane()
  background.mesh.position.z = -360
  scene.add(background.mesh)
  needUpdate.push(background)

  space = new BackgroundSpacePlane()
  space.mesh.position.z = -350
  scene.add(space.mesh)
  needUpdate.push(space)

  let starLoader = new THREE.TextureLoader()
  starLoader.load(
    'textures/star-1024.png',
    (texture) => {
      particles = new ParticleField(1000, texture)
      scene.add(particles.particleSystem)
      needUpdate.push(particles)
    }
  )

  shapeSwirl = new WireframeShapeSwirl(10)
  scene.add(shapeSwirl.container)

  closeButton = document.querySelector('.close-button')
  closeButtonHit = document.querySelector('.close-button-hitarea')
  TweenMax.set(closeButton, {
    scaleX : 0.6,
    scaleY : 0.6
  })

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onClick)
  renderer.rendererElement.addEventListener('touchstart', onTouchStart)

  TweenMax.ticker.addEventListener('tick', loop)
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  let intersects = raycaster.intersectObjects(interactiveObjects)
  if(intersects.length > 0 && !projectIsActive) {
    mainContainer.style.cursor = 'pointer'
  } else {
    mainContainer.style.cursor = 'auto'
  }
}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
  testInteractiveObjects()
}

function onTouchStart(event) {
  event.preventDefault()
  mouse.x = (event.targetTouches[0].pageX / window.innerWidth) * 2 - 1
  mouse.y = - (event.targetTouches[0].pageY / window.innerHeight) * 2 + 1
  testInteractiveObjects()
}

function testInteractiveObjects() {
  if(!projectIsActive) {
    raycaster.setFromCamera(mouse, camera)

    let intersects = raycaster.intersectObjects(interactiveObjects)
    if(intersects.length > 0) {
      for(let i = 0; i < interactiveObjects.length; i++) {
        if(interactiveObjects[i] == intersects[0].object) {
          projects[i].openProject()
        } else {
          projects[i].disableProject()
        }
      }
      projectIsActive = true
      disableSpaceBackground()
    }
  }
}

function disableSpaceBackground() {
  mainContainer.style.cursor = 'auto'

  window.removeEventListener('click', onClick)
  renderer.rendererElement.removeEventListener('touchstart', onTouchStart)

  TweenMax.from(closeButton, 1, {
    y : 360,
    alpha : 0,
    ease : Expo.easeOut,
    onStart : () => {
      closeButton.style.display = 'block'
    },
    onComplete : () => {
      closeButtonHit.addEventListener('click', closeProject)
    }
  })

  TweenMax.to(background.mesh.position, 1, {
    z : -2000,
    ease : Quad.easeOut
  })

  TweenMax.to(space.mesh.position, 1.2, {
    z : -2000,
    ease : Quad.easeOut
  })

  TweenMax.to(shapeSwirl.container.scale, 2, {
    x : 0.5,
    y : 0.5,
    z : 0.5,
    ease : Expo.easeOut
  })
}

function enableSpaceBackground() {
  TweenMax.to(closeButton, 1, {
    alpha : 0,
    ease : Expo.easeOut,
    onComplete : () => {
      closeButton.style.display = 'none'
      closeButton.style.opacity = 1
      window.addEventListener('click', onClick)
      renderer.rendererElement.addEventListener('touchstart', onTouchStart)
    }
  })

  TweenMax.to(background.mesh.position, 2, {
    z : -360,
    ease : Expo.easeOut
  })

  TweenMax.to(space.mesh.position, 2, {
    z : -350,
    ease : Expo.easeOut
  })

  TweenMax.to(shapeSwirl.container.scale, 2, {
    x : 1,
    y : 1,
    z : 1,
    ease : Elastic.easeOut
  })

  projectIsActive = false
}

function closeProject() {
  for(let i = 0; i < projects.length; i++) {
    projects[i].closeProject()
    enableSpaceBackground()
  }
}

function loop() {
  renderer.render()

  for (var i = 0; i < needUpdate.length; i++) {
    needUpdate[i].update()
  }
}

window.addEventListener('load', init)
