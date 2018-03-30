// external imports
import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

// custom component imports
import Renderer from './components/Renderer'
import ProjectShape from './components/ProjectShape'
import BackgroundGradientPlane from './components/BackgroundGradientPlane'

let mainContainer
let renderer
let scene, camera
let needUpdate = []

function init() {
  mainContainer = document.querySelector('.main-container')

  renderer = new Renderer(0x29e2fb)
  mainContainer.appendChild(renderer.rendererElement)

  scene = renderer.scene
  camera = renderer.camera

  for (let i = 0; i < 50; i++) {
    let newShape = new ProjectShape()
    scene.add(newShape.shape)
    needUpdate.push(newShape)
  }

  let background = new BackgroundGradientPlane()
  background.mesh.position.z = -200
  scene.add(background.mesh)

  TweenMax.ticker.addEventListener('tick', loop)
}

function loop() {
  renderer.render()

  for (var i = 0; i < needUpdate.length; i++) {
    needUpdate[i].update()
  }
}

window.addEventListener('load', init)
