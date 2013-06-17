function init() {

var c0 = document.getElementById("canvas0").getContext("2d");

var cellsize = 20, width = 1200, height = 600, pitch = width/cellsize, generation = 0, index = 0, neighbors = 0;
var offcolor = "#CCC", oncolor = "#333";
var prevcells = [], currcells = [], allzero = [];
for (var i=0; i<(pitch)*(height/cellsize); i++) {
	prevcells[i] = 0;
	currcells[i] = 0;
}
var arraylength = prevcells.length;

prevcells[ pitch*4 + 7 ] = 1;
prevcells[ pitch*5 + 7 ] = 1;
prevcells[ pitch*6 + 7 ] = 1;

function loop() {
	
	console.log("generation : " + generation);
	
	c0.fillStyle = offcolor;
	c0.fillRect( 0, 0, width, height );
	c0.fillStyle = oncolor;
	for (index=0; index<arraylength; index++) {
		
		//marker for debugging
		c0.fillStyle = "#F00";
		c0.fillRect( (index%pitch)*cellsize + 2, Math.floor(index/pitch)*cellsize + 2, 2, 2 );
		c0.fillStyle = oncolor;
		//suspicions();
		
		//if edge cell
		if (
			index<pitch ||
			index>=arraylength-pitch ||
			index%pitch==0 ||
			index%pitch==pitch-1
		){
			//marker for debugging
			c0.fillStyle = "#00F";
			c0.fillRect( (index%pitch)*cellsize + 2, Math.floor(index/pitch)*cellsize + 2, 2, 2 );
			c0.fillStyle = oncolor;
		}
		else {
			mrRogers();
			if (prevcells[index]) {
				if (neighbors<2 || neighbors>3) {
					console.log(index + " died");
				}
				else {
					console.log(index + " lived");
					currcells[index] = 1;
					c0.fillRect( (index%pitch)*cellsize, Math.floor(index/pitch)*cellsize, cellsize, cellsize );
				}
			}
			else if (neighbors==3) {
				console.log(index + " born");
				currcells[index] = 1;
				c0.fillRect( (index%pitch)*cellsize, Math.floor(index/pitch)*cellsize, cellsize, cellsize );
			}
			neighbors = 0;
		}
	}
	for (var i in prevcells) {
		prevcells[i] = currcells[i];
		currcells[i] = 0;
	}
	generation++;
	window.setTimeout(loop, 1000);
}

function mrRogers() {
	if (prevcells[index+1]) neighbors++;
	if (prevcells[index-1]) neighbors++;
	if (prevcells[index-pitch-1]) neighbors++;
	if (prevcells[index-pitch  ]) neighbors++;
	if (prevcells[index-pitch+1]) neighbors++;
	if (prevcells[index+pitch-1]) neighbors++;
	if (prevcells[index+pitch  ]) neighbors++;
	if (prevcells[index+pitch+1]) neighbors++;
}

//for debugging
/*
function suspicions() {
	switch(index) {
		case 247:
			console.log("247 : " + prevcells[index]);
			break;
		case 306:
			console.log("306 : " + prevcells[index]);
			break;
		case 307:
			console.log("307 : " + prevcells[index]);
			break;
		case 308:
			console.log("308 : " + prevcells[index]);
			break;
		case 367:
			console.log("367 : " + prevcells[index]);
			break;
	}
}*/

loop();

}//init