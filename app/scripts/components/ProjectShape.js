import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

export default class ProjectShape {
  constructor() {
    this.ranColor = tinycolor.random()

    this.geometry = new THREE.TetrahedronGeometry(5 + Math.random() * 15, 3)
    this.material = new THREE.MeshStandardMaterial(
      {
        color : this.ranColor.toHexString(),
        flatShading : true,
        side : THREE.DoubleSide
      }
    )

    this.shape = new THREE.Mesh(this.geometry, this.material)

    this.shape.position.x = -100 + Math.random() * 200;
    this.shape.position.y = -100 + Math.random() * 200;
    this.shape.position.z = -100 + Math.random() * 200;

    this.moveShape()
  }

  moveShape() {
    let ranTime = 2 + Math.random() * 10

    TweenMax.to(this.shape.position, ranTime, {
      x : -100 + Math.random() * 200,
      y : -100 + Math.random() * 200,
      z : -100 + Math.random() * 200,
      ease : Quad.easeInOut,
      onComplete : this.moveShape.bind(this)
    })

    TweenMax.to(this.shape.rotation, ranTime, {
      x : Math.random() * Math.PI,
      y : Math.random() * Math.PI,
      z : Math.random() * Math.PI,
      ease : Quad.easeInOut
    })
  }
}
