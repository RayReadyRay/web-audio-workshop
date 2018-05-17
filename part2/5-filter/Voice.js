class Voice {
  
  constructor( options ) {

    this.audioContext = options.audioContext;

    this.output = this.audioContext.createGain();
    this.output.gain.setValueAtTime( 0, this.audioContext.currentTime );

    //setup oscillator
    this.oscillator = audioContext.createOscillator();
    this.oscillator.start();

    //setup ADSR
    this.envelope = new ADSREnvelope( { audioContext } );
    this.envelope.attack = 1;
    this.envelope.decay = 1;
    this.envelope.sustain = .1;
    this.envelope.release = 1;
    this.envelope.connect( this.output.gain );

    //set filter
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.Q.setValueAtTime( 30, this.audioContext.currentTime);
    this.filter.frequency.setValueAtTime( 2000, this.audioContext.currentTime);
    this.filter.connect( this.output );

    this.oscillator.connect( this.filter );

    this.envelope.connect( this.filter.detune, -2400 );

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