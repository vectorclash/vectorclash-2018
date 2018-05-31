import tinycolor from 'tinycolor2'

export default class ImagePlane {
  constructor(url, size) {
    let geometry = new THREE.PlaneGeometry(size, size, 32)
    let texture = new THREE.TextureLoader().load(url)
    let material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      needsUpdate: true
    })

    this.mesh = new THREE.Mesh(geometry, material)
  }
}
