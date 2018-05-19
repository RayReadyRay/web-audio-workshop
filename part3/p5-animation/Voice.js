class Voice {
  
  constructor( options ) {

    this.audioContext = options.audioContext;

    this.output = this.audioContext.createGain();
    this.output.gain.setValueAtTime( 0, this.audioContext.currentTime );

    //setup analyser
    this.analyser = new Analyser( { audioContext, fftSize: 32 } );
    this.output.connect( this.analyser.input );

    //setup oscillator
    this.oscillator = audioContext.createOscillator();
    this.oscillator.type = "sine";
    this.oscillator.start();

    //setup ADSR
    this.envelope = new ADSREnvelope( { audioContext } );
    this.envelope.attack = 1;
    this.envelope.decay = 1;
    this.envelope.sustain = .1;
    this.envelope.release = .25;
    this.envelope.connect( this.output.gain );

    //setup filter
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.Q.setValueAtTime( 30, this.audioContext.currentTime );
    this.filter.frequency.setValueAtTime( 20000, this.audioContext.currentTime );
    this.filter.connect( this.output );

    this.oscillator.connect( this.output );

    //setup filter LFO
    this.lfo = new LFO( { audioContext: this.audioContext } );
    this.lfo.connect( this.filter.detune, -4800 );
    this.lfo.connect( this.oscillator.detune, 2400 );
    this.lfo.start();

    this.buffers = null;

    this.bufferPlayer = new AudioBufferPlayer({
      audioContext: this.audioContext
    })

  }

  start( time = this.audioContext.currentTime ) {
    
    if( this.buffers ){
      let bufferSource = this.bufferPlayer.start( this.buffers.get( 0 ), Math.random() );
      // bufferSource.connect( this.filter );
      
      this.lfo.connect( bufferSource.playbackRate );
    }
    
    this.envelope.start( time );

  }

  stop( time = this.audioContext.currentTime ) {

    this.envelope.stop( time );

  }

}