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