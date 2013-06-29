/* TO DO
 * 
 * play/pause
 * clear
 * stamp editor
 * speed slider
 * cellsize selector(1,2,4,8)
 * rgb sliders
 * * cella
 * * callb
 * * cellc
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


var thisthing = [
	"110",
	"101",
	"011"
]

var plus = [
	"010",
	"101",
	"010"
]

var box = [
	"111",
	"101",
	"111"
]

var heptominob = [
	"1011",
	"1110",
	"0100"
]

var gosperglidergun = [
	[24],
	[22,24],
	[12,13,20,21,34,35],
	[11,15,20,21,34,35],
	[ 0, 1,10,16,20,21],
	[ 0, 1,10,14,16,17,22,24],
	[10,16,24],
	[11,15],
	[12,13]
]

var stamp = box;

var cells = [], neighborcounts = [];
var arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

function blitpattern(x, y, source) {
	for (var i=0; i<source.length; i++) {
		for (var j=0; j<source[i].length; j++) {
			if (source[i][j] === '1') cells[ (y)*pitch + pitch*i + (x) + j ] = 1;
			else if (source[i][j] === '0') ;
			else cells[ x + y*pitch + i*pitch + source[i][j] ] = 1;
		}
	}
}

var curx, cury, previoucurx, previoucury, curcoords = [[]], mousedown = 0;
var findcur = function(evt) {
	var obj = canvas0;
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
	findcur(evt);
	var c = document.getElementById('canvas1').getContext('2d');
	c.clearRect( previoucurx*cellsize, previoucury*cellsize, cellsize*stamp[0].length, cellsize*stamp.length);
	c.fillStyle = curcolor;
	for (var i=0; i<stamp.length; i++) {
		for (var j=0; j<stamp[i].length; j++) {
			if (stamp[i][j] === '1') {
				c.fillRect( (curx+j)*cellsize, (cury+i)*cellsize, cellsize, cellsize );
			}
		}
	}
	previoucurx = curx;
	previoucury = cury;
	if (mousedown) curcoords.push( [ curx, cury ] );
}, 0);
cancan.addEventListener("mousedown", function(evt) {
	mousedown = 1;
	findcur(evt);
	curcoords.push( [ curx, cury ] );
}, 0);
cancan.addEventListener("mouseup", function(evt) {mousedown = 0}, 0);

function fillcell(i) { 
	var c = document.getElementById('canvas0').getContext('2d');
	c.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
}

function loop() {
	//console.log("generation : " + generation);
	
	var c = document.getElementById('canvas0').getContext('2d');
	
	while (curcoords.length) {
		var cc = curcoords.pop();
		blitpattern(cc[0], cc[1], stamp);
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

var c = document.getElementById('canvas0').getContext('2d');
c.fillStyle = backcolor;
c.fillRect(0, 0, width, height);
loop();


}//init