var Slider = function(divID,audio)
{

	this.canvasHeight = $("#"+divID).height();
	this.canvasWidth  = $("#"+divID).width();

	$("#"+divID).append('<canvas id="sliderCanvas" width="'+this.canvasWidth+'" height="'+this.canvasHeight+'" + style="display: block; background-color: #AAAAAA;"></canvas>');
	this.ctx = $("#sliderCanvas").get()[0].getContext("2d");


	$("#"+divID).on('click',function(e){

		var offset = $("#"+divID).offset();
		var canvasX = e.pageX-offset.left;
		audio.currentTime =  audio.duration*canvasX/$("#"+divID).width();
		slider.drawCurrTime(audio.currentTime,audio.duration);//update the position instantaneously 

	});
};

Slider.prototype.drawFrame = function() {

	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	
	//set the fill style
    this.ctx.fillStyle="#777777";

	this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);

};

Slider.prototype.drawCurrTime = function(currentTime,duration) {

	console.log( "Time: " + currentTime + " / " + duration);
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

	this.ctx.fillStyle="#777777";
	this.drawFrame();

	this.ctx.fillStyle="#FFFFFF";
	this.ctx.clearRect(2,2,(currentTime/duration)*(this.canvasWidth-2),this.canvasHeight-4);


};


