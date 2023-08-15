///////////////////////////////////////////////////////////////
// elements.js
// globals and html elements
///////////////////////////////////////////////////////////////

var gd = new gameData;
var spawnID;			// used for spawn interval
var timerID;			// used for clock interval

// HTML ELEMENTS
const body 	 = document.querySelector('body');
const gc 	 = document.querySelector('#gun-container');
const phb	 = gc.getBoundingClientRect();
const gun 	 = document.querySelector('#gun');
const count  = document.querySelector('#count');
const score  = document.querySelector('#score');
const time 	 = document.querySelector('#time');
const health = document.querySelector('#health');

const healthColors = ['#15d600', 	// green
					  '#8de106', 	// lime
					  '#f3d300', 	// yellow
					  '#fd7600', 	// orange
					  '#ff0000',	// red
					  '#ff0000'];	// still red

///////////////////////////////////////////////////////////////