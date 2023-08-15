///////////////////////////////////////////////////////////////
// functions.js
// function definitions
///////////////////////////////////////////////////////////////

// updates the window dimensions on load/resize
function updateDimensions() {
	gd.updateWindow(window.innerWidth, window.innerHeight);
}

// converts mouse coordinates to degrees from origin
function mouseToDeg() {
	let rad = Math.atan2(gd.getDeltaY(), gd.getDeltaX());
	let deg = rad * (180 / Math.PI);
	return deg;
}

// parses degrees to apply rotation styles to gun
function degToStyle(deg) {
	deg = Number.parseFloat(deg - 180).toFixed(2);
	return `transform: rotate(${deg}deg);`;
}

// rotates the gun on mouse move
function rotateGun() {
	gc.setAttribute('style', degToStyle(mouseToDeg()));
}

// updates the mouse coordinates on mouse move
const updateMousePosition = (e) => {
	gd.updateMouse(e.clientX, e.clientY);
	rotateGun();
}

/* creates a yellow svg line */
function generateShot() {
	let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('class', 'shot');
	let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute('x1', gd.mouseX);
	line.setAttribute('y1', gd.mouseY);
	line.setAttribute('x2', gd.getOriginX());
	line.setAttribute('y2', gd.getOriginY());
	line.setAttribute('style', 'stroke: hsla(50, 100%, 50%, 0.67); stroke-width: 3px;');
	let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', gd.mouseX);
	circle.setAttribute('cy', gd.mouseY);
	circle.setAttribute('fill', 'red');
	circle.setAttribute('r', 5);
	circle.setAttribute('style', 'opacity: 0.33');
	svg.appendChild(line);
	svg.appendChild(circle);
	// console.log(`(${gd.mouseX}, ${gd.mouseY}) | (${gd.getOriginX()}, ${gd.getOriginY()})`);
	body.appendChild(svg);
}

/* updates the kill count in the menu */
function updateScore() {
	gd.score += 1;
	score.textContent = gd.score;
}

/* updates the current zombie count in the menu */
function updateCount(posNegOne) {
	gd.zombies += posNegOne;
	count.textContent = gd.zombies;
}

/* explodes zombie then removes it */
function killZombie(zContainer) {
	zContainer.firstChild.textContent = '💥';
	zContainer.setAttribute('class', 'zombie-container explosion');
	setTimeout(() => {
		zContainer.remove();
	}, 100);
	updateCount(-1);
	updateScore();
}

/* checks if the shot hit the zombie
	then kills it and updates the counts */
function checkZombiesHit(hitbox) {
	const zombies = document.querySelectorAll('.zombie-container');
	// console.log('hitbox: ', hitbox);
	zombies.forEach((z) => {
		let zBox = z.getBoundingClientRect();
		if (
			((hitbox.top > zBox.top && hitbox.top < zBox.bottom)
				&& ((hitbox.right < zBox.right && hitbox.right > zBox.left)
					|| (hitbox.left > zBox.left && hitbox.left < zBox.right)
			)) // bottom hitboxes
			&& 
			((hitbox.bottom < zBox.bottom && hitbox.bottom > zBox.top)
				&& ((hitbox.right > zBox.left && hitbox.right < zBox.right)
					|| (hitbox.left < zBox.right && hitbox.left > zBox.left)
			))
			) { // top hitboxes
			// console.log('zBox: ', zBox);
			killZombie(z);
		}
	});
}

/* shows game over and reloads on button click */
function renderGameOverModal() {
	const modal = document.createElement('div');
	modal.setAttribute('id', 'modal');
	modal.setAttribute('class', 'slide-in');
	const h1 = document.createElement('h1');
	h1.setAttribute('class', 'gg');
	h1.textContent = 'Game Over';
	const button = document.createElement('button');
	button.textContent = 'Try Again?';
	button.addEventListener('click', () => {
		window.location.reload();
	});
	modal.appendChild(h1);
	modal.appendChild(button);
	body.appendChild(modal);
}

/* pauses everything and renders the end game modal */
function endGame() {
	clearInterval(spawnID);
	clearInterval(timerID);
	removeEventListener('click', shootGun);
	removeEventListener('mousemove', updateMousePosition);
	gun.setAttribute('class', 'death');
	const zombies = document.querySelectorAll('.zombie-container');
	zombies.forEach((z) => {
		z.setAttribute('class', 'zombie-container attack-slow');
	});
	gd.end = new Date().getTime();
	document.querySelector('#bg-image').setAttribute('class', 'fade-out');
	body.style.cursor = 'auto';
	renderGameOverModal();
}

/* updates health count/style in menu */
function decrementHealth() {
	gd.health -= 1;
	let bars = health.textContent;
	let newBars = bars.slice(0, gd.health);
	health.textContent = newBars;
	health.setAttribute('style', 
		`color: ${healthColors[(5 - gd.health)]}`);
}

/* decrements health, animates injury,
	checks loss condition */
function injurePlayer() {
	decrementHealth();
	if (gd.health == 0) {
		health.textContent = '☠';
		endGame();
	} else {
		gun.setAttribute('class', 'injury');
		setTimeout(() => {
			gun.classList.remove('injury');
		}, 500);
	}
}

/* checks if zombie hit player,
	lowers health, animates, checks loss */
function checkPlayerHit() {
	const zombies = document.querySelectorAll('.zombie-container');
	zombies.forEach((z) => {
		let zBox = z.getBoundingClientRect();
		if (
			((phb.top > zBox.top && phb.top < zBox.bottom)
				&& ((phb.right < zBox.right && phb.right > zBox.left)
					|| (phb.left > zBox.left && phb.left < zBox.right)
			)) // bottom hitboxes
			&& 
			((phb.bottom < zBox.bottom && phb.bottom > zBox.top)
				&& ((phb.right > zBox.left && phb.right < zBox.right)
					|| (phb.left < zBox.right && phb.left > zBox.left)
			))
			) { // top hitboxes
			injurePlayer();
		}
	});
}

/* creates shot, checks hit, removes shot */
function shootGun() {
	generateShot();
	const shot = document.querySelector('.shot');
	const circle = document.querySelector('circle');
	let hitbox = circle.getBoundingClientRect();
	checkZombiesHit(hitbox);
	setTimeout(() => {
		shot.remove();
	}, 100);
}

/* generates a random start along the edges */
function zombieSpawnPosition() {
	let left, top = 0;
	if (Math.random() <= 0.5) {
		left = Math.floor(Math.random() * 91) + 10;
		if (Math.random() <= 0.5) {
			top = 0;
		} else {
			top = 90;
		}
	} else {
		top = Math.floor(Math.random() * 91) + 10;
		if (Math.random() <= 0.5) {
			left = 0;
		} else {
			left = 90;
		}
	}
	return `left: ${left}vw; top: ${top}vh;`
}

/* creates a zombie and updates count */
function spawnZombie() {
	let zContainer = document.createElement('div');
	zContainer.setAttribute('class', 'zombie-container');
	zContainer.setAttribute('style', `${zombieSpawnPosition()}`);
	let zombie = document.createElement('span');
	zombie.setAttribute('class', 'zombie');
	if (Math.random() <= 0.5) {
		zombie.textContent = '🧟‍♂️';
	} else {
		zombie.textContent = '🧟‍♀️';
	}
	zContainer.appendChild(zombie);
	body.appendChild(zContainer);
	zContainer.setAttribute('class', 'zombie-container attack');
	updateCount(1);
}

function increaseDifficulty() {
	if (gd.clock.minutes >= 1 && gd.difficulty == 3) {
		clearInterval(spawnID);
		spawnID = setInterval(spawnZombie, 50);			
		gd.difficulty += 1;
	} else if (gd.clock.seconds >= 30 && gd.difficulty == 2) {
		clearInterval(spawnID);
		spawnID = setInterval(spawnZombie, 150);
		gd.difficulty += 1;
	} else if (gd.clock.seconds >= 15 && gd.difficulty == 1) {
		clearInterval(spawnID);
		spawnID = setInterval(spawnZombie, 250);
		gd.difficulty += 1;
	}
}

/* starts the game's clock */
function startTimer() {
	gd.start = new Date().getTime();
	timerID = setInterval(() => {
		gd.clock.incrementSeconds();
		time.textContent = gd.clock.clockText();
		checkPlayerHit();
		increaseDifficulty()
	}, 1000);
}

///////////////////////////////////////////////////////////////