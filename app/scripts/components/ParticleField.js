import * as THREE from 'three'

export default class ParticleField {
  constructor(particleNum, texture) {
    this.particleCount = particleNum
    this.particles = new THREE.Geometry()

    this.particleMaterial = new THREE.PointsMaterial({
      size : 20,
      map : texture,
      blending : THREE.NormalBlending,
      transparent : true,
      opacity : 0.8,
      depthWrite : false
    })

    for (let p = 0; p < this.particleCount; p++) {
      let pX = Math.random() * 1000 - 500,
          pY = Math.random() * 1000 - 500,
          pZ = Math.random() * 1000 - 500,
          particle = new THREE.Vector3(pX, pY, pZ)

      this.particles.vertices.push(particle)
    }

    this.particleSystem = new THREE.Points(this.particles, this.particleMaterial)
    this.particleSystem.sortParticles = true
  }

  update() {
    this.particleSystem.rotation.x += 0.0002
    this.particleSystem.rotation.y += 0.0003
    this.particleSystem.rotation.z += 0.00029
  }
}
