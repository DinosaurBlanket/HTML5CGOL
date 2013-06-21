function init() {

var ctx = document.getElementById('canvas').getContext('2d');

var width = 800;
var height = 600;
var cellsize = 4;
var timeout = 60;
var generation = 0;
var pitch = width/cellsize;

var backcolor = "#444", trim = "#BBB";
var colorschemes = [
	//[new, 2neighbor, 3neighbor]
	["#B4B", "#4BB", "#BB4"],
	["#A6D", "#6AD", "#6DA"],
	["#F8B", "#B8F", "#88F"],
]
var colorscheme = 0;
var curcolor = "rgba(187, 187, 187, 0.4)";



var thisthing = [
	"110",
	"101",
	"011"
]

var heptominob = [
	"1011",
	"1110",
	"0100"
]
/*
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
*/
var stamp = thisthing;

var cells = [], neighborcounts = [];
var curx, cury, curcoords = [[]], mousedown = 0, xoffset = -3, yoffset = -3;

var arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

function blitpattern(x, y, source) {
	for (var i=0; i<source.length; i++) {
		for (var j=0; j<source[i].length; j++) {
			if (source[i][j] === '1') {
				cells[ (y+yoffset)*pitch + pitch*i + (x+xoffset) + j ] = 1;
			}
		}
	}
}

var findcur = function(evt) {
	var obj = canvas;
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
	if (mousedown) curcoords.push( [ curx, cury ] );
}, 0);
cancan.addEventListener("mousedown", function(evt) {
	mousedown = 1;
	findcur(evt);
	curcoords.push( [ curx, cury ] );
}, 0);
cancan.addEventListener("mouseup", function(evt) {mousedown = 0}, 0);

function fillcell(i) { 
	ctx.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
}

function loop() {
	//console.log("generation : " + generation);
	
	ctx.fillStyle = backcolor;
	ctx.fillRect(0,0,width,height);
	
	
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
				//console.log(i + " died");
			}
			else {
				ctx.fillStyle = neighborcounts[i]==2 ? colorschemes[colorscheme][1] : colorschemes[colorscheme][2];
				fillcell(i);
				//console.log(i + " lived");
			}
		}
		else if (neighborcounts[i]==3) {
			cells[i] = 1;
			ctx.fillStyle = colorschemes[colorscheme][0];
			fillcell(i);
			//console.log(i + " born");
		}
	}
	//reset
	for (var i=0; i<arraylength; i++) neighborcounts[i] = 0;
	generation++;
	
	window.setTimeout(loop, timeout);
	
	ctx.fillStyle = curcolor;
	for (var i=0; i<stamp.length; i++) {
		for (var j=0; j<stamp[i].length; j++) {
			if (stamp[i][j] === '1') {
				ctx.fillRect( (curx+j+xoffset)*cellsize, (cury+i+yoffset)*cellsize, cellsize, cellsize );
			}
		}
	}
	
}


blitpattern(50, 20, heptominob);

loop();


}//init