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
compressor.connect(masterGain);

//setup analyser
const analyser = new Analyser( { audioContext } );
masterGain.connect( analyser.input );

let currentKeyboardKey = 0;
let keyboardKeyCount = 12;

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


	voice = new Voice( { audioContext } );
	voice.output.connect( compressor );

	let sampleURLs = [
		"/audio/samples/it-takes-two.mp3",
		"/audio/samples/wolves.mp3"];

	AudioBufferLoader.load( sampleURLs, audioContext )
	  .then( buffers => {
	    voice.buffers = buffers;
	  });

}

function mousePressed(){

	voice.start( ( mouseX / windowWidth ) );

	updateKeyboardKey();

}

function mouseReleased() {

	voice.stop();

}

function mouseDragged() {

	updateKeyboardKeySlide();

}

function mouseMoved() {

}

function updateKeyboardKey() {

	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	currentKeyboardKey = k;

}

function updateKeyboardKeySlide() {

	let k = Math.floor( ( mouseX / windowWidth ) * keyboardKeyCount );

	if( k !== currentKeyboardKey ) {
		voice.stop();
		voice.start( mouseX / windowWidth );
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
