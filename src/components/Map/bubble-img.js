import { TweenMax } from 'gsap'

export default class BubbleImage {
    constructor(container, images) {
        this.r = 50
        this.dots = []
        this.animate = false
        this.container = container
        this.images = []
        images.forEach(src => {
            this.createImage(src)
        });
        this.setZoomLevel(0)
    }

    createImage(src) {
        const image = document.createElement('img')
        image.classList.add('bubble-img')
        image.setAttribute('src', src)
        this.container.appendChild(image);
        this.images.push(image)
    }

    setZoomLevel(id) {
        this.images.forEach(i => i.classList.add('hidden'))
        this.images[id].classList.remove('hidden')
    }
}
