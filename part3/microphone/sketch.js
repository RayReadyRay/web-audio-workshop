//set AudioContext class for compatibility 
let AudioContext = window.AudioContext || window.webkitAudioContext;  

//create audio context
const audioContext = new AudioContext();

//setup master gain
const masterGain = audioContext.createGain();
masterGain.connect( audioContext.destination );
masterGain.gain.value = .8;


//setup bus and effects
const compressor = audioContext.createDynamicsCompressor();
// compressor.threshold.value = -30;
// compressor.knee.value = 30;
// compressor.ratio.value = 3;
// compressor.attack.value = .1;
// compressor.release.value = 0.15;
// compressor.reduction = -20;
compressor.connect(masterGain);

const submixGain = audioContext.createGain();
submixGain.connect( compressor );

const effectGain = audioContext.createGain();
effectGain.connect( compressor );

const delay = new Delay( { audioContext, feedback: .8, time: .5 } );
submixGain.connect( delay.input );
delay.output.connect( effectGain );

const lfo = new LFO( { audioContext } );
// lfo.connect( delay.input.delayTime, 4 );
lfo.oscillator.frequency = .00125;
lfo.start();

const reverb = new Reverb( { audioContext, url: "/audio/impulses/water.wav" } );
submixGain.connect( reverb.input );
reverb.output.connect( effectGain );

delay.output.connect( reverb.input );

//setup analyser
const analyser = new Analyser( { audioContext } );
masterGain.connect( analyser.input );

let currentSpin = 0;


function connectStream() {

	navigator.getUserMedia( 
    { audio: true, video: false }, 
    function(stream) {
      let input = audioContext.createMediaStreamSource(stream);
      input.connect( submixGain );
    }, 
    function( e ) { console.log( 'No live audio input: ' + e ) }
  )
}

function setup() {

	//resume web audio on first click for Chrome autoplay rules
	function clickHandler(){
		audioContext.resume();
		connectStream();
		document.body.removeEventListener( "click", clickHandler );
		document.body.removeEventListener( "touchend", clickHandler );
	}

	document.body.addEventListener( "click", clickHandler );
	document.body.addEventListener( "touchend", clickHandler );

	//create p5 canvas
	createCanvas( windowWidth, windowHeight );

}

function mousePressed(){

}

function mouseReleased() {


}

function mouseDragged() {


}

function mouseMoved() {

}

function draw() {

	//clear canvas
  stroke(0);
	fill( 0, 0, 0, 25 );
	rect( 0, 0, windowWidth, windowHeight );


	let dataArray = analyser.getWaveformData();
	let waveformHeight = .333 * windowHeight;

	let radius = windowHeight * .2;

	let pointSpacingAngle = .1;
	// let a = currentSpin;
	let x1,y1,x2,y2,r,amp;

	let tX = .5 * windowWidth;
	let tY = .5 * windowHeight;

	for( var i = 1; i < dataArray.length; i++ ) {

		strokeWeight( 3 * ( i / dataArray.length ) )

		amp = ( dataArray[ i - 1 ] / 255 );

		stroke( 1.5 * ( 255 - (255 * amp ) ) );

		r = radius + ( radius * Math.pow( amp * 2, 2 ) );

		let x1 = tX + r * Math.cos(currentSpin);
		let y1 = tY + r * Math.sin(currentSpin);

		currentSpin += .0125 * pointSpacingAngle;

		amp = ( dataArray[ i ] / 255 );

		r = radius + ( radius * Math.pow( amp * 2, 2 ) );

		let x2 = tX + r * Math.cos(currentSpin);
		let y2 = tY + r * Math.sin(currentSpin);

		//draw line segment
		line( x1, y1, x2, y2 );

	}

}