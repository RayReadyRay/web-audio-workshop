//set AudioContext class for compatibility
let AudioContext = window.AudioContext || window.webkitAudioContext;

//create audio context
const audioContext = new AudioContext();

//setup master gain
const masterGain = audioContext.createGain();
masterGain.connect( audioContext.destination );
masterGain.gain.value = 0;
//setup oscillator
const oscillator = audioContext.createOscillator();
oscillator.start();
oscillator.connect( masterGain );

function setup() {

	//resume web audio on first click for Chrome autoplay rules
	function clickHandler(){
		audioContext.resume();
		document.body.removeEventListener( "click", clickHandler );
	}
	document.body.addEventListener( "click", clickHandler );

	//listen for oscillator waveform selection
	const oscWaveformElement = document.querySelector( "#osc-waveform" );
	oscWaveformElement.addEventListener( "change", function( event ){
		event.preventDefault();
		oscillator.type = event.target.value;
	});

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
  stroke( 200 );
	fill( 255, 255, 255 );

}
