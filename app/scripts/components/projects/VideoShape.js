export default class VideoShape {
  constructor(url, size) {
    let geometry = new THREE.TetrahedronGeometry(size)

    let videoElement = document.createElement('video')
    videoElement.src = url
    videoElement.setAttribute('autoplay', '')
    videoElement.setAttribute('loop', '')
    videoElement.setAttribute('crossorigin', 'anonymous')

    let videoTexture = new THREE.VideoTexture(videoElement)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture.format = THREE.RGBFormat

    let material = new THREE.MeshBasicMaterial({
      map : videoTexture,
      transparent : true,
      opacity : 0
    })

    this.mesh = new THREE.Mesh(geometry, material)

    TweenMax.ticker.addEventListener('tick', this.update.bind(this))

    return this.mesh
  }

  update() {
    this.mesh.rotation.x += 0.001
    this.mesh.rotation.y += 0.0015
    this.mesh.rotation.z += 0.0013
  }
}
