export default class BackgroundSpacePlane {
  constructor(texture) {
    let geometry = new THREE.PlaneGeometry(1500, 1500)
    let material = new THREE.MeshBasicMaterial(
      {
        transparent: true,
        opacity: 1,
        depthWrite: true,
        map: texture
      }
    )

    this.mesh = new THREE.Mesh(geometry, material)

    TweenMax.from(this.mesh.material, 2,
      {
        opacity: 0,
        ease: Quad.easeOut
      }
    )
  }

  update() {
    this.mesh.rotation.z += 0.0002
  }
}
