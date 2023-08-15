///////////////////////////////////////////////////////////////
// classes.js
// class game class definitions
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
// simple clock to count HH:MM:SS

class clock {
	constructor() {
		this.seconds = 0;
		this.minutes = 0;
		this.hours = 0;
	}
	incrementSeconds() {
		if (this.seconds == 59) {
			this.seconds = 0;
			this.minutes += 1;
			if (this.minutes == 59) {
				this.hours += 1;
				this.minutes = 0;
			}
		} else {
			this.seconds += 1;
		}
	}
	clockText() {
		if (this.hours == 0) {
			if (this.seconds <10) {
				return `${this.minutes}:0${this.seconds}`;
			} else {
				return `${this.minutes}:${this.seconds}`;
			}
		} else {
			if (this.seconds < 10) {
				return `${this.hours}:${this.minutes}:0${this.seconds}`;
			} else {
				return `${this.hours}:${this.minutes}:${this.seconds}`;
			}
		}
	}
}

///////////////////////////////////////////////////////////////
// class containing data used to play the game

class gameData {
	constructor() {
		this.windowX 	= 0;
		this.windowY 	= 0;
		this.mouseX 	= 0;
		this.mouseY 	= 0;
		this.score 		= 0;
		this.health 	= 5;
		this.zombies 	= 0;
		this.difficulty = 1;
		this.start;
		this.end;
		this.clock = new clock();
	}
	updateWindow(x, y) {
		this.windowX 	= x;
		this.windowY 	= y;
	}
	updateMouse(x, y) {
		this.mouseX 	= x;
		this.mouseY 	= y;
	}
	getDeltaX() {
		return (this.mouseX - (this.windowX / 2));
	}
	getDeltaY() {
		return (this.mouseY - (this.windowY / 2));
	}
	getOriginX() {
		return (this.windowX / 2);
	}
	getOriginY() {
		return (this.windowY / 2);
	}
}

///////////////////////////////////////////////////////////////