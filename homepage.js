function init() {

var c0 = document.getElementById("canvas0").getContext("2d");

var width = 800;
var height = 600;
var cellsize = 4;
var timeout = 80;
var generation = 0;
var offcolor = "#DDD", oncolor = "#444";
var pitch = width/cellsize;

var cells = [], cursedcells = [], neighborcounts = [];
var arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

var curx, cury, mousedown = 0;
var curse = function(evt) {
	var obj = canvas0;
	var top = 0;
	var left = 0;
	while (obj && obj.tagName != "BODY") {
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	curx = evt.clientX - left + window.pageXOffset;
	cury = evt.clientY - top + window.pageYOffset;
	if (mousedown) cursedcells.push( Math.floor(cury/cellsize)*pitch + Math.floor(curx/cellsize) );
}
canvas0.addEventListener("mousemove", curse, 0)
canvas0.addEventListener("mousedown", function(evt) {
	mousedown = 1;
	curse(evt);
}, 0);
canvas0.addEventListener("mouseup",   function(evt) {mousedown = 0}, 0);

function fillcell(i) { c0.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize ) }

function loop() {
	//console.log("generation : " + generation);
	
	while (cursedcells.length) {
		var cc = cursedcells.pop()
		cells[cc-pitch  -1] = 1;
		cells[cc-pitch  -2] = 1;
		cells[cc-pitch*2-1] = 1;
		cells[cc-pitch*2-3] = 1;
		cells[cc-pitch*3-2] = 1;
		cells[cc-pitch*3-3] = 1;
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
				c0.fillStyle = offcolor;
				fillcell(i);
				//console.log(i + " died");
			}
			else {
				c0.fillStyle = oncolor;
				fillcell(i);
				//console.log(i + " lived");
			}
		}
		else if (neighborcounts[i]==3) {
			cells[i] = 1;
			c0.fillStyle = oncolor;
			fillcell(i);
			//console.log(i + " born");
		}
	}
	//reset
	for (var i=0; i<arraylength; i++) neighborcounts[i] = 0;
	generation++;
	
	window.setTimeout(loop, timeout);
	
}

gosperglidergun = [
	[24], 
	[22, 24], 
	[12, 13, 20, 21, 34, 35], 
	[11, 15, 20, 21, 34, 35], 
	[ 0,  1, 10, 16, 20, 21], 
	[ 0,  1, 10, 14, 16, 17, 22, 24], 
	[10, 16, 24], 
	[11, 15], 
	[12, 13] 
]

function blitpattern(x, y, source) {
	for (var i=0; i<source.length; i++) {
		for (var j=0; j<source[i].length; j++) {
			cells[ (y+i)*pitch + x + source[i][j] ] = 1;
		}
	}
}

blitpattern(20, 20, gosperglidergun);

loop();


}//init