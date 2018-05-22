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

    let bodyDiv = document.createElement('div')
    bodyDiv.classList.add('project-body')
    bodyDiv.innerHTML = this.body

    let textDiv = document.createElement('div')
    textDiv.classList.add('project-text')
    textDiv.appendChild(titleDiv)
    textDiv.appendChild(bodyDiv)

    let textX = 0
    let textRotationY = 0

    if(window.innerWidth > 640) {
      textX = -170
      textRotationY = Math.PI * 0.1
    } else {

    }

    this.text3D = new THREE.CSS3DObject(textDiv)
    this.cssContainer.add(this.text3D)
    this.text3D.position.set(
      textX,
      -20,
      0
    )
    this.text3D.rotation.set(
      0,
      textRotationY,
      0
    )
    this.text3D.scale.set(
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

    let imageContainerX = 0
    let imageContainerRotationY = 0

    if(window.innerWidth > 640) {
      imageContainerX = 30
      imageContainerRotationY = Math.PI * -0.1
    } else {
      imageContainerX = -50
      imageContainerRotationY = 0
    }

    this.container.position.x = imageContainerX
    this.container.position.y -= imageY / 2
    this.container.rotation.y = imageContainerRotationY

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

    TweenMax.to(this.text3D.scale, 0.5, {
      x : 1,
      y : 1,
      z : 1,
      ease : Back.easeOut,
      delay : 0.3
    })

    TweenMax.from(this.text3D.position, 0.5, {
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

    TweenMax.to(this.text3D.scale, 0.3, {
      x : 0.00001,
      y : 0.00001,
      z : 0.00001
    })
  }
}
