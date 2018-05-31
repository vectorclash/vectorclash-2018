import tinycolor from 'tinycolor2'

export default class BackgroundGradientPlane {
  constructor() {
    this.colorOne = tinycolor.random().toHexString()
    this.colorTwo = tinycolor.random().toHexString()
    this.colorThree = tinycolor.random().toHexString()

    this.geometry = new THREE.PlaneGeometry(6000, 6000)

    let texture = new THREE.Texture( this.generateTexture() )
    texture.needsUpdate = true

    this.material = new THREE.MeshBasicMaterial(
      {
        map: texture,
        depthWrite: false
      }
    )

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.changeColor()
  }

  changeColor() {
    TweenMax.to(this, 5, {
      colorOne: tinycolor.random().toHexString(),
      colorTwo: tinycolor.random().toHexString(),
      colorThree: tinycolor.random().toHexString(),
      onComplete: this.changeColor.bind(this)
    })
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

  	gradient.addColorStop(0.3, this.colorOne)
  	gradient.addColorStop(0.5, this.colorTwo)
    gradient.addColorStop(0.7, this.colorThree)
  	context.fillStyle = gradient
  	context.fill()

  	return canvas;
  }

  update() {
    let texture = new THREE.Texture( this.generateTexture() )
    texture.needsUpdate = true

    this.material.map = texture
    this.material.needsUpdate = true
  }
}
