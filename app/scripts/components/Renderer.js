import OrbitControls from 'orbit-controls-es6'
import tinycolor from 'tinycolor2'

export default class Renderer {
  constructor(color) {
    // create the renderer
    this.renderer = new THREE.WebGLRenderer({ alpha : true, antialias : true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(color, 1)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.precision = 'highp'

    this.cssRenderer = new THREE.CSS3DRenderer()
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight)
    this.cssRenderer.domElement.classList.add('css3d-renderer')

    // set default camera position for later retrieval
    this.cameraDefaultPosition = { x : 0, y : 2, z : 130 }
    this.cameraDefaultRotation = { x : 0, y : 0, z : 0 }

    // create the camera
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20000)
    this.camera.position.x = this.cameraDefaultPosition.x
    this.camera.position.y = this.cameraDefaultPosition.y
    this.camera.position.z = this.cameraDefaultPosition.z
    this.camera.rotation.x = this.cameraDefaultRotation.x
    this.camera.rotation.y = this.cameraDefaultRotation.y
    this.camera.rotation.z = this.cameraDefaultRotation.z

    // create the scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(color, 1, 3000)
    TweenMax.from(this.scene.fog, 3, {
      far : 1,
      ease : Expo.easeOut
    })

    this.cssScene = new THREE.Scene()

    // create some lights
    this.ambientLight = new THREE.AmbientLight(0xfafafa, 0.2)
  	this.scene.add(this.ambientLight)

    this.spotLightOne = new THREE.SpotLight(0xffffff, 0.5)
    this.spotLightOne.position.set( -100, 2000, 100 )
    this.spotLightOne.castShadow = true

    this.spotLightOne.shadow.mapSize.width = 2048
    this.spotLightOne.shadow.mapSize.height = 2048

    this.spotLightOne.shadow.camera.near = 500
    this.spotLightOne.shadow.camera.far = 4000
    this.spotLightOne.shadow.camera.fov = 30

    this.scene.add(this.spotLightOne)

    this.spotLightTwo = new THREE.SpotLight(0xffffff, 0.5)
    this.spotLightTwo.position.set(1500, 20000, 800)
    this.spotLightTwo.rotation.set(0, 0, Math.PI)

    this.scene.add(this.spotLightTwo);

    this.directionalLightOne = new THREE.DirectionalLight(0xfafafa, 1)
    this.directionalLightOne.position.set(0, -1000, 0)
    this.directionalLightOne.castShadow = true
    this.scene.add(this.directionalLightOne)

    // create an orbit controller
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.object.position.z = 700
    this.controls.minDistance = 50
    this.controls.maxDistance = 900
    this.controls.minPolarAngle = - Math.PI - (Math.PI / 3)
    this.controls.maxPolarAngle = Math.PI - (Math.PI / 5)
    this.controls.minAzimuthAngle = - Math.PI / 3
    this.controls.maxAzimuthAngle = Math.PI / 3
    this.controls.enablePan = false
    this.controls.update()

    window.addEventListener('keyup', this.onKeyUp.bind(this))

    // reset the projection matrix on resize
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  adjustFog(time, near, far) {
    TweenMax.to(this.scene.fog, time, {
      near : near,
      far : far,
      ease : Expo.easeOut
    })
  }

  changeFogColor(time, color) {
    let rgbColor = tinycolor(color).toRgb()

    TweenMax.to(this.scene.fog.color, time, {
      r : rgbColor.r,
      g : rgbColor.g,
      b : rgbColor.b,
      ease : Quad.easeInOut,
      yoyo : true,
      repeat : -1
    })
  }

  moveCamera(time, rotationVec, positionVec) {
    this.controls.enabled = false

    TweenMax.to(this.controls.object.position, time, {
      x : positionVec.x,
      y : positionVec.y,
      z : positionVec.z,
      ease : Back.easeOut,
      onComplete : () => {
        this.controls.enabled = true
      }
    })

    TweenMax.to(this.controls.object.rotation, time, {
      x : rotationVec.x,
      y : rotationVec.y,
      z : rotationVec.z,
      ease : Back.easeOut
    })
  }

  render() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    this.cssRenderer.render(this.cssScene, this.camera)
  }

  onKeyUp(event) {
    if(event.code == 'Space') {
      console.log(this.controls.object.position, this.controls.object.rotation)
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight)
  }

  get rendererElement() {
    return this.renderer.domElement
  }

  get cssRendererElement() {
    return this.cssRenderer.domElement
  }
}
