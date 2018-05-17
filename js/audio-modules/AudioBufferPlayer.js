class AudioBufferPlayer {

  constructor( options ) {

    this.audioContext = options.audioContext;

    this.bufferSourceMap = new Map();
    this.bufferSourceId = -1;

  }

  start( buffer, offset = 0, time = this.audioContext.currentTime, duration, loop = false, loopStartTime = 0, loopEndTime ) {
    let
    bufferSource = this.audioContext.createBufferSource();

    duration = duration || buffer.duration;
    bufferSource.loop = loop;
    bufferSource.buffer = buffer;
    bufferSource.startTime = time;

    var endHandler = this.createEndHandler( bufferSource );
    bufferSource.onended = endHandler;

    if( loop ) {
    
      loopEndTime = loopEndTime || buffer.duration;

      bufferSource.loopEnd = loopEndTime;
      bufferSource.loopStart = loopStartTime;
      bufferSource.start( time, offset * duration, duration );

      if ( duration !== 0 )
          bufferSource.stop( time + duration );
    
    }
    else {

      bufferSource.start( time, offset * duration, duration );

    }

    this.bufferSourceMap[ bufferSource ] = bufferSource;

    return bufferSource;
    
  }

  createEndHandler( bufferSource ) {

    return () => this.stop( bufferSource );

  }

  stop( bufferSource ) {

    if ( this.bufferSourceMap.get( bufferSource ) ) {

      if ( ( this.audioContext.currentTime - bufferSource.startTime ) > 0.01 ) { 
      
        bufferSource.stop( this.audioContext.currentTime );
      
      }

      bufferSource.disconnect();
 
      this.bufferSourceMap.delete( bufferSource );

    }

  }

  stopAll() {

    this.bufferSourceMap.forEach( function( bufferSource ) {
      
      stop( bufferSource )

    } );

  }

}