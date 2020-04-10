import { TweenMax } from 'gsap'

export default class Bubble {
    constructor(container) {
        this.dots = []
        this.animate = false
        this.canvas = document.createElement('canvas')
        this.canvas.classList.add('bubble')
        this.r = 50
        this.canvas.setAttribute('width', this.r * 2)
        this.canvas.setAttribute('height', this.r * 2)
        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d')
        for (let i = 0; i < 100; i++) {
            const dot = this.getPointInsideBubble(5)
            this.dots.push(dot)
        }
        requestAnimationFrame(() => this.draw())
        this.updateDots()
    }
    getPointInsideBubble(padding) {
        var pt_angle = Math.random() * 2 * Math.PI;
        var pt_radius_sq = Math.random() * Math.pow(this.r - padding, 2);
        return { x: this.r + Math.sqrt(pt_radius_sq) * Math.cos(pt_angle), y: this.r + Math.sqrt(pt_radius_sq) * Math.sin(pt_angle) }
    }
    updateDots() {
        this.dots.forEach(dot => {
            TweenMax.to(dot, 1, { x: this.canvas.width * Math.random(), y: this.canvas.height * Math.random() })
        })
        if (this.animate) setTimeout(() => this.updateDots(), 2000)
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        this.ctx.arc(this.r, this.r, this.r, 0, 2 * Math.PI);
        this.ctx.fill()
        this.ctx.fillStyle = 'rgba(255, 0, 0, 1)'
        this.dots.forEach(d => {
            this.ctx.beginPath();
            this.ctx.arc(d.x, d.y, 2, 0, 2 * Math.PI);
            this.ctx.fill()
        })
        if (this.animate) requestAnimationFrame(() => this.draw())
    }
}