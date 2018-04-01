import * as THREE from 'three'

export default class BackgroundGradientPlane {
  constructor() {

    let geometry = new THREE.PlaneGeometry(1500, 1500)

    let texture = new THREE.TextureLoader().load( 'textures/space-4096.png' );

    let material = new THREE.MeshBasicMaterial(
      {
        map : texture,
        transparent : true,
        side : THREE.DoubleSide,
        opacity : 1
      }
    )

    this.mesh = new THREE.Mesh(geometry, material)
  }

  update() {
    this.mesh.rotation.z += 0.0002
  }
}
