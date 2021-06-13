let animationId
let score = 0
function animate() {
	animationId = requestAnimationFrame(animate)
    c.save()
    c.globalAlpha = 0.1
	imageLoad()
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