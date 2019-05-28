class PolyVoice {

  constructor( options ) {

    this.audioContext = options.audioContext;

    //class to make a polyphonic version of. Requires an output and start/stop methods
    let VoiceClass = options.VoiceClass;

    //how many voices to create
    this.voiceCount = options.voiceCount || 6;

    this.currentVoiceId = 0;

    this.voiceMap = new Map();

    this.output = this.audioContext.createGain();
    this.output.gain.value = 1;

    //create the voices
    for ( let i=0; i<this.voiceCount; i++ ) {

      let voice = new VoiceClass( { audioContext: this.audioContext } );
      voice.output.connect( this.output );

      this.voiceMap.set( i, voice );

    }

    this.currentVoice = this.voiceMap.get(0);

  }

  start( value = this.audioContext.currentTime, voiceId ){

    //cycle through the voices
    this.currentVoiceId = voiceId || ( this.currentVoiceId + 1 ) % this.voiceCount;

    this.currentVoice = this.voiceMap.get( this.currentVoiceId );

    this.currentVoice.start( value );

    return this.currentVoice;

  }

  stop( value = this.audioContext.currentTime, voiceId ){

    let vId = voiceId || this.currentVoice

    voiceMap.get( vId ).stop( value );

  }


}
