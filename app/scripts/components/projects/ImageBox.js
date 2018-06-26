import tinycolor from 'tinycolor2'

export default class ImageBox {
  constructor(url, size) {
    let geometry = new THREE.BoxGeometry(size, size, 2)
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
