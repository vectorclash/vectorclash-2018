import tinycolor from 'tinycolor2'

export default class AboutContent {
  constructor() {
    this.isActive = false
    this.container = document.querySelector('.html-content')
    this.aboutButton = document.querySelector('.about-button')
    this.aboutButtonContent = this.aboutButton.querySelector('p')
    this.content = document.querySelector('.about-row')
    this.aboutContent = document.querySelector('.about-content')
    this.gradientBackground = document.querySelector('.gradient-background')
    this.mainTitle = document.querySelector('.title')
    this.copyright = document.querySelector('.copyright')

    let date = new Date()
    this.copyright.innerHTML = '© ' + date.getFullYear() + ' Aaron Ezra Sterczewski'

    this.color1 = tinycolor.random().toRgb()
    this.color2 = tinycolor.random().toRgb()
    this.color3 = tinycolor.random().toRgb()

    this.changeColors()

    this.aboutButton.addEventListener('click', this.onButtonClick.bind(this))
    TweenMax.ticker.addEventListener('tick', this.update.bind(this))

    $.get({
      url : 'http://www.vectorclash.com/data/about?_format=json',
      success : (data) => {
        this.aboutContent.innerHTML = ''

        let title = document.createElement('h1')
        title.innerHTML = data.title[0].value

        this.aboutContent.appendChild(title)

        let body = document.createElement('div')
        body.innerHTML = data.body[0].value

        this.aboutContent.appendChild(body)
      }
    })

    return this
  }

  changeColors() {
    TweenMax.to(this.color1, 5, {
      r : Math.random() * 255,
      g : Math.random() * 255,
      b : Math.random() * 255,
      ease : Quad.easeInOut,
      onComplete : this.changeColors.bind(this)
    })

    TweenMax.to(this.color2, 5, {
      r : Math.random() * 255,
      g : Math.random() * 255,
      b : Math.random() * 255,
      ease : Quad.easeInOut
    })

    TweenMax.to(this.color3, 5, {
      r : Math.random() * 255,
      g : Math.random() * 255,
      b : Math.random() * 255,
      ease : Quad.easeInOut
    })
  }

  activateAboutPage() {
    this.isActive = true

    this.container.classList.add('enble-events')
    this.container.classList.remove('disable-events')

    TweenMax.set(this.mainTitle, {
      display : 'none'
    })

    TweenMax.set(this.gradientBackground, {
      display : 'block'
    })

    TweenMax.from(this.gradientBackground, 1, {
      alpha : 0,
      ease : Quad.easeOut
    })

    TweenMax.set(this.content, {
      display : 'flex'
    })

    TweenMax.staggerFrom(this.content.children, 1, {
      y : 20,
      alpha : 0,
      ease : Back.easeOut
    }, 0.1)

    TweenMax.to(this.aboutButtonContent, 0.5, {
      text : 'close'
    })
  }

  deactivateAboutPage() {
    this.isActive = false

    this.container.classList.add('disable-events')
    this.container.classList.remove('enable-events')

    TweenMax.set(this.mainTitle, {
      display : 'block'
    })

    TweenMax.set(this.gradientBackground, {
      display : 'none'
    })

    TweenMax.set(this.content, {
      display : 'none'
    })

    TweenMax.to(this.aboutButtonContent, 0.5, {
      text : 'About/Contact'
    })
  }

  onButtonClick(event) {
    let myEvent
    if(this.isActive) {
      this.deactivateAboutPage()
      myEvent = new Event('enable3DInteraction')
    } else {
      this.activateAboutPage()
      myEvent = new Event('disable3DInteraction')
    }

    this.content.dispatchEvent(myEvent)
  }

  update() {
    const bgStyle = 'url(images/nebula_stars.png), linear-gradient(42deg, ' + tinycolor(this.color1).toHexString() + ', ' + tinycolor(this.color2).toHexString() + ', ' + tinycolor(this.color3).toHexString() + ')'
    this.gradientBackground.style.backgroundImage = bgStyle
  }
}
