class Voice {
  
  constructor( options ) {

    this.audioContext = options.audioContext;

    this.output = this.audioContext.createGain();
    this.output.gain.setValueAtTime( 0, this.audioContext.currentTime );

    //setup oscillator
    this.oscillator = audioContext.createOscillator();
    this.oscillator.start();
    this.oscillator.connect( this.output );

    //setup ADSR
    this.envelope = new ADSREnvelope( { audioContext } );
    this.envelope.attack = 0;
    this.envelope.decay = .5;
    this.envelope.sustain = 0.3;
    this.envelope.release = 1;
    this.envelope.connect( this.output.gain );

    //listen for oscillator waveform selection
    const oscWaveformElement = document.querySelector( "#osc-waveform" );
    oscWaveformElement.addEventListener( "change", ( event ) => {
      event.preventDefault();
      this.oscillator.type = event.target.value;
    });

  }

  start( time = this.audioContext.currentTime ) {

    this.envelope.start( time );

  }

  stop( time = this.audioContext.currentTime ) {

    this.envelope.stop( time );

  }

}