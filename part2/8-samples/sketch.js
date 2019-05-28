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
// delay.output.connect( effectGain );

const reverb = new Reverb( { audioContext, url: "/audio/impulses/default.wav" } );
submixGain.connect( reverb.input );
// reverb.output.connect( effectGain );

delay.output.connect( reverb.input );

//setup analyser
const analyser = new Analyser( { audioContext } );
masterGain.connect( analyser.input );

//setup musical scale and keyboard
const musicalScale = new MusicalScale({ scale: "minor", rootNote: "A4" });
const keyboardKeyCount = 14;
const slideTime = .5;
let currentKeyboardKey = 0;

let polyVoice;
let voice;



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

	let sampleURLs = ["/audio/samples/amen-break.wav"];

	AudioBufferLoader.load( sampleURLs, audioContext )
	  .then( buffers => {
	    polyVoice.voiceMap.forEach( voice => {
	      voice.buffers = buffers;
	    })
	  });


}

function mousePressed(){

	updateKeyboardKey();

	polyVoice.start( currentKeyboardKey / keyboardKeyCount );
	voice = polyVoice.currentVoice;

}

function mouseReleased() {

	voice.stop();
	voice = polyVoice.currentVoice;

}

function mouseDragged() {

	updateKeyboardKeySlide();

}

function mouseMoved() {

}

function keyPressed() {

	voice.stop();
	voice = polyVoice.currentVoice;

	let samplePosition = 0;
  let keyIndex = -1;

  switch(key){
		case 'Q':
			samplePosition = 1/10;
			break;
		case 'W':
			samplePosition = 2/10;
			break;
		case 'E':
			samplePosition = 3/10;
			break;
		case 'R':
			samplePosition = 4/10;
			break;
		case 'T':
			samplePosition = 5/10;
			break;
		case 'Y':
			samplePosition = 6/10;
			break;
		case 'U':
			samplePosition = 7/10;
			break;
		case 'I':
			samplePosition = 8/10;
			break;
		case 'O':
			samplePosition = 9/10;
			break;
		case 'P':
			samplePosition = 9.5/10;
			break;
	}

	polyVoice.start( samplePosition );
	voice = polyVoice.currentVoice;

}

function keyReleased() {

}

function updateKeyboardKey() {

	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	currentKeyboardKey = k;

}

function updateKeyboardKeySlide() {

	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	if( k !== currentKeyboardKey ) {
		currentKeyboardKey = k;
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
