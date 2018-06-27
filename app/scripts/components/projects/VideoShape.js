import tinycolor from 'tinycolor2'

export default class VideoShape {
  constructor(url, size, imageurl) {
    this.videoHasPlayed = false

    this.container = new THREE.Object3D()
    this.container.scale.set(0.0001, 0.0001, 0.0001)

    let geometry = new THREE.TetrahedronGeometry(size)

    this.videoElement = document.createElement('video')
    this.videoElement.setAttribute('autoplay', '')
    this.videoElement.setAttribute('loop', '')
    this.videoElement.setAttribute('muted', '')
    this.videoElement.setAttribute('playsinline', '')
    this.videoElement.setAttribute('crossorigin', 'anonymous')

    let sourceElement = document.createElement('source')
    sourceElement.src = url
    this.videoElement.appendChild(sourceElement)

    let fallbackImage = document.createElement('img')
    fallbackImage.src = imageurl
    this.videoElement.appendChild(fallbackImage)

    let videoTexture = new THREE.VideoTexture(this.videoElement)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture.format = THREE.RGBFormat

    let material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      transparent: true,
      opacity: 0,
      color: 0xFFFFFF
    })

    let placeholderMaterial = new THREE.MeshStandardMaterial({
      color: tinycolor.random().toHexString(),
      flatShading: true,
      transparent: true,
      opacity: 0.5
    })

    this.placeholderMesh = new THREE.Mesh(geometry, placeholderMaterial)
    this.placeholderMesh.scale.set(0.9, 0.9, 0.9)
    this.container.add(this.placeholderMesh)

    this.mesh = new THREE.Mesh(geometry, material)

    TweenMax.ticker.addEventListener('tick', this.update.bind(this))

    this.videoElement.addEventListener('canplay', this.animateIn.bind(this))

    return this.container
  }

  animateIn(event) {
    if(this.videoHasPlayed) {
      return
    }

    this.container.add(this.mesh)

    TweenMax.from(this.mesh.scale, 1, {
      x: 0.0001,
      y: 0.0001,
      z: 0.0001,
      ease: Back.easeOut
    })

    TweenMax.to(this.placeholderMesh.scale, 1, {
      x: 0.0001,
      y: 0.0001,
      z: 0.0001,
      ease: Back.easeIn
    })

    TweenMax.to(this.mesh.material, 1, {
      opacity: 0.7
    })

    this.videoElement.play()
    this.videoHasPlayed = true
  }

  update() {
    this.mesh.rotation.x += 0.001
    this.mesh.rotation.y += 0.0015
    this.mesh.rotation.z += 0.0013

    this.placeholderMesh.rotation.x += 0.001
    this.placeholderMesh.rotation.y += 0.0015
    this.placeholderMesh.rotation.z += 0.0013
  }
}
