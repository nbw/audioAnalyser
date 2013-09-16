

var AudioAnalyser = function(inputAudio,divID,fftSize,smoothingTimeConstant)
{
    this.context = new webkitAudioContext(); // create the audio context
    this.audioBuffer    = null;
    this.sourceNode     = null;
    this.analyserLeft   = null; // frequency analyser for first channel
    this.analyserRight  = null; // frequency analyser for second channel
    this.splitter       = null; // module that splits audio into left and right components

    this.javascriptNode = this.context.createJavaScriptNode(2048, 1, 1);
    this.canvasHeight =  $("#"+divID).height();
    this.canvasWidth  =   $("#"+divID).width();
    this.fftSize = (fftSize === undefined)? 64 : fftSize;
    this.smoothingTimeConstant =  (smoothingTimeConstant === undefined)? 0.5 : smoothingTimeConstant;
    this.audio = inputAudio;
    this.divID = divID;

    window.addEventListener('load', function(e) {
        this.sourceNode = this.context.createMediaElementSource(audio);
        $(this).trigger('doneSourceNodeSetup');
        $("#"+divID).trigger('audioLoaded');
        console.log("Done loading audio.");
    }.bind(this), false);
};


AudioAnalyser.prototype.setup = function(){
    this.setupAudioNodes();
};

AudioAnalyser.prototype.setupJavascriptNode = function(){
    this.javascriptNode.onaudioprocess = function() {

        // get the average for the first channel
        this.fftLeft =  new Uint8Array(this.analyserLeft.frequencyBinCount);
        this.analyserLeft.getByteFrequencyData(this.fftLeft);

        // get the average for the second channel
        this.fftRight =  new Uint8Array(this.analyserRight.frequencyBinCount);
        this.analyserRight.getByteFrequencyData(this.fftRight);

        if(!audio.paused){
            $("#"+this.divID).trigger('drawReady');
        }

    }.bind(this);
};

AudioAnalyser.prototype.setupAudioNodes = function() {

    $(this).on('doneSourceNodeSetup', function(){

        // connect to destination, else it isn't called
        this.setupJavascriptNode();
        this.javascriptNode.connect(this.context.destination);

        // create analyzer LEFT
        this.analyserLeft = this.context.createAnalyser();
        this.analyserLeft.smoothingTimeConstant = this.smoothingTimeConstant;
        this.analyserLeft.fftSize = this.fftSize;

        // create analyser RIGHT
        this.analyserRight = this.context.createAnalyser();
        this.analyserRight.smoothingTimeConstant = this.smoothingTimeConstant;
        this.analyserRight.fftSize = this.fftSize;

        // create splitter
        this.splitter = this.context.createChannelSplitter();

        // connect the source to the splitter
        this.sourceNode.connect(this.splitter);

        // connect the splitters to the analysers
        this.splitter.connect(this.analyserLeft,0,0); // LEFT
        this.splitter.connect(this.analyserRight,1,0); //RIGHT

        // Use the javascript node to draw at a
        // specific interval. Only necessary to connect one of the
        // analysers as the purpose is to creat an event trigger. 
        this.analyserLeft.connect(this.javascriptNode);

        // connect the source directly to the desination for audio output.
        this.sourceNode.connect(this.context.destination);

        console.log(this.sourceNode);

    }.bind(this));

};


// log if an error occurs
function onError(e) {
    console.log(e);
}

AudioAnalyser.prototype.getLeft = function(){
    return this.fftLeft;
};
AudioAnalyser.prototype.getRight = function(){
    return this.fftRight;
};
AudioAnalyser.prototype.getAverage = function(){
    return (this.fftRight+this.fftLeft)/2;
};



AudioAnalyser.prototype.drawSpectrogram = function(array){

    // side length of each cube
    var cubeSize = Math.round(0.75*this.canvasHeight/this.array.length);

    // copy the current canvas onto the temp canvas
    var canvas = document.getElementById("canvas");

    this.tempCtx.drawImage(canvas, 0, 0, this.canvasWidth, this.canvasHeight);

    var value;
    // iterate over the elements from the array
    for (var i = 0; i < this.array.length; i++) {

        // draw each pixel with the specific color
        value = this.array[i];
        this.ctx.fillStyle = this.hot.getColor(value).hex();

        // draw the line at the right side of the canvas
        this.ctx.fillRect(this.canvasWidth - cubeSize, this.canvasHeight-i*Math.round(this.canvasHeight/this.array.length) , cubeSize, cubeSize);
    }

    // set translate on the canvas
    this.ctx.translate(Math.round(-this.canvasHeight/this.array.length), 0);

    // draw the copied image
    this.ctx.drawImage(this.tempCanvas, 0, 0, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight);

    // reset the transformation matrix
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

};



