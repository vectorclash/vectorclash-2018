// external imports
import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

// custom component imports
import Renderer from './components/Renderer'
import ProjectShape from './components/ProjectShape'

let renderer
let scene, camera

function init() {
  renderer = new Renderer(0xCCFF00)
  document.body.appendChild(renderer.rendererElement)

  scene = renderer.scene
  camera = renderer.camera

  for (let i = 0; i < 100; i++) {
    let newShape = new ProjectShape()
    scene.add(newShape.shape)
  }

  TweenMax.ticker.addEventListener('tick', loop)
}

function loop() {
  renderer.render()
}

window.addEventListener('load', init)
