// external imports
import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

// custom component imports
import Renderer from './components/Renderer'
import ProjectShape from './components/ProjectShape'
import BackgroundGradientPlane from './components/BackgroundGradientPlane'
import BackgroundSpacePlane from './components/BackgroundSpacePlane'

let mainContainer
let renderer
let scene, camera
let needUpdate = []

function init() {
  mainContainer = document.querySelector('.main-container')

  renderer = new Renderer(0x390391)
  mainContainer.appendChild(renderer.rendererElement)

  scene = renderer.scene
  camera = renderer.camera

  for (let i = 0; i < 100; i++) {
    let newShape = new ProjectShape()
    scene.add(newShape.shape)
    needUpdate.push(newShape)
  }

  let background = new BackgroundGradientPlane()
  background.mesh.position.z = -300
  scene.add(background.mesh)
  needUpdate.push(background)

  let space = new BackgroundSpacePlane()
  space.mesh.position.z = -200
  scene.add(space.mesh)
  needUpdate.push(space)

  TweenMax.ticker.addEventListener('tick', loop)
}

function loop() {
  renderer.render()

  for (var i = 0; i < needUpdate.length; i++) {
    needUpdate[i].update()
  }
}

window.addEventListener('load', init)
