// external imports
import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

// custom component imports
import Renderer from './components/Renderer'

let renderer
let scene, camera

function init() {
  renderer = new Renderer(0xCCFF00)
  document.body.appendChild(renderer.rendererElement)

  scene = renderer.scene
  camera = renderer.camera

  let ranColor = tinycolor.random()

  let geometry = new THREE.IcosahedronGeometry(10, 1)
  let material = new THREE.MeshStandardMaterial(
    {
      color : ranColor.toHexString(),
      flatShading : true,
      side : THREE.DoubleSide
    }
  )

  let shape = new THREE.Mesh(geometry, material)

  scene.add(shape)

  TweenMax.ticker.addEventListener('tick', loop)
}

function loop() {
  renderer.render()
}

window.addEventListener('load', init)
