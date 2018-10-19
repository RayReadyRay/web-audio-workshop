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

//setup musical scale and keyboard
const musicalScale = new MusicalScale({ scale: "minor", rootNote: "C4" });
const keyboardKeyCount = 7;
let currentKeyboardKey = 0;

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

	masterGain.gain.setValueAtTime( 1, audioContext.currentTime );
	updateKeyboardKey();

}

function mouseReleased() {

	masterGain.gain.setValueAtTime( 0, audioContext.currentTime );

}

function mouseDragged() {

}

function mouseMoved() {

}

function updateKeyboardKey() {

	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	currentKeyboardKey = k;
	oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
	oscillator.frequency.setValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime );

}

function draw() {

	//clear canvas
  stroke( 200 );
	fill( 255, 255, 255 );

	//draw keyboard
	let keyboardKeyWidth = windowWidth / keyboardKeyCount;
	for( var i = 0; i < keyboardKeyCount; i++ ){
		rect( i * keyboardKeyWidth, 0, keyboardKeyWidth, windowHeight );
	}

}
