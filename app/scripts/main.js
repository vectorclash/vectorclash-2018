// external imports
import TweenMax from 'gsap'
import tinycolor from 'tinycolor2'

// custom component imports
import Renderer from './components/Renderer'
import ProjectShape from './components/ProjectShape'
import ProjectDetails from './components/ProjectDetails'
import BackgroundGradientPlane from './components/BackgroundGradientPlane'
import BackgroundSpacePlane from './components/BackgroundSpacePlane'
import ParticleField from './components/ParticleField'
import WireframeShapeSwirl from './components/WireframeShapeSwirl'

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

function init() {
  mainContainer = document.querySelector('.main-container')

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
    x : 0.0001,
    y : 0.0001,
    z : 0.0001,
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
        x : 1,
        y : 1,
        z : 1,
        ease : Expo.easeOut
      })

      background = new BackgroundGradientPlane()
      background.mesh.position.z = -360
      scene.add(background.mesh)
      needUpdate.push(background)

      let spaceLoader = new THREE.TextureLoader()
      spaceLoader.load(
        'images/textures/space-4096.png',
        (texture) => {
          space = new BackgroundSpacePlane(texture)
          space.mesh.position.z = -350
          scene.add(space.mesh)
          needUpdate.push(space)
        }
      )

      let starLoader = new THREE.TextureLoader()
      starLoader.load(
        'images/textures/star-1024.png',
        (texture) => {
          particles = new ParticleField(1000, texture)
          scene.add(particles.particleSystem)
          needUpdate.push(particles)
        }
      )
    }
  })

  closeButton = document.querySelector('.close-button')
  closeButtonHit = document.querySelector('.close-button-hitarea')
  TweenMax.set(closeButton, {
    scaleX : 0.6,
    scaleY : 0.6
  })

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onClick)
  renderer.rendererElement.addEventListener('touchstart', onTouchStart)

  TweenMax.ticker.addEventListener('tick', loop)
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

  testRollOver()
}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
  testInteractiveObjects()
}

function onTouchStart(event) {
  event.preventDefault()
  mouse.x = (event.targetTouches[0].pageX / window.innerWidth) * 2 - 1
  mouse.y = - (event.targetTouches[0].pageY / window.innerHeight) * 2 + 1
  testRollOver(event)
  TweenMax.delayedCall(0.2, testInteractiveObjects)
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
}

function disableSpaceBackground() {
  mainContainer.style.cursor = 'auto'

  window.removeEventListener('click', onClick)
  renderer.rendererElement.removeEventListener('touchstart', onTouchStart)

  renderer.adjustFog(2, 1, 4000)

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
    z : -2000,
    ease : Quad.easeOut
  })

  TweenMax.to(space.mesh.position, 1.2, {
    z : -2000,
    ease : Quad.easeOut
  })

  TweenMax.to(shapeSwirl.container.scale, 2, {
    x : 2,
    y : 2,
    z : 2,
    ease : Expo.easeOut
  })

  TweenMax.to('.title', 0.5, {
    alpha : 0,
    y : 20,
    ease : Quad.easeOut
  })
}

function enableSpaceBackground() {
  renderer.adjustFog(2, 1, 3000)

  TweenMax.to(closeButton, 1, {
    alpha : 0,
    ease : Expo.easeOut,
    onComplete : () => {
      closeButton.style.display = 'none'
      closeButton.style.opacity = 1
      window.addEventListener('click', onClick)
      renderer.rendererElement.addEventListener('touchstart', onTouchStart)
    }
  })

  TweenMax.to(background.mesh.position, 1, {
    z : -360,
    ease : Expo.easeOut
  })

  TweenMax.to(space.mesh.position, 1, {
    z : -350,
    ease : Expo.easeOut
  })

  TweenMax.to(shapeSwirl.container.scale, 2, {
    x : 1,
    y : 1,
    z : 1,
    ease : Elastic.easeOut
  })

  TweenMax.to('.title', 1, {
    alpha : 0.5,
    y : 0,
    ease : Quad.easeOut
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
    scaleX : 0,
    scaleY : 0,
    alpha : 0,
    ease : Quad.easeOut,
    onComplete : () => {
      for (var i = 0; i < projectTitleElements.length; i++) {
        let title = projectTitleElements[i]
        title.parentNode.removeChild(title)
      }
    }
  })

  TweenMax.to(projectBodyElements, 1, {
    scaleX : 0,
    scaleY : 0,
    alpha : 0,
    ease : Quad.easeOut,
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

function loop() {
  renderer.render()

  for (var i = 0; i < needUpdate.length; i++) {
    needUpdate[i].update()
  }
}

window.addEventListener('load', init)
