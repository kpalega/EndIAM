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

function imageLoad(url){
    var image = new Image()
    image.src = url
    image.onload = function(){
        var pattern = c.createPattern(this, "repeat")
        c.fillStyle = pattern
    }
}

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
	
function init(){
    player = new Player(x, y, 20, 'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score
}

var keys = {
	up: false,
	down: false,
	left: false,
	right: false
}

window.onkeydown = function(e){
		var kc = e.keyCode
		e.preventDefault()
		if(kc === 65) keys.left = true;
		else if(kc === 87) keys.up = true;
		else if(kc === 68) keys.right = true;
		else if(kc === 83) keys.down = true;	
}

window.onkeyup = function(e){
	var kc = e.keyCode
	e.preventDefault()
	if(kc === 65) keys.left = false;
	else if(kc === 87) keys.up = false;
	else if(kc === 68) keys.right = false;
	else if(kc === 83) keys.down = false;	
}

function checkMove(){
	if(keys.up){
		if(player.y - player.radius >= 0) {
			player.y -= 3
		} 
	}
	else if (keys.down){
		if(player.y + player.radius <= canvas.height) {
			player.y += 3
		}
	}
	else if (keys.left){
		if(player.x - player.radius >= 0) {
			player.x -= 3
		}
	}
	else if (keys.right){
		if(player.x + player.radius <= canvas.width) {
			player.x += 3
		}
	}
}

function spawnEnemies() {
	setInterval(()=> {
		
		const radius = Math.random() * (40 - 4) +  4
		
		let x
		let y
		
		if (Math.random() < 0.5) {
		
		x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
		y = Math.random() * canvas.height
		
		} else {
			x = Math.random() * canvas.width
			y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
			
		}
		//Różne kolory lecących kulek
		const color = `hsl(${Math.random() * 360}, 50%,50%)`
			
		
		const angle = Math.atan2(
			player.y - y,
			player.x - x
		)
	
		const velocity = {
			x: Math.cos(angle), 
			y: Math.sin(angle)
		}
		
		enemies.push(new Enemy(x, y, radius, color, velocity))
	}, 500)
	
	
}


let animationId
let score = 0
function animate() {
	animationId = requestAnimationFrame(animate)
    c.save()
    c.globalAlpha = 0.1
	//background color (0.1 dodaje rozmycie przy kulkach)
	//c.fillStyle = 'rgba(0,0,0, 0.1)'
    imageLoad('https://wallpaperaccess.com/full/1253106.jpg')
	c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
    player.draw()
    particles.forEach((particle, index) => {
        if( particle.alpha <= 0){
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    })
	projectiles.forEach((projectile, index) => {
		projectile.update()
		
		//remove from edges of screen
	if (
	projectile.x + projectile.radius < 0 ||
	projectile.x - projectile.radius > canvas.width ||
	projectile.y + projectile.radius < 0 ||
	projectile.y - projectile.radius > canvas.height
	) {
			setTimeout(() => {
					
					projectiles.splice(index, 1)
				},0)
			
			
		}
	})
	
	enemies.forEach((enemy, index) => {
		enemy.update()
		
		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
		
		//endgame
		if (dist - enemy.radius - player.radius < 1) {
			cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
			audio.pause()
			audio.currentTime = 0
		}
		
		projectiles.forEach((projectile, projectileIndex) => {
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
			
			//projectiles touch enemy
			if (dist - enemy.radius - projectile.radius < 1) {

				//create explosion
                for(let i = 0; i < enemy.radius * 2 ; i++){
                    particles.push(new Particle(
                        projectile.x,
                        projectile.y,
                        Math.random() * 2,
                        enemy.color, {
                            x: (Math.random() - 0.5) * (Math.random() * 6),
                            y: (Math.random() - 0.5) * (Math.random() * 6)
                        }
                    ))

                }
                if(enemy.radius - 10 > 5){
                    //icrease score
                    score += 100
                    scoreEl.innerHTML = score

                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    } )
				    setTimeout(() => {
					    projectiles.splice(projectileIndex, 1)
				    },0)
                } else {
                    //remove from scene
                    //icrease score
                    score += 250
                    scoreEl.innerHTML = score
				    setTimeout(() => {
					    enemies.splice(index, 1)
					    projectiles.splice(projectileIndex, 1)
				    },0)
                }
			}
		})
	})
}

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
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
})
