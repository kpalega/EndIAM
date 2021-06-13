const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
const audio = document.querySelector("audio")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const scoreEl = document.querySelector('#scoreEl')
console.log(scoreEl)
const startGameBtn = document.querySelector('#startGameBtn')
const bigScoreEl = document.querySelector("#bigScoreEl")
const modalEl = document.querySelector("#modalEl")


class Player {
	constructor(x, y, radius, color) {
		this.x = x 
		this.y = y
		this.radius = radius
		this.color = color
	}	
	
	draw() {
		checkMove()
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
}

class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	
	draw() {
		c.beginPath()
		c.arc(
		this.x, 
		this.y, 
		this.radius, 
		0, 
		Math.PI * 2, 
		false
		)
		c.fillStyle = this.color
		c.fill()
	}

	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y		
	}	
}

class Enemy {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}

	draw() {
		c.beginPath()
		c.arc(
		this.x, 
		this.y, 
		this.radius, 
		0, 
		Math.PI * 2, 
		false
		)
		c.fillStyle = this.color
		c.fill()
	}

	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y		
	}	
}

const friction = 0.97
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
        this.alpha = 1
	}
	
	draw() {
        c.save()
        c.globalAlpha = this.alpha
		c.beginPath()
		c.arc(
		    this.x, 
		    this.y, 
		    this.radius, 
		    0, 
		    Math.PI * 2, 
		    false
		)
		c.fillStyle = this.color
		c.fill()
        c.restore()
	}

	update() {
		this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
        this.alpha 	-= 0.01	
	}	
}

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 10, 'white')
let projectiles = []
let enemies = []
let particles = []
	

window.addEventListener('click', (event) => {
	
	console.log(projectiles)
	
	const angle = Math.atan2(
	event.clientY - player.y, 
	event.clientX - player.x
	)
	
	const velocity = {
		x: Math.cos(angle) * 5, 
		y: Math.sin(angle) * 5
	}
	
		projectiles.push(new Projectile(player.x,
		player.y, 5, 'white', velocity)
	)
})

startGameBtn.addEventListener('click', () => {
	audio.volume = 0.2
	audio.play()
    init()
	checkMove()
	spawnEnemies()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
})
