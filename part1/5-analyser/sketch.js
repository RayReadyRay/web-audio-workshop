//set AudioContext class for compatibility 
let AudioContext = window.AudioContext || window.webkitAudioContext;  

//create audio context
const audioContext = new AudioContext();

//setup master gain
const masterGain = audioContext.createGain();
masterGain.connect( audioContext.destination );
masterGain.gain.value = 0;

//setup analyser
const analyser = new Analyser( { audioContext, fftSize: 32 } );
masterGain.connect( analyser.input );

//setup oscillator
const oscillator = audioContext.createOscillator();
oscillator.start();
oscillator.connect( masterGain );

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

	updateKeyboardKeySlide();

}

function mouseMoved() {

}

function updateKeyboardKey() {
	
	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	currentKeyboardKey = k;
	oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
	oscillator.frequency.setValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime );

}

function updateKeyboardKeySlide() {
	
	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	if( k !== currentKeyboardKey ) {
		currentKeyboardKey = k;
		oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
		oscillator.frequency.linearRampToValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime + slideTime );
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
  stroke( 255, 0, 0 );//red
	strokeWeight( 4 );

	let dataArray = analyser.getWaveformData();
	let sliceWidth = windowWidth / dataArray.length;
	let waveformHeight = .333 * windowHeight;

	for( var i = 1; i < dataArray.length; i++ ) {
		
		//start point of line segment
		let x1 = ( i - 1 ) * sliceWidth;//time
		let y1 = waveformHeight * ( dataArray[ i - 1 ] / 255 );//amplitude

		//end point of line segment
		let x2 = i * sliceWidth;//time
		let y2 = waveformHeight * ( dataArray[ i ] / 255 );//amplitude

		//offset Y to middle of window
		y1 += ( .5 * windowHeight ) - ( .5 * waveformHeight );
		y2 += ( .5 * windowHeight ) - ( .5 * waveformHeight );

		//draw line segment
		line( x1, y1, x2, y2 );

	}

}