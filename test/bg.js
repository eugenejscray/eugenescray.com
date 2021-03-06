// runtime
// We have to make this so we can have multiple animation lines in the canvas.
$(document).ready(function(){
	document.getElementById('bg').height = $(document).height();
	document.getElementById('bg').width = $(document).width();


	// ranomize this accross the screen.
	var animation = new animatedLine(Math.floor($(document).width() / 2), Math.floor($(document).height() / 2), "#0F5791");
	animation.init();

	var animation2 = new animatedLine(200, 200, "#0F5791");
	animation2.init();


});

function animatedLine(startx, starty, colorStr){
	// these should be passed into the object.
	this.curpointX = startx,
	this.curpointY = starty,
	this.NORTH = 1,
	this.NORTHEAST = 2;
	this.EAST = 3;
	this.SOUTHEAST = 4;
	this.SOUTH = 5;
	this.SOUTHWEST = 6; 
	this.WEST = 7;
	this.NORTHWEST = 8;
	this.colorHex = colorStr;

	// We will then be calling the object withing a line drawer to animate this in the background.
	var self = this;
	// Lets get rid of one of these position variables.
	this.startpointx = this.curpointX;
	this.startpointy = this.curpointY;
	this.curposx = this.curpointX;
	this.curposy = this.curpointY;
	this.endpointx = this.curpointX;
	this.endpointy = this.curpointY;
	this.myinterval = {};

	this.init = function() {
	   	this.myinterval = setInterval( function() { self.animate(self.endpointx,self.endpointy);}, 100);
	}

	this.animate = function(endpointx, endpointy) {
		this.startpointy = this.curposy;
		this.startpointx = this.curposx;
		if (this.curposx == endpointx && this.curposy == endpointy){
			this.drawLine();
			return false;
		}
		else if(endpointx != this.curposx && endpointy != this.curposy){
			// this will screw up if we have half pixel somewhere. ( will always be diagnol)
			this.curposy += (endpointy > this.curposy ? 1 : -1);			
			this.curposx += (endpointx > this.curposx ? 1 : -1);
		}
		else if(endpointx != this.curposx){
			this.curposx += (endpointx > this.curposx ? 1 : -1);
		}
		else if(endpointy != this.curposy){
			this.curposy += (endpointy > this.curposy ? 1 : -1);
		}
		else{
			console.log("We have a problem");
		}
	    this.drawShape(this.curposx, this.curposy, this.colorHex);
	}

	this.drawShape = function(tendpointx, tendpointy, clor){
	    var canvas = document.getElementById('bg');
	    var ctx = canvas.getContext('2d');

	    ctx.strokeStyle = clor;
	    ctx.globalAlpha = 0.2;
	    ctx.beginPath();
	    ctx.moveTo(this.startpointx ,this.startpointy );
	    ctx.lineTo(tendpointx,tendpointy);
	    ctx.stroke();
	} 

	this.drawLine = function(){
		
		clearInterval(this.myinterval);

		// calculate the next point with direction and distance.
		var direction = Math.floor(Math.random() * 8) + 1;
		var distance = Math.floor(Math.random() * 10) + 1;

		var newPointY, newPointX;

		switch(direction){
			case this.NORTH:
				newPointX = this.endpointx;
				newPointY = this.endpointy - distance;
				this.setAnimationVariables(newPointX, newPointY);
				break; 
			case this.NORTHEAST:
				newPointX = this.endpointx + distance;
				newPointY = this.endpointy - distance;
				this.setAnimationVariables(newPointX, newPointY);
				break;
			case this.EAST:
				newPointX = this.endpointx + distance;
				newPointY = this.endpointy;
				this.setAnimationVariables(newPointX, newPointY);
				break; 
			case this.SOUTHEAST: 
				newPointX = this.endpointx + distance;
				newPointY = this.endpointy + distance;
				this.setAnimationVariables(newPointX, newPointY);
				break;
			case this.SOUTH:
				newPointX = this.endpointx;
				newPointY = this.endpointy + distance;
				this.setAnimationVariables(newPointX, newPointY);
				break;
			case this.SOUTHWEST:
				newPointX =  this.endpointx - distance;
				newPointY = this.endpointy + distance;
				this.setAnimationVariables(newPointX, newPointY);				
				break;
			case this.WEST:
				newPointX = this.endpointx - distance;
				newPointY = this.endpointy;
				this.setAnimationVariables(newPointX, newPointY);
				break;
			case this.NORTHWEST:
				newPointX = this.endpointx - distance;
				newPointY = this.endpointy - distance;
				this.setAnimationVariables(newPointX, newPointY);
				break;
			default:
				console.log("We have a problem");
		}
		this.init();
	}

	// Helper function to set variables for animation. 
	// TODO refactor to get rid of some of these variables.
	this.setAnimationVariables = function(newPointX, newPointY){

		// check the newpoints. Verify its inside the canvas.
		if(newPointY > 0 && newPointX > 0 && newPointY < $(document).height() && newPointX < $(document).width()){
			this.startpointx = this.endpointx;
			this.startpointy = this.endpointy;
			this.curpointX = this.endpointx;
			this.curpointY = this.endpointy;
			this.endpointx = newPointX;
			this.endpointy = newPointY;
		}
		else {
			// solve the recursion issue here
			this.drawLine();
		}
	}
}
