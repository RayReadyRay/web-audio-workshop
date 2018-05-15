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

      let voice = new VoiceClass( { this.audioContext } );
      voice.output.connect( this.output );

      this.voiceMap.set( i, voice );

    }

  }

  startVoice( value ){

    //cycle through the voices
    this.currentVoiceId = ( this.currentVoiceId + 1 ) % this.voiceCount;
    
    this.voiceMap.get( this.currentVoiceId ).start( value );

    return currentVoice;

  }

  stopVoice( voiceId ){

    let vId = voiceId || this.currentVoice

    voiceMap.get( currentVoice ).stop();

  }


}