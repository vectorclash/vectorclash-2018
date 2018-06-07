import tinycolor from 'tinycolor2'

export default class ProjectShape {
  constructor(id) {
    this.id = id
    this.clock = new THREE.Clock
    this.radius = id * 50
    this.angle = Math.random() * 10
    this.scale = 0.7 + Math.random() * 1.3
    this.angleIncrease = 0.01 + Math.random() * 0.05
    this.deformationRange = 0.1
    this.randomRotation = -Math.PI * 0.004 + (Math.random() * Math.PI * 0.008)

    this.ranColor = tinycolor.random()

    this.container = new THREE.Object3D()

    this.geometry = new THREE.IcosahedronGeometry(15, 1)
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

    TweenMax.from(this.shape.scale, 1, {
      x: 0.0001,
      y: 0.0001,
      z: 0.0001,
      ease: Back.easeOut,
      delay: 0.5 + this.id * 0.05
    })

    this.rolledOver = false

    this.rollMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0,
      needsUpdate: true
    })

    this.rollShape = new THREE.Mesh(this.geometry, this.rollMaterial)
    this.shape.add(this.rollShape)

    this.status = 'standby'

    return this
  }

  openProject() {
    // open the project
    // console.log('opening project #', this.id)
    this.status = 'active'

    TweenMax.to(this.shape.scale, 2, {
      x: 120,
      y: 120,
      z: 120,
      ease: Expo.easeOut,
      delay: 0.2
    })

    TweenMax.to(this.shape.position, 1, {
      x: 0,
      y: 0,
      z: 0,
      ease: Expo.easeOut
    })
  }

  closeProject() {
    this.status = 'standby'

    TweenMax.to(this.shape.scale, 0.5, {
      x: this.scale,
      y: this.scale,
      z: this.scale,
      ease: Power1.easeOut
    })

    for(let i = 0; i < this.shape.geometry.vertices.length; i++) {
      TweenMax.to(this.shape.geometry.vertices[i], 1, {
        x: this.vertices[i].x,
        y: this.vertices[i].y,
        z: this.vertices[i].z,
        ease: Bounce.easeOut,
        delay: i * 0.02,
        onUpdate: () => {
          this.shape.geometry.verticesNeedUpdate = true
        }
      })
    }
  }

  disableProject() {
    this.status = 'inactive'

    TweenMax.to(this.shape.scale, 1, {
      x: 0.0001,
      y: 0.0001,
      z: 0.0001,
      ease: Expo.easeOut
    })

    TweenMax.to(this.shape.position, 1, {
      x: 0,
      y: 0,
      z: 0,
      ease: Expo.easeOut
    })
  }

  rolloverProject() {
    if(!this.rolledOver) {
      this.rolledOver = true
      TweenMax.to(this.rollShape.scale, 0.5, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        ease: Back.easeOut
      })

      TweenMax.from(this.rollShape.rotation, 0.5, {
        x: Math.random() * -(Math.PI / 3) + ((Math.PI / 3) * 2),
        y: Math.random() * -(Math.PI / 3) + ((Math.PI / 3) * 2),
        z: Math.random() * -(Math.PI / 3) + ((Math.PI / 3) * 2),
        ease: Back.easeOut
      })

      TweenMax.to(this.rollShape.material, 0.5, {
        opacity: 0.7,
        ease: Back.easeOut
      })
    }
  }

  rolloutProject() {
    if(this.rolledOver) {
      TweenMax.to(this.rollShape.scale, 0.5, {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        ease: Quad.easeOut
      })

      TweenMax.to(this.rollShape.material, 0.2, {
        opacity: 0,
        ease: Quad.easeOut
      })
    }
    this.rolledOver = false
  }

  update() {
    if(this.status == 'standby') {
      let time = this.clock.getElapsedTime() * 0.05

      this.angle += 0.001

      this.shape.rotation.x += this.randomRotation

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
