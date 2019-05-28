class ADSREnvelope {

  constructor( options ) {

    this.audioContext = options.audioContext;

    //fade in time
    this.attack = options.attack || 0;

    //time until rest after attack
    this.decay = options.decay || 1;

    //level to rest at after attack and decay
    this.sustain = options.sustain || 1;

    //fade out time after release
    this.release = options.release || 1;

    this.paramMap = new Map();

  }

  start( time = this.audioContext.currentTime ) {

    this.paramMap.forEach( ( obj ) => {

      //pin value
      var v = obj.param.value
      if( obj.param.cancelAndHoldAtTime )
        obj.param.cancelAndHoldAtTime( time );
      else
        obj.param.cancelScheduledValues( time );
      obj.param.setValueAtTime( v, time );

      // obj.param.setValueAtTime( 0, time );

      //attack
      if( this.attack > 0 )
        obj.param.linearRampToValueAtTime( obj.magnitude, time + this.attack );
      else
        obj.param.setValueAtTime( obj.magnitude, time );


      //decay
      if( this.decay > 0 )
        obj.param.exponentialRampToValueAtTime( ( this.sustain * obj.magnitude ), time + this.attack + this.decay );
      else
        obj.param.setValueAtTime( ( this.sustain * obj.magnitude ), time + this.attack  );

    } );



  }

  stop( time = this.audioContext.currentTime ) {

    this.paramMap.forEach( ( obj ) => {
      //pin value
      var v = obj.param.value
      if( obj.param.cancelAndHoldAtTime )
        obj.param.cancelAndHoldAtTime( time );
      else
        obj.param.cancelScheduledValues( time );
      obj.param.setValueAtTime( v, time );

      //release
      obj.param.linearRampToValueAtTime( 0.0, time + this.release );

    } );

  }

  connect( param, magnitude = 1 ) {

    this.paramMap.set( param, { param, magnitude } );

  }

  disconnect( param ) {

    if ( this.paramMap.get( param ) ) {

      param.cancelScheduledValues( this.audioContext.currentTime );
      this.paramMap.delete( param );

    }

  }

}
