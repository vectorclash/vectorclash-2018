import * as THREE from 'three'

export default class BackgroundGradientPlane {
  constructor() {
    let geometry = new THREE.PlaneGeometry(1500, 1500)
    let material = new THREE.MeshBasicMaterial(
      {
        transparent : true,
        opacity : 0,
        depthWrite : true
      }
    )

    this.mesh = new THREE.Mesh(geometry, material)

    let loader = new THREE.TextureLoader()
    loader.load(
      'images/textures/space-4096.png',
      (texture) => {
        this.mesh.material.map = texture
        this.mesh.material.needsUpdate = true

        TweenMax.to(this.mesh.material, 2,
          {
            opacity : 1,
            ease : Quad.easeOut
          }
        )
      }
    )
  }

  update() {
    this.mesh.rotation.z += 0.0002
  }
}
