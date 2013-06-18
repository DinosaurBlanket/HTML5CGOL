function init() {

var c0 = document.getElementById("canvas0").getContext("2d");

var cellsize = 20, width = 1200, height = 600, pitch = width/cellsize, generation = 0;
var offcolor = "#CCC", oncolor = "#333";
function fillcell(i) { c0.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize ) }

var cells = [], neighborcounts = [], arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

var initialpattern = [
	247, 307, 367
];
for (var i in initialpattern) cells[ initialpattern[i] ] = 1;


function loop() {
	console.log("generation : " + generation);
	//to what cells does each live cell neighbor?
	for (var i=0; i<arraylength; i++) {
		if (cells[i]) {
			if (i>=pitch) ++neighborcounts[i-pitch];//up
			if (i<arraylength-pitch) ++neighborcounts[i+pitch];//down
			if (i%pitch!=0) ++neighborcounts[i-1];//left
			if (i%pitch!=pitch-1) ++neighborcounts[i+1];//right
			if (i>=pitch && i%pitch!=0) ++neighborcounts[i-pitch-1];//upleft
			if (i>=pitch && i%pitch!=pitch-1) ++neighborcounts[i-pitch+1];//upright
			if (i<arraylength-pitch && i%pitch!=0) ++neighborcounts[i+pitch-1];//downleft
			if (i<arraylength-pitch && i%pitch!=pitch-1) ++neighborcounts[i+pitch+1];//downright
		}
	}
	//life happens
	for (var i=0; i<arraylength; i++) {
		if (cells[i]){
			if (neighborcounts[i]<2 || neighborcounts[i]>3) {
				cells[i] = 0;
				c0.fillStyle = offcolor;
				fillcell(i);
				console.log(i + " died");
			}
			else {
				c0.fillStyle = oncolor;
				fillcell(i);
				console.log(i + " lived");
			}
		}
		else if (neighborcounts[i]==3) {
			cells[i] = 1;
			c0.fillStyle = oncolor;
			fillcell(i);
			console.log(i + " born");
		}
	}
	//reset
	for (var i=0; i<arraylength; i++) neighborcounts[i] = 0;
	generation++;
	window.setTimeout(loop, 1000);
}

loop();

}//init