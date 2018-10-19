//set AudioContext class for compatibility
let AudioContext = window.AudioContext || window.webkitAudioContext;

//create audio context
const audioContext = new AudioContext();

//setup oscillator
const oscillator = audioContext.createOscillator();
oscillator.type = "triangle";
oscillator.frequency.value = 440;
oscillator.detune.value = 1200;//cents
oscillator.start();
oscillator.connect( audioContext.destination );

function setup() {

	//resume web audio on first click for Chrome autoplay rules
	function clickHandler(){
		audioContext.resume();
		document.body.removeEventListener( "click", clickHandler );
	}
	document.body.addEventListener( "click", clickHandler );

	//create p5 canvas
	createCanvas( windowWidth, windowHeight );

}
