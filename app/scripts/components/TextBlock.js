import tinycolor from 'tinycolor2'

export default class TextBlock {
  constructor(text, font, size, color) {
    let geometry = new THREE.TextGeometry(text,
      {
        font : font,
        size : size,
    		height : 0.2,
    		curveSegments : 12
      }
    )

    console.log(geometry)

    let material = new THREE.MeshBasicMaterial(
      {
        color : color
      }
    )

    this.mesh = new THREE.Mesh(geometry, material)
  }
}
