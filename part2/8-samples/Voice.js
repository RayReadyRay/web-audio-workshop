class Voice {

  constructor( options ) {

    this.audioContext = options.audioContext;

    this.output = this.audioContext.createGain();
    this.output.gain.setValueAtTime( 0, this.audioContext.currentTime );

    //setup ADSR
    this.envelope = new ADSREnvelope( { audioContext } );
    this.envelope.attack = 0;
    this.envelope.decay = 1;
    this.envelope.sustain = 1;
    this.envelope.release = .5;
    this.envelope.connect( this.output.gain );


    this.buffers = null;

    this.bufferPlayer = new AudioBufferPlayer({
      audioContext: this.audioContext
    })

  }

  start( samplePosition ) {

    if( this.bufferSource ){
      this.bufferPlayer.stop( this.bufferSource );
    }

    if( this.buffers ){
      this.bufferSource = this.bufferPlayer.start( this.buffers.get( 0 ), samplePosition );
      this.bufferSource.connect( this.output );
    }

    this.envelope.start();

  }

  stop( time = this.audioContext.currentTime ) {

    if( this.bufferSource ){
      this.bufferPlayer.stop( this.bufferSource );
    }

    this.envelope.stop( time );

  }

}
