import * as THREE from 'three'
import tinycolor from 'tinycolor2'

export default class WireframeShapeSwirl {
  constructor(shapeNum) {
    this.rX = 0
    this.rY = 0
    this.rZ = 0

    this.geometry = new THREE.TetrahedronGeometry(5, 0)
    this.container = new THREE.Object3D()

    for(let i = 0; i < shapeNum; i++) {
      this.material = new THREE.MeshBasicMaterial({
        wireframe : true,
        fog : false,
        transparent : true,
        opacity : 0.2,
        depthWrite : false,
        color : tinycolor({h : i / shapeNum * 255, s : 100, l : 50}).toHexString()
      })

      let mesh = new THREE.Mesh(this.geometry, this.material)
      let newScale = 200 + (i * 20)
      mesh.scale.set(newScale, newScale, newScale)
      let newRotation = i * 0.08
      mesh.rotation.set(newRotation, newRotation, newRotation)

      this.container.add(mesh)
    }

    this.changeRotation()
  }

  changeRotation() {
    let ranTime = 10 + Math.random() * 50
    TweenMax.to(this, ranTime, {
      rX : -10 + Math.random() * 20,
      rY : -10 + Math.random() * 20,
      rZ : -10 + Math.random() * 20,
      ease : Power1.easeInOut,
      onUpdate : this.update.bind(this),
      onComplete : this.changeRotation.bind(this)
    })
  }

  update() {
    for(let i = 0; i < this.container.children.length; i++) {
      let mesh = this.container.children[i]
      let soundTotal = 0
      if(window.total) {
        soundTotal = (window.total * i) * 0.00003
      }

      let newRX = this.rX * (i * 0.02) + soundTotal
      let newRY = this.rY * (i * 0.02) + soundTotal
      let newRZ = this.rZ * (i * 0.02) + soundTotal

      mesh.rotation.set(newRX, newRY, newRZ)
    }
  }
}
