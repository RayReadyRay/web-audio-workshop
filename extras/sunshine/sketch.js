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
compressor.threshold.value = -30;
compressor.knee.value = 30;
compressor.ratio.value = 3;
compressor.attack.value = .1;
compressor.release.value = 0.15;
compressor.reduction = -20;
compressor.connect(masterGain);

const submixGain = audioContext.createGain();
submixGain.connect( compressor );
submixGain.gain.value = 0;

const effectGain = audioContext.createGain();
effectGain.connect( compressor );

const delay = new Delay( { audioContext, feedback: .4, time: .5 } );
submixGain.connect( delay.input );
// delay.output.connect( effectGain );

const reverb = new Reverb( { audioContext, url: "/audio/impulses/water.wav" } );
submixGain.connect( reverb.input );
reverb.output.connect( effectGain );

delay.output.connect( reverb.input );

//setup analyser
const analyser = new Analyser( { audioContext } );
masterGain.connect( analyser.input );

//setup oscillator
const oscillator = audioContext.createOscillator();
oscillator.start();
oscillator.connect( submixGain );

//setup ADSR
const envelope = new ADSREnvelope( { audioContext } );
envelope.attack = 0;
envelope.decay = .25;
envelope.sustain = 0.3;
envelope.release = 1;
envelope.connect( submixGain.gain );

//setup LFO
const lfo = new LFO( { audioContext } );
lfo.connect( oscillator.detune, 600 );

envelope.connect( lfo.depth.gain );

//setup musical scale and keyboard
const musicalScale = new MusicalScale({ scale: "minor", rootNote: "D3" });
const keyboardKeyCount = 7;
const slideTime = .5;
let currentKeyboardKey = 0;

let bpm = 120;
let sunshine = [
	{note:"C4",duration:.25},
	{note:"C4",duration:.25},
	{note:"D4",duration:.25},
	{note:"E4",duration:.5},
	{note:"E4",duration:.5},
	{note:"Rest",duration:.25},
	{note:"E4",duration:.25},
	{note:"D#4",duration:.25},
	{note:"E4",duration:.25},
	{note:"C4",duration:.5},
	{note:"C4",duration:.5},

	{note:"Rest",duration:.25},
	{note:"C4",duration:.25},
	{note:"D4",duration:.25},
	{note:"E4",duration:.25},
	{note:"F4",duration:.5},
	{note:"A4",duration:.5},
	{note:"Rest",duration:.25},
	{note:"A4",duration:.25},
	{note:"G4",duration:.25},
	{note:"F4",duration:.25},
	{note:"E4",duration:1},

	{note:"Rest",duration:.25},
	{note:"C4",duration:.25},
	{note:"D4",duration:.25},
	{note:"E4",duration:.25},
	{note:"F4",duration:.5},
	{note:"A4",duration:.5},
	{note:"Rest",duration:.25},
	{note:"A4",duration:.25},
	{note:"G4",duration:.25},
	{note:"F4",duration:.25},
	{note:"E4",duration:.5},
	{note:"C4",duration:.5},

	{note:"Rest",duration:.5},
	{note:"C4",duration:.25},
	{note:"D4",duration:.25},
	{note:"E4",duration:.75},
	{note:"F4",duration:.25},
	{note:"D4",duration:.5},
	{note:"D4",duration:.25},
	{note:"E4",duration:.25},
	{note:"C4",duration:1}
]

function playSunshine() {

	oscillator.frequency.cancelScheduledValues( audioContext.currentTime );

	let time = audioContext.currentTime;
	let frequency;

	sunshine.forEach( ( note ) => {

		if( note.note === "Rest" ) {

			time += ( note.duration * ( bpm / 60 ) );

		}
		else {

			frequency = musicalScale.getFrequencyByNote( note.note );
			oscillator.frequency.setValueAtTime( frequency, time );
			envelope.start( time );

			time += ( note.duration * ( bpm / 60 ) );
			envelope.stop( time );
		
		}

	} )

}

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


		playSunshine();

	// lfo.start();
	// envelope.start();
	
	// updateKeyboardKey();

}

function mouseReleased() {

	// envelope.stop();

}

function mouseDragged() {

	// updateKeyboardKeySlide();

}

function mouseMoved() {

}

function updateKeyboardKey() {
	
	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	currentKeyboardKey = k;
	oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
	oscillator.frequency.setValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime );

	lfo.oscillator.frequency.setValueAtTime( currentKeyboardKey * 100, audioContext.currentTime );

}

function updateKeyboardKeySlide() {
	
	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	if( k !== currentKeyboardKey ) {
		currentKeyboardKey = k;
		oscillator.frequency.cancelScheduledValues( audioContext.currentTime );
		oscillator.frequency.linearRampToValueAtTime( musicalScale.getFrequency( currentKeyboardKey ), audioContext.currentTime + slideTime );
	
		lfo.oscillator.frequency.linearRampToValueAtTime( currentKeyboardKey * 100, audioContext.currentTime  + slideTime );
	
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