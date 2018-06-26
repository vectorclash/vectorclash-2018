import tinycolor from 'tinycolor2'
import ImagePlane from './ImagePlane'
import ImageBox from './ImageBox'
import VideoShape from './VideoShape'

export default class ProjectDetails {
  constructor(data, camera) {
    this.title = data.title[0].value
    this.body = data.body[0].value
    this.images = data.field_image
    this.videos = data.field_video

    this.cameraReference = camera

    // build css 3d objects, title and body

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

    if(window.innerWidth > 700) {
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
      y: this.cssContainer.position.y + 10,
      yoyo: true,
      repeat: -1,
      ease: Quad.easeInOut
    })

    TweenMax.to(this.cssContainer.rotation, 15, {
      y: Math.PI * 0.11,
      yoyo: true,
      repeat: -1,
      ease: Quad.easeInOut
    })

    // build standard 3d objects

    this.container = new THREE.Object3D()

    this.imageMeshArray = []
    this.imageActive = false

    this.rowWidth = 4
    this.imageSize = 100
    this.imagePadding = this.imageSize * 0.05

    let imageX = 0
    let imageY = 0

    for (var i = 0; i < this.images.length; i++) {
      let newImageBox = new ImageBox(this.images[i].url, this.imageSize)

      newImageBox.mesh.position.set(
        imageX,
        imageY,
        -150
      )

      newImageBox.mesh.originalPosition = new THREE.Vector3(imageX, imageY, -150)

      imageX += this.imageSize + this.imagePadding
      if(imageX > this.imageSize * this.rowWidth && i != this.images.length - 1) {
        imageX = 0
        imageY -= this.imageSize + this.imagePadding
      }

      this.container.add(newImageBox.mesh)
      this.imageMeshArray.push(newImageBox.mesh)
    }

    let imageContainerX = 0
    let imageContainerRotationY = 0

    if(window.innerWidth > 700) {
      imageContainerX = 30
      imageContainerRotationY = Math.PI * -0.1
    } else {
      imageContainerX = -50
      imageContainerRotationY = 0
    }

    // build video shape object

    if(this.videos.length > 0) {
      let ranVideo = Math.floor(Math.random() * this.videos.length)

      let videoX = 0
      if(window.innerWidth > 700) {
        videoX = -700
      }

      let ranImage = Math.floor(Math.random() * this.images.length)

      this.videoShape = new VideoShape(this.videos[ranVideo].url, 700, this.images[ranImage].url)
      this.videoShape.position.set(
        videoX,
        -50,
        -740
      )

      TweenMax.to(this.videoShape.position, 20, {
        y: -200,
        yoyo: true,
        repeat: -1,
        ease: Quad.easeInOut
      })

      this.container.add(this.videoShape)
    }

    this.container.position.x = imageContainerX
    this.container.position.y -= imageY / 2
    this.container.rotation.y = imageContainerRotationY

    TweenMax.delayedCall(0.3, this.animateIn.bind(this))

    TweenMax.to(this.container.position, 18, {
      y: this.container.position.y + 10,
      yoyo: true,
      repeat: -1,
      ease: Quad.easeInOut
    })

    TweenMax.to(this.container.rotation, 16, {
      y: Math.PI * -0.11,
      yoyo: true,
      repeat: -1,
      ease: Quad.easeInOut
    })

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    return this
  }

  animateIn() {
    for (var i = 0; i < this.container.children.length; i++) {
      let object = this.container.children[i]
      if(object.type == 'Mesh') {
        TweenMax.from(object.scale, 0.5, {
          y: 0.001,
          ease: Back.easeOut,
          delay: i * 0.05
        })

        TweenMax.from(object.rotation, 0.5, {
          x: -Math.PI,
          ease: Back.easeOut,
          delay: i * 0.05
        })

        TweenMax.from(object.position, 0.5, {
          z: -500,
          ease: Back.easeOut,
          delay: i * 0.05
        })

        TweenMax.to(object.material, 0.5, {
          opacity: 1,
          ease: Quad.easeOut,
          delay: i * 0.05
        })
      } else {
        TweenMax.to(object.scale, 0.5, {
          x: 1,
          y: 1,
          z: 1,
          ease: Back.easeOut,
          delay: i * 0.05
        })

        TweenMax.from(object.position, 1, {
          y: -500,
          ease: Back.easeOut,
          delay: i * 0.05
        })
      }
    }

    TweenMax.to(this.text3D.scale, 0.5, {
      x: 1,
      y: 1,
      z: 1,
      ease: Back.easeOut,
      delay: 0.3
    })

    TweenMax.from(this.text3D.position, 0.5, {
      y: -200,
      ease: Back.easeOut,
      delay: 0.3
    })

    TweenMax.delayedCall(1, () => {
      window.addEventListener('click', this.testImageInteraction.bind(this))
      window.addEventListener('mousemove', this.onMouseMove.bind(this))
    })
  }

  animateOut() {
    for (var i = 0; i < this.container.children.length; i++) {
      let object = this.container.children[i]
      TweenMax.to(object.scale, 0.3, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        ease: Quad.easeOut,
        delay: i * 0.01
      })

      TweenMax.to(object.rotation, 0.3, {
        x: -Math.PI,
        ease: Quad.easeOut,
        delay: i * 0.01
      })

      TweenMax.to(object.position, 0.3, {
        z: 0,
        x: 0,
        y: -100,
        ease: Quad.easeOut,
        delay: i * 0.01
      })
    }

    TweenMax.to(this.text3D.scale, 0.3, {
      x: 0.00001,
      y: 0.00001,
      z: 0.00001
    })
  }

  testImageInteraction() {
    this.raycaster.setFromCamera(this.mouse, this.cameraReference)
    let intersects = this.raycaster.intersectObjects(this.imageMeshArray)
    if(intersects.length > 0) {
      for(let i = 0; i < this.imageMeshArray.length; i++) {
        if(this.imageMeshArray[i] == intersects[0].object) {
          if(this.imageMeshArray[i].scale.x > 2) {
            this.shrinkImage(this.imageMeshArray[i])
            TweenMax.delayedCall(0.5, () => {
              this.imageActive = false
            })
          } else {
            this.enlargeImage(this.imageMeshArray[i])
            this.imageActive = true
          }
        } else {
          this.shrinkImage(this.imageMeshArray[i])
        }
      }
    }
  }

  enlargeImage(image) {
    TweenMax.to(image.scale, 0.5, {
      x: 5,
      y: 5,
      z: 5,
      ease: Back.easeInOut
    })

    TweenMax.to(image.position, 0.5, {
      x: 200,
      y: -100,
      z: -100,
      ease: Back.easeInOut
    })
  }

  shrinkImage(image) {
    TweenMax.to(image.scale, 0.2, {
      x: 1,
      y: 1,
      z: 1,
      ease: Expo.easeInOut
    })

    TweenMax.to(image.position, 0.2, {
      x: image.originalPosition.x,
      y: image.originalPosition.y,
      z: image.originalPosition.z,
      ease: Expo.easeInOut
    })
  }

  overImage(image) {
    TweenMax.to(image.scale, 0.5, {
      z: 50,
      ease: Bounce.easeOut
    })

    TweenMax.to(image.position, 0.5, {
      z: -120,
      ease: Quad.easeOut
    })
  }

  outImage(image) {
    TweenMax.to(image.scale, 0.4, {
      z: 1,
      ease: Bounce.easeOut
    })

    TweenMax.to(image.position, 0.4, {
      z: -150,
      ease: Bounce.easeOut
    })
  }

  testRollOver() {
    this.raycaster.setFromCamera(this.mouse, this.cameraReference)
    let intersects = this.raycaster.intersectObjects(this.imageMeshArray)

    if(!this.imageActive) {
      if(intersects.length > 0) {
        for(let i = 0; i < this.imageMeshArray.length; i++) {
          if(this.imageMeshArray[i] == intersects[0].object) {
            this.overImage(this.imageMeshArray[i])
          } else {
            this.outImage(this.imageMeshArray[i])
          }
        }
      } else {
        for(let i = 0; i < this.imageMeshArray.length; i++) {
          this.outImage(this.imageMeshArray[i])
        }
      }
    }
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

    this.testRollOver()
  }
}
