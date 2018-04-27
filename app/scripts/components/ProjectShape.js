import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

export default class ProjectShape {
  constructor(id) {
    this.id = id
    this.clock = new THREE.Clock
    this.radius = id * 30
    this.angle = 0
    this.angleIncrease = 0.01 + Math.random() * 0.05

    this.ranColor = tinycolor.random()

    this.container = new THREE.Object3D()

    this.geometry = new THREE.TetrahedronGeometry(5 + Math.random() * 15, 2)
    this.material = new THREE.MeshStandardMaterial(
      {
        color : this.ranColor.toHexString(),
        flatShading : true,
        side : THREE.DoubleSide
      }
    )

    this.shape = new THREE.Mesh(this.geometry, this.material)

    this.shape.position.x = -100 + Math.random() * 200
    this.shape.position.y = -100 + Math.random() * 200
    this.shape.position.z = -20 + Math.random() * 40

    this.shape.rotation.x = Math.random() * Math.PI
    this.shape.rotation.y = Math.random() * Math.PI
    this.shape.rotation.z = Math.random() * Math.PI

    this.container.add(this.shape)

    // this.moveShape()
  }

  moveShape() {
    let ranTime = 1 + Math.random() * 3
    let ranXEnd = -100 + Math.random() * 200
    let ranYEnd = -100 + Math.random() * 200
    let ranZEnd = -100 + Math.random() * 200
    let ranXMid1 = Math.random() * this.shape.position.x + (ranXEnd / 5)
    let ranYMid1 = Math.random() * this.shape.position.y + (ranYEnd / 5)
    let ranZMid1 = Math.random() * this.shape.position.z + (ranZEnd / 5)

    TweenMax.to(this.shape.position, ranTime, {
      bezier : {
        curviness : 2,
        type : 'thru',
        autoRotate : false,
        values : [
          { x : ranXMid1, y : ranYMid1, z : ranZMid1 },
          { x : ranXEnd, y : ranYEnd, z : ranZEnd }
        ]
      },
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

  update() {
    let time = this.clock.getDelta() * 0.02

    this.angle += noise.simplex2(this.angleIncrease, time) * 0.05

    this.shape.position.x = Math.cos(this.angle) * this.radius
    this.shape.position.y = Math.sin(this.angle) * this.radius
    this.shape.position.z = noise.simplex2(this.angleIncrease, time) * 100

    this.container.rotation.x += 0.003
    this.container.rotation.y += 0.002
    this.container.rotation.z += 0.0029
  }
}
