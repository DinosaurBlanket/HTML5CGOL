/* 
 * 
 */

function init() {


var width = 800;
var height = 600;
var cellsize = 4;
var timeout = 100;
flourishlimit = 6;
var generation = 0;
var pitch = width/cellsize;

var backcolor = "#EEE", trim = "#AAA";
	              //[new, 2neighbor, 3neighbor]
var colorscheme = ["#A6D", "#6AD", "#6DA"]/*["#A3A", "#3AA", "#AA3"]["#F8B", "#B8F", "#88F"]*/;
var curcolor = "rgba(40, 40, 40, 0.5)";


var cells = [], neighborcounts = [];
var arraylength = pitch*(height/cellsize);
for (var i=0; i<arraylength; i++) {
	cells[i] = 0;
	neighborcounts[i] = 0;
}

var curcoords = [[]], mousedown = 0, cursex, cursey, previouscursex, previouscursey;
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
	var c = document.getElementById('stampcanvas').getContext('2d');
	c.fillStyle = curcolor;
	findcur(evt);
	//if (!(mousedown)){
	c.clearRect( previouscursex*cellsize, previouscursey*cellsize, cellsize, cellsize );
	//}
	c.fillRect( cursex*cellsize, cursey*cellsize, cellsize, cellsize );
	if (mousedown) {
		curcoords.push( [cursex,cursey] );
		///flourish on drag
		for (var i=1; i<cursex-previouscursex && i<flourishlimit; i++) {
			curcoords.push( [cursex-i, cursey] );
			//c.fillRect( (cursex-i)*cellsize, cursey*cellsize, cellsize, cellsize );
		}
		for (var i=1; i<previouscursex-cursex && i<flourishlimit; i++) {
			curcoords.push( [cursex+i, cursey] );
			//c.fillRect( (cursex+i)*cellsize, cursey*cellsize, cellsize, cellsize );
		}
		for (var i=1; i<cursey-previouscursey && i<flourishlimit; i++) {
			curcoords.push( [previouscursex, cursey - i] );
			//c.fillRect( previouscursex*cellsize, (cursey - i)*cellsize, cellsize, cellsize );
		}
		for (var i=1; i<previouscursey-cursey && i<flourishlimit; i++) {
			curcoords.push( [previouscursex, cursey + i] );
			//c.fillRect( previouscursex*cellsize, (cursey + i)*cellsize, cellsize, cellsize );
		}
	}
	previouscursex = cursex;
	previouscursey = cursey;
}, 0);
stampcanvas.addEventListener("mousedown", function(evt) {
	mousedown = 1;
	findcur(evt);
	curcoords.push( [ cursex, cursey ] );
}, 0);
stampcanvas.addEventListener("mouseup", function(evt) {mousedown = 0}, 0);
controlcanvas.addEventListener("mousedown", function(evt) {
	if (paused) {
		paused = 0;
		loop();
	}
	else paused = 1;
}, 0);

function fillcell(i) { 
	var c = document.getElementById('gridcanvas').getContext('2d');
	c.fillRect( (i%pitch)*cellsize, Math.floor(i/pitch)*cellsize, cellsize, cellsize );
}

function loop() {
	if (!paused) {
		//console.log("generation : " + generation);
		var c = document.getElementById('gridcanvas').getContext('2d');
		
		while (curcoords.length) {
			var cc = curcoords.pop();
			var ccc = cc[0] + cc[1]*pitch;
			if (cells[ccc]) {
				cells[ccc] = 0;
				c.fillStyle = backcolor;
				fillcell(ccc);
			}
			else {
				cells[ccc] = 1;
				c.fillStyle = colorscheme[0];
				fillcell(ccc);
			}
		}
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
					c.fillStyle = backcolor;
					fillcell(i);
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
		
		window.setTimeout(loop, timeout);
	}
}


var c = document.getElementById('gridcanvas').getContext('2d');
c.fillStyle = backcolor;
c.fillRect(0, 0, width, height);
loop();


}//init