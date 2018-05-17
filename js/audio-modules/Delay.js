class Delay {
  
  constructor( options ) {

    this.audioContext = options.audioContext;

    this.input = this.audioContext.createDelay();
    this.input.delayTime.value = options.time || .5;

    this.output = this.audioContext.createGain();
    this.output.gain.value = options.feedback || .5;

    this.input.connect( this.output );
    this.output.connect( this.input );

  }

}