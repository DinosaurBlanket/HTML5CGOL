/* 
 * 
 */

function init() {


var width = 800;
var height = 600;
var cellsize = 4;
var timeout = 100;
var generation = 0;
var pitch = width/cellsize;

var backcolor = "#EEE", trim = "#AAA";
var colorschemes = [
	//[new, 2neighbor, 3neighbor]
	["#A3A", "#3AA", "#AA3"],
	["#A6D", "#6AD", "#6DA"],
	["#F8B", "#B8F", "#88F"],
]
var colorscheme = 1;
var curcolor = "rgba(40, 40, 40, 0.5)";


var cells = [], neighborcounts = [];
var arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

var curx, cury, previoucurx, previoucury, xdif, ydif, longleg, curcoords = [[]], mousedown = 0;
var findcur = function(evt) {
	var obj = gridcanvas;
	var top = 0;
	var left = 0;
	while (obj && obj.tagName != "BODY") {
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	curx = Math.floor( (evt.clientX - left + window.pageXOffset)/cellsize );
	cury = Math.floor( (evt.clientY - top  + window.pageYOffset)/cellsize );
}
cancan.addEventListener("mousemove", function(evt) {
	var c = document.getElementById('stampcanvas').getContext('2d');
	c.fillStyle = curcolor;
	findcur(evt);
	c.clearRect( previoucurx*cellsize, previoucury*cellsize, cellsize, cellsize );
	c.fillRect( curx*cellsize, cury*cellsize, cellsize, cellsize );
	if (mousedown) {
		curcoords.push( [curx,cury] );
		xdif = Math.abs(curx-previoucurx);
		ydif = Math.abs(cury-previoucury);
		if (xdif || ydif) {
			if (ydif < xdif)
				for (var i=0; i<xdif; i++) {
					curcoords.push( [ curx+i, cury + Math.floor( ydif*( xdif/(xdif-i) ) ) ] );
				}
			else {
				for (var i=0; i<ydif; i++) {
					curcoords.push( [ curx + Math.floor( xdif*( ydif/(ydif-i) ) ), cury+i ] );
				}
			}
		}
	}
	previoucurx = curx;
	previoucury = cury;
}, 0);
cancan.addEventListener("mousedown", function(evt) {
	mousedown = 1;
	findcur(evt);
	curcoords.push( [ curx, cury ] );
}, 0);
cancan.addEventListener("mouseup", function(evt) {mousedown = 0}, 0);

function fillcell(i) { 
	var c = document.getElementById('gridcanvas').getContext('2d');
	c.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
}

function loop() {
	//console.log("generation : " + generation);
	
	var c = document.getElementById('gridcanvas').getContext('2d');
	
	while (curcoords.length) {
		var cc = curcoords.pop();
		cells[cc[0] + cc[1]*pitch] = 1;
	}
	//to what cells does each live cell neighbor?
	for (var i=0; i<arraylength; i++) {
		if (cells[i]) {
			if (i>=pitch) ++neighborcounts[i-pitch];//up
			if (i<arraylength-pitch) neighborcounts[i+pitch]++;//down
			if (i%pitch!=0) neighborcounts[i-1]++;//left
			if (i%pitch!=pitch-1) neighborcounts[i+1]++;//right
			if (i>=pitch && i%pitch!=0) neighborcounts[i-pitch-1]++;//upleft
			if (i>=pitch && i%pitch!=pitch-1) neighborcounts[i-pitch+1]++;//upright
			if (i<arraylength-pitch && i%pitch!=0) neighborcounts[i+pitch-1]++;//downleft
			if (i<arraylength-pitch && i%pitch!=pitch-1) neighborcounts[i+pitch+1]++;//downright
		}
	}
	//life
	for (var i=0; i<arraylength; i++) {
		if (cells[i]){
			if (neighborcounts[i]<2 || neighborcounts[i]>3) {
				cells[i] = 0;
				c.fillStyle = backcolor;
				fillcell(i);
				//console.log(i + " died");
			}
			else {
				c.fillStyle = neighborcounts[i]==2 ? colorschemes[colorscheme][1] : colorschemes[colorscheme][2];
				fillcell(i);
				//console.log(i + " lived");
			}
		}
		else if (neighborcounts[i]==3) {
			cells[i] = 1;
			c.fillStyle = colorschemes[colorscheme][0];
			fillcell(i);
			//console.log(i + " born");
		}
	}
	//reset
	for (var i=0; i<arraylength; i++) neighborcounts[i] = 0;
	generation++;
	
	
	window.setTimeout(loop, timeout);
}

//blitpattern(50, 20, gosperglidergun);

var c = document.getElementById('gridcanvas').getContext('2d');
c.fillStyle = backcolor;
c.fillRect(0, 0, width, height);
loop();


}//init