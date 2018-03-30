import * as THREE from 'three'

export default class BackgroundGradientPlane {
  constructor() {
    let geometry = new THREE.PlaneGeometry(5000, 5000)

    let texture = new THREE.Texture( this.generateTexture() )
    texture.needsUpdate = true

    let material = new THREE.MeshBasicMaterial(
      {
        map : texture,
        transparent : true
      }
    )

    this.mesh = new THREE.Mesh(geometry, material)
  }

  generateTexture() {
  	let size = 1024

  	// create canvas
  	let canvas = document.createElement( 'canvas' )
  	canvas.width = size
  	canvas.height = size

  	// get context
  	let context = canvas.getContext( '2d' )

  	// draw gradient
  	context.rect( 0, 0, size, size )
  	let gradient = context.createLinearGradient( 0, 0, size, size )
  	gradient.addColorStop(0, '#41009e')
  	gradient.addColorStop(1, '#ff0073')
  	context.fillStyle = gradient
  	context.fill()

  	return canvas;
  }
}
