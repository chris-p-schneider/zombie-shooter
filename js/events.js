///////////////////////////////////////////////////////////////
// events.js
// main game event triggers
///////////////////////////////////////////////////////////////

addEventListener('load', () => {
	updateDimensions();
	startTimer();
});

addEventListener('resize', updateDimensions);

addEventListener('mousemove', updateMousePosition);

addEventListener('click', shootGun);

spawnID = setInterval(spawnZombie, 500);

///////////////////////////////////////////////////////////////