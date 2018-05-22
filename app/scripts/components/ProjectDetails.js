import tinycolor from 'tinycolor2'
import ImagePlane from './ImagePlane'

export default class ProjectDetails {
  constructor(data) {
    this.title = data.title[0].value
    this.body = data.body[0].value
    this.images = data.field_image
    this.videos = data.field_video

    // build css 3d objects
    this.cssContainer = new THREE.Object3D()

    let titleDiv = document.createElement('div')
    titleDiv.classList.add('project-title')
    titleDiv.innerHTML = this.title

    this.title3D = new THREE.CSS3DObject(titleDiv)
    this.title3D.position.set(
      -150,
      100,
      -100
    )
    this.title3D.rotation.set(
      0,
      Math.PI * 0.1,
      0
    )
    this.title3D.scale.set(
      0,
      0,
      0
    )
    this.cssContainer.add(this.title3D)

    let bodyDiv = document.createElement('div')
    bodyDiv.classList.add('project-body')
    bodyDiv.innerHTML = this.body

    this.body3D = new THREE.CSS3DObject(bodyDiv)
    this.cssContainer.add(this.body3D)
    this.body3D.position.set(
      -100,
      -20,
      0
    )
    this.body3D.rotation.set(
      0,
      Math.PI * 0.1,
      0
    )
    this.body3D.scale.set(
      0,
      0,
      0
    )

    TweenMax.to(this.cssContainer.position, 20, {
      y : this.cssContainer.position.y + 10,
      yoyo : true,
      repeat : -1,
      ease : Quad.easeInOut
    })

    TweenMax.to(this.cssContainer.rotation, 15, {
      y : Math.PI * 0.11,
      yoyo : true,
      repeat : -1,
      ease : Quad.easeInOut
    })

    // build standard 3d objects

    this.container = new THREE.Object3D()

    this.rowWidth = 4
    this.imageSize = 100
    this.imagePadding = this.imageSize * 0.05

    let imageX = 0
    let imageY = 0

    for (var i = 0; i < this.images.length; i++) {
      let newImagePlane = new ImagePlane(this.images[i].url, this.imageSize)

      newImagePlane.mesh.position.set(
        imageX,
        imageY,
        -150
      )

      imageX += this.imageSize + this.imagePadding
      if(imageX > this.imageSize * this.rowWidth) {
        imageX = 0
        imageY -= this.imageSize + this.imagePadding
      }

      this.container.add(newImagePlane.mesh)
    }

    this.container.position.y -= imageY / 2
    this.container.rotation.y = Math.PI * -0.1

    TweenMax.delayedCall(0.3, this.animateIn.bind(this))

    TweenMax.to(this.container.position, 18, {
      y : this.container.position.y + 10,
      yoyo : true,
      repeat : -1,
      ease : Quad.easeInOut
    })

    TweenMax.to(this.container.rotation, 16, {
      y : Math.PI * -0.11,
      yoyo : true,
      repeat : -1,
      ease : Quad.easeInOut
    })

    return this
  }

  animateIn() {
    for (var i = 0; i < this.container.children.length; i++) {
      let object = this.container.children[i]
      TweenMax.from(object.scale, 0.5, {
        y : 0.001,
        ease : Back.easeOut,
        delay : i * 0.05
      })

      TweenMax.from(object.rotation, 0.5, {
        x : -Math.PI,
        ease : Back.easeOut,
        delay : i * 0.05
      })

      TweenMax.from(object.position, 0.5, {
        z : -500,
        ease : Back.easeOut,
        delay : i * 0.05
      })

      TweenMax.to(object.material, 0.5, {
        opacity : 1,
        ease : Quad.easeOut,
        delay : i * 0.05
      })
    }

    TweenMax.to(this.title3D.scale, 0.5, {
      x : 1,
      y : 1,
      z : 1,
      ease : Back.easeOut
    })

    TweenMax.from(this.title3D.position, 0.5, {
      y : 200,
      ease : Back.easeOut
    })

    TweenMax.to(this.body3D.scale, 0.5, {
      x : 1,
      y : 1,
      z : 1,
      ease : Back.easeOut,
      delay : 0.3
    })

    TweenMax.from(this.body3D.position, 0.5, {
      y : -200,
      ease : Back.easeOut,
      delay : 0.3
    })
  }

  animateOut() {
    for (var i = 0; i < this.container.children.length; i++) {
      let object = this.container.children[i]
      TweenMax.to(object.scale, 0.3, {
        x : 0.001,
        y : 0.001,
        z : 0.001,
        ease : Quad.easeOut,
        delay : i * 0.01
      })

      TweenMax.to(object.rotation, 0.3, {
        x : -Math.PI,
        ease : Quad.easeOut,
        delay : i * 0.01
      })

      TweenMax.to(object.position, 0.3, {
        z : 0,
        x : 0,
        y : -100,
        ease : Quad.easeOut,
        delay : i * 0.01
      })
    }

    TweenMax.to(this.title3D.scale, 0.3, {
      x : 0.00001,
      y : 0.00001,
      z : 0.00001
    })

    TweenMax.to(this.body3D.scale, 0.3, {
      x : 0.00001,
      y : 0.00001,
      z : 0.00001
    })
  }
}
