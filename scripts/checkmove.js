var keys = {
	up: false,
	down: false,
	left: false,
	right: false
}
//change state when key was pressed
window.onkeydown = function(e){
	var kc = e.keyCode
	e.preventDefault()
	if(kc === 65) keys.left = true;
	else if(kc === 87) keys.up = true;
	else if(kc === 68) keys.right = true;
	else if(kc === 83) keys.down = true;	
}

//chage state when key was released
window.onkeyup = function(e){
	var kc = e.keyCode
	e.preventDefault()
	if(kc === 65) keys.left = false;
	else if(kc === 87) keys.up = false;
	else if(kc === 68) keys.right = false;
	else if(kc === 83) keys.down = false;	
}

//verify what key was pressed
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