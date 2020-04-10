import { TweenMax } from 'gsap'
const svgns = 'http://www.w3.org/2000/svg'

export default class BubbleSVG {
	constructor(container) {
		this.r = 50
		this.dots = []
		this.animate = false
		this.showBounds = true
		this.canvas = document.createElementNS(svgns, 'svg')
		this.canvas.setAttribute('viewBox', '0 0 100 100')
		this.canvas.setAttribute('preserveAspectRatio', 'none')
		this.canvas.classList.add('bubble')
		container.appendChild(this.canvas);
		this.spots = 200
		this.createSpots();
		requestAnimationFrame(() => this.draw())
		this.updateDots()
		this.drawDots()
	}
	setBounds(bounds) {
		this.canvas.setAttribute('width', bounds.width)
		this.canvas.setAttribute('height', bounds.height)
	}
	createSpots() {
		let protection = 0;
		const maxCalls = 10000;
		while (this.dots.length < this.spots) {
			this.populateWithSpot(10);
			protection++;
			if (protection > maxCalls) break
		}
	}
	populateWithSpot(padding) {
		var pt_angle = Math.random() * 2 * Math.PI;
		var pt_radius_sq = Math.random() * Math.pow(this.r - padding, 2);
		let spot = {
			x: this.r + Math.sqrt(pt_radius_sq) * Math.cos(pt_angle),
			y: this.r + Math.sqrt(pt_radius_sq) * Math.sin(pt_angle),
		}
		let overlapping = false
		this.dots.forEach(dot => {
			const dist = Math.sqrt((spot.x - dot.x) ** 2 + (spot.y - dot.y) ** 2);
			if (dist < 4) {
				overlapping = true
			}
		})
		if (!overlapping) {
			this.dots.push(spot)
		}
	}
	updateDots() {
		this.dots.forEach(dot => {
			TweenMax.to(dot, 1, { x: this.canvas.width * Math.random(), y: this.canvas.height * Math.random() })
		})
		if (this.animate) setTimeout(() => this.updateDots(), 2000)
	}
	drawDots() {
		if (this.showBounds) {
			const area = document.createElementNS(svgns, 'circle')
			area.setAttribute('cx', this.r)
			area.setAttribute('cy', this.r)
			area.setAttribute('r', this.r - 5)
			area.classList.add('bubble-area')
			this.canvas.appendChild(area)
		}
		this.dots.forEach(d => {
			const c = document.createElementNS(svgns, 'circle')
			c.setAttribute('cx', d.x)
			c.setAttribute('cy', d.y)
			c.setAttribute('r', 1.5)
			c.classList.add('bubble-dot')
			this.canvas.appendChild(c)
		})
	}
	draw() {
		return
	}
}
