import * as THREE from 'three'
import { TweenMax, BezierPlugin } from 'gsap'
import tinycolor from 'tinycolor2'

export default class ProjectShape {
  constructor() {
    this.ranColor = tinycolor.random()

    this.geometry = new THREE.TetrahedronGeometry(5 + Math.random() * 15, 1)
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
    let ranTime = 10 + Math.random() * 30
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
}
