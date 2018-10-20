class Voice {

  constructor( options ) {

    this.audioContext = options.audioContext;

    this.output = this.audioContext.createGain();

    this.buffers = null;

    this.bufferPlayer = new AudioBufferPlayer({
      audioContext: this.audioContext
    })

  }

  start( playbackRate = 0 ) {

    if( this.buffers ){
      //this.bufferPlayer.start( bufferIndex, startPoint );
      this.bufferSource = this.bufferPlayer.start( this.buffers.get( 0 ), .01 );
      this.bufferSource.connect( this.output );
      this.bufferSource.playbackRate.value = playbackRate * 2;//playbackRate * 2;
    }

  }

  stop( time = this.audioContext.currentTime ) {

    if( this.bufferSource ) {
      this.bufferSource.disconnect( this.output );
      this.bufferSource.stop( audioContext.currentTime );
    }

  }

}
