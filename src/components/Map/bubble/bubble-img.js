export default class BubbleImage {
    constructor(container, images) {
        this.r = 50
        this.dots = []
        this.animate = false
        this.container = container
        this.images = []
        images.forEach((src, i) => {
            let cssClass = 'far'
            if(i > 0) cssClass = 'close'
            this.createImage(src, cssClass)
        });
        this.setZoomLevel(0)
    }

    createImage(src, cssClass) {
        const image = document.createElement('img')
        image.classList.add('bubble-img')
        image.classList.add(cssClass)
        image.setAttribute('src', src)
        this.container.appendChild(image);
        this.images.push(image)
    }

    setZoomLevel(id) {
        this.images.forEach(i => i.classList.add('hidden'))
        this.images[id].classList.remove('hidden')
    }
}
