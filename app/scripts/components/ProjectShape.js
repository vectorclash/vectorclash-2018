import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

export default class ProjectShape {
  constructor(id) {
    this.id = id
    this.clock = new THREE.Clock
    this.radius = id * 30
    this.angle = 0
    this.scale = 0.5 + Math.random() * 1.3
    this.angleIncrease = 0.01 + Math.random() * 0.05

    this.ranColor = tinycolor.random()

    this.container = new THREE.Object3D()

    this.geometry = new THREE.TetrahedronGeometry(10, 2)
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

    this.shape.scale.x = this.scale
    this.shape.scale.y = this.scale
    this.shape.scale.z = this.scale

    this.container.add(this.shape)

    this.status = 'standby'

    return this
  }

  openProject() {
    // open the project
    console.log('opening project #', this.id)
    this.status = 'active'

    TweenMax.to(this.shape.scale, 2, {
      x : 100,
      y : 100,
      z : 100,
      ease : Expo.easeOut,
      delay : 0.2
    })

    TweenMax.to(this.shape.position, 1, {
      x : 0,
      y : 0,
      z : 0,
      ease : Expo.easeOut
    })
  }

  closeProject() {
    this.status = 'standby'

    TweenMax.to(this.shape.scale, 1, {
      x : this.scale,
      y : this.scale,
      z : this.scale,
      ease : Expo.easeOut
    })
  }

  disableProject() {
    this.status = 'inactive'

    TweenMax.to(this.shape.scale, 1, {
      x : 0.01,
      y : 0.01,
      z : 0.01,
      ease : Expo.easeOut
    })

    TweenMax.to(this.shape.position, 1, {
      x : 0,
      y : 0,
      z : 0,
      ease : Expo.easeOut
    })
  }

  update() {
    if(this.status == 'standby') {
      let time = this.clock.getDelta() * 0.02

      this.angle += noise.simplex2(this.angleIncrease, time) * 0.05

      this.shape.position.x = Math.cos(this.angle) * this.radius
      this.shape.position.y = Math.sin(this.angle) * this.radius
      this.shape.position.z = noise.simplex2(this.angleIncrease, time) * 100
    } else if(this.status == 'active') {

    } else if(this.status == 'inactive') {

    }

    this.container.rotation.x += 0.003
    this.container.rotation.y += 0.002
    this.container.rotation.z += 0.0029
  }
}
