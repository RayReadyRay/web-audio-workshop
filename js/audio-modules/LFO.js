class LFO {

  constructor( options ) {

    this.audioContext = options.audioContext;

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = options.type || "sine";
    this.oscillator.frequency.value = options.frequency || 2;

    this.rate = this.oscillator.frequency;

    this.depth = this.audioContext.createGain();
    this.oscillator.connect( this.depth );

    this.paramMap = new Map();

    this.started = false;

  }

  start( time = this.audioContext.currentTime ) {

    if( this.started === true ) {
      this.stop();
    }

    this.oscillator.start( time );
    this.started = true;

  }

  stop( time = this.audioContext.currentTime ) {

    this.oscillator.stop( time );
    this.oscillator.disconnect( this.depth );

    let oscillator = audioContext.createOscillator();
    oscillator.type = this.oscillator.type;
    oscillator.frequency.value = this.oscillator.frequency.value;
    oscillator.connect( this.depth );

    this.oscillator = oscillator;

  }

  connect( param, magnitude = 1 ) {

    let gain = this.audioContext.createGain();
    gain.gain.value = magnitude;

    this.depth.connect( gain );
    gain.connect( param );

    this.paramMap.set( param, { param, gain } );

  }

  disconnect( param ) {

    if ( this.paramMap.get( param ) ) {

      let gain = this.paramMap.get( param ).gain;

      this.depth.disconnect( gain );
      gain.disconnect ( param );

      this.paramMap.delete( param );

    }

  }

}
