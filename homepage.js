/* 
 * 
 * 
 * how can i get rid of the text cursor when dragging in chrome?
 */

function init() {


var width = 800;   ///if you change this, change cellsizes and relevant css values accordingly
var height = 600;  ///if you change this, change cellsizes and relevant css values accordingly
var cellsizes = [2,4,5,10,20,25,50]; ///some common divisors of width and height, the remainders of which are even
             /// 0,1,2,3, 4, 5, 6
var cellsizei = 3;     ///feel free to change this
var flourishlimit = 16;///feel free to change this
var timeout = 120;     ///feel free to change this
var timeoutincrem = 20;///feel free to change this
var timeoutmax = 500;  ///feel free to change this
var cellsize = cellsizes[cellsizei];
var pitch = width/cellsize;
var c;///canvas drawing context
document.getElementById("cellsizeout").value = cellsize+"px";
document.getElementById("timeoutout").value = timeout+"ms";

///feel free to change these colors
var borncolor        = "#88E";
var twoneighcolor    = "#6AE";
var threeneightcolor = "#6DD";
var drawncolor       = "#66E";
var curcolor          ="rgba(40, 40, 40, 0.5)";
var curcolorreflected ="rgba(40, 40, 40, 0.3)";

var generation=mousedown=paused=stepped=vertsym=horsym=0;
var cells = [], neighborcounts = [];
var arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

var cursex, cursey, previouscursex, previouscursey;
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
function dab(x, y) {
	cells[ x + y*pitch ] = cells[ x + y*pitch ] ? 0 : 1;
	if (horsym) cells[ x + arraylength - y*pitch - pitch ] = cells[ x + arraylength - y*pitch - pitch ] ? 0 : 1;
	if (vertsym) cells[ pitch-x-1 + y*pitch ] = cells[ pitch-x-1 + y*pitch ] ? 0 : 1;
	if (horsym && vertsym) cells[ pitch-x-1 + arraylength - y*pitch - pitch ] = cells[ pitch-x-1 + arraylength - y*pitch - pitch ] ? 0 : 1;
	if ( cells[ x + y*pitch ] ) {
		c.fillStyle = drawncolor;
		c.fillRect( x*cellsize, y*cellsize, cellsize, cellsize );
		if (horsym) c.fillRect( x*cellsize, height - cellsize - y*cellsize, cellsize, cellsize );
		if (vertsym) c.fillRect( width - cellsize - x*cellsize, y*cellsize, cellsize, cellsize );
		if (horsym && vertsym) c.fillRect( width - cellsize - x*cellsize, height - cellsize - y*cellsize, cellsize, cellsize );
	}
	else {
		c.clearRect( x*cellsize, y*cellsize, cellsize, cellsize );
		if (horsym) c.clearRect( x*cellsize, height - cellsize - y*cellsize, cellsize, cellsize );
		if (vertsym) c.clearRect( width - cellsize - x*cellsize, y*cellsize, cellsize, cellsize );
		if (horsym && vertsym) c.clearRect( width - cellsize - x*cellsize, height - cellsize - y*cellsize, cellsize, cellsize );
	}
}
stampcanvas.addEventListener("mousemove", function(evt) {
	findcur(evt);
	if (cursex != previouscursex  ||  cursey != previouscursey) {
		c = document.getElementById('stampcanvas').getContext('2d');
		c.fillStyle = curcolor;
		c.fillRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
		c.clearRect( previouscursex*cellsize, previouscursey*cellsize, cellsize, cellsize );
		c.fillStyle = curcolorreflected;
		if (horsym) {
			c.fillRect( cursex*cellsize, height - cellsize - cursey*cellsize, cellsize, cellsize );
			c.clearRect( previouscursex*cellsize, height - cellsize - previouscursey*cellsize, cellsize, cellsize );
		}
		if (vertsym) {
			c.fillRect( width - cellsize - cursex*cellsize, cursey*cellsize, cellsize, cellsize );
			c.clearRect( width - cellsize - previouscursex*cellsize, previouscursey*cellsize, cellsize, cellsize );
		}
		if (horsym && vertsym) {
			c.fillRect( width - cellsize - cursex*cellsize, height - cellsize - cursey*cellsize, cellsize, cellsize );
			c.clearRect( width - cellsize - previouscursex*cellsize, height - cellsize - previouscursey*cellsize, cellsize, cellsize );
		}
		if (mousedown) {
			c = document.getElementById('gridcanvas').getContext('2d');
			dab(cursex, cursey);
			///flourish on drag
			for (var i=1; i<cursex-previouscursex && i<flourishlimit; i++) dab(cursex-i, cursey);
			for (var i=1; i<previouscursex-cursex && i<flourishlimit; i++) dab(cursex+i, cursey);
			for (var i=1; i<cursey-previouscursey && i<flourishlimit; i++) dab(previouscursex, cursey-i);
			for (var i=1; i<previouscursey-cursey && i<flourishlimit; i++) dab(previouscursex, cursey+i);
		}
		previouscursex = cursex;
		previouscursey = cursey;
	}
}, 0);
stampcanvas.addEventListener("mousedown", function(evt) {
	mousedown = 1;
	findcur(evt);
	c = document.getElementById('gridcanvas').getContext('2d');
	dab(cursex, cursey);
}, 0);
stampcanvas.addEventListener("mouseup", function(evt) {
	mousedown = 0;
}, 0);


function resetcellsize() {
	var newcellsize = cellsizes[cellsizei];
	var newpitch = width/newcellsize;
	var newarraylength = newpitch*(height/newcellsize);
	var newcells = [];
	c = document.getElementById('stampcanvas').getContext('2d');
	c.clearRect(0,0, width,height);
	c = document.getElementById('gridcanvas').getContext('2d');
	c.clearRect(0,0, width,height);
	c.fillStyle = drawncolor;
	if (newarraylength>arraylength) {///smaller
		for (var i=0; i<height/cellsize; i++) {
			for (var j=0; j<pitch; j++) {
				newcells[ j + (newpitch-pitch)/2 + ( i + (height/newcellsize - height/cellsize)/2 )*newpitch ] = cells[ j + i*pitch ];
				if ( cells[ j + i*pitch ] ) {
					c.fillRect( ( j + (newpitch-pitch)/2 )*newcellsize, ( i + (height/newcellsize - height/cellsize)/2 )*newcellsize, newcellsize,newcellsize );
				}
			}
		}
	}
	else {///bigger
		for (var i=0; i<height/newcellsize; i++) {
			for (var j=0; j<newpitch; j++) {
				newcells[ j + i*newpitch ] = cells[ j + (pitch-newpitch)/2 + ( i + (height/cellsize - height/newcellsize)/2 )*pitch ];
				if ( newcells[ j + i*newpitch ] ) {
					c.fillRect( j*newcellsize, i*newcellsize, newcellsize,newcellsize );
				}
			}
		}
	}
	cellsize = newcellsize;
	pitch = newpitch;
	arraylength = newarraylength;
	cells = newcells;
	document.getElementById("cellsizeout").value = cellsize+"px";
}

var pauseButton = function() {
	if (paused) {
		paused = 0;
		document.getElementById("pauseButton").value = "pause";
		c = document.getElementById('stampcanvas').getContext('2d');
		c.clearRect(0, 0, width, height);
		loop();
	}
	else {
		paused = 1;
		document.getElementById("pauseButton").value = "play";
	}
}
var stepButton = function() {
	if (paused) {
		stepped = 1;
		paused = 0;
		loop();
	}
}
var clearButton = function() {
	for (var i=0; i<arraylength; i++) cells[i] = 0;
	c = document.getElementById('gridcanvas').getContext('2d');
	c.clearRect(0,0,width,height);
}
var vertsymButton = function() {
	c = document.getElementById('stampcanvas').getContext('2d');
	c.clearRect(0,0, width,height);
	if (!vertsym) {
		document.getElementById("vertsymbar").style.visibility="visible";
		vertsym = 1;
	}
	else {
		document.getElementById("vertsymbar").style.visibility="hidden";
		vertsym = 0;
	}
}
var horsymButton = function() {
	c = document.getElementById('stampcanvas').getContext('2d');
	c.clearRect(0,0, width,height);
	if (!horsym) {
		document.getElementById("horsymbar").style.visibility="visible";
		horsym = 1;
	}
	else {
		document.getElementById("horsymbar").style.visibility="hidden";
		horsym = 0;
	}
}
var smallerButton = function() {
	if (cellsizei != 0) {
		cellsizei--;
		resetcellsize();
	}
}
var biggerButton = function() {
	if (cellsizei < cellsizes.length-1) {
		cellsizei++;
		resetcellsize();
	}
}
var slowerButton = function() {
	timeout += timeoutincrem;
	if (timeout > timeoutmax) timeout = timeoutmax;
	document.getElementById("timeoutout").value = timeout+"ms";
}
var fasterButton = function() {
	timeout -= timeoutincrem;
	if (timeout < 0) timeout = 0;
	document.getElementById("timeoutout").value = timeout+"ms";
}
document.getElementById("pauseButton").onclick = pauseButton;
document.getElementById("stepButton").onclick = stepButton;
document.getElementById("clearButton").onclick = clearButton;
document.getElementById("vertsymButton").onclick = vertsymButton;
document.getElementById("horsymButton").onclick = horsymButton;
document.getElementById("smallerButton").onclick = smallerButton;
document.getElementById("biggerButton").onclick = biggerButton;
document.getElementById("slowerButton").onclick = slowerButton;
document.getElementById("fasterButton").onclick = fasterButton;
window.onkeydown = function() {
	switch (window.event.keyCode) {
		case 90:///z
			pauseButton();
			break;
		case 88:///x
			stepButton();
			break;
		case 67:///c
			clearButton();
			break;
		case 86:///v
			vertsymButton();
			break;
		case 66:///b
			horsymButton();
			break;
		case 78:///n
			smallerButton();
			break;
		case 77:///m
			biggerButton();
			break;
		case 188:///,
			slowerButton();
			break;
		case 190:///.
			fasterButton();
			break;
	}
}
document.onselectstart = function(){ return false; }///this is to prevent the text cursor from coming up in certain browsers

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
					c.fillStyle = neighborcounts[i]==2 ? twoneighcolor : threeneightcolor;
					c.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
					//console.log(i + " lived");
				}
			}
			else if (neighborcounts[i]==3) {
				cells[i] = 1;
				c.fillStyle = borncolor;
				c.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
				//console.log(i + " born");
			}
		}
		///reset
		for (var i=0; i<arraylength; i++) neighborcounts[i] = 0;
		generation++;
		
		if (stepped) {
			stepped = 0;
			paused = 1;
		}
		else window.setTimeout(loop, timeout);
	}
}


loop();

}//init