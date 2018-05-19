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

const delay = new Delay( { audioContext, feedback: .4, time: .5 } );
submixGain.connect( delay.input );
delay.output.connect( effectGain );

const reverb = new Reverb( { audioContext, url: "/audio/impulses/default.wav" } );
submixGain.connect( reverb.input );
reverb.output.connect( effectGain );

delay.output.connect( reverb.input );

//setup analyser
const analyser = new Analyser( { audioContext } );
masterGain.connect( analyser.input );

//setup musical scale and keyboard
const musicalScale = new MusicalScale({ scale: "minor", rootNote: "A4" });
const keyboardKeyCount = 7;
const slideTime = .5;
let currentKeyboardKey = 0;

let polyVoice;
let voice;

let currentVoices = new Map();
let touchKeys = new Map();


function setup() {

	//resume web audio on first click for Chrome autoplay rules
	function clickHandler(){
		audioContext.resume();
		document.body.removeEventListener( "click", clickHandler );
	}
	document.body.addEventListener( "click", clickHandler );

	//create p5 canvas
	createCanvas( windowWidth, windowHeight );

	polyVoice = new PolyVoice( { audioContext, VoiceClass: Voice } );
	polyVoice.output.connect( submixGain );
	voice = polyVoice.currentVoice;

	// let sampleURLs = ["/audio/samples/wolves.mp3"];

	// AudioBufferLoader.load( sampleURLs, audioContext )
	//   .then( buffers => {
	//     polyVoice.voiceMap.forEach( voice => {
	//       voice.buffers = buffers;
	//     })
	//   });


}

function mousePressed(){

	polyVoice.start();
	voice = polyVoice.currentVoice;

	updateKeyboardKey();

}

function mouseReleased() {

	voice.stop();
	voice = polyVoice.currentVoice;

}

function mouseDragged() {

	updateKeyboardKeySlide();

}

function mouseMoved() {

	touches.forEach( function( touch ) {

			if( !currentVoices.has( touch.id ) ) {

				polyVoice.start();
				currentVoices.set( touch.id, polyVoice.currentVoice );

			}

	} );

}

function touchStarted() {

	touches.forEach( function( touch ) {

		if( !currentVoices.has( touch.id ) ) {

			let voice = polyVoice.start();
			currentVoices.set( touch.id, voice );

			let k = Math.floor( ( touch.x / windowWidth ) * keyboardKeyCount );
			touchKeys.set( touch.id, k );

			voice.oscillator.type = "sawtooth";
			voice.oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
			voice.oscillator.frequency.setValueAtTime( musicalScale.getFrequency( k ), audioContext.currentTime );

		}

	} );

  // prevent default
  return false;

}

function touchEnded() {

	let touchIds = [];

	touches.forEach( function( touch ) {

		touchIds.push( touch.id );

	} );

	currentVoices.forEach( function( voice, id ) {

		if(!touchIds.includes( id ) ) {

			voice.stop( audioContext.currentTime );

			currentVoices.delete( id );
			touchKeys.delete( id );

		}

	} );

  // prevent default
  return false;

}

function touchMoved () {

	touches.forEach( function( touch ) {

		let k = Math.floor( ( touch.x / windowWidth ) * keyboardKeyCount );
		
		if( touchKeys.get( touch.id ) != k ) {

			let voice = currentVoices.get( touch.id );
			voice.oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
			voice.oscillator.frequency.linearRampToValueAtTime( musicalScale.getFrequency( k ), audioContext.currentTime + slideTime );

			touchKeys.set( touch.id, k );

		}

	} );

  // prevent default
  return false;

}

function updateKeyboardKey() {
	
	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	currentKeyboardKey = k;
	voice.oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
	voice.oscillator.frequency.setValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime );

}

function updateKeyboardKeySlide() {
	
	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	if( k !== currentKeyboardKey ) {
		currentKeyboardKey = k;
		voice.oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
		voice.oscillator.frequency.linearRampToValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime + slideTime );
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

}