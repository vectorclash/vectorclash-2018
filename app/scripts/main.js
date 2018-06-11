// external imports
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

// custom component imports
import Renderer from './components/Renderer'
import ProjectShape from './components/projects/ProjectShape'
import ProjectDetails from './components/projects/ProjectDetails'
import BackgroundGradientPlane from './components/BackgroundGradientPlane'
import BackgroundSpacePlane from './components/BackgroundSpacePlane'
import ParticleField from './components/ParticleField'
import WireframeShapeSwirl from './components/WireframeShapeSwirl'
import AboutContent from './components/html/AboutContent'

let mainContainer
let renderer, cssRenderer
let scene, cssScene, camera
let needUpdate = []
let interactiveObjects = []
let projects = []
let projectData = []
let activeProjectDetail
let raycaster
let mouse
let projectIsActive = false
let closeButton, closeButtonHit
let background, space, particles, shapeSwirl, projectContainer, projectCSSContainer
let spaceTexture
let aboutContent
let isMobile = false
let instructionsElement
let hiddenTitleElement
let titles = ['Vectorclash', 'Omnichromatic', 'Geometric']

function preloadSpace() {
  let spaceLoader = new THREE.TextureLoader()
  spaceLoader.load(
    'images/textures/space-4096.png',
    (texture) => {
      spaceTexture = texture
      init()
    }
  )
}

function init() {
  detectIfMobile()

  mainContainer = document.querySelector('.main-container')

  hiddenTitleElement = document.querySelector('.hidden-title')

  instructionsElement = document.querySelector('.instructions')

  let aboutContent = new AboutContent()
  aboutContent.content.addEventListener('enable3DInteraction', enableInteraction)
  aboutContent.content.addEventListener('disable3DInteraction', disableInteraction)

  renderer = new Renderer(0xff006b)
  mainContainer.appendChild(renderer.rendererElement)
  mainContainer.appendChild(renderer.cssRendererElement)

  scene = renderer.scene
  cssScene = renderer.cssScene
  camera = renderer.camera

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  shapeSwirl = new WireframeShapeSwirl(20)
  scene.add(shapeSwirl.container)
  shapeSwirl.container.scale.set(0.03, 0.03, 0.03)
  TweenMax.from(shapeSwirl.container.scale, 1, {
    x: 0.0001,
    y: 0.0001,
    z: 0.0001,
    ease : Elastic.easeOut
  })

  projectContainer = new THREE.Object3D()
  scene.add(projectContainer)

  projectCSSContainer = new THREE.Object3D()
  cssScene.add(projectCSSContainer)

  $.get({
    url : 'http://www.vectorclash.com/data/projects?_format=json',
    success : (data) => {
      projectData = data
      for (let i = 0; i < data.length; i++) {
        let newShape = new ProjectShape(i)
        projects.push(newShape)
        scene.add(newShape.container)
        needUpdate.push(newShape)
        interactiveObjects.push(newShape.shape)
      }

      TweenMax.to(shapeSwirl.container.scale, 1, {
        x: 1,
        y: 1,
        z: 1,
        ease: Quad.easeInOut,
        delay: 0.5
      })

      space = new BackgroundSpacePlane(spaceTexture)
      space.mesh.position.z = -350
      scene.add(space.mesh)
      needUpdate.push(space)

      background = new BackgroundGradientPlane()
      background.mesh.position.z = -360
      scene.add(background.mesh)
      needUpdate.push(background)

      let starLoader = new THREE.TextureLoader()
      starLoader.load(
        'images/textures/star-1024.png',
        (texture) => {
          particles = new ParticleField(1000, texture)
          scene.add(particles.particleSystem)
          needUpdate.push(particles)
        }
      )

      renderer.moveCamera(3, -300, -300, 300)

      TweenMax.to('.title', 2, {
        text: 'VECTOR / CLASH',
        alpha: 0.5,
        delay: 0.5,
        ease: Expo.easeOut
      })

      TweenMax.to(renderer.rendererElement, 1, {
        alpha: 1
      })

      TweenMax.to(instructionsElement, 1, {
        alpha: 1
      })
    }
  })

  closeButton = document.querySelector('.close-button')
  closeButtonHit = document.querySelector('.close-button-hitarea')
  TweenMax.set(closeButton, {
    scaleX: 0.6,
    scaleY: 0.6
  })

  enableInteraction()
  changeTitle()

  TweenMax.ticker.addEventListener('tick', loop)
}

function removeInstructions() {
  TweenMax.to(instructionsElement, 1, {
    y: 20,
    alpha: 0,
    ease: Quad.easeOut,
    onComplete: () => {
      instructionsElement.parentNode.removeChild(instructionsElement)
      instructionsElement = null
    }
  })
}

function enableInteraction() {
  if(!projectIsActive) {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
    renderer.rendererElement.addEventListener('touchstart', onTouchStart)
  }
}

function disableInteraction() {
  if(instructionsElement) {
    removeInstructions()
  }

  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onClick)
  renderer.rendererElement.removeEventListener('touchstart', onTouchStart)
}

function testRollOver() {
  raycaster.setFromCamera(mouse, camera)

  let intersects = raycaster.intersectObjects(interactiveObjects)
  if(intersects.length > 0 && !projectIsActive) {
    mainContainer.style.cursor = 'pointer'
    for(let i = 0; i < interactiveObjects.length; i++) {
      if(interactiveObjects[i] == intersects[0].object) {
        projects[i].rolloverProject()
      } else {
        projects[i].rolloutProject()
      }
    }
  } else {
    mainContainer.style.cursor = 'auto'
    for (var i = 0; i < projects.length; i++) {
      projects[i].rolloutProject()
    }
  }
}

function testInteractiveObjects() {
  if(!projectIsActive) {
    raycaster.setFromCamera(mouse, camera)

    let intersects = raycaster.intersectObjects(interactiveObjects)
    if(intersects.length > 0) {
      for(let i = 0; i < interactiveObjects.length; i++) {
        if(interactiveObjects[i] == intersects[0].object) {
          projects[i].openProject()
          projects[i].rolloutProject()
          openProjectDetail(i)
        } else {
          projects[i].disableProject()
        }
      }
      projectIsActive = true
      disableSpaceBackground()
    }
  }
}

function openProjectDetail(pID) {
  let newProjectDetail = new ProjectDetails(projectData[pID])
  activeProjectDetail = newProjectDetail
  projectContainer.add(newProjectDetail.container)
  projectCSSContainer.add(newProjectDetail.cssContainer)

  renderer.moveCamera(1, 0, 0, 800)
}

function disableSpaceBackground() {
  mainContainer.style.cursor = 'auto'

  disableInteraction()

  renderer.adjustFog(2, 1, 5000)

  TweenMax.from(closeButton, 1, {
    y : 360,
    alpha : 0,
    ease : Expo.easeOut,
    onStart : () => {
      closeButton.style.display = 'block'
    },
    onComplete : () => {
      closeButtonHit.addEventListener('click', closeProjects)
    }
  })

  TweenMax.to(background.mesh.position, 1, {
    z: -5000,
    ease : Quad.easeOut
  })

  TweenMax.to(space.mesh.position, 1, {
    z: -4700,
    ease : Quad.easeOut
  })

  TweenMax.to(shapeSwirl.container.scale, 2, {
    x: 2,
    y: 2,
    z: 2,
    ease : Expo.easeOut
  })

  TweenMax.to('.title', 0.5, {
    alpha: 0,
    y: 20,
    ease: Quad.easeOut
  })
}

function enableSpaceBackground() {
  renderer.adjustFog(2, 1, 3000)

  const ranX = -300 + Math.random() * 600
  const ranY = -300 + Math.random() * 600

  renderer.moveCamera(1, ranX, ranY, 300)

  TweenMax.to(closeButton, 1, {
    alpha: 0,
    ease: Expo.easeOut,
    onComplete : () => {
      closeButton.style.display = 'none'
      closeButton.style.opacity = 1
      enableInteraction()
    }
  })

  TweenMax.to(background.mesh.position, 1, {
    z: -360,
    ease: Expo.easeOut
  })

  TweenMax.to(space.mesh.position, 1, {
    z: -350,
    ease: Expo.easeOut
  })

  TweenMax.to(shapeSwirl.container.scale, 2, {
    x: 1,
    y: 1,
    z: 1,
    ease: Elastic.easeOut
  })

  TweenMax.to('.title', 1, {
    alpha: 0.5,
    y: 0,
    ease: Quad.easeOut
  })

  projectIsActive = false
}

function closeProjects() {
  for(let i = 0; i < projects.length; i++) {
    projects[i].closeProject()
    enableSpaceBackground()
  }

  let projectTitleElements = document.querySelectorAll('.project-title')
  let projectBodyElements = document.querySelectorAll('.project-body')

  TweenMax.to(projectTitleElements, 0.5, {
    scaleX: 0,
    scaleY: 0,
    alpha: 0,
    ease: Quad.easeOut,
    onComplete : () => {
      for (var i = 0; i < projectTitleElements.length; i++) {
        let title = projectTitleElements[i]
        title.parentNode.removeChild(title)
      }
    }
  })

  TweenMax.to(projectBodyElements, 1, {
    scaleX: 0,
    scaleY: 0,
    alpha: 0,
    ease: Quad.easeOut,
    onComplete : () => {
      for (var i = 0; i < projectBodyElements.length; i++) {
        let body = projectBodyElements[i]
        body.parentNode.removeChild(body)
      }
    }
  })

  activeProjectDetail.animateOut()
  TweenMax.delayedCall(1, () => {
    projectContainer.remove(activeProjectDetail.container)
  })
}

function changeTitle() {
  let ranTitle = titles[Math.floor(Math.random() * titles.length)]
  TweenMax.to(hiddenTitleElement, 1, {
    text: ranTitle,
    onUpdate: () => {
      document.title = hiddenTitleElement.textContent
    },
    onComplete: () => {
      TweenMax.delayedCall(1 + Math.random() * 5, () => {
        changeTitle()
      })
    }
  })
}

function detectIfMobile() {
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
      isMobile = true;
  }
}

// main loop

function loop() {
  renderer.render()

  for (var i = 0; i < needUpdate.length; i++) {
    needUpdate[i].update()
  }
}

// event handlers

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

  testRollOver()
}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
  testInteractiveObjects()

  if(instructionsElement) {
    removeInstructions()
  }
}

function onTouchStart(event) {
  event.preventDefault()
  mouse.x = (event.targetTouches[0].pageX / window.innerWidth) * 2 - 1
  mouse.y = - (event.targetTouches[0].pageY / window.innerHeight) * 2 + 1
  testRollOver(event)
  TweenMax.delayedCall(0.2, testInteractiveObjects)

  if(instructionsElement) {
    removeInstructions()
  }
}

// initiate

window.addEventListener('load', preloadSpace)
