/* 
 * 
 * 
 * ::to do::
 * toggle vertically symmetrical drawing
 * toggle horizontally symmetrical drawing
 * bigger,smaller (get common divisors for width and height)
 * 
 * ::questions::
 * why can't I change the text on the buttons?
 * why can't i cache "document.getElementById('...').getContext('2d')"
 * how can i get rid of the text cursor when dragging in chrome?
 */

function init() {


var width = 800;
var height = 600;
var cellsize = 5;
var timeout = 100;
var flourishlimit = 16;
var timeoutincrem = 20;
var maxtimeout = 500;
var generation = 0;
var pitch = width/cellsize;
var c;///canvas drawing context

	             ///[born, 2neighbor, 3neighbor, drawn]
var colorscheme = ["#A6D", "#6AD", "#6DA", "#66D"];
var curcolor = "rgba(40, 40, 40, 0.4)";


var cells = [], neighborcounts = [];
var arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

var mousedown=0, paused=0, stepped=0, erase=0, cursex, cursey, previouscursex, previouscursey;
var findcur = function(evt) {
	var obj = gridcanvas;
	var top = 0;
	var left = 0;
	while (obj && obj.tagName != "BODY") {
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	cursex = Math.floor( (evt.clientX - left + window.pageXOffset)/cellsize );
	cursey = Math.floor( (evt.clientY - top  + window.pageYOffset)/cellsize );
}
stampcanvas.addEventListener("mousemove", function(evt) {
	findcur(evt);
	if (cursex != previouscursex  ||  cursey != previouscursey) {
		c = document.getElementById('stampcanvas').getContext('2d');
		c.fillStyle = curcolor;
		c.fillRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
		c.clearRect( previouscursex*cellsize, previouscursey*cellsize, cellsize, cellsize );
		if (mousedown) {
			cells[ cursex + cursey*pitch ] = erase ? 0 : 1;
			c = document.getElementById('gridcanvas').getContext('2d');
			if (paused) {
				if (!erase){
					c.fillStyle = colorscheme[3];
					c.fillRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
				}
				else c.clearRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
			}
			else if (erase) c.clearRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
			///flourish on drag
			if (!erase) {
				for (var i=1; i<cursex-previouscursex && i<flourishlimit; i++) {
					cells[ (cursex-i) + cursey*pitch ] = 1;
					if (paused) c.fillRect( (cursex-i)*cellsize, cursey*cellsize, cellsize, cellsize );
				}
				for (var i=1; i<previouscursex-cursex && i<flourishlimit; i++) {
					cells[ (cursex+i) + cursey*pitch ] = 1;
					if (paused) c.fillRect( (cursex+i)*cellsize, cursey*cellsize, cellsize, cellsize );
				}
				for (var i=1; i<cursey-previouscursey && i<flourishlimit; i++) {
					cells[ previouscursex + (cursey-i)*pitch ] = 1;
					if (paused) c.fillRect( previouscursex*cellsize, (cursey - i)*cellsize, cellsize, cellsize );
				}
				for (var i=1; i<previouscursey-cursey && i<flourishlimit; i++) {
					cells[ previouscursex + (cursey+i)*pitch ] = 1;
					if (paused) c.fillRect( previouscursex*cellsize, (cursey + i)*cellsize, cellsize, cellsize );
				}
			}
		}
	}
	previouscursex = cursex;
	previouscursey = cursey;
}, 0);
stampcanvas.addEventListener("mousedown", function(evt) {
	mousedown = 1;
	findcur(evt);
	cells[ cursex + cursey*pitch ] = erase ? 0 : 1;
	c = document.getElementById('gridcanvas').getContext('2d');
	if (!erase){
		c.fillStyle = colorscheme[3];
		c.fillRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
	}
	else c.clearRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
}, 0);
stampcanvas.addEventListener("mouseup", function(evt) {mousedown = 0}, 0);

document.getElementById("pauseButton").onclick = function () {
	if (paused) {
		paused = 0;
		c = document.getElementById('stampcanvas').getContext('2d');
		c.clearRect(0, 0, width, height);
		loop();
	}
	else paused = 1;
}
document.getElementById("stepButton").onclick = function () {
	if (paused) {
		stepped = 1;
		paused = 0;
		loop();
	}
}
document.getElementById("eraseButton").onclick = function () {
	erase = erase ? 0 : 1;
}
document.getElementById("clearButton").onclick = function () {
	for (var i=0; i<arraylength; i++) {
		cells[i] = 0;
		//neighborcounts[i] = 0;
	}
	c = document.getElementById('gridcanvas').getContext('2d');
	c.clearRect(0,0,width,height);
}
document.getElementById("vertsymButton").onclick = function () {
	
}
document.getElementById("horsymButton").onclick = function () {
	
}
document.getElementById("smallerButton").onclick = function () {
	
}
document.getElementById("biggerButton").onclick = function () {
	
}
document.getElementById("slowerButton").onclick = function () {
	timeout += timeoutincrem;
	if (timeout > maxtimeout) timeout = maxtimeout;
	document.getElementById("timeoutout").value = timeout+"ms";
}
document.getElementById("fasterButton").onclick = function () {
	timeout -= timeoutincrem;
	if (timeout < 0) timeout = 0;
	document.getElementById("timeoutout").value = timeout+"ms";
}


function fillcell(i) { 
	c = document.getElementById('gridcanvas').getContext('2d');
	c.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
}

function loop() {
	if (!paused) {
		//console.log("generation : " + generation);
		c = document.getElementById('gridcanvas').getContext('2d');
		///tick
		for (var i=0; i<arraylength; i++) {
			if (cells[i]) {
				if (i>=pitch) neighborcounts[i-pitch]++;          ///up
				if (i<arraylength-pitch) neighborcounts[i+pitch]++;///down
				if (i%pitch!=0) neighborcounts[i-1]++;               ///left
				if (i%pitch!=pitch-1) neighborcounts[i+1]++;            ///right
				if (i>=pitch && i%pitch!=0) neighborcounts[i-pitch-1]++;    ///upleft
				if (i>=pitch && i%pitch!=pitch-1) neighborcounts[i-pitch+1]++;   ///upright
				if (i<arraylength-pitch && i%pitch!=0) neighborcounts[i+pitch-1]++;    ///downleft
				if (i<arraylength-pitch && i%pitch!=pitch-1) neighborcounts[i+pitch+1]++;     ///downright
			}
		}
		///tock
		for (var i=0; i<arraylength; i++) {
			if (cells[i]){
				if (neighborcounts[i]<2 || neighborcounts[i]>3) {
					cells[i] = 0;
					c.clearRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
					//console.log(i + " died");
				}
				else {
					c.fillStyle = neighborcounts[i]==2 ? colorscheme[1] : colorscheme[2];
					fillcell(i);
					//console.log(i + " lived");
				}
			}
			else if (neighborcounts[i]==3) {
				cells[i] = 1;
				c.fillStyle = colorscheme[0];
				fillcell(i);
				//console.log(i + " born");
			}
		}
		//reset
		for (var i=0; i<arraylength; i++) neighborcounts[i] = 0;
		generation++;
		
		if (stepped) {
			stepped = 0;
			paused = 1;
		}
		
		window.setTimeout(loop, timeout);
	}
}

loop();

}//init