The audioAnalyser uses the HTML 5 Audio API (CHROME, FIREFOX) to create an "AudioAnalyser" object, which takes the fft of an audio input. The object can be viewed as a blackbox where the user defines an audio input and retrieves and array of fft values without worrying about the details. It is up to the user to user/display the fft values in whatever way is suitable. The "AudioAnalyser" object triggers a 'drawReady' event each time the fft for the next window is available.  


AUDIO INPUT----> [  ANALYSER  ] ---> FFT values 
		


The application requires uses: 

* THE HTML5 WEB AUDIO API <--- Browser dependant. (should funciton on chrome and firefox)
* JQUERY
* CHROMA.js


example:

Initial Setup: 

//HTML

        <div align="center" id="canvasDiv" style="width:800px; height:400px;"></div>
        <div id="slider" style="width:800px; height:25px;"></div> // optional slider


// AUDIO INPUT VARIABLES

        var audio = new Audio();
        	audio.src = 'music/song.mp3';
        	audio.controls = true;
        	audio.autoplay = false;
        	audio.load();

        var fftSize = 32;
        var analyser = new AudioAnalyser(audio,'canvasDiv',fftSize); 
        	analyser.setup(); 


To access an array of fft values:
	
	analyser.getLeft(); // Left channel
	analyser.getRight(); // Right Channel
	analyser.getAverage(); // Average of L and R



I've also included the code for a PROGRESSBAR as progressBar.js. For use look at an example. 

