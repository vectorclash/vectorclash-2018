import * as THREE from 'three'
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

export default class ProjectShape {
  constructor(id) {
    this.id = id
    this.clock = new THREE.Clock
    this.radius = id * 30
    this.angle = Math.random() * 10
    this.scale = 0.5 + Math.random() * 1.3
    this.angleIncrease = 0.01 + Math.random() * 0.05
    this.deformationRange = 0.1

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

    this.vertices = []
    for(let i = 0; i < this.shape.geometry.vertices.length; i++) {
      let vertex = this.shape.geometry.vertices[i]
      let newVertex = new THREE.Vector3(vertex.x, vertex.y, vertex.z)
      this.vertices.push(newVertex)
    }

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
    // console.log('opening project #', this.id)
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

    TweenMax.to(this.shape.scale, 0.5, {
      x : this.scale,
      y : this.scale,
      z : this.scale,
      ease : Power1.easeOut
    })

    for(let i = 0; i < this.shape.geometry.vertices.length; i++) {
      TweenMax.to(this.shape.geometry.vertices[i], 1, {
        x : this.vertices[i].x,
        y : this.vertices[i].y,
        z : this.vertices[i].z,
        ease : Bounce.easeOut,
        delay : i * 0.02,
        onUpdate : () => {
          this.shape.geometry.verticesNeedUpdate = true
        }
      })
    }
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
      let time = this.clock.getElapsedTime() * 0.05

      this.angle += noise.simplex2(this.angleIncrease, time) * 0.01

      this.shape.position.x = Math.cos(this.angle) * this.radius
      this.shape.position.y = Math.sin(this.angle) * this.radius
      this.shape.position.z = noise.simplex2(this.angleIncrease, time) * 100
    } else if(this.status == 'active') {
      for (var i = 0; i < this.shape.geometry.vertices.length; i++) {
        let time1 = this.clock.getElapsedTime() * 0.1
        let time2 = this.clock.getElapsedTime() * 0.2
        let time3 = this.clock.getElapsedTime() * 0.15

        this.shape.geometry.vertices[i].x = this.vertices[i].x * ((1 - this.deformationRange) + noise.simplex2(time1, i) * this.deformationRange)
        this.shape.geometry.vertices[i].y = this.vertices[i].y * ((1 - this.deformationRange) + noise.simplex2(time2, i) * this.deformationRange)
        this.shape.geometry.vertices[i].z = this.vertices[i].z * ((1 - this.deformationRange) + noise.simplex2(time3, i) * this.deformationRange)
        this.shape.geometry.verticesNeedUpdate = true
      }
    } else if(this.status == 'inactive') {

    }

    this.container.rotation.x += 0.0003
    this.container.rotation.y += 0.0002
    this.container.rotation.z += 0.00029
  }
}
