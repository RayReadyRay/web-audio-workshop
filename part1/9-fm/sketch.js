//set AudioContext class for compatibility
let AudioContext = window.AudioContext || window.webkitAudioContext;

//create audio context
const audioContext = new AudioContext();

//setup master gain
const masterGain = audioContext.createGain();
masterGain.connect( audioContext.destination );
masterGain.gain.value = 0;

//setup analyser
const analyser = new Analyser( { audioContext } );
masterGain.connect( analyser.input );

//setup oscillator
const oscillator = audioContext.createOscillator();
oscillator.start();
oscillator.connect( masterGain );

//setup ADSR
const envelope = new ADSREnvelope( { audioContext } );
envelope.attack = 1;
envelope.connect( masterGain.gain );

//setup pitch ADSR
const pitchEnvelope = new ADSREnvelope( { audioContext } );
pitchEnvelope.attack = 0.25;
pitchEnvelope.connect( oscillator.detune, -1200 );

//setup LFO
const lfo = new LFO( { audioContext } );
lfo.connect( oscillator.detune, 4800 );

//setup musical scale and keyboard
const musicalScale = new MusicalScale({ scale: "major", rootNote: "C4" });
const keyboardKeyCount = 28;
const slideTime = .5;
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

	//listen for low frequency oscillator waveform selection
	const lfoWaveformElement = document.querySelector( "#lfo-waveform" );
	lfoWaveformElement.addEventListener( "change", function( event ){
		event.preventDefault();
		lfo.oscillator.type = event.target.value;
	});

	//create p5 canvas
	createCanvas( windowWidth, windowHeight );

}

function mousePressed(){

	lfo.start();
	envelope.start();
	pitchEnvelope.start();

	updateKeyboardKey();

}

function mouseReleased() {

	envelope.stop();
	pitchEnvelope.stop();

}

function mouseDragged() {

	updateKeyboardKeySlide();

}

function mouseMoved() {

}

function updateKeyboardKey() {

	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	currentKeyboardKey = k;
		console.log(k)
	oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
	oscillator.frequency.linearRampToValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime + slideTime );

	lfo.oscillator.frequency.setValueAtTime( currentKeyboardKey * 100, audioContext.currentTime );

}

function updateKeyboardKeySlide() {

	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	if( k !== currentKeyboardKey ) {
		console.log(k)

		currentKeyboardKey = k;
		oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
		oscillator.frequency.linearRampToValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime + slideTime );

		lfo.oscillator.frequency.setValueAtTime( currentKeyboardKey * 100, audioContext.currentTime  + slideTime );

	}

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

	//draw waveform
  stroke( 255, 0, 0 );
	strokeWeight( 4 );

	let dataArray = analyser.getWaveformData();
	let sliceWidth = windowWidth / dataArray.length;
	let waveformHeight = .333 * windowHeight;

	for( var i = 1; i < dataArray.length; i++ ) {

		//start point of line segment
		let x1 = ( i - 1 ) * sliceWidth;//time
		let y1 = waveformHeight * ( dataArray[ i - 1 ] / 256 );//amplitude

		//end point of line segment
		let x2 = i * sliceWidth;//time
		let y2 = waveformHeight * ( dataArray[ i ] / 256 );//amplitude

		//offset Y to middle of window
		y1 += ( .5 * windowHeight ) - ( .5 * waveformHeight );
		y2 += ( .5 * windowHeight ) - ( .5 * waveformHeight );

		//draw line segment
		line( x1, y1, x2, y2 );

	}

}f
